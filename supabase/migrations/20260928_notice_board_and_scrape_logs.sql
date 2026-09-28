-- ============================================================
-- Apps Script v10 সাপোর্ট টেবিল (idempotent — যতবার খুশি run করা যাবে)
--   • checkNoticeBoards() → notice_board_snapshots
--   • logRun_()          → ai_scrape_logs
-- এই দুটো টেবিল ছাড়া v10-এর notice-board detection + run logging silent fail করত।
-- (Apps Script service_role key দিয়ে লেখে — RLS bypass হয়; নিচের policy গুলো শুধু admin UI-র জন্য।)
-- ============================================================

-- ---------- 1. notice_board_snapshots ----------
create table if not exists public.notice_board_snapshots (
  id uuid primary key default gen_random_uuid(),
  university_id text not null,
  url text not null,
  content_hash text not null,
  detected_at timestamptz not null default now()
);
create index if not exists idx_nbs_uni_time
  on public.notice_board_snapshots(university_id, detected_at desc);

alter table public.notice_board_snapshots enable row level security;
drop policy if exists nbs_admin on public.notice_board_snapshots;
create policy nbs_admin on public.notice_board_snapshots
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- 2. ai_scrape_logs ----------
create table if not exists public.ai_scrape_logs (
  id uuid primary key default gen_random_uuid(),
  run_type text not null,
  input_query text,
  ai_model text,
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_asl_created
  on public.ai_scrape_logs(created_at desc);
create index if not exists idx_asl_query
  on public.ai_scrape_logs(input_query, created_at desc);

alter table public.ai_scrape_logs enable row level security;
drop policy if exists asl_admin on public.ai_scrape_logs;
create policy asl_admin on public.ai_scrape_logs
  for all using (public.is_admin()) with check (public.is_admin());
