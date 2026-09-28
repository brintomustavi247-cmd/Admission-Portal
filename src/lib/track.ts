import { supabase } from './supabase';

/* uid আর module-level cache করা হয় না — sign-out/sign-in-এ stale uid যাওয়ার bug ছিল।
   প্রতিবার session থেকে পড়া হয় (local call, cheap)। */
export const track = async (event: string, meta?: Record<string, any>) => {
  try {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id || null;
    if (!uid) return;
    await supabase.from('user_events').insert({ user_id: uid, event_type: event, meta: meta || {} });
  } catch {}
};