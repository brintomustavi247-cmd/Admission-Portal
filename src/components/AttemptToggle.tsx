import React from "react";
import { motion } from "motion/react";
import { User, Users, Info, Sparkles } from "lucide-react";
import { toBanglaNum } from "../lib/banglaUtils";

interface AttemptToggleProps {
  isSecondTimer: boolean;
  onToggle: (val: boolean) => void;
  totalUniversitiesCount: number;
  secondTimerCount: number;
}

export const AttemptToggle: React.FC<AttemptToggleProps> = ({
  isSecondTimer,
  onToggle,
  totalUniversitiesCount,
  secondTimerCount,
}) => {
  const firstCount = totalUniversitiesCount - secondTimerCount;

  const options = [
    {
      key: false,
      icon: <User className="w-4 h-4" />,
      label: "১ম বারের পরীক্ষার্থী",
      en: "1st Timer",
      count: firstCount,
    },
    {
      key: true,
      icon: <Users className="w-4 h-4" />,
      label: "২য় বারের পরীক্ষার্থী",
      en: "2nd Timer",
      count: secondTimerCount,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101828]/90 p-3 sm:p-4 shadow-sm">
      {/* ===== Header row ===== */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-sky-500" />
          আপনার পরীক্ষার সুযোগ নির্বাচন করুন
        </span>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 hidden sm:block">
          সকল বিশ্ববিদ্যালয় প্রদর্শিত
        </span>
      </div>

      {/* ===== Segmented control (sliding thumb) ===== */}
      <div className="relative grid grid-cols-2 gap-1 rounded-xl bg-slate-100 dark:bg-[#0d1424] border border-slate-200/70 dark:border-white/5 p-1">
        {options.map((opt) => {
          const active = isSecondTimer === opt.key;
          return (
            <button
              key={String(opt.key)}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(opt.key)}
              className="relative rounded-lg px-2 sm:px-3 py-2.5 sm:py-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
            >
              {active && (
                <motion.span
                  layoutId="attempt-seg-thumb"
                  className="absolute inset-0 rounded-lg bg-white dark:bg-[#1e2530] border border-slate-200 dark:border-white/10 shadow-sm"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs transition-colors ${
                  active
                    ? "text-sky-700 dark:text-sky-300 font-black"
                    : "text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {opt.icon}
                <span className="truncate">
                  {opt.label}{" "}
                  <span className="opacity-70 font-semibold hidden md:inline">
                    ({opt.en})
                  </span>
                </span>
                <span
                  className={`shrink-0 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md tabular-nums ${
                    active
                      ? "bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                      : "bg-slate-200/80 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {toBanglaNum(opt.count)}টি
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ===== Footer hints ===== */}
      <div className="flex items-center justify-between gap-2 mt-2.5">
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 min-w-0">
          <Info className="w-3 h-3 shrink-0" />
          <span className="truncate">
            কার্ড ক্লিক করে বিস্তারিত সময়সূচি, ইউনিট ও নিয়মাবলী দেখুন
          </span>
        </span>
        <span
          className={`text-[10px] font-black shrink-0 ${
            isSecondTimer
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-sky-600 dark:text-sky-400"
          }`}
        >
          {isSecondTimer
            ? `ফিল্টারড: ২য় বার সুযোগ আছে (${toBanglaNum(secondTimerCount)}টি)`
            : "সব প্রতিষ্ঠান দেখানো হচ্ছে"}
        </span>
      </div>
    </section>
  );
};

