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
6. ওই URL `src/components/admin/UpdateQueueTab.tsx`-এর `RESEARCH_WEBHOOK_URL`-এ বসাও (আর `WEBHOOK_KEY`
   = `WEBHOOK_SECRET`)।
7. Supabase SQL Editor-এ migrations run করো (নিচে দেখো)।

## Database যেগুলো লাগে (repo-র migrations)

- `supabase/migrations/20260927_restore_schema.sql` — `university_updates`, `user_contributions`, `app_feedback`,
  `source_weights`, `university_overrides`, `user_events`, `app_settings` columns, `update_source_weight()`,
  `admin_process_payment()`, RLS + realtime publication।
- `supabase/migrations/20260928_notice_board_and_scrape_logs.sql` — `notice_board_snapshots`, `ai_scrape_logs`
  (v10-এর notice detection + logging এখানে লেখে)।

## Verification checklist

1. **Community contribution** — frontend-এ (News → কমিউনিটি) তথ্য জমা দাও → `user_contributions.status='pending'`।
2. Admin → Queue tab → *Approve → News* → `university_updates`-এ `status='published'`,
   `extracted_data._contributor` + `_source='community'` থাকবে; News panel-এর কমিউনিটি tab-এ নামসহ দেখাবে।
3. **Source reliability** — ওই approve-এ `source_weights`-এ ওই hostname-এর `approved_count` +1 (reject-এ `rejected_count` +1)।
4. **Feedback popup** — localStorage-এর `feedback_popup_last_shown` মুছে reload → popup; submit → `app_feedback` row।
   Admin → Settings → "মতামত/ফিডব্যাক পপআপ" switch OFF করলে আর দেখাবে না।
5. **Notice board** — দুইবার `checkNoticeBoards` চালাও; দ্বিতীয়বার hash বদলালে Telegram alert + নতুন snapshot row।

## Security notes (গুরুত্বপূর্ণ)

- Apps Script-এর `GEMINI_API_KEY` / `SUPABASE_SERVICE_KEY` server-side থাকে ✅ — client-এ যায় না।
- কিন্তু `WEBHOOK_SECRET` client bundle-এ আছে (যে কেউ দেখতে পারে) — এটা দিয়ে শুধু webhook trigger করা যায়,
  তাই কম ঝুঁকি; তবু ভবিষ্যতে rate-limit/quota abuse ঠেকাতে Supabase Edge Function proxy-তে সরানো ভালো।
- `src/components/admin/ManualUpdateForm.tsx` এখনো ব্রাউজারে `import.meta.env.VITE_GEMINI_API_KEY` পড়ে —
  এই ফাইলের "GEMINI key শুধু Apps Script-এ" নীতির সাথে সাংঘর্ষিক; decision দরকার (proxy তে সরাও বা key যোগ করো)।
