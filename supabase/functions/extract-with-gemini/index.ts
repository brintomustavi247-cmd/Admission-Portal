/**
 * extract-with-gemini — server-side Gemini proxy (SECURITY)
 *
 * কেন: আগে ব্রাউজার সরাসরি `VITE_GEMINI_API_KEY` দিয়ে Google Gemini call করত →
 * key client bundle-এ চলে যেত (যে কেউ দেখতে পারে)। এখন key শুধু এই function-এর
 * secret-এ থাকে: supabase secrets set GEMINI_API_KEY=...
 *
 * Contract (client → function):
 *   POST { text: string, university_id?: string, model?: string }
 * Response: raw Gemini payload (candidates[0].content.parts[0].text) + `model` —
 * তাই client-এর পুরনো parsing code অপরিবর্তিত থাকে।
 *
 * শুধু admin user call করতে পারে (caller-এর JWT দিয়ে PostgREST-এ role verify হয়)।
 */
/* এই file-টা Supabase Edge Function (Deno runtime), কিন্তু repo-র tsconfig
 * এটা include করে না (`include: ["src", "tests"]`) — তাই এখানে `Deno` global-এর
 * type পাওয়া যায় না। নিচের module-scoped declaration-টা শুধু এই file-এর ভেতরে
 * কাজ করে (global scope-এ leak করে না), তাই Deno extension-এর নিজস্ব types-এর
 * সাথে conflict হয় না — আবার editor-এও `Deno` undefined দেখাবে না।
 * TypeScript-এর `declare` runtime-এ কোনো code generate করে না, তাই
 * Deno-তে `Deno` আসলেই global থেকে আসবে। */

/* আগে `serve` remote থেকে import করা হতো:
 *   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 * ওটা Deno-only URL import — সাধারণ ts/ESLint সেটা resolve করতে পারে না
 * ("Cannot find module 'https://deno.land/...'"), আর deploy-এর সময়
 * network fetch লাগাত। std-এর `serve` আসলে `Deno.serve`-এরই wrapper,
 * যেটা এখন Deno runtime-এ built-in (Supabase edge runtime-এও)।
 * তাই নিজের code-ই যথেষ্ট — কোনো remote module লাগে না। */
declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(
    handler: (req: Request) => Response | Promise<Response>,
  ): unknown;
};

/* এটা নিজে module বানায়, যাতে উপরের `declare` global scope-এ ছড়িয়ে না পড়ে */
export {};

const GEMINI_API_KEY = (Deno.env.get("GEMINI_API_KEY") || "").trim();
const SUPABASE_URL = (Deno.env.get("SUPABASE_URL") || "").replace(/\/+$/, "");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

/* browser থেকে call হয় → CORS preflight handle করা বাধ্যতামূলক */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/* fallback order — এগুলো Google-এর আসল model id (আগের 'gemini-3.8-flash'-জাতীয় নাম exist করে না) */
const MODELS = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"];

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/* caller-এর JWT নিজে trust করি না — PostgREST signature verify করে role ফেরত দেয় */
async function isAdmin(authHeader: string): Promise<boolean> {
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token || !SUPABASE_URL || !SUPABASE_ANON_KEY) return false;

  const part = token.split(".")[1] || "";
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  let sub = "";
  try {
    const payload = JSON.parse(
      atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4)),
    );
    sub = typeof payload?.sub === "string" ? payload.sub : "";
  } catch {
    return false;
  }
  if (!sub) return false;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?select=role&id=eq.${encodeURIComponent(sub)}&limit=1`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: authHeader } },
  );
  if (!res.ok) return false;
  const rows = await res.json().catch(() => null);
  return Array.isArray(rows) && rows[0]?.role === "admin";
}

function buildPrompt(text: string, universityId?: string): string {
  return `You are an expert Bangladeshi University admission circular analyzer.
${universityId ? `Hint: the circular belongs to university_id "${universityId}".` : ""}
Return ONLY a pure valid JSON object (no markdown backticks), exact shape:
{
  "university_name": "University name in Bangla (e.g. জাহাঙ্গীরনগর বিশ্ববিদ্যালয়)",
  "title": "Short Bangla title (e.g. জাবি ভর্তি পরীক্ষা শুরু ১৭ জানুয়ারি)",
  "update_type": "admission_circular",
  "exam_date": "Exam date in Bangla (e.g. ১৭ জানুয়ারি)",
  "fees": "Fee text (e.g. ৳৫৫০)",
  "extracted_data": {
    "exam_date": "",
    "application_start": "",
    "application_end": "",
    "fees": "",
    "highlights": []
  },
  "source_urls": ["<the url if the input is a url, else empty>"]
}
Unknown field হলে "" / [] দাও — কোনো তারিখ বানিয়ে লিখবে না।
Input (circular text or news link):
"${text}"`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return reply({ error: "method not allowed" }, 405);

  try {
    if (!GEMINI_API_KEY) {
      return reply(
        { error: "GEMINI_API_KEY secret সেট করা নেই (supabase secrets set GEMINI_API_KEY=...)" },
        500,
      );
    }
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader) return reply({ error: "missing authorization header" }, 401);
    if (!(await isAdmin(authHeader))) return reply({ error: "admin only" }, 403);

    const body = await req.json().catch(() => null);
    const text: string = typeof body?.text === "string" ? body.text.trim() : "";
    const universityId: string | undefined =
      typeof body?.university_id === "string" ? body.university_id : undefined;
    if (!text) return reply({ error: "text is required" }, 400);
    if (text.length > 20000) {
      return reply({ error: "text too long (max 20000 chars)" }, 413);
    }

    const requested: string =
      typeof body?.model === "string" ? body.model.trim() : "";
    const models = requested
      ? [requested, ...MODELS.filter((m) => m !== requested)]
      : MODELS;

    let lastError = "";
    for (const model of models) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY, // key URL-এ নয় (log-এ leak কম)
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(text, universityId) }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          }),
        },
      );
      const data = await res.json().catch(() => null);
      if (res.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return reply({ ...data, model });
      }
      lastError = data?.error?.message || `HTTP ${res.status} from ${model}`;
    }
    return reply({ error: lastError || "Gemini call failed" }, 502);
  } catch (error) {
    return reply(
      { error: error instanceof Error ? error.message : String(error) },
      500,
    );
  }
});
