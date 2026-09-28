-- ⚠️⚠️ HISTORICAL MIGRATION — DO NOT RUN ON ANY DATABASE ⚠️⚠️
-- Applied to production on 2026-09-27/28; now SUPERSEDED.
-- Fresh bootstrap  : run ONLY supabase/schema.sql
-- Existing prod DB : already up to date — re-running this file would
--                    RE-INTRODUCE removed vulnerabilities (open profiles
--                    read, priv-esc policy, unguarded RPCs).
-- Kept for audit history only.


-- ============================================================
-- BLOCKERS + SECURITY FIXES (idempotent — যতবার খুশি run করা যাবে)
--   run order: schema.sql → 20260927_restore_schema.sql →
--              20260928_notice_board_and_scrape_logs.sql → এই ফাইল
-- ============================================================

-- ---------- BLOCKER 1. profiles.email ----------
-- handle_new_user() trigger এই column-এ লেখে; column না থাকলে signup-এ trigger
-- fail করে → profile row-ই তৈরি হয় না (signup dead)।
alter table public.profiles add column if not exists email text;
-- donor_card column পুরনো schema.sql-এ ছিল; নতুন canonical schema থেকে যেন না হারায়
alter table public.profiles add column if not exists donor_card boolean not null default false;

-- পুরনো row-গুলোর email auth.users থেকে backfill
update public.profiles p
   set email = u.email
  from auth.users u
 where u.id = p.id
   and p.email is distinct from u.email;

-- ---------- BLOCKER 2. check_referral_code RPC: param name + return type ----------
-- আগের version `returns boolean` ছিল, কিন্তু PremiumModal `row.owner_id` পড়ে →
-- সবসময় "কোড সঠিক নয়" দেখাত (referral discount dead)।
drop function if exists public.check_referral_code(text);
create or replace function public.check_referral_code(code text)
returns table(owner_id uuid, owner_name text)
language sql stable security definer set search_path = public as $$
  select p.id, p.full_name
    from public.profiles p
   where upper(p.referral_code) = upper(btrim(code))
     and p.id <> auth.uid();
$$;

-- ---------- BLOCKER 3. profiles_update_self: privilege escalation বন্ধ ----------
-- NOTE: policy-এর expression-এ একই table-এর subquery দিলে PostgreSQL runtime-এ
--       "infinite recursion detected in policy for relation profiles" (42P17)
--       throw করে। তাই compare-টা SECURITY DEFINER helper-এ (owner RLS bypass
--       করে) — is_admin() যে প্যাটার্নে চলে, ঠিক সেটাই।
create or replace function public.profile_privileged_fields_unchanged(
  p_role               text,
  p_is_premium         boolean,
  p_premium_expires_at timestamptz,
  p_access_enabled     boolean,
  p_referral_code      text,
  p_referred_by        uuid,
  p_discount_unlocked  boolean,
  p_total_donated      numeric,
  p_donor_card         boolean
) returns boolean
language sql stable security definer set search_path = public as $$
  select p_role                is not distinct from p.role
     and p_is_premium          is not distinct from p.is_premium
     and p_premium_expires_at  is not distinct from p.premium_expires_at
     and p_access_enabled      is not distinct from p.access_enabled
     and p_referral_code       is not distinct from p.referral_code
     and p_referred_by         is not distinct from p.referred_by
     and p_discount_unlocked   is not distinct from p.discount_unlocked
     and p_total_donated       is not distinct from p.total_donated
     and p_donor_card          is not distinct from p.donor_card
    from public.profiles p
   where p.id = auth.uid();
$$;

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and public.profile_privileged_fields_unchanged(
      role, is_premium, premium_expires_at, access_enabled,
      referral_code, referred_by, discount_unlocked, total_donated, donor_card
    )
  );

-- INSERT-ও একই class-এর hole (AuthContext নিজের row বানাতে পারে) → safe default-এ বাঁধা।
-- referral_code শুধু DB trigger / AuthContext fallback ('U'+5 char) সেট করে।
drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert with check (
    auth.uid() = id
    and role = 'user'
    and access_enabled
    and not is_premium
    and premium_expires_at is null
    and coalesce(total_donated, 0) = 0
    and not coalesce(discount_unlocked, false)
    and not coalesce(donor_card, false)
    and referred_by is null
    and (referral_code is null or length(referral_code) between 4 and 12)
  );

