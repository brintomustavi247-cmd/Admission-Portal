{/* ===== LANDING v5.5 • OPTIMIZED WITH GLOBAL HOOK ===== */}
import React, { useEffect, useState } from "react";
import { useAppSettings } from "../hooks/useAppSettings"; // ✅ গ্লোবাল হুক
import {
  Calendar,
  ShieldCheck,
  Smartphone,
  Crown,
  Download,
  GraduationCap,
  Printer,
  Users,
  ArrowRight,
  CheckCircle2,
  Ticket,
  Sparkles,
  Bell,
  Flame,
  Zap,
  Clock,
  BadgeCheck,
} from "lucide-react";

interface LandingProps {
  onGetStarted: () => void;
}

const FEATURES = [
  {
    n: "০১",
    icon: <Calendar className="w-5 h-5" />,
    t: "মাস্টার ক্যালেন্ডার",
    d: "সব ভর্তি পরীক্ষার পূর্ণাঙ্গ রুটিন, সময়সূচি ও শিফট এক ফ্রেমে — যেকোনো সময় প্রিন্ট বা PDF রেডি।",
    tag: "জনপ্রিয়",
  },
  {
    n: "০২",
    icon: <ShieldCheck className="w-5 h-5" />,
    t: "GPA যোগ্যতা ক্যালকুলেটর",
    d: "SSC ও HSC জিপিএ ইনপুট দিয়েই চোখের পলকে দেখে নাও কোন কোন ইউনিটে তুমি যোগ্য।",
    tag: "স্মার্ট",
  },
  {
    n: "০৩",
    icon: <Users className="w-5 h-5" />,
    t: "সেকেন্ড টাইম ফিল্টার",
    d: "২য় বার সুযোগ থাকা ১৪টি শীর্ষ প্রতিষ্ঠানের আলাদা তালিকা ও আবেদন শর্ত এক ক্লিকে।",
    tag: "২য় বার",
  },
  {
    n: "০৪",
    icon: <Printer className="w-5 h-5" />,
    t: "অফিসিয়াল প্রিন্ট ও PDF",
    d: "ঝকঝকে বাংলা প্রিমিয়াম লেআউটে A4 সাইজে প্রিন্ট অথবা সেভ করে পড়ার টেবিলে রাখো।",
    tag: "A4 রেডি",
  },
  {
    n: "০৫",
    icon: <Bell className="w-5 h-5" />,
    t: "রিয়েল-টাইম নোটিফিকেশন",
    d: "তারিখ পরিবর্তন, প্রবেশপত্র বা ফলাফল ঘোষণার সাথে সাথে পুশ অ্যালার্ট।",
    tag: "ইনস্ট্যান্ট",
  },
  {
    n: "০৬",
    icon: <Smartphone className="w-5 h-5" />,
    t: "নেটিভ অ্যাপ এক্সপেরিয়েন্স",
    d: "হোমস্ক্রিনে ইনস্টল — ফুলস্ক্রিন ফাস্ট ইন্টারফেস, অফলাইনেও দ্রুত লোড।",
    tag: "PWA/APK",
  },
];

const STEPS = [
  {
    n: "০১",
    t: "Google দিয়ে সাইন ইন",
    d: "কোনো ঝামেলাপূর্ণ ফর্ম ছাড়া এক ক্লিকে অ্যাকাউন্ট চালু করো।",
  },
  {
    n: "০২",
    t: "জিপিএ যোগ্যতা যাচাই",
    d: "SSC ও HSC GPA দিন — সিস্টেম নিখুঁতভাবে শাখা বাছাই করে দেবে।",
  },
  {
    n: "০৩",
    t: "ক্যালেন্ডার ও প্রস্তুতি শুরু",
    d: "সময়সূচি প্রিন্ট নিন, বুকমার্ক করুন ও রিয়েল-টাইম ট্র্যাকিং শুরু করুন।",
  },
];

