import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toBanglaNum } from '../lib/banglaUtils';
import { Gift, Copy, Check, X, MessageCircle, Send, Clock } from 'lucide-react';

export const FreePeriodPopup: React.FC = () => {
  const { profile } = useAuth();
  const [freeUntil, setFreeUntil] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    supabase.from('app_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (!data) return;
      setFreeUntil(data.free_until);
      const today = new Date().toDateString();
      if (!data.subscription_enabled && data.free_until && localStorage.getItem('fpp_dismissed') !== today) {
        setOpen(true);
      }
    });
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  if (!open || !profile || !freeUntil) return null;
  const diff = new Date(freeUntil).getTime() - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  const dismiss = () => {
    localStorage.setItem('fpp_dismissed', new Date().toDateString());
    setOpen(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile.referral_code || '');
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const shareText = encodeURIComponent(
    `🎓 বিশ্ববিদ্যালয় ভর্তি ২০২৬-২৭ অ্যাপ! এখন ১০০% ফ্রি চলছে। আমার কোড ${profile.referral_code} দিয়ে signup করিস — পরে কাজে লাগবে!`
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative w-full max-w-sm bg-[#151b27] border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-100">
        <button onClick={dismiss} className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-white/10 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Gift className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg font-black text-white mt-3">এখন ১০০% ফ্রি চলছে!</h2>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            কিন্তু <strong className="text-amber-300">খুব বেশি দিন ফ্রি থাকবে না</strong> — প্রিমিয়াম চালু হলে দাম ৳৯৯
          </p>
        </div>

        {/* Countdown */}
        <div className="mt-4 rounded-2xl bg-[#0f141d] border border-white/10 p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
            <Clock className="w-3 h-3" /> ফ্রি সময় বাকি
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <div>
              <div className="text-3xl font-black text-emerald-400 font-number">{toBanglaNum(days)}</div>
              <div className="text-[10px] text-slate-500">দিন</div>
            </div>
            <div className="text-2xl text-slate-600 font-black">:</div>
            <div>
              <div className="text-3xl font-black text-emerald-400 font-number">{toBanglaNum(hours)}</div>
              <div className="text-[10px] text-slate-500">ঘণ্টা</div>
            </div>
          </div>
        </div>

        {/* Referral code share */}
        {profile.referral_code && (
          <div className="mt-3 rounded-2xl bg-[#0f141d] border border-white/10 p-3">
            <div className="text-[10px] text-slate-400 font-bold mb-2">তোমার কোড — friend-দের দাও (পরে ছাড় পাবে)</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-center py-2 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-300 font-black tracking-widest text-sm">
                {profile.referral_code}
              </code>
              <button onClick={copyCode} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              </button>
              <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 cursor-pointer">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>
        )}

        <button onClick={dismiss}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition">
          বুঝেছি — ফ্রি সময়টা উপভোগ করছি 🎉
        </button>

        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-slate-500">
          <a href="https://t.me/TOMAR_CHANNEL" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-sky-400">
            <Send className="w-3 h-3" /> Telegram-এ আপডেট
          </a>
        </div>
      </div>
    </div>
  );
};
