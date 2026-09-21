import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'user' | 'admin';
  access_enabled: boolean;
  is_premium: boolean;
  premium_expires_at: string | null;
  referral_code?: string | null;
  referred_by?: string | null;
  discount_unlocked?: boolean;
}

interface AuthCtx {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfile = useCallback(async (uid?: string | null) => {
    if (!uid) { setProfile(null); return; }
    setProfileError(null);

    let { data, error } = await supabase
      .from('profiles').select('*').eq('id', uid).single();
    if (error) console.error('[profile select]', error.message);

    /* ভাঙা/পুরোনো token → clean logout */
    if (error && /jwt|token/i.test(error.message)) {
      setProfileError('Stale session → ' + error.message);
      await supabase.auth.signOut();
      setProfile(null);
      return;
    }

    /* row নেই → বানাও */
    if (!data) {
      const { data: me } = await supabase.auth.getUser();
      const m = me.user?.user_metadata || {};
      const ins = await supabase.from('profiles').insert({
        id: uid,
        full_name: m.full_name || m.name || '',
        phone: m.phone || '',
        referral_code: ('U' + uid.slice(0, 5)).toUpperCase(),
      });
      if (ins.error) console.error('[profile insert]', ins.error.message);
      else {
        const r = await supabase.from('profiles').select('*').eq('id', uid).single();
        data = r.data;
        if (r.error) console.error('[profile reselect]', r.error.message);
      }
      if (!data && error) setProfileError(error.message);
      if (!data && ins.error) setProfileError(ins.error.message);
    }

    if (!data) {
      if (!profileError) setProfileError('Profile row পাওয়া/বানানো যায়নি');
      setProfile(null);
      return;
    }
    setProfile(data as Profile);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user.id ?? null).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) loadProfile(s.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(
    () => loadProfile(session?.user.id ?? null),
    [loadProfile, session]
  );

  const signOut = useCallback(async () => { await supabase.auth.signOut(); }, []);

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, profile, loading, profileError, refreshProfile, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth outside AuthProvider');
  return c;
};