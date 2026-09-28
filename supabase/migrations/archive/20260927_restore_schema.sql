-- ⚠️⚠️ HISTORICAL MIGRATION — DO NOT RUN ON ANY DATABASE ⚠️⚠️
-- Applied to production on 2026-09-27/28; now SUPERSEDED.
-- Fresh bootstrap  : run ONLY supabase/schema.sql
-- Existing prod DB : already up to date — re-running this file would
--                    RE-INTRODUCE removed vulnerabilities (open profiles
--                    read, priv-esc policy, unguarded RPCs).
-- Kept for audit history only.


-- ============================================================
-- RESTORE + COMPLETE SCHEMA (idempotent — যতবার খুশি run করা যাবে)
-- ============================================================

-- ---------- 0. is_admin (সবার আগে) ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- 1. profiles: missing columns + INSERT policy (referral dead-fix) ----------
alter table public.profiles add column if not exists referral_code text unique;
alter table public.profiles add column if not exists referred_by uuid;
alter table public.profiles add column if not exists discount_unlocked boolean not null default false;
alter table public.profiles add column if not exists last_seen timestamptz;
alter table public.profiles add column if not exists total_donated numeric not null default 0;
alter table public.profiles add column if not exists access_enabled boolean not null default true;
alter table public.profiles add column if not exists is_premium boolean not null default false;
alter table public.profiles add column if not exists premium_expires_at timestamptz;
alter table public.profiles add column if not exists role text not null default 'user';

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles for insert with check (auth.uid() = id);
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles for select using (true);
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update using (auth.uid() = id);
drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles for update using (public.is_admin());

-- ---------- 2. Referral code auto-generate (handle_new_user trigger) ----------
create or replace function public.generate_unique_referral_code() returns text
language plpgsql as $$
declare code text;
begin
  loop
    code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    if not exists (select 1 from public.profiles where referral_code = code) then
      return code;
    end if;
  end loop;
end;
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, referral_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,'user'), '@', 1)),
    public.generate_unique_referral_code()
  )
  on conflict (id) do update set
    email = excluded.email,
    referral_code = coalesce(public.profiles.referral_code, excluded.referral_code);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: যাদের code নেই তাদের দিয়ে দাও
update public.profiles set referral_code = public.generate_unique_referral_code()
where referral_code is null;

-- ---------- 3. touch_last_seen + check_referral_code RPC ----------
create or replace function public.touch_last_seen() returns void
language sql security definer as $$
  update public.profiles set last_seen = now() where id = auth.uid();
$$;

create or replace function public.check_referral_code(p_code text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where upper(referral_code) = upper(btrim(p_code)) and id <> auth.uid()
  );
$$;

