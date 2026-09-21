import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toBanglaNum } from '../lib/banglaUtils';
import { useAuth } from '../contexts/AuthContext';
import { X, Crown, Ticket, Copy, Check, MessageCircle, Send, LogOut, ShieldCheck, Mail, Heart } from 'lucide-react';

const WHATSAPP = 'https://wa.me/8801XXXXXXXXX';
const TELEGRAM = 'https://t.me/TOMAR_CHANNEL';
const TIP_BKASH = '01XXXXXXXXX';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const SettingsPanel: React.FC<Props> = ({ open, onClose, onOpenAdmin }) => {
  const { session, profile, signOut } = useAuth();
  const [copied, setCopied] = useState(false);
  const [donationOn, setDonationOn] = useState(false);
  const [tip, setTip] = useState(20);
  const [tipTrx, setTipTrx] = useState('');
  const [tipBusy, setTipBusy] = useState(false);
  const [tipMsg, setTipMsg] = useState('');
  const [numCopied, setNumCopied] = useState(false);

  useEffect(() => {
    supabase.from('app_settings').select('donation_enabled').eq('id', 1).single()
      .then(({ data }) => data && setDonationOn(data.donation_enabled !== false));
  }, []);

  if (!open) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile?.referral_code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const copyNum = async () => {
    try { await navigator.clipboard.writeText(TIP_BKASH); setNumCopied(true); setTimeout(() => setNumCopied(false), 1500); } catch {}
  };

  const sendTip = async () => {
    if (!profile || tipTrx.trim().length < 6) { setTipMsg('সঠিক TrxID লিখো'); return; }
    setTipBusy(true); setTipMsg('');
    const { error } = await supabase.from('payment_requests').insert({
      user_id: profile.id, trx_id: tipTrx.trim(), plan: 'donation', amount: tip, status: 'pending',
    });
    setTipBusy(false);
    setTipMsg(error ? 'ব্যর্থ: ' + error.message : '💜 ধন্যবাদ! তোমার support পেয়েছি');
    setTipTrx('');
  };

  const shareText = encodeURIComponent(
    `🎓 বিশ্ববিদ্যালয় ভর্তি ২০২৬-২৭ অ্যাপ! আমার কোড ${profile?.referral_code} দিয়ে signup কর — ছাড় পাবি!`
  );
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Right slide-in panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-[#151b27] shadow-2xl overflow-y-auto p-5 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black">সেটিংস</h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ===== Account ===== */}
        <div className="rounded-2xl bg-slate-100 dark:bg-[#0f141d] border border-slate-200 dark:border-white/10 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white font-black shrink-0">
              {(session?.user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" /> {session?.user.email}
              </div>
              <div className="flex gap-1.5 mt-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${profile?.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
                  {profile?.role === 'admin' ? 'ADMIN' : 'USER'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 ${profile?.is_premium ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
                  {profile?.is_premium && <Crown className="w-2.5 h-2.5" />}
                  {profile?.is_premium ? 'প্রিমিয়াম' : 'ফ্রি'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Referral ===== */}
        {profile?.referral_code && (
          <div className="rounded-2xl bg-slate-100 dark:bg-[#0f141d] border border-slate-200 dark:border-white/10 p-4 mb-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
              <Ticket className="w-3 h-3" /> তোমার রেফারেল কোড
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-center py-2.5 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-600 dark:text-blue-300 font-black tracking-widest text-sm">
                {profile.referral_code}
              </code>
              <button onClick={copyCode} className="p-2.5 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 cursor-pointer">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 cursor-pointer">
                <MessageCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              </a>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
              Friend এই কোড দিয়ে signup করলেই সে ৳৪৯ পাবে আর তোমার ডিসকাউন্ট unlock হবে
            </p>
          </div>
        )}
        {/* ===== Donation (admin ON করলে দেখাবে) ===== */}
        {donationOn && (
          <div className="rounded-2xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 border border-violet-500/30 p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <div className="text-xs font-black text-white">ডেভেলপার সাপোর্ট</div>
                <div className="text-[10px] text-slate-400">ঐচ্ছিক tip — premium নয়, শুধু ভালোবাসা 💜</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 my-3">
              {[10, 20, 50, 100].map((t) => (
                <button key={t} onClick={() => setTip(t)}
                  className={`py-2 rounded-xl text-[11px] font-black cursor-pointer transition ${
                    tip === t ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/30' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}>
                  ৳{toBanglaNum(t)}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 mb-2 rounded-xl bg-[#0f141d] border border-white/10 px-3 py-2">
              <span className="text-[10px] text-slate-400 font-bold">bKash:</span>
              <button onClick={copyNum} className="flex items-center gap-1 text-[10px] font-black text-pink-300 cursor-pointer">
                {numCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {TIP_BKASH}
              </button>
            </div>

            <div className="flex gap-2">
              <input value={tipTrx} onChange={(e) => setTipTrx(e.target.value)} placeholder="Donation TrxID"
                className="flex-1 bg-[#0f141d] border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white placeholder:text-slate-500 focus:outline-none" />
              <button onClick={sendTip} disabled={tipBusy}
                className="px-4 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[11px] font-black cursor-pointer disabled:opacity-50 shadow-lg shadow-violet-500/25">
                পাঠাও
              </button>
            </div>
            {tipMsg && <p className="text-[10px] text-violet-300 mt-2 text-center font-bold">{tipMsg}</p>}
          </div>
        )}

        {/* ===== Admin ===== */}
        {profile?.role === 'admin' && onOpenAdmin && (
          <button onClick={() => { onClose(); onOpenAdmin(); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black hover:bg-blue-600/20 cursor-pointer mb-3">
            <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
          </button>
        )}

        {/* ===== Help ===== */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <a href={WHATSAPP} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/25 transition">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Help
          </a>
          <a href={TELEGRAM} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-300 text-[11px] font-bold hover:bg-sky-500/25 transition">
            <Send className="w-3.5 h-3.5" /> Telegram
          </a>
        </div>

        {/* ===== Logout ===== */}
        <button onClick={async () => { await signOut(); onClose(); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-black hover:bg-red-500/20 cursor-pointer">
          <LogOut className="w-4 h-4" /> লগআউট
        </button>

        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-4">
          v1.0.0 • ভর্তি সেশন ২০২৬-২৭
        </p>
      </div>
    </div>
  );
};