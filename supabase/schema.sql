-- ============================================================
-- CANONICAL SCHEMA — Generated from migrations
-- Bootstrap: এই ফাইল run করো, তারপর migrations order-এ apply করো:
--   1. supabase/schema.sql                                    (এই ফাইল)
--   2. supabase/migrations/20260927_restore_schema.sql
--   3. supabase/migrations/20260928_notice_board_and_scrape_logs.sql
--   4. supabase/migrations/20260928_fix_blockers.sql
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- CORE TABLES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'user',
  access_enabled boolean not null default true,
  is_premium boolean not null default false,
  premium_expires_at timestamptz,
  referral_code text unique,
  referred_by uuid references public.profiles(id),
  discount_unlocked boolean not null default false,
  total_donated numeric not null default 0,
  donor_card boolean not null default false,
  last_seen timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id int primary key default 1,
  subscription_enabled boolean not null default true,
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

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trx_id text not null,
  sender_phone text,
  plan text not null,
  amount numeric,
  referral_code text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

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
  user_id uuid references auth.users(id) on delete cascade,
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
  user_id uuid references auth.users(id) on delete set null,
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
  user_id uuid references auth.users(id) on delete set null,
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

create table if not exists public.ai_scrape_logs (
  id uuid primary key default gen_random_uuid(),
  run_type text not null,
  input_query text,
  ai_model text,
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notice_board_snapshots (
  id uuid primary key default gen_random_uuid(),
  university_id text not null,
  url text not null,
  content_hash text not null,
  detected_at timestamptz not null default now()
);

-- ============================================================
-- FUNCTIONS
-- ============================================================

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

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

create or replace function public.touch_last_seen() returns void
language sql security definer set search_path = public as $$
  update public.profiles set last_seen = now() where id = auth.uid();
$$;

-- donor card (SettingsPanel → "Claim" → profile.donor_card)
create or replace function public.claim_donor_card() returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set donor_card = true
  where id = auth.uid() and coalesce(total_donated, 0) > 0;
end;
$$;

-- PremiumModal referral verify → row.owner_id / row.owner_name
create or replace function public.check_referral_code(code text)
returns table(owner_id uuid, owner_name text)
language sql stable security definer set search_path = public as $$
  select p.id, p.full_name
    from public.profiles p
   where upper(p.referral_code) = upper(btrim(code))
     and p.id <> auth.uid();
$$;

-- RLS policy helper: privileged column গুলো unchanged কিনা।
-- SECURITY DEFINER (owner RLS bypass করে) — নইলে policy-র ভিতরে same-table
-- subquery দিলে PostgreSQL 42P17 "infinite recursion detected in policy" দেয়।
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

  -- ফ্রি উইন্ডো: টাকা লাগবে না → amount 0 + status 'free_period' + সাথে সাথে access
  -- (Admin UI শুধু 'pending' দেখায়, তাই access না দিলে user আটকে যেত)
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
        update public.profiles set referred_by = owner_id
        where id = pay.user_id and referred_by is null;   -- overwrite হবে না
      end if;
    end if;
  end if;
end;
$$;

create or replace function public.update_source_weight(p_source text, p_delta_approved int, p_delta_rejected int) returns void
language plpgsql security definer set search_path = public as $$
begin
  -- admin UI অথবা Apps Script v10 (service_role key) — service_role JWT-তে
  -- auth.uid() NULL থাকে, তাই শুধু is_admin() চেক করলে webhook flow ভাঙত।
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

-- ============================================================
-- TRIGGERS
-- ============================================================

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists trg_payment_amount on public.payment_requests;
create trigger trg_payment_amount
  before insert on public.payment_requests
  for each row execute function public.validate_and_set_payment_amount();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.payment_requests enable row level security;
alter table public.university_updates enable row level security;
alter table public.user_events enable row level security;
alter table public.university_overrides enable row level security;
alter table public.user_contributions enable row level security;
alter table public.app_feedback enable row level security;
alter table public.source_weights enable row level security;
alter table public.ai_scrape_logs enable row level security;
alter table public.notice_board_snapshots enable row level security;

-- Profiles — self insert/edit নিরাপদ column-এ বাঁধা (privilege escalation বন্ধ)
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
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
  for select using (auth.uid() = id or public.is_admin());
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
drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update using (public.is_admin());

-- App settings
drop policy if exists settings_read on public.app_settings;
create policy settings_read on public.app_settings for select using (true);
drop policy if exists settings_update on public.app_settings;
create policy settings_update on public.app_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- Payment requests
drop policy if exists pr_insert on public.payment_requests;
create policy pr_insert on public.payment_requests
  for insert with check (auth.uid() = user_id);
drop policy if exists pr_select on public.payment_requests;
create policy pr_select on public.payment_requests
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists pr_update on public.payment_requests;
create policy pr_update on public.payment_requests
  for update using (public.is_admin()) with check (public.is_admin());

-- University updates
drop policy if exists uu_select on public.university_updates;
create policy uu_select on public.university_updates
  for select using (status = 'published' or public.is_admin());
drop policy if exists uu_admin on public.university_updates;
create policy uu_admin on public.university_updates
  for all using (public.is_admin()) with check (public.is_admin());

-- User events + overrides
drop policy if exists ue_insert on public.user_events;
create policy ue_insert on public.user_events
  for insert with check (auth.uid() = user_id);
drop policy if exists ue_select on public.user_events;
create policy ue_select on public.user_events
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists ov_read on public.university_overrides;
create policy ov_read on public.university_overrides for select using (true);
drop policy if exists ov_admin on public.university_overrides;
create policy ov_admin on public.university_overrides
  for all using (public.is_admin()) with check (public.is_admin());

-- Contributions / feedback / source weights (anonymous spam বন্ধ)
drop policy if exists uc_insert on public.user_contributions;
create policy uc_insert on public.user_contributions
  for insert with check (auth.uid() is not null);
drop policy if exists uc_read on public.user_contributions;
create policy uc_read on public.user_contributions
  for select using (status = 'approved' or public.is_admin());
drop policy if exists uc_admin on public.user_contributions;
create policy uc_admin on public.user_contributions
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists af_insert on public.app_feedback;
create policy af_insert on public.app_feedback
  for insert with check (auth.uid() is not null);
drop policy if exists af_admin on public.app_feedback;
create policy af_admin on public.app_feedback
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists sw_read on public.source_weights;
create policy sw_read on public.source_weights for select using (true);
drop policy if exists sw_admin on public.source_weights;
create policy sw_admin on public.source_weights
  for all using (public.is_admin()) with check (public.is_admin());

-- Apps Script v10 tables (Apps Script service_role key দিয়ে লেখে → RLS bypass)
drop policy if exists asl_admin on public.ai_scrape_logs;
create policy asl_admin on public.ai_scrape_logs
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists nbs_admin on public.notice_board_snapshots;
create policy nbs_admin on public.notice_board_snapshots
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_uu_status on public.university_updates(status);
create index if not exists idx_uu_uni on public.university_updates(university_id);
create index if not exists idx_ue_user on public.user_events(user_id, created_at desc);
create index if not exists idx_uc_status on public.user_contributions(status);
create index if not exists idx_pr_user on public.payment_requests(user_id, created_at desc);
create index if not exists idx_nbs_uni_time on public.notice_board_snapshots(university_id, detected_at desc);
create index if not exists idx_asl_created on public.ai_scrape_logs(created_at desc);
create index if not exists idx_asl_query on public.ai_scrape_logs(input_query, created_at desc);

-- ============================================================
-- REALTIME PUBLICATION
-- (NewsPanel ↔ university_updates, useAppSettings ↔ app_settings live sync)
-- ============================================================

do $$
declare t text;
begin
  foreach t in array array['university_updates', 'app_settings'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ============================================================
-- INITIAL DATA
-- ============================================================

insert into public.app_settings (id) values (1) on conflict (id) do nothing;





