import { createClient } from "@supabase/supabase-js";

/* Env-only (৩য় বার): আর কোনো hardcoded fallback নেই।
 * `VITE_` prefix মানেই value-টা client bundle-এ চলে যায়, তাই এগুলো
 * (anon key — anon key হলে public, কিন্তু URL/key ভুল project-এ
 * পড়ে গেলে production-এর data অন্য project-এ leak করার ঝুঁকি থাকে)
 * যাচাই না করে boot করা ভুল ছিল।
 * .env.example → .env.local copy না করলে এখন সঙ্গে সঙ্গে পরিষ্কার
 * error দেবে, চুপচাপ ভুল backend-এ কানেক্ট হবে না। */
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — copy .env.example to .env.local",
  );
}

export const supabase = createClient(url, anon);
