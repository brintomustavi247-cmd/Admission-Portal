import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GraduationCap, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';

const bnErr = (m: string) =>
  m.includes('Invalid login credentials') ? 'ইমেইল বা পাসওয়ার্ড ভুল'
  : m.includes('already registered') ? 'এই ইমেইল আগেই নিবন্ধিত — লগইন করো'
  : m.includes('at least 6') ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
  : m;

export const Login: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(bnErr(error.message)); else onDone();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name, phone } },
      });
      if (error) setErr(bnErr(error.message));
      else if (data.session) onDone();
      else setErr('নিবন্ধন সফল! ইমেইল ভেরিফাই করে লগইন করো।');
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1017] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#151a23] border border-white/10 rounded-3xl p-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-lg font-black text-white mt-3">
            {mode === 'login' ? 'লগইন করো' : 'অ্যাকাউন্ট খোলো'}
          </h1>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="পুরো নাম"
                  className="w-full bg-[#10141d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none" />
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="মোবাইল নম্বর"
                  className="w-full bg-[#10141d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none" />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ইমেইল"
              className="w-full bg-[#10141d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none" />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="পাসওয়ার্ড"
              className="w-full bg-[#10141d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none" />
          </div>

          {err && <p className="text-[11px] text-red-400 text-center">{err}</p>}

          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition disabled:opacity-50">
            {busy ? 'অপেক্ষা করো...' : mode === 'login' ? 'লগইন' : 'নিবন্ধন'}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          {mode === 'login' ? 'অ্যাকাউন্ট নেই?' : 'আগেই অ্যাকাউন্ট আছে?'}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr(''); }}
            className="text-blue-400 font-bold cursor-pointer">
            {mode === 'login' ? 'নিবন্ধন করো' : 'লগইন করো'}
          </button>
        </p>
      </div>
    </div>
  );
};
