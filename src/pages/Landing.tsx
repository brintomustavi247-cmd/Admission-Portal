import React, { useEffect, useState } from "react";
import {
  Calendar,
  ShieldCheck,
  Smartphone,
  Zap,
  Crown,
  Download,
  GraduationCap,
  Printer,
  Users,
  ArrowRight,
  Check,
  Ticket,
  Bot,
  Bell,
  Star,
} from "lucide-react";

interface LandingProps {
  onGetStarted: () => void;
}

const STATS = [
  { v: "২১+", l: "প্রতিষ্ঠান" },
  { v: "১৪", l: "২য় বার সুযোগ" },
  { v: "১০০%", l: "লঞ্চে ফ্রি" },
  { v: "৳৪৯", l: "রেফারেল অফার" },
];

const FEATURES = [
  {
    icon: <Calendar className="w-5 h-5" />,
    t: "মাস্টার ক্যালেন্ডার",
    d: "সব ভর্তি পরীক্ষার তারিখ, রুটিন ও সময়সূচি এক টেবিলে — প্রিন্ট/PDF রেডি",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    t: "GPA যোগ্যতা চেক",
    d: "নিমেষে জেনে নাও কোন ইউনিট/শাখায় তোমার সুযোগ আছে, কোনটাতে নেই",
  },
  {
    icon: <Users className="w-5 h-5" />,
    t: "২য় বার ফিল্টার",
    d: "২য় বার পরীক্ষার্থীদের জন্য আলাদা তালিকা — ১৪টি প্রতিষ্ঠান এক ক্লিকে",
  },
  {
    icon: <Printer className="w-5 h-5" />,
    t: "প্রিন্ট / PDF",
    d: "সুন্দর বাংলা টাইপোগ্রাফিতে পুরো সেশনের ক্যালেন্ডার প্রিন্ট করো",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    t: "লাইভ আপডেট",
    d: "তারিখ পরিবর্তন হলে সাথে সাথে app-এ আপডেট — কোনো খবর মিস হবে না",
  },
  {
    icon: <Smartphone className="w-5 h-5" />,
    t: "নেটিভ অ্যাপের মতো",
    d: "PWA/APK ইনস্টল করো — home screen-এ logo, fullscreen experience",
  },
];

const STEPS = [
  {
    n: "১",
    t: "Google দিয়ে login",
    d: "১ ক্লিকে account — কোনো ফর্ম লাগবে না",
  },
  { n: "২", t: "যোগ্যতা যাচাই", d: "GPA দাও → কোন শাখায় সুযোগ দেখো" },
  { n: "৩", t: "ক্যালেন্ডার নাও", d: "সময়সূচি দেখো, প্রিন্ট করো, share করো" },
];

