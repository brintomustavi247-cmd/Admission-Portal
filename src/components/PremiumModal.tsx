import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toBanglaNum } from '../lib/banglaUtils';
import { Crown, Check, RefreshCw, Wallet, Clock, Copy, Ticket, Heart, MessageCircle, Send } from 'lucide-react';

const BKASH_NUMBER = '01XXXXXXXXX';          // ⚠️ তোমার bKash
const WHATSAPP = 'https://wa.me/8801XXXXXXXXX'; // ⚠️ তোমার WhatsApp
const TELEGRAM = 'https://t.me/TOMAR_CHANNEL';  // ⚠️ তোমার channel

export const PremiumPaywall: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [referralOn, setReferralOn] = useState(true);
  const [code, setCode] = useState('');
  const [codeOwner, setCodeOwner] = useState<{ id: string; name: string } | null>(null);
  const [codeMsg, setCodeMsg] = useState('');
  const [trx, setTrx] = useState('');
  const [sender, setSender] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [pending, setPending] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [tip, setTip] = useState(20);
  const [tipTrx, setTipTrx] = useState('');
  const [tipBusy, setTipBusy] = useState(false);
  const [tipMsg, setTipMsg] = useState('');

  useEffect(() => {
    supabase.from('app_settings').select('referral_discount_enabled').eq('id', 1).single()
      .then(({ data }) => data && setReferralOn(data.referral_discount_enabled));
    if (!profile) return;
    supabase.from('payment_requests').select('*')
      .eq('user_id', profile.id).eq('status', 'pending')
      .order('created_at', { ascending: false }).limit(1).single()
      .then(({ data }) => setPending(data || null));
  }, [profile]);

  if (!profile) return null;

  const ownDiscount = profile.discount_unlocked || !!profile.referred_by;
  const price = referralOn && (ownDiscount || !!codeOwner) ? 49 : 99;
  const discounted = price === 49;

  const verifyCode = async () => {
    setCodeMsg('');
    const c = code.trim().toUpperCase();
    if (c.length < 4) { setCodeMsg('কোড লিখো'); return; }
    const { data } = await supabase.rpc('check_referral_code', { code: c });
    const row = Array.isArray(data) ? data[0] : data;
    if (row && row.owner_id !== profile.id) {
      setCodeOwner({ id: row.owner_id, name: row.owner_name || 'friend' });
      setCodeMsg('✅ কোড সক্রিয়! দাম ৳৯৯ → ৳৪৯');
    } else {
      setCodeOwner(null);
      setCodeMsg('❌ কোড সঠিক নয় (বা নিজের কোড দেওয়া যাবে না)');
    }
  };

  const submit = async () => {
    if (trx.trim().length < 6 || sender.trim().length < 11) {
      setMsg('সঠিক TrxID এবং bKash নম্বর লিখো'); return;
    }
    setBusy(true); setMsg('');
    const { error } = await supabase.from('payment_requests').insert({
      user_id: profile.id,
      trx_id: trx.trim(),
      sender_phone: sender.trim(),
      plan: 'season',
      amount: price,
      referral_code: codeOwner ? code.trim().toUpperCase() : null,
      status: 'pending',
    });
    setBusy(false);
    if (error) setMsg('সাবমিট ব্যর্থ: ' + error.message);
    else {
      setPending({ plan: 'season', amount: price, status: 'pending' });
      setTrx(''); setSender('');
      setMsg('সাবমিট সফল! Admin approve করলেই premium খুলে যাবে');
    }
  };

  const sendTip = async () => {
    if (tipTrx.trim().length < 6) { setTipMsg('TrxID লিখো'); return; }
    setTipBusy(true); setTipMsg('');
    const { error } = await supabase.from('payment_requests').insert({
      user_id: profile.id, trx_id: tipTrx.trim(), plan: 'donation', amount: tip, status: 'pending',
    });
    setTipBusy(false);
    setTipMsg(error ? 'ব্যর্থ: ' + error.message : '💜 ধন্যবাদ! তোমার support পেয়ে গেছি');
    setTipTrx('');
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(profile.referral_code || ''); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#151a23] via-[#10141d] to-[#0d1017] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#151b27] border border-white/10 rounded-3xl p-6 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black text-white mt-3">প্রিমিয়াম অ্যাক্সেস</h2>
          <p className="text-xs text-slate-400 mt-1">একবারই pay করো — পুরো সেশন ২০২৬-২৭ full access</p>
        </div>

        {/* FOMO strip */}
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-[11px] text-amber-300 font-bold text-center mb-4">
          ⚡ Launch offer — ফ্রি সময় শেষ হলে দাম ৳৯৯ fixed হয়ে যাবে
        </div>

        {/* Price card */}
        <div className={`rounded-2xl p-4 mb-4 border text-center ${discounted ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0f141d] border-white/10'}`}>
          {discounted && (
            <div className="text-[10px] font-black text-emerald-300 uppercase tracking-wider mb-1">
              🐛 রেফারেল ডিসকাউন্ট আনলকড!
            </div>
          )}
          <div className="flex items-baseline justify-center gap-2">
            {discounted && <span className="text-lg text-slate-500 line-through font-bold">৳৯৯</span>}
            <span className="text-4xl font-black text-white">৳{toBanglaNum(price)}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">one-time • lifetime season pass</div>
        </div>
        {/* Referral code input */}
        {referralOn && !ownDiscount && !codeOwner && (
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="রেফারেল কোড (থাকলে দাও)"
                  className="w-full bg-[#0f141d] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none uppercase" />
              </div>
              <button onClick={verifyCode} className="px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 cursor-pointer">
                যাচাই
              </button>
            </div>
            {codeMsg && <p className={`text-[11px] mt-1.5 ${codeOwner ? 'text-emerald-400' : 'text-red-400'}`}>{codeMsg}</p>}
          </div>
        )}

        {/* bKash instructions + payment */}
        {pending ? (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-center mb-3">
            <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-amber-300">অনুমোদনের অপেক্ষায়</div>
            <p className="text-[11px] text-slate-400 mt-1">Admin approve করলেই access খুলে যাবে</p>
            <button onClick={refreshProfile}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> স্ট্যাটাস রিফ্রেশ
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-[#0f141d] border border-white/10 p-4 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400 mb-2">
                <Wallet className="w-4 h-4" /> bKash Send Money: <span className="text-pink-300">{BKASH_NUMBER}</span>
              </div>
              <input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="তোমার bKash নম্বর"
                className="w-full bg-[#0f141d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none mb-2" />
              <input value={trx} onChange={(e) => setTrx(e.target.value)} placeholder="TrxID"
                className="w-full bg-[#0f141d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none mb-3" />
              <button onClick={submit} disabled={busy}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition disabled:opacity-50">
                {busy ? 'সাবমিট হচ্ছে...' : `৳${toBanglaNum(price)} pay করে unlock করো`}
              </button>
            </div>
          </>
        )}
        {msg && <p className="text-[11px] text-center text-sky-300 mb-3">{msg}</p>}
        {/* Own referral code */}
        {profile.referral_code && (
          <div className="rounded-2xl bg-[#0f141d] border border-white/10 p-3 mb-3">
            <div className="text-[10px] text-slate-400 font-bold mb-2">তোমার কোড share করো — friend signup করলেই তোমার দাম ৳৪৯</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-center py-2 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-300 font-black tracking-widest text-sm">
                {profile.referral_code}
              </code>
              <button onClick={copyCode} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent('ভর্তি অ্যাপে আমার কোড ' + profile.referral_code + ' দিয়ে signup কর — ছাড় পাবি!')}`}
                target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 cursor-pointer">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>
        )}
        {/* Donation box */}
        <div className="rounded-2xl bg-violet-500/10 border border-violet-500/25 p-4 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-300 mb-2">
            <Heart className="w-4 h-4 fill-violet-400 text-violet-400" /> ডেভেলপার সাপোর্ট (ঐচ্ছিক)
          </div>
          <div className="flex gap-2 mb-2">
            {[10, 20, 50].map((t) => (
              <button key={t} onClick={() => setTip(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-black cursor-pointer transition ${tip === t ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                ৳{toBanglaNum(t)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={tipTrx} onChange={(e) => setTipTrx(e.target.value)} placeholder="Donation TrxID"
              className="flex-1 bg-[#0f141d] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white placeholder:text-slate-500 focus:outline-none" />
            <button onClick={sendTip} disabled={tipBusy}
              className="px-4 rounded-xl bg-violet-500/20 text-violet-300 text-[11px] font-bold hover:bg-violet-500/30 cursor-pointer disabled:opacity-50">
              পাঠাও
            </button>
          </div>
          {tipMsg && <p className="text-[10px] text-violet-300 mt-1.5 text-center">{tipMsg}</p>}
        </div>

        {/* Help buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a href={WHATSAPP} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/25 transition">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Help
          </a>
          <a href={TELEGRAM} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-bold hover:bg-sky-500/25 transition">
            <Send className="w-3.5 h-3.5" /> Telegram Channel
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> লাইভ আপডেট</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> পুরো সেশন valid</span>
        </div>
      </div>
    </div>
  );
};

