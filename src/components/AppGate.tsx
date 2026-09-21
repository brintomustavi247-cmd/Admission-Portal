import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PremiumPaywall } from './PremiumModal';
import { ShieldOff, RefreshCw } from 'lucide-react';

export const AppGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading, refreshProfile } = useAuth();
  const [subEnabled, setSubEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const load = () =>
      supabase.from('app_settings').select('subscription_enabled').eq('id', 1).single()
        .then(({ data }) => { if (data) setSubEnabled(data.subscription_enabled); });
    load();
    const ch = supabase.channel('settings-watch')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_settings' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (loading || !profile || subEnabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#151a23]">
        <RefreshCw className="w-7 h-7 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!profile.access_enabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#151a23] text-slate-200 p-6 text-center">
        <ShieldOff className="w-14 h-14 text-red-400 mb-4" />
        <h2 className="text-xl font-black text-white">অ্যাক্সেস বন্ধ করা হয়েছে</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          তোমার অ্যাকাউন্টে অ্যাক্সেস নিষ্ক্রিয় করা হয়েছে। সাপোর্ট টিমের সাথে যোগাযোগ করো।
        </p>
        <button onClick={refreshProfile}
          className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer">
          পুনরায় চেক করো
        </button>
      </div>
    );
  }

  const premiumActive =
    profile.is_premium &&
    (!profile.premium_expires_at || new Date(profile.premium_expires_at).getTime() > Date.now());

  if (subEnabled && profile.role !== 'admin' && !premiumActive) {
    return <PremiumPaywall />;
  }

  return <>{children}</>;
};
