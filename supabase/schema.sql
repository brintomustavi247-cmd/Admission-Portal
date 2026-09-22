-- ========== PROFILES ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text default '',
  phone text default '',
  role text not null default 'user',
  access_enabled boolean not null default true,
  is_premium boolean not null default false,
  premium_expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- ========== APP SETTINGS ==========
create table if not exists public.app_settings (
  id int primary key default 1,
  subscription_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

-- ========== PAYMENT REQUESTS ==========
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  trx_id text not null,
  sender_phone text default '',
  plan text not null,
  amount int not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ========== AUTO PROFILE ON SIGNUP ==========
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name',''),
          coalesce(new.raw_user_meta_data->>'phone',''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========== ADMIN HELPER ==========
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- ========== RLS ==========
alter table public.profiles enable row level security;
create policy "own or admin select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "admin update profiles" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

alter table public.app_settings enable row level security;
create policy "public read settings" on public.app_settings
  for select using (true);
create policy "admin update settings" on public.app_settings
  for update using (public.is_admin()) with check (public.is_admin());

alter table public.payment_requests enable row level security;
create policy "own or admin select payments" on public.payment_requests
  for select using (user_id = auth.uid() or public.is_admin());
create policy "user create payment" on public.payment_requests
  for insert with check (user_id = auth.uid());
create policy "admin update payments" on public.payment_requests
  for update using (public.is_admin()) with check (public.is_admin());

-- ========== REALTIME ==========
alter publication supabase_realtime add table public.app_settings;

-- ========== DONOR CARD SYSTEM ==========
alter table public.profiles add column if not exists donor_card boolean not null default false;
alter table public.profiles add column if not exists total_donated int not null default 0;

create or replace function public.claim_donor_card()
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set donor_card = true
  where id = auth.uid() and total_donated > 0;
end $$;

-- ========== DYNAMIC PRICING + ANNOUNCEMENT ==========
alter table public.app_settings add column if not exists base_price int not null default 99;
alter table public.app_settings add column if not exists referral_price int not null default 49;
alter table public.app_settings add column if not exists announcement_text text not null default '';