export const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const [installEvt, setInstallEvt] = useState<any>(null);

  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e);
    };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  const doInstall = async () => {
    if (!installEvt) return;
    await installEvt.prompt();
    setInstallEvt(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 overflow-x-hidden font-anek">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/85 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/icons/icon-512.png"
              alt="logo"
              className="w-9 h-9 rounded-xl bg-white object-cover shadow-lg shadow-sky-500/30"
            />
            <div>
              <div className="font-anek text-sm font-extrabold text-white leading-none tracking-wide">
                Admission Portal
              </div>
              <div className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                ২০৬-২৭ • বাংলাদেশ
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/download/app.apk"
              download
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/25 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> APK
            </a>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-[11px] font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition"
            >
              লগইন
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 pt-14 pb-10 grid lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold mb-5">
              <Zap className="w-3 h-3" /> ভর্তি সেশন ২০২-২৭ • লাইভ আপডেট
            </div>
            <h1 className="font-tiro text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.3]">
              বিশ্ববিদ্যালয় ভর্তি{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400">
                এক অ্যাপে
              </span>
            </h1>
            <p className="font-anek font-medium text-slate-300 text-sm sm:text-base mt-5 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              সকল পাবলিক, প্রকৌশল, মেডিকেল ও গুচ্ছ ভর্তির সময়সূচি, জিপিএ
              যোগ্যতা চেক ও মাস্টার ক্যালেন্ডার — সব এক জায়গায়। একদম ফ্রি,
              লঞ্চ অফারে।
            </p>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-black shadow-xl shadow-blue-500/30 cursor-pointer active:scale-95 transition"
              >
                ফ্রি শুরু করো <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="/download/app.apk"
                download
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-bold hover:bg-emerald-500/25 transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> APK Download
              </a>
              {installEvt && (
                <button
                  onClick={doInstall}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/15 text-slate-200 text-sm font-bold hover:bg-white/10 transition cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" /> Install App
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-4 gap-3 max-w-md mx-auto lg:mx-0">
              {STATS.map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl bg-white/5 border border-white/10 px-2 py-3 text-center"
                >
                  <div className="text-lg font-black text-white font-number">
                    {s.v}
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 m-auto w-72 h-72 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="relative w-[270px] rounded-[2.2rem] border-[6px] border-[#1e2530] bg-[#151a23] shadow-2xl shadow-black/60 overflow-hidden">
              {/* notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-[#0d1017] z-10" />
              {/* mini app UI */}
              <div className="pt-8 px-3 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/icons/icon-512.png"
                    alt=""
                    className="w-7 h-7 rounded-lg bg-white object-cover"
                  />
                  <div className="text-[10px] font-black text-white">
                    বিশ্ববিদ্যালয় ভর্তি
                  </div>
                  <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                    ২০৬-২৭
                  </span>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-sky-500/20 to-violet-500/10 border border-white/10 p-3">
                  <div className="text-[9px] text-sky-300 font-bold">
                    ভর্তি সেশন ২০২৬-২৭ • লাইভ
                  </div>
                  <div className="text-[13px] font-black text-white mt-1">
                    ভর্তি পোর্টাল
                  </div>
                </div>
                {[
                  {
                    c: "bg-red-500",
                    n: "ঢাকা বিশ্ববিদ্যালয় (ঢাবি)",
                    d: "৫১ দিন পর শুরু",
                  },
                  {
                    c: "bg-emerald-600",
                    n: "খুলনা বিশ্ববিদ্যালয় (খুবি)",
                    d: "৪১ দিন পর শুরু",
                  },
                  {
                    c: "bg-pink-600",
                    n: "জাহাঙ্গীরনগর (জাবি)",
                    d: "৬০ দিন পর শুরু",
                  },
                ].map((u) => (
                  <div
                    key={u.n}
                    className="rounded-xl bg-[#1e2530] border border-white/5 p-2.5 flex items-center gap-2"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${u.c} flex items-center justify-center text-white text-[9px] font-black`}
                    >
                      {u.n.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold text-white truncate">
                        {u.n}
                      </div>
                      <div className="text-[8px] text-slate-400">{u.d}</div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-around pt-1 pb-1 border-t border-white/5">
                  {["হোম", "যোগ্যতা", "ক্যালেন্ডার", "সেটিংস"].map((b, i) => (
                    <div
                      key={b}
                      className={`text-[8px] font-bold ${i === 0 ? "text-sky-400" : "text-slate-500"}`}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <div className="text-[11px] font-black text-sky-400 tracking-widest uppercase">
            Features
          </div>
          <h2 className="font-tiro text-3xl sm:text-4xl text-white mt-2 leading-snug">
            যা যা পাচ্ছো এক অ্যাপে
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="group rounded-2xl p-5 bg-[#151a23] border border-white/10 hover:border-sky-400/40 hover:bg-[#1a2130] transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500/20 to-violet-500/20 border border-sky-400/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <div className="text-sm font-black text-white">{f.t}</div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-5xl mx-auto px-5 pb-14">
        <div className="rounded-3xl bg-gradient-to-br from-[#151a23] to-[#10141d] border border-white/10 p-8">
          <h2 className="font-tiro text-2xl sm:text-3xl text-white text-center mb-8">
            ৩ step-এ শুরু করো
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                  {s.n}
                </div>
                <div className="text-sm font-black text-white mt-3">{s.t}</div>
                <p className="text-[11px] text-slate-400 mt-1">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING + REFERRAL (PREMIUM) ===== */}
      <section className="relative max-w-5xl mx-auto px-5 pb-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold mb-4">
            <Crown className="w-3.5 h-3.5" /> প্রিমিয়াম সদস্যপদ
          </div>
          <h2 className="font-tiro text-3xl sm:text-4xl text-white leading-snug">
            লঞ্চ অফারে এখন{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
              সম্পূর্ণ ফ্রি
            </span>
          </h2>
          <p className="font-anek text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
            অফার পিরিয়ড শেষে একবারই পেমেন্ট — পুরো সেশন ২০২৬-২৭ জুড়ে প্রিমিয়াম
            সুবিধা। কোনো মাসিক ফি নেই।
          </p>
        </div>

        {/* Value banner */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-400/25 bg-gradient-to-br from-[#1a1610] via-[#151a23] to-[#10141d] p-6 sm:p-8 text-center mb-8 shadow-2xl shadow-amber-500/5">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />
          <div className="relative font-anek text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
            ৳৯৯-এ যা পাচ্ছো — সম্পূর্ণ সেশনের সব সময়সূচি • আনলিমিটেড যোগ্যতা চেক •
            প্রিন্ট ও PDF • তাৎক্ষণিক লাইভ আপডেট • প্রায়োরিটি সাপোর্ট
          </div>
          <div className="relative mt-4 font-tiro text-xl sm:text-2xl text-emerald-300">
            বন্ধুর রেফারেল কোডে দাম মাত্র ৳৪৯ 🎁
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Season Pass */}
          <div className="relative rounded-3xl p-6 bg-[#151a23] border border-white/10 hover:border-amber-400/40 hover:-translate-y-1 transition-all shadow-xl">
            <div className="text-[10px] font-black tracking-[0.25em] text-slate-400 uppercase">
              Season Pass
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-tiro text-5xl text-white">৳৯৯</span>
              <span className="font-anek text-xs text-slate-400 font-semibold">
                একবারই
              </span>
            </div>
            <div className="mt-5 space-y-2.5">
              {[
                "পুরো সেশন ২০২৬-২৭ অ্যাক্সেস",
                "সব ফিচার আনলিমিটেড",
                "প্রিন্ট / PDF / ক্যালেন্ডার",
                "লাইভ আপডেট নোটিফিকেশন",
              ].map((x) => (
                <div
                  key={x}
                  className="flex items-center gap-2.5 font-anek text-[12px] text-slate-300 font-medium"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-amber-300" />
                  </span>
                  {x}
                </div>
              ))}
            </div>
          </div>

          {/* Referral offer */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 via-[#12201c] to-[#10141d] border border-emerald-400/40 shadow-2xl shadow-emerald-500/10 hover:-translate-y-1 transition-all">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black tracking-widest flex items-center gap-1 shadow-lg">
              <Ticket className="w-3 h-3" /> রেফারেল অফার
            </div>
            <div className="text-[10px] font-black tracking-[0.25em] text-emerald-300 uppercase">
              কোড সহ
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-tiro text-5xl text-white">৳৪৯</span>
              <span className="font-anek text-sm text-slate-500 line-through font-semibold">
                ৳৯৯
              </span>
            </div>
            <div className="mt-5 space-y-2.5">
              {[
                "Friend-এর কোড ব্যবহার করলে",
                "সব ফিচার একই রকম",
                "কোড দাতাও ডিসকাউন্ট পায় 🎁",
                "দুজনের জন্যই একবার পেমেন্ট",
              ].map((x) => (
                <div
                  key={x}
                  className="flex items-center gap-2.5 font-anek text-[12px] text-slate-200 font-medium"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-300" />
                  </span>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 font-anek text-xs text-slate-400">
          <Bot className="w-4 h-4 text-violet-400" />
          ভালো লাগলে ঐচ্ছিক donation-এ{" "}
          <span className="text-violet-300 font-bold">Donor Card</span> জিতে নাও
          🤖
        </div>
      </section>

      {/* ===== INSTALL CTA ===== */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-600/20 border border-blue-400/30 p-8 text-center">
          <Smartphone className="w-8 h-8 text-sky-400 mx-auto mb-3" />
          <h2 className="font-tiro text-2xl sm:text-3xl text-white">
            ফোনে অ্যাপের মতো ব্যবহার করো
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            Chrome menu → "Add to Home screen" অথবা APK install করো — home
            screen-এ logo, fullscreen experience, offline-এও খোলে
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="/download/app.apk"
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-sm font-black shadow-xl shadow-emerald-500/30 cursor-pointer active:scale-95 transition"
            >
              <Download className="w-4 h-4" /> APK Download (Android)
            </a>
            {installEvt && (
              <button
                onClick={doInstall}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition cursor-pointer"
              >
                <Star className="w-4 h-4" /> One-click Install
              </button>
            )}
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/15 text-slate-200 text-sm font-bold hover:bg-white/10 transition cursor-pointer"
            >
              Web-এ চালিয়ে যাও
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/icons/icon-512.png"
              alt="logo"
              className="w-8 h-8 rounded-lg bg-white object-cover"
            />
            <div className="text-[11px] text-slate-400">
              © ২০২৬ Admission Portal • বাংলাদেশ
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <a
              href="https://wa.me/8801XXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/TOMAR_CHANNEL"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 transition"
            >
              Telegram
            </a>
            <GraduationCap className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </footer>
    </div>
  );
};