-- ---------- BLOCKER 4. profiles_select_all: সব row পড়া বন্ধ ----------
-- (referral lookup তো SECURITY DEFINER RPC → RLS লাগে না; Admin panel is_admin())
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- ---------- HIGH: update_source_weight — শুধু admin বা Apps Script (service_role) ----------
create or replace function public.update_source_weight(p_source text, p_delta_approved int, p_delta_rejected int) returns void
language plpgsql security definer set search_path = public as $$
begin
  -- service_role JWT-তে auth.uid() NULL থাকে, তাই শুধু is_admin() চেক করলে
  -- Apps Script v10-এর approve/reject flow ভেঙে যেত (README-র webhook contract)।
  -- JWT secret ছাড়া কেউ service_role claim বানাতে পারে না — তাই এটা নিরাপদ।
  if coalesce(auth.role(), '') <> 'service_role' and not public.is_admin() then
    raise exception 'not admin';
  end if;

  insert into public.source_weights (source_name, approved_count, rejected_count)
  values (p_source, p_delta_approved, p_delta_rejected)
  on conflict (source_name) do update set
    approved_count = source_weights.approved_count + p_delta_approved,
    rejected_count = source_weights.rejected_count + p_delta_rejected,
    weight = greatest(0.3, least(2.0,
      1.0 + (source_weights.approved_count - source_weights.rejected_count) * 0.05)),
    updated_at = now();
end;
$$;

-- ---------- MEDIUM: anonymous spam বন্ধ (login করা user-ই লিখবে) ----------
drop policy if exists uc_insert on public.user_contributions;
create policy uc_insert on public.user_contributions
  for insert with check (auth.uid() is not null);

drop policy if exists af_insert on public.app_feedback;
create policy af_insert on public.app_feedback
  for insert with check (auth.uid() is not null);

-- ---------- MEDIUM: payment amount — free_until উইন্ডো respect করবে ----------
create or replace function public.validate_and_set_payment_amount() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  base numeric; ref_price numeric; ref_ok boolean := false;
  sub_on boolean; free_t timestamptz;
begin
  select base_price, referral_price, subscription_enabled, free_until
    into base, ref_price, sub_on, free_t
  from public.app_settings where id = 1;
  base := coalesce(base, 99); ref_price := coalesce(ref_price, 49);

  -- ফ্রি উইন্ডো (subscription চালু কিন্তু free_until এখনো ভবিষ্যতে): টাকা লাগবে না।
  -- amount 0 + status 'free_period' রেখে সাথে সাথে premium access-ও দিয়ে দেওয়া হয় —
  -- নইলে Admin UI-র pending list-এ row-টা দেখাই যেত না (UI শুধু 'pending' দেখায়)
  -- এবং user কখনো access পেত না।
  if sub_on and free_t is not null and now() < free_t then
    new.amount := 0;
    new.status := 'free_period';
    update public.profiles
       set is_premium = true,
           premium_expires_at = greatest(coalesce(premium_expires_at, free_t), free_t)
     where id = new.user_id;
    return new;
  end if;

  if new.plan = 'season' then
    if new.referral_code is not null and new.referral_code <> '' then
      select exists (
        select 1 from public.profiles
        where upper(referral_code) = upper(new.referral_code) and id <> new.user_id
      ) into ref_ok;
    end if;
    new.amount := case when ref_ok then ref_price else base end;
  elsif new.plan = 'donation' then
    if coalesce(new.amount, 0) < 10 then
      raise exception 'donation minimum 10 taka';
    end if;
  else
    raise exception 'unknown plan: %', new.plan;
  end if;
  new.status := 'pending';
  return new;
end;
$$;

drop trigger if exists trg_payment_amount on public.payment_requests;
create trigger trg_payment_amount
  before insert on public.payment_requests
  for each row execute function public.validate_and_set_payment_amount();

-- ---------- MEDIUM: admin_process_payment — referred_by overwrite করবে না ----------
create or replace function public.admin_process_payment(p_payment_id uuid, p_approve boolean) returns void
language plpgsql security definer set search_path = public as $$
declare
  pay public.payment_requests%rowtype;
  owner_id uuid;
begin
  if not public.is_admin() then raise exception 'not admin'; end if;

  select * into pay from public.payment_requests
  where id = p_payment_id for update;          -- row lock (double-click safe)
  if not found then raise exception 'payment not found'; end if;
  if pay.status <> 'pending' then raise exception 'already decided'; end if;

  update public.payment_requests
  set status = case when p_approve then 'approved' else 'rejected' end
  where id = p_payment_id;

  if p_approve then
    if pay.plan = 'season' then
      update public.profiles
      set is_premium = true, premium_expires_at = '2027-12-31T23:59:59Z'::timestamptz
      where id = pay.user_id;
    elsif pay.plan = 'donation' then
      update public.profiles                       -- atomic increment, no read-then-write
      set total_donated = coalesce(total_donated, 0) + pay.amount
      where id = pay.user_id;
    end if;

    if pay.referral_code is not null and pay.referral_code <> '' then
      select id into owner_id from public.profiles
      where upper(referral_code) = upper(pay.referral_code) and id <> pay.user_id;
      if owner_id is not null then
        update public.profiles set discount_unlocked = true where id = owner_id;
        -- ✅ referred_by প্রথমবারই সেট হবে; পরে অন্য কেউ overwrite করতে পারবে না
        update public.profiles set referred_by = owner_id
        where id = pay.user_id and referred_by is null;
      end if;
    end if;
  end if;
end;
$$;

-- ---------- MEDIUM: app_settings default (subscription চালু default) ----------
alter table public.app_settings alter column subscription_enabled set default true;
