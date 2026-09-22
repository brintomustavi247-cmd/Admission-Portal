import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const bnErr = (m: string) =>
  m.includes("Invalid login credentials")
    ? "ইমেইল বা পাসওয়ার্ড ভুল"
    : m.includes("already registered")
      ? "এই ইমেইল আগেই নিবন্ধিত — লগইন করো"
      : m.includes("at least 6")
        ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
        : m.includes("Email not confirmed")
          ? "ইমেইল ভেরিফিকেশন সম্পূর্ণ করো"
          : m;

/* Official Google "G" logo */
const GoogleIcon: React.FC = () => (
  <svg
    className="w-4.5 h-4.5 w-[18px] h-[18px]"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C32.2 6.1 28.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C32.2 6.1 28.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.3 5.3C36.9 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5z"
    />
  </svg>
);

export const Login: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [mode, setMode] = useState<"login" | "signup">(
    new URLSearchParams(window.location.search).get("ref") ? "signup" : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [refCode, setRefCode] = useState(
    () => new URLSearchParams(window.location.search).get("ref")?.toUpperCase() || ""
  );
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [err, setErr] = useState("");

  /* ---------- Google OAuth ---------- */
  const googleLogin = async () => {
    setGoogleBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      setErr("Google লগইন ব্যর্থ: " + error.message);
      setGoogleBusy(false);
    }
    /* success হলে page নিজে থেকেই redirect হয়ে যাবে */
  };

  /* ---------- Email/Password ---------- */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setErr(bnErr(error.message));
      else onDone();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, phone, referral_code: refCode.trim().toUpperCase() } },
      });
      if (error) setErr(bnErr(error.message));
      else if (data.session) onDone();
      else setErr("নিবন্ধন সফল! ইমেইল ভেরিফাই করে লগইন করো।");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1017] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm bg-[#151b27] border border-white/10 shadow-xl shadow-black/30 rounded-3xl p-6 relative z-10">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-lg font-black text-white mt-3">
            {mode === "login" ? "স্বাগতম! লগইন করো" : "অ্যাকাউন্ট খোলো"}
          </h1>
          <p className="text-[11px] text-slate-400 mt-1">
            ১ ক্লিকে Google দিয়ে শুরু করো — কোনো ফর্ম লাগবে না
          </p>
        </div>

        {/* ---------- GOOGLE BUTTON ---------- */}
        <button
          type="button"
          onClick={googleLogin}
          disabled={googleBusy || busy}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-sm font-bold shadow-md active:scale-95 transition cursor-pointer disabled:opacity-60"
        >
          {googleBusy ? (
            <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span>Google দিয়ে চালিয়ে যাও</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            অথবা ইমেইল
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* ---------- EMAIL FORM ---------- */}
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="পুরো নাম"
                  className="w-full bg-[#0f141d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="মোবাইল নম্বর"
                  className="w-full bg-[#0f141d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <div className="rounded-2xl bg-blue-500/10 border border-blue-400/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-blue-300 mb-2">
                  <Ticket className="w-3.5 h-3.5" /> রেফারেল কোড আছে? (ঐচ্ছিক)
                </div>
                <input
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="Friend-এর কোড লিখো — যেমন: 2193CE"
                  className="w-full bg-[#0f141d] border border-blue-400/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none uppercase tracking-widest font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  {refCode
                    ? `✅ রেফার করা হয়েছে ID ${refCode.toUpperCase()} দ্বারা — subscription-এ তুমি ছাড় পাবে`
                    : 'বন্ধুর User ID/কোড থাকলে দাও — দুজনেই ছাড় পাবে 🎁'}
                </p>
              </div>

            </>
          )}
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ইমেইল"
              className="w-full bg-[#0f141d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড"
              className="w-full bg-[#0f141d] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {err && <p className="text-[11px] text-red-400 text-center">{err}</p>}

          <button
            type="submit"
            disabled={busy || googleBusy}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition disabled:opacity-50"
          >
            {busy ? "অপেক্ষা করো..." : mode === "login" ? "লগইন" : "নিবন্ধন"}
          </button>
        </form>

        {/* Mode toggle */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          {mode === "login" ? "অ্যাকাউন্ট নেই?" : "আগেই অ্যাকাউন্ট আছে?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setErr("");
            }}
            className="text-blue-400 font-bold cursor-pointer"
          >
            {mode === "login" ? "নিবন্ধন করো" : "লগইন করো"}
          </button>
        </p>

        {/* Trust strip */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>তোমার তথ্য নিরাপদ • Google Secure OAuth</span>
        </div>
      </div>
    </div>
  );
};
