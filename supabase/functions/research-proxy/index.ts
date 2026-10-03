// Bulletproof proxy: ALWAYS 200+JSON, real cause in body.
// Contract Apps Script v10: GET ?key=&uni= (research), POST ?key=&action=approve|reject (community).
declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): unknown;
};
export {};
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const hookUrl = (Deno.env.get("RESEARCH_WEBHOOK_URL") ?? "").trim();
    const hookKey = (Deno.env.get("RESEARCH_WEBHOOK_KEY") ?? "").trim();
    if (!hookUrl || !hookKey) {
      return json({ ok: false, error: "proxy_not_configured", detail: "secrets (RESEARCH_WEBHOOK_URL/KEY) set kora nei" });
    }
    const supabaseUrl = (Deno.env.get("SUPABASE_URL") ?? "").replace(/\/+$/, "");
    const anonKey = (Deno.env.get("SUPABASE_ANON_KEY") ?? "").trim();
    const serviceKey = ((Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "").trim() || (Deno.env.get("SERVICE_ROLE_KEY") ?? "").trim());
    if (!supabaseUrl || !anonKey) {
      return json({ ok: false, error: "proxy_env_missing", detail: "SUPABASE_URL/ANON_KEY env nei" });
    }
    const auth = req.headers.get("Authorization") ?? "";
    if (!auth) return json({ ok: false, error: "not_logged_in", detail: "login expired — abar login koro" });
    let userId = "";
    try {
      const r = await fetch(supabaseUrl + "/auth/v1/user", { headers: { apikey: anonKey, Authorization: auth } });
      if (!r.ok) return json({ ok: false, error: "not_logged_in", detail: "auth_verify_http_" + r.status + " — abar login koro" });
      const u = (await r.json().catch(() => null)) as { id?: unknown } | null;
      userId = typeof u?.id === "string" ? u.id : "";
    } catch (e) {
      return json({ ok: false, error: "not_logged_in", detail: String((e as Error)?.message ?? e) });
    }
    if (!userId) return json({ ok: false, error: "not_logged_in", detail: "login expired — abar login koro" });
    try {
      const lk = serviceKey || anonKey;
      const la = serviceKey ? "Bearer " + serviceKey : auth;
      const r = await fetch(supabaseUrl + "/rest/v1/profiles?select=role&id=eq." + encodeURIComponent(userId) + "&limit=1", { headers: { apikey: lk, Authorization: la, Accept: "application/json" } });
      if (!r.ok) return json({ ok: false, error: "forbidden", detail: "role lookup failed http " + r.status });
      const rows = (await r.json().catch(() => null)) as Array<{ role?: unknown }> | null;
      if (!Array.isArray(rows) || rows[0]?.role !== "admin") {
        return json({ ok: false, error: "forbidden", detail: "shudhu admin — tomar role admin na" });
      }
    } catch (e) {
      return json({ ok: false, error: "forbidden", detail: String((e as Error)?.message ?? e) });
    }
    let body: Record<string, unknown> = {};
    try { body = (await req.json()) as Record<string, unknown>; } catch { body = {}; }
    const rawAction = typeof body.action === "string" ? body.action : "";
    const uni = ((typeof body.uni === "string" && body.uni.trim().slice(0, 64)) || (typeof body.uni_id === "string" && body.uni_id.trim().slice(0, 64)) || "");
    const action = rawAction || "scan";
    const isContrib = action === "approve_contribution" || action === "reject_contribution";
    let upstream: Response;
    if (isContrib) {
      const cid = typeof body.contribution_id === "string" ? body.contribution_id.trim().slice(0, 64) : "";
      if (!cid) return json({ ok: false, error: "bad_request", detail: "contribution_id is required" });
      const qs = new URLSearchParams({ key: hookKey, action });
      upstream = await fetch(hookUrl + "?" + qs.toString(), { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ contribution_id: cid }), redirect: "follow" });
    } else {
      const qs = new URLSearchParams({ key: hookKey });
      if (uni) qs.set("uni", uni);
      if (action !== "scan") qs.set("action", action);
      upstream = await fetch(hookUrl + "?" + qs.toString(), { redirect: "follow" });
    }
    const text = await upstream.text();
    try { return json(JSON.parse(text)); } catch {
      return json({ ok: false, error: "bad_upstream", detail: "Apps Script raw: " + text.slice(0, 180) });
    }
  } catch (e) {
    return json({ ok: false, error: "proxy_crash", detail: String((e as Error)?.message ?? e) });
  }
});