const BENEFITS = [
  {
    t: "পূর্ণাঙ্গ সেশন সময়সূচি",
    d: "পাবলিক, বিজ্ঞান-প্রযুক্তি, মেডিকেল ও গুচ্ছের সমন্বিত আপডেট।",
  },
  {
    t: "আনলিমিটেড যোগ্যতা চেক",
    d: "যতবার খুশি বিভিন্ন জিপিএ ও সাবজেক্ট কম্বিনেশনে যাচাই।",
  },
  {
    t: "হাই-রেজ্যুলিউশন প্রিন্ট ও PDF",
    d: "প্রফেশনাল বাংলা টাইপোগ্রাফিক ফরম্যাটে প্রিন্ট সুবিধা।",
  },
  {
    t: "লাইভ নোটিফিকেশন ও অ্যালার্ট",
    d: "তারিখ পেছানো বা আসনবিন্যাসের খবর কখনো মিস হবে না।",
  },
  {
    t: "ডেডিকেটেড স্টুডেন্ট সাপোর্ট",
    d: "ভর্তি সংক্রান্ত দ্বিধায় কমিউনিটি ও সাপোর্ট টিমের সঙ্গ।",
  },
  {
    t: "সেকেন্ড টাইমার এক্সক্লুসিভ ডেটা",
    d: "কোন ভার্সিটিতে মার্ক কাটা যাবে তার পূর্ণাঙ্গ গাইডলাইন।",
  },
];

const MOCK_UNIS = [
  { c: "from-rose-500 to-red-600", n: "ঢাকা বিশ্ববিদ্যালয়", u: "ঢাবি • ক ইউনিট • ৫১ দিন বাকি" },
  { c: "from-emerald-500 to-teal-600", n: "খুলনা বিশ্ববিদ্যালয়", u: "খুবি • গুচ্ছ বিজ্ঞান • ৪১ দিন" },
  { c: "from-violet-500 to-purple-600", n: "জাহাঙ্গীরনগর", u: "জাবি • এ ইউনিট • ৬০ দিন" },
];

const PAYMENTS = ["bKash", "Nagad", "Rocket", "Upay"];

