import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PremiumPaywall } from './PremiumModal';
import { FreePeriodPopup } from './FreePeriodPopup';
import { ShieldOff, RefreshCw, Megaphone } from 'lucide-react';

export const AppGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading, refreshProfile } = useAuth();
  const [subEnabled, setSubEnabled] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    let alive = true;
    const load = () =>
      supabase.from('app_settings').select('subscription_enabled, announcement_text').eq('id', 1).single()
        .then(({ data, error }) => {
          if (!alive) return;
          if (error || !data) { setSubEnabled(false); return; }
          setSubEnabled(!!data.subscription_enabled);
          setAnnouncement(data.announcement_text || '');
        });
    load();
    const ch = supabase.channel('settings-watch')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_settings' }, () => load())
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#151a23]">
        <RefreshCw className="w-7 h-7 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#151a23] text-slate-200 p-6 text-center">
        <RefreshCw className="w-10 h-10 text-red-400 mb-3" />
        <h2 className="text-lg font-black text-white">প্রোফাইল লোড করা যায়নি</h2>
        <button onClick={() => refreshProfile()} className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer">Retry</button>
      </div>
    );
  }

  if (!profile.access_enabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#151a23] text-slate-200 p-6 text-center">
        <ShieldOff className="w-14 h-14 text-red-400 mb-4" />
        <h2 className="text-xl font-black text-white">অ্যাক্সেস বন্ধ করা হয়েছে</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">সাপোর্ট টিমের সাথে যোগাযোগ করো।</p>
      </div>
    );
  }

  const premiumActive = profile.is_premium && (!profile.premium_expires_at || new Date(profile.premium_expires_at).getTime() > Date.now());

  if (subEnabled && profile.role !== 'admin' && !premiumActive) {
    return <PremiumPaywall />;
  }

  return (
    <>
      {announcement && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold px-4 py-2 text-center flex items-center justify-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5 shrink-0" /> {announcement}
        </div>
      )}
      {children}
      <FreePeriodPopup />
    </>
  );
};