-- ---------- 4. app_settings: missing columns ----------
create table if not exists public.app_settings (
  id int primary key default 1,
  subscription_enabled boolean not null default false,
  referral_discount_enabled boolean not null default true,
  donation_enabled boolean not null default true,
  contribution_enabled boolean not null default true,
  feedback_popup_enabled boolean not null default true,
  free_until timestamptz,
  base_price numeric not null default 99,
  referral_price numeric not null default 49,
  announcement_text text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.app_settings add column if not exists referral_discount_enabled boolean not null default true;
alter table public.app_settings add column if not exists donation_enabled boolean not null default true;
alter table public.app_settings add column if not exists free_until timestamptz;
alter table public.app_settings add column if not exists contribution_enabled boolean not null default true;
alter table public.app_settings add column if not exists feedback_popup_enabled boolean not null default true;
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

-- ---------- 5. payment_requests: referral_code + amount validation trigger ----------
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  trx_id text not null,
  sender_phone text,
  plan text not null,
  amount numeric,
  referral_code text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.payment_requests add column if not exists referral_code text;

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

-- ---------- 6. ATOMIC admin payment RPC (concurrency fix) ----------
create or replace function public.admin_process_payment(p_payment_id uuid, p_approve boolean) returns void
language plpgsql security definer set search_path = public as $$
declare
  pay public.payment_requests%rowtype;
  owner_id uuid;
begin
  if not public.is_admin() then raise exception 'not admin'; end if;

  select * into pay from public.payment_requests
  where id = p_payment_id for update;          -- row lock
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
        update public.profiles set referred_by = owner_id where id = pay.user_id;
      end if;
    end if;
  end if;
end;
$$;


-- ---------- 7. Missing TABLES ----------
create table if not exists public.university_updates (
  id uuid primary key default gen_random_uuid(),
  university_id text,
  university_name text,
  update_type text not null default 'circular',
  title text not null,
  raw_content text not null default '',
  extracted_data jsonb not null default '{}'::jsonb,
  source_urls jsonb not null default '[]'::jsonb,
  severity text not null default 'normal',
  status text not null default 'pending',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  event_type text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.university_overrides (
  university_id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  contributor_name text not null default 'Anonymous',
  university_id text,
  university_name text,
  info_text text not null,
  source_url text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.app_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text,
  message text not null,
  contact text,
  created_at timestamptz not null default now()
);

create table if not exists public.source_weights (
  source_name text primary key,
  weight numeric not null default 1.0,
  approved_count int not null default 0,
  rejected_count int not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.update_source_weight(p_source text, p_delta_approved int, p_delta_rejected int) returns void
language plpgsql security definer as $$
begin
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


-- ---------- 8. RLS on সব table ----------
alter table public.university_updates enable row level security;
drop policy if exists uu_select on public.university_updates;
create policy uu_select on public.university_updates for select using (status = 'published' or public.is_admin());
drop policy if exists uu_admin on public.university_updates;
create policy uu_admin on public.university_updates for all using (public.is_admin()) with check (public.is_admin());

alter table public.user_events enable row level security;
drop policy if exists ue_insert on public.user_events;
create policy ue_insert on public.user_events for insert with check (auth.uid() = user_id);
drop policy if exists ue_select on public.user_events;
create policy ue_select on public.user_events for select using (auth.uid() = user_id or public.is_admin());

alter table public.university_overrides enable row level security;
drop policy if exists ov_read on public.university_overrides;
create policy ov_read on public.university_overrides for select using (true);
drop policy if exists ov_admin on public.university_overrides;
create policy ov_admin on public.university_overrides for all using (public.is_admin()) with check (public.is_admin());

alter table public.user_contributions enable row level security;
drop policy if exists uc_insert on public.user_contributions;
create policy uc_insert on public.user_contributions for insert with check (true);
drop policy if exists uc_read on public.user_contributions;
create policy uc_read on public.user_contributions for select using (status = 'approved' or public.is_admin());
drop policy if exists uc_admin on public.user_contributions;
create policy uc_admin on public.user_contributions for all using (public.is_admin()) with check (public.is_admin());

alter table public.app_feedback enable row level security;
drop policy if exists af_insert on public.app_feedback;
create policy af_insert on public.app_feedback for insert with check (true);
drop policy if exists af_admin on public.app_feedback;
create policy af_admin on public.app_feedback for all using (public.is_admin());

alter table public.source_weights enable row level security;
drop policy if exists sw_read on public.source_weights;
create policy sw_read on public.source_weights for select using (true);
drop policy if exists sw_admin on public.source_weights;
create policy sw_admin on public.source_weights for all using (public.is_admin()) with check (public.is_admin());

alter table public.payment_requests enable row level security;
drop policy if exists pr_insert on public.payment_requests;
create policy pr_insert on public.payment_requests for insert with check (auth.uid() = user_id);
drop policy if exists pr_select on public.payment_requests;
create policy pr_select on public.payment_requests for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists pr_update on public.payment_requests;
create policy pr_update on public.payment_requests for update using (public.is_admin());

-- ---------- 9. REALTIME publication (popup/NewsPanel live sync fix) ----------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'university_updates'
  ) then
    alter publication supabase_realtime add table public.university_updates;
  end if;
end $$;

-- ---------- 10. Indexes ----------
create index if not exists idx_uu_status on public.university_updates(status);
create index if not exists idx_uu_uni on public.university_updates(university_id);
create index if not exists idx_ue_user on public.user_events(user_id, created_at desc);
create index if not exists idx_uc_status on public.user_contributions(status);