export const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const [installEvt, setInstallEvt] = useState<any>(null);
  
  // ✅ গ্লোবাল হুক ব্যবহার করে সেটিংস লোড
  const { settings } = useAppSettings();
  const paid = settings?.subscription_enabled ?? false;

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
    <div className="min-h-screen bg-[#0a0e16] text-slate-100 selection:bg-blue-500/30 selection:text-blue-200 antialiased overflow-x-clip font-['Hind_Siliguri','Anek_Bangla',sans-serif]">
      {/* Ambient mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-600/10 via-violet-600/[0.06] to-transparent blur-3xl" />
        <div className="absolute top-[900px] -left-40 w-80 h-80 bg-sky-500/[0.06] rounded-full blur-3xl" />
        <div className="absolute top-[1700px] -right-40 w-80 h-80 bg-violet-500/[0.06] rounded-full blur-3xl" />
      </div>

      {/* ===== URGENCY BANNER (DYNAMIC THEME) ===== */}
      <div className={`relative z-50 ${paid ? "bg-[#16120c] border-b border-amber-400/20" : "bg-emerald-950/40 border-b border-emerald-500/20"}`}>
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center">
          {paid ? (
            <Clock className="w-3.5 h-3.5 text-amber-300/90 shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-emerald-300/90 shrink-0" />
          )}
          {paid ? (
            <span className="text-[11px] sm:text-xs font-semibold text-amber-100/90 leading-snug">
              <span className="font-bold text-amber-300">সিজন পাস চালু:</span> রেফারেল কোড থাকলে ৫০% ছাড় — মাত্র ৳৪৯, কোড ছাড়া ৳৯৯।
            </span>
          ) : (
            <span className="text-[11px] sm:text-xs font-semibold text-emerald-100/90 leading-snug">
              <span className="font-bold text-emerald-300">সম্পূর্ণ বিনামূল্যে:</span> সকল প্রিমিয়াম ফিচার এখন সবার জন্য উন্মুক্ত, কোনো লুকানো চার্জ নেই!
            </span>
          )}
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-40 bg-[#0a0e16]/85 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/icons/icon-512.png"
              alt="Logo"
              className="w-9 h-9 rounded-xl bg-[#0d131f] object-cover ring-1 ring-white/15 shadow-lg shadow-black/30 shrink-0"
            />
            <div className="leading-tight min-w-0">
              <div className="font-['Noto_Serif_Bengali',serif] font-semibold text-lg text-white flex items-center gap-1.5 truncate">
                ভর্তি পোর্টাল
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                সেশন ২০২৬-২৭
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="/download/app.apk"
              download
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> APK
            </a>
            <button
              onClick={onGetStarted}
              className={`px-4 sm:px-5 py-2 rounded-xl text-white text-xs font-bold shadow-lg shadow-black/30 ring-1 ring-white/10 active:scale-95 transition cursor-pointer ${paid ? "bg-blue-600 hover:bg-blue-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
            >
              লগইন / শুরু করুন
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative z-10 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-400/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-xs font-semibold text-sky-300/90">
                বাংলাদেশ বিশ্ববিদ্যালয় ভর্তি সেশন ২০২৬-২৭
              </span>
            </div>

            <h1 className="font-['Noto_Serif_Bengali',serif] font-semibold text-4xl sm:text-5xl lg:text-[3.6rem] text-white leading-[1.3] tracking-tight">
              ভর্তির প্রতিটি তথ্য,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-300 to-violet-300">
                সঠিক সময়ে এক প্ল্যাটফর্মে।
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base mt-6 max-w-xl leading-relaxed">
              পাবলিক, কৃষি, বিজ্ঞান ও প্রযুক্তি, প্রকৌশল এবং গুচ্ছভুক্ত সকল বিশ্ববিদ্যালয়ের পরীক্ষার ক্যালেন্ডার, স্বয়ংক্রিয় GPA যোগ্যতা যাচাই ও রুটিন প্রিন্ট করার আধুনিক সমাধান।
            </p>

            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <button
                onClick={onGetStarted}
                className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-black/30 ring-1 ring-white/10 active:scale-95 transition cursor-pointer ${paid ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
              >
                {paid ? "শুরু করো" : "বিনামূল্যে শুরু করো"} <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="/download/app.apk"
                download
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/10 active:scale-95 transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Android APK
              </a>
              {installEvt && (
                <button
                  onClick={doInstall}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-sky-500/40 text-slate-200 text-sm font-semibold hover:bg-white/[0.08] active:scale-95 transition cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-sky-400" /> অ্যাপ ইনস্টল
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-10 pt-7 border-t border-white/[0.07] grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-6">
              {[
                { v: "২১+", l: "বিশ্ববিদ্যালয় ও প্রতিষ্ঠান" },
                { v: "১৪টি", l: "২য় বার পরীক্ষার সুযোগ" },
                paid ? { v: "৳৪৯", l: "রেফারেল কোডে পাস" } : { v: "১০০%", l: "সম্পূর্ণ বিনামূল্যে" },
                { v: "২৪/৭", l: "লাইভ আপডেট ও সাপোর্ট" },
              ].map((s) => (
                <div key={s.l} className="min-w-0">
                  <div className="font-['Noto_Serif_Bengali',serif] font-semibold text-2xl sm:text-[1.7rem] text-white">
                    {s.v}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Mobile Mockup */}
          <div className="relative flex justify-center lg:justify-end min-w-0">
            <div className="absolute inset-0 m-auto w-72 h-72 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none" />
            <div className="relative w-[280px] sm:w-[315px] max-w-full rounded-[2.4rem] p-3 bg-white/[0.06] border border-white/15 shadow-2xl shadow-black/50">
              <div className="rounded-[1.9rem] bg-[#0c101a] border border-white/[0.08] overflow-hidden p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      ভ
                    </div>
                    <span className="font-['Noto_Serif_Bengali',serif] text-xs font-semibold text-white truncate">
                      ভর্তি ড্যাশবোর্ড
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/25 shrink-0">
                    লাইভ
                  </span>
                </div>

                <div className="rounded-2xl bg-blue-600/15 border border-blue-400/20 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-300/90">
                    <Flame className="w-3.5 h-3.5 text-amber-400/90 shrink-0" /> আসন্ন পরীক্ষা
                  </div>
                  <div className="font-['Noto_Serif_Bengali',serif] text-sm font-semibold text-white leading-snug">
                    ঢাকা বিশ্ববিদ্যালয় (ক ইউনিট)
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between gap-2 pt-0.5">
                    <span className="truncate">রুটিন প্রকাশিত</span>
                    <span className="text-amber-300/90 font-bold shrink-0">৫১ দিন পর</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase px-1">
                    আপডেট তালিকা
                  </div>
                  {MOCK_UNIS.map((u) => (
                    <div
                      key={u.n}
                      className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 flex items-center gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${u.c} flex items-center justify-center text-white text-xs font-black shrink-0`}
                      >
                        {u.n.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{u.n}</div>
                        <div className="text-[10px] text-slate-500 truncate">{u.u}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-black/30 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" /> GPA যাচাই করো
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-14 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-9">
          <div className="min-w-0">
            <div className="text-sky-400/90 font-semibold text-xs tracking-wider uppercase mb-1">
              ফিচার পরিচিতি
            </div>
            <h2 className="font-['Noto_Serif_Bengali',serif] text-3xl sm:text-4xl text-white">
              ভর্তি পরীক্ষার পূর্ণাঙ্গ সমাধান
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm">
            এক প্ল্যাটফর্মেই ভর্তি সংক্রান্ত সকল তথ্য, যাচাই এবং প্রিন্ট সুবিধা।
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.n}
              className="group rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-sky-500/30 hover:bg-white/[0.05] p-5 sm:p-6 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-slate-400 whitespace-nowrap">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-['Noto_Serif_Bengali',serif] text-lg sm:text-xl font-semibold text-white mb-1.5 group-hover:text-sky-200 transition-colors">
                {f.t}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== STEPS ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-14 border-t border-white/[0.06]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-['Noto_Serif_Bengali',serif] text-3xl sm:text-4xl text-white">
            মাত্র ৩ ধাপে শুরু করো
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            অহেতুক রেজিস্ট্রেশনের জটিলতা ছাড়াই তোমার প্রস্তুতি এগিয়ে রাখো।
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="font-['Noto_Serif_Bengali',serif] text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300 mb-2">
                {s.n}
              </div>
              <h3 className="font-['Noto_Serif_Bengali',serif] text-lg font-semibold text-white mb-1.5">
                {s.t}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SEASON PASS (DYNAMIC PAYWALL OR NATIVE FREE) ===== */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 py-14">
        <div className="text-center mb-9">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold mb-4 ${paid ? "border-amber-400/25 bg-amber-400/[0.08] text-amber-300/90" : "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300/90"}`}>
            <Crown className="w-4 h-4" /> {paid ? "প্রিমিয়াম এক্সেস" : "সকল ফিচার আনলিমিটেড"}
          </div>
          <h2 className="font-['Noto_Serif_Bengali',serif] text-3xl sm:text-4xl text-white leading-snug">
            {paid ? (
              <>
                একবার পেমেন্ট,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-300 to-violet-300">
                  পুরো সেশন নিশ্চিন্ত
                </span>
              </>
            ) : (
              <>
                সকল প্রিমিয়াম ফিচার,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-sky-200 to-blue-300">
                  সম্পূর্ণ বিনামূল্যে
                </span>
              </>
            )}
          </h2>
          <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
            {paid
              ? "রেফারেল কোড থাকলে ৫০% ছাড় — মাত্র ৳৪৯। কোড ছাড়া মূল্য ৳৯৯। একবার পেমেন্ট, কোনো মাসিক ফি নেই।"
              : "আমাদের সকল প্রিমিয়াম ফিচার এখন সবার জন্য উন্মুক্ত। কোনো লুকানো চার্জ বা মাসিক ফি ছাড়াই সম্পূর্ণ সেশন উপভোগ করুন।"}
          </p>
        </div>

        {/* PASS TICKET */}
        <div className="relative rounded-3xl border border-blue-400/20 bg-[#0e1420] overflow-hidden shadow-2xl shadow-black/40">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-sky-400/60 via-blue-500/60 to-violet-500/60" />
          <div className="p-6 sm:p-9">
            {/* Ticket Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-dashed border-white/10">
              <div className="min-w-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400/90">
                  Full Season Pass
                </span>
                <div className="font-['Noto_Serif_Bengali',serif] text-2xl sm:text-3xl font-semibold text-white mt-0.5">
                  ভর্তি সেশন পাস ২০২৬-২৭
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  {paid && <div className="text-xs text-slate-600 line-through">৳৯৯</div>}
                  <div className={`font-['Noto_Serif_Bengali',serif] font-semibold text-white leading-none ${paid ? "text-4xl" : "text-3xl sm:text-4xl"}`}>
                    {paid ? "৳৪৯" : "ফ্রি"}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-full border whitespace-nowrap ${
                    paid
                      ? "text-sky-300 bg-sky-500/10 border-sky-500/25"
                      : "text-emerald-300 bg-emerald-500/10 border-emerald-500/25"
                  }`}
                >
                  {paid ? "রেফারেল কোডে" : "১০০% ফ্রি"}
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 py-7">
              {BENEFITS.map((b) => (
                <div key={b.t} className="flex items-start gap-3 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400/90 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-['Noto_Serif_Bengali',serif] text-[15px] sm:text-base font-semibold text-white leading-snug">
                      {b.t}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{b.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Banner (Referral or Share) */}
            {paid ? (
              <div className="rounded-2xl bg-sky-500/[0.07] border border-sky-400/25 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/25 flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5 text-sky-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-['Noto_Serif_Bengali',serif] text-lg font-semibold text-sky-200 leading-snug">
                      ৳৪৯ দামটি শুধুমাত্র রেফারেল কোডধারীদের জন্য
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      বন্ধুর কোড ব্যবহার করো — কোড দাতাও একই ছাড় পায়। কোড ছাড়া checkout-এ ৳৯৯ প্রযোজ্য হবে।
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    পেমেন্ট:
                  </span>
                  {PAYMENTS.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-emerald-500/[0.07] border border-emerald-400/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-['Noto_Serif_Bengali',serif] text-lg font-semibold text-emerald-200 leading-snug">
                      বন্ধুদের সাথে শেয়ার করুন
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      এই অ্যাপটি আপনার বন্ধু ও সহপাঠীদের সাথে শেয়ার করে তাদেরও ভর্তি প্রস্তুতিতে সাহায্য করুন।
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="font-['Noto_Serif_Bengali',serif] text-xl font-semibold text-white">
                    সবকিছু ফ্রি
                  </span>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              {paid ? (
                <>
                  <button
                    onClick={onGetStarted}
                    className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-black/30 ring-1 ring-white/10 active:scale-95 transition cursor-pointer"
                  >
                    ৳৯৯-এ সিজন পাস কিনুন
                  </button>
                  <button
                    onClick={onGetStarted}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-black/30 active:scale-95 transition cursor-pointer"
                  >
                    রেফারেল কোড দিয়ে ৳৪৯-এ নিন
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onGetStarted}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-black/30 ring-1 ring-white/10 active:scale-95 transition cursor-pointer"
                  >
                    এখনই বিনামূল্যে ব্যবহার শুরু করুন
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: 'ভর্তি পোর্টাল', text: 'ভর্তি পরীক্ষার সকল তথ্য এক জায়গায়!', url: window.location.href });
                      } else {
                        onGetStarted();
                      }
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-emerald-300 text-sm font-bold hover:bg-emerald-500/10 active:scale-95 transition cursor-pointer"
                  >
                    বন্ধুদের শেয়ার করুন
                  </button>
                </>
              )}
            </div>

            {/* Guarantee */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
              {paid ? "একবার পেমেন্ট • কোনো লুকানো ফি নেই • সেশন শেষ পর্যন্ত সকল আপডেট সহ" : "১০০% বিনামূল্যে • কোনো লুকানো চার্জ নেই • সেশন শেষ পর্যন্ত সকল আপডেট সহ"}
            </div>
          </div>
        </div>
      </section>

      {/* ===== INSTALL CTA ===== */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pb-16">
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-8 sm:p-10 text-center">
          <Smartphone className="w-8 h-8 text-sky-400/90 mx-auto mb-3" />
          <h2 className="font-['Noto_Serif_Bengali',serif] text-2xl sm:text-3xl text-white">
            স্মার্টফোনে সরাসরি অ্যাপ হিসেবে ব্যবহার করো
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Chrome মেনু থেকে <span className="text-slate-300 font-semibold">"Add to Home Screen"</span> চাপুন অথবা Android APK ইনস্টল করে ফুলস্ক্রিনে মসৃণ অভিজ্ঞতা নিন।
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="/download/app.apk"
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-black/30 active:scale-95 transition cursor-pointer"
            >
              <Download className="w-4 h-4" /> সরাসরি APK ডাউনলোড
            </a>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] text-slate-200 text-xs sm:text-sm font-semibold active:scale-95 transition cursor-pointer"
            >
              ব্রাউজারে চালিয়ে যান
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/[0.06] py-7 bg-[#080b12]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/icons/icon-512.png"
              alt="Logo"
              className="w-7 h-7 rounded-lg bg-[#0e131f] object-cover ring-1 ring-white/10 shrink-0"
            />
            <div className="text-xs text-slate-500 truncate">
              © ২০২৬ ভর্তি পোর্টাল • সর্বস্বত্ব সংরক্ষিত
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs text-slate-500 shrink-0">
            <a
              href="https://wa.me/8801XXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition"
            >
              হোয়াটসঅ্যাপ হেল্পলাইন
            </a>
            <a
              href="https://t.me/TOMAR_CHANNEL"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 transition"
            >
              টেলিগ্রাম চ্যানেল
            </a>
            <GraduationCap className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </footer>
    </div>
  );
};