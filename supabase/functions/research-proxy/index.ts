// Admin-only proxy to the Apps Script research webhook.
// Secret lives in Supabase secrets (server-side), never in the bundle.

/* এই file-টা Deno runtime-এ চলে, কিন্তু repo-র tsconfig এটা include করে না
 * (`include: ["src", "tests"]`) — তাই `Deno` global-এর type এখানে নেই।
 * Module-scoped declare (global scope-এ leak করে না)। */
declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(
    handler: (req: Request) => Response | Promise<Response>,
  ): unknown;
};

/* আগে `createClient` esm.sh থেকে import করা হতো:
 *   import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 * ওটা Deno-only URL import — সাধারণ ts/ESLint সেটা resolve করতে পারে না
 * ("Cannot find module 'https://esm.sh/...'"), আর deploy-এর সময় network
 * fetch লাগাত। তাই নিচে `fetch` দিয়েই Supabase-এর REST endpoint-এ কাজ হয়
 * (extract-with-gemini function-ও একইভাবে করে) — কোনো remote module লাগে না। */

/* এটা নিজে module বানায়, যাতে উপরের `declare` global scope-এ ছড়িয়ে না পড়ে */
export {};

const APP_ORIGIN = "https://varsity-admission-bd.vercel.app";
const SCRIPT_URL = (Deno.env.get("RESEARCH_WEBHOOK_URL") || "").trim();
const SCRIPT_KEY = (Deno.env.get("RESEARCH_WEBHOOK_KEY") || "").trim();
const SUPABASE_URL = (Deno.env.get("SUPABASE_URL") || "").replace(/\/+$/, "");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

/* CORS: `*` না — শুধু আমাদের নিজের origin (credentialed request-এ
 * wildcard ব্যবহার করলে browser reject করে)। */
const cors = {
  "Access-Control-Allow-Origin": APP_ORIGIN,
  "Vary": "Origin",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });

/* `sb.auth.getUser()`-এর fetch equivalent — caller-এর নিজের JWT দিয়ে
 * `/auth/v1/user`-এ যাই, তাই token-টা সত্যিই verify হয় (শুধু decode নয়)।
 * service_role key শুধু apikey হিসেবে যায়, identity caller-েরই থাকে। */
async function resolveUserId(authHeader: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: authHeader },
  });
  if (!res.ok) return "";
  const user = (await res.json().catch(() => null)) as { id?: unknown } | null;
  return typeof user?.id === "string" ? user.id : "";
}

/* role যাচাই — service_role key দিয়ে RLS bypass করে profiles থেকে পড়ি,
 * তাই যে ইচ্ছেই token পাঠাক, শুধু নিজের `id`-র role-ই দেখা যায়। */
async function isAdmin(userId: string): Promise<boolean> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles` +
      `?select=role&id=eq.${encodeURIComponent(userId)}&limit=1`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Accept: "application/json",
      },
    },
  );
  if (!res.ok) return false;
  const rows = (await res.json().catch(() => null)) as
    | Array<{ role?: unknown }>
    | null;
  return Array.isArray(rows) && rows[0]?.role === "admin";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);

  if (!SCRIPT_URL || !SCRIPT_KEY) {
    return json({ ok: false, error: "webhook secret not configured" }, 500);
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ ok: false, error: "supabase env missing" }, 500);
  }

  try {
    // 1) JWT verified by runtime (verify_jwt = true); resolve user
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ ok: false, error: "unauthenticated" }, 401);
    const userId = await resolveUserId(auth);
    if (!userId) return json({ ok: false, error: "unauthenticated" }, 401);

    // 2) admin check SERVER-SIDE (client-side role check হলোই যথেষ্ট নয়)
    if (!(await isAdmin(userId))) {
      return json({ ok: false, error: "forbidden" }, 403);
    }

    // 3) proxy with server-held secret
    const body = await req.json().catch(() => ({}) as Record<string, unknown>);

    /* Two upstream shapes, Apps Script-এর existing contract অক্ষত রেখে:
     *   a) GET  ?key=&uni=...                                  → deep research
     *   b) POST ?key=&action=approve_contribution|reject_contribution
     *      body: { contribution_id }                            → community review
     * দুটোতেই Apps Script `doPost` e.parameter (query) থেকে key/action পড়ে। */
    const action = typeof body?.action === "string" ? body.action : "";
    const isContributionAction =
      action === "approve_contribution" || action === "reject_contribution";
    const contributionId =
      typeof body?.contribution_id === "string"
        ? body.contribution_id.trim().slice(0, 64)
        : "";

    const params = new URLSearchParams({ key: SCRIPT_KEY });
    const uni = typeof body?.uni === "string" ? body.uni.trim().slice(0, 64) : "";

    let upstream: Response;
    if (isContributionAction) {
      if (!contributionId) {
        return json({ ok: false, error: "contribution_id is required" }, 400);
      }
      params.set("action", action);
      // text/plain → Apps Script-এর preflight ফাঁকা পড়ে না (আগের client behaviour)
      upstream = await fetch(`${SCRIPT_URL}?${params.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ contribution_id: contributionId }),
        redirect: "follow",
      });
    } else {
      if (uni) params.set("uni", uni);
      upstream = await fetch(`${SCRIPT_URL}?${params.toString()}`, {
        redirect: "follow",
      });
    }

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (error) {
    return json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      500,
    );
  }
});