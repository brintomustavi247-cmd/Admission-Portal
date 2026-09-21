import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Crown, Check, RefreshCw, Wallet, Clock } from 'lucide-react';

const BKASH_NUMBER = '01XXXXXXXXX';

const PLANS = [
  { id: 'monthly', label: 'মাসিক', price: 99, tag: 'জনপ্রিয়' },
  { id: 'yearly', label: 'বার্ষিক', price: 499, tag: 'সেরা ভ্যালু' },
];

const toBanglaNum = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);

export const PremiumPaywall: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [plan, setPlan] = useState('monthly');
  const [trx, setTrx] = useState('');
  const [sender, setSender] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [pending, setPending] = useState<any>(null);

  useEffect(() => {
    if (!profile) return;
    supabase.from('payment_requests').select('*')
      .eq('user_id', profile.id).eq('status', 'pending')
      .order('created_at', { ascending: false }).limit(1).single()
      .then(({ data }) => setPending(data || null));
  }, [profile]);

  const selected = PLANS.find((p) => p.id === plan)!;

  const submit = async () => {
    if (!profile) return;
    if (trx.trim().length < 6 || sender.trim().length < 11) {
      setMsg('সঠিক TrxID এবং bKash নম্বর লিখো'); return;
    }
    setBusy(true); setMsg('');
    const { error } = await supabase.from('payment_requests').insert({
      user_id: profile.id, trx_id: trx.trim(), sender_phone: sender.trim(),
      plan, amount: selected.price, status: 'pending',
    });
    setBusy(false);
    if (error) setMsg('সাবমিট ব্যর্থ: ' + error.message);
    else {
      setPending({ plan, amount: selected.price, status: 'pending' });
      setTrx(''); setSender('');
      setMsg('সাবমিট সফল! Admin অনুমোদনের পর access পাবে।');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#151a23] via-[#10141d] to-[#0d1017] flex items-center justify-center p-4">
      <div className="w-full max-w-md surface-card rounded-3xl p-6 text-slate-100 border border-white/10 bg-[#151a23]">
        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black text-white mt-3">প্রিমিয়াম আনলক করো</h2>
          <p className="text-xs text-slate-400 mt-1">
            সাবস্ক্রিপশন নিয়ে সব বিশ্ববিদ্যালয়ের লাইভ সূচি, যোগ্যতা চেক ও ক্যালেন্ডার ব্যবহার করো
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {PLANS.map((p) => (
            <button key={p.id} type="button" onClick={() => setPlan(p.id)}
              className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                plan === p.id
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}>
              <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{p.tag}</span>
              <div className="text-xs font-bold text-slate-300">{p.label}</div>
              <div className="text-2xl font-black text-white mt-1">৳{toBanglaNum(p.price)}</div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-[#141922] border border-white/10 p-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400 mb-2">
            <Wallet className="w-4 h-4" /> bKash Send Money করো
          </div>
          <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside">
            <li>bKash → <strong>Send Money</strong> → <strong className="text-pink-300">{BKASH_NUMBER}</strong></li>
            <li>Amount: <strong className="text-white">৳{toBanglaNum(selected.price)}</strong> (Personal)</li>
            <li>TrxID + তোমার নম্বর নিচে লিখে সাবমিট করো</li>
          </ol>
        </div>

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
            <input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="তোমার bKash নম্বর (যেখান থেকে পাঠিয়েছ)"
              className="w-full bg-[#10141d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none mb-2" />
            <input value={trx} onChange={(e) => setTrx(e.target.value)} placeholder="TrxID (যেমন: 9A7X2B1C3D)"
              className="w-full bg-[#10141d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none mb-3" />
            <button onClick={submit} disabled={busy}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition disabled:opacity-50">
              {busy ? 'সাবমিট হচ্ছে...' : `পেমেন্ট সাবমিট করো (৳${toBanglaNum(selected.price)})`}
            </button>
          </>
        )}

        {msg && <p className="text-[11px] text-center mt-3 text-sky-300">{msg}</p>}

        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> লাইভ আপডেট</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> যেকোনো সময় বাতিল</span>
        </div>
      </div>
    </div>
  );
};
