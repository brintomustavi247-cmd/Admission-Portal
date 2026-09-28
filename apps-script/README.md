# Apps Script research engine (v10) — deployment & integration

> `Code.gs`-এর canonical copy Apps Script project-এ থাকে (**v10**)। এই ফোল্ডারে শুধু deployment/integration
> চেকলিস্ট রাখা হলো, যাতে frontend-এর সাথে কোন contract-এর উপর চলছে সেটা repo-তেই থাকে।

## v10 যা যা করে

| Feature | Function | কোথায় লেখে |
|---|---|---|
| Multi-source research (Google News RSS + newspaper RSS + Telegram) | `fetchAllSources_`, `researchUniversity` | `university_updates` (status `pending`) |
| Article verification + agreement score + source weight | `verifyArticle_`, `calculateAgreementScore_`, `getSourceWeight_` | confidence-এ ভাঁজ হয় |
| Notice board change detection | `checkNoticeBoards` | `notice_board_snapshots` + Telegram alert |
| Community contribution **approve/reject** | `approveContribution_`, `rejectContribution_` | `university_updates` (published, `_contributor`) + `user_contributions.status` + `update_source_weight` RPC |
| Run logging | `logRun_` | `ai_scrape_logs` |
| Manual bulk insert | `manualInsert_` | `university_updates` |

## Webhook contract (frontend ↔ Apps Script)

| Method | URL | Body | কাজ |
|---|---|---|---|
| GET | `?key=<WEBHOOK_SECRET>&uni=<university_id>` | — | Deep research (queue-তে pending row) |
| GET | `?key=<WEBHOOK_SECRET>` | — | Full sweep (`runResearch`) |
| POST | `?key=<WEBHOOK_SECRET>&action=manual` | `{"rows":[...]}` | Manual bulk insert |
| POST | `?key=<WEBHOOK_SECRET>&action=approve_contribution` | `{"contribution_id":"<uuid>"}` | Approve → News publish + weight +1 |
| POST | `?key=<WEBHOOK_SECRET>&action=reject_contribution` | `{"contribution_id":"<uuid>"}` | Reject + weight -1 |

Apps Script `doPost` `e.parameter` থেকে `key`/`action` পড়ে (query string), body থেকে `contribution_id`।
Frontend (`src/components/admin/UpdateQueueTab.tsx`) `Content-Type: text/plain` দিয়ে POST করে — এতে CORS
preflight হয় না (Apps Script OPTIONS handle করে না)। Response body পড়া না গেলেও UI Supabase থেকে
status poll করে confirm করে।

## Deployment steps

1. Apps Script → পুরো `Code.gs` v10 paste → Save।
2. `saveSecrets()` run করো — `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `WEBHOOK_SECRET` বসাও
   (Script Properties-এ যায়, repo-তে কিছু লেখার দরকার নেই)।
3. `testConnection()` → Supabase ও Gemini দুটোতেই HTTP 200 আশা করো।
4. `setupTriggers()` → ৪x daily research + ৬ ঘণ্টায় notice-board check + digest।
5. **Deploy → New deployment → Web app** → *Execute as: Me*, *Who has access: Anyone* → Deploy → URL copy।
6. ⚠️ **`WEBHOOK_SECRET` rotate করো** (পুরনো value git history-তে পড়ে আছে) → `saveSecrets()` চালিয়ে
   Script Properties-এ নতুন random secret বসাও।
7. URL + key **`.env.local`-এ** (gitignored) বসাও — source file-এ আর কোনোদিন বসাবে না:
   ```bash
   VITE_RESEARCH_WEBHOOK_URL=https://script.google.com/macros/s/...../exec
   VITE_WEBHOOK_KEY=<নতুন WEBHOOK_SECRET>
   ```
   Vercel-এ deploy করলে Project → Settings → Environment Variables-এ এই দুটো var-ও add করো
   (নাহলে production build-এ webhook চালু হবে না)।
8. Supabase SQL Editor-এ migrations run করো (নিচের "Bootstrap order" দেখো)।
9. AI extract এখন Edge Function দিয়ে (key client-এ নেই):
   ```bash
   supabase functions deploy extract-with-gemini
   supabase secrets set GEMINI_API_KEY=<আগের Gemini key>
   ```
   Function deploy না হওয়া পর্যন্ত Admin → "১-ক্লিক AI এক্সট্রাক্টর" নিজে থেকেই
   local regex fallback extractor-এ কাজ করবে (feature ভাঙবে না)।

## Bootstrap order (গুরুত্বপূর্ণ)

Fresh DB বানাতে হলে ঠিক এই order-এ run করো (Supabase SQL Editor):

1. `supabase/schema.sql` — সব table + base function/trigger/policy
2. `supabase/migrations/20260927_restore_schema.sql` — v10 feature + RLS
3. `supabase/migrations/20260928_notice_board_and_scrape_logs.sql` — notice board + run logs
4. `supabase/migrations/20260928_fix_blockers.sql` — **সবসময় শেষে** (blocker + security fix)

**Migrations কখনো out-of-order run করবে না** — পরেরটা আগেরটার তৈরি করা object-এর উপর নির্ভর করে
(যেমন `check_referral_code()`/`validate_and_set_payment_amount()` আগের migration-ই বানায়)।
সবগুলো idempotent, তাই আগেরগুলো re-run করা নিরাপদ।

প্রতিটা migration কী যোগ করে:

- `supabase/migrations/20260927_restore_schema.sql` — `university_updates`, `user_contributions`, `app_feedback`,
  `source_weights`, `university_overrides`, `user_events`, `app_settings` columns, `update_source_weight()`,
  `admin_process_payment()`, RLS + realtime publication।
- `supabase/migrations/20260928_notice_board_and_scrape_logs.sql` — `notice_board_snapshots`, `ai_scrape_logs`
  (v10-এর notice detection + logging)।
- `supabase/migrations/20260928_fix_blockers.sql` — `profiles.email` column, `check_referral_code()` return type,
  self-update privilege-escalation বন্ধ, `profiles_select_all` সীমিত, `update_source_weight()` admin guard,
  `free_until` payment logic, `referred_by` overwrite বন্ধ।

## Security notes (গুরুত্বপূর্ণ)

- Apps Script-এর `GEMINI_API_KEY` / `SUPABASE_SERVICE_KEY` server-side ✅ — client-এ যায় না।
- **Browser-এ Gemini key নেই** — `ManualUpdateForm` / `AIExtractButton` এখন
  `supabase/functions/extract-with-gemini` proxy-তে call করে (key = Edge Function secret,
  admin-only: caller-এর JWT দিয়ে role verify হয়)।
- `VITE_WEBHOOK_KEY` এখন env-এ (`VITE_` prefix মানেই client bundle-এ যায়) — এটা শুধু webhook
  *trigger* করতে পারে; abuse ঠেকাতে চাইলে এটাও Edge Function proxy-তে সরাও।
- **Compromised secret git history-তে থাকে** — `WEBHOOK_SECRET` + Gemini key rotate করে
  সব জায়গায় (`.env.local`, Vercel env, Apps Script Script Properties, Supabase secrets) নতুন value বসাও।

## Verification checklist

1. **Community contribution** — frontend-এ (News → কমিউনিটি) তথ্য জমা দাও → `user_contributions.status='pending'`।
2. Admin → Queue tab → *Approve → News* → `university_updates`-এ `status='published'`,
   `extracted_data._contributor` + `_source='community'` থাকবে; News panel-এর কমিউনিটি tab-এ নামসহ দেখাবে।
3. **Source reliability** — ওই approve-এ `source_weights`-এ ওই hostname-এর `approved_count` +1 (reject-এ `rejected_count` +1)।
4. **Feedback popup** — localStorage-এর `feedback_popup_last_shown` মুছে reload → popup; submit → `app_feedback` row।
   Admin → Settings → "মতামত/ফিডব্যাক পপআপ" switch OFF করলে আর দেখাবে না।
5. **Notice board** — দুইবার `checkNoticeBoards` চালাও; দ্বিতীয়বার hash বদলালে Telegram alert + নতুন snapshot row।
