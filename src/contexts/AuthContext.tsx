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
}

interface AuthCtx {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid?: string | null) => {
    if (!uid) { setProfile(null); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
    setProfile((data as Profile) || null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user.id ?? null).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      loadProfile(s?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(
    () => loadProfile(session?.user.id ?? null),
    [loadProfile, session]
  );

  const signOut = useCallback(async () => { await supabase.auth.signOut(); }, []);

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, profile, loading, refreshProfile, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth outside AuthProvider');
  return c;
};
