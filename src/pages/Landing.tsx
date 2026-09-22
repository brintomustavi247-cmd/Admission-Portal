import React from "react";
import { Calendar, ShieldCheck, Smartphone, Zap, Crown } from "lucide-react";

export const Landing: React.FC<{ onGetStarted: () => void }> = ({
  onGetStarted,
}) => (
  <div className="min-h-screen bg-[#0d1017] text-slate-100">
    <div className="relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold mb-4">
          <Zap className="w-3 h-3" /> ভর্তি সেশন ২০২৬–২৭ • লাইভ
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          বিশ্ববিদ্যালয় ভর্তি{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            এক অ্যাপে
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl mx-auto">
          সকল পাবলিক, প্রকৌশল, মেডিকেল ও গুচ্ছ ভর্তির সময়সূচি, জিপিএ যোগ্যতা
          চেক ও মাস্টার ক্যালেন্ডার — সব এক জায়গায়।
        </p>
        <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onGetStarted}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition"
          >
            ফ্রি শুরু করো
          </button>
          <button
            onClick={onGetStarted}
            className="px-7 py-3 rounded-xl bg-white/5 border border-white/15 text-slate-200 text-sm font-bold cursor-pointer hover:bg-white/10 transition"
          >
            লগইন
          </button>
          <a
            href="/download/app.apk"
            download
            className="px-7 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-bold cursor-pointer hover:bg-emerald-500/25 transition"
          >
            📥 APK Download
          </a>
        </div>
        <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <span>২১+ প্রতিষ্ঠান</span>
          <span>•</span>
          <span>লাইভ আপডেট</span>
          <span>•</span>
          <span>প্রিন্ট/PDF</span>
        </div>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-5 pb-12 grid sm:grid-cols-3 gap-4">
      {[
        {
          icon: <Calendar className="w-5 h-5" />,
          t: "মাস্টার ক্যালেন্ডার",
          d: "সব পরীক্ষার তারিখ ও রুটিন এক টেবিলে, প্রিন্ট রেডি",
        },
        {
          icon: <ShieldCheck className="w-5 h-5" />,
          t: "যোগ্যতা চেক",
          d: "GPA দিয়ে মুহূর্তেই জেনে নাও কোন ইউনিটে সুযোগ আছে",
        },
        {
          icon: <Smartphone className="w-5 h-5" />,
          t: "অ্যাপ হিসেবে ইনস্টল",
          d: "ফোনে APK/PWA ইনস্টল করে নেটিভের মতো ব্যবহার করো",
        },
      ].map((f) => (
        <div
          key={f.t}
          className="rounded-2xl p-5 bg-[#151a23] border border-white/10"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-3">
            {f.icon}
          </div>
          <div className="text-sm font-bold text-white">{f.t}</div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {f.d}
          </p>
        </div>
      ))}
    </div>

    <div className="max-w-3xl mx-auto px-5 pb-16 text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-300 text-[11px] font-bold mb-3">
        <Crown className="w-3 h-3" /> প্রিমিয়াম
      </div>
      <h2 className="text-xl font-black text-white">
        মাসিক ৳৯৯ — সব ফিচার আনলিমিটেড
      </h2>
      <p className="text-xs text-slate-400 mt-2">
        লঞ্চের সময় সম্পূর্ণ ফ্রি • সাবস্ক্রিপশন পরে চালু হবে
      </p>
    </div>

    <footer className="border-t border-white/5 py-6 text-center text-[11px] text-slate-500">
      © ২০২৬ বিশ্ববিদ্যালয় ভর্তি পোর্টাল • বাংলাদেশ
    </footer>
  </div>
);
