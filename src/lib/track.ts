import { supabase } from './supabase';

let uidCache: string | null | undefined;

export const track = async (event: string, meta?: Record<string, any>) => {
  try {
    if (uidCache === undefined) {
      const { data } = await supabase.auth.getSession();
      uidCache = data.session?.user.id || null;
    }
    if (!uidCache) return;
    await supabase.from('user_events').insert({ user_id: uidCache, event_type: event, meta: meta || {} });
  } catch {}
};