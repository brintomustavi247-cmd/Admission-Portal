import React from "react";
import { motion } from "motion/react";
import { User, Users, Info, ArrowRight } from "lucide-react";
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
      gradient: "from-sky-500/10 to-blue-500/10",
      activeBorder: "border-sky-400/50",
      inactiveText: "text-slate-600 dark:text-slate-400",
      activeText: "text-sky-700 dark:text-sky-300",
      badgeBg: "bg-sky-100 dark:bg-sky-950/60",
      badgeText: "text-sky-700 dark:text-sky-300",
      badgeBorder: "border-sky-200 dark:border-sky-800",
    },
    {
      key: true,
      icon: <Users className="w-4 h-4" />,
      label: "২য় বারের পরীক্ষার্থী",
      en: "2nd Timer",
      count: secondTimerCount,
      gradient: "from-emerald-500/10 to-teal-500/10",
      activeBorder: "border-emerald-400/50",
      inactiveText: "text-slate-600 dark:text-slate-400",
      activeText: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-100 dark:bg-emerald-950/60",
      badgeText: "text-emerald-700 dark:text-emerald-300",
      badgeBorder: "border-emerald-200 dark:border-emerald-800",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#101828]/95 backdrop-blur-sm shadow-sm">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: isSecondTimer
            ? "radial-gradient(ellipse at top right, rgba(16,185,129,0.08), transparent 60%)"
            : "radial-gradient(ellipse at top left, rgba(14,165,233,0.08), transparent 60%)",
        }}
      />

      <div className="relative p-4 sm:p-5">
        {/* ===== Header ===== */}
        <div className="mb-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            আপনার পরীক্ষার সুযোগ নির্বাচন করুন
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            সকল বিশ্ববিদ্যালয় প্রদর্শিত হবে
          </p>
        </div>

        {/* ===== Floating pill toggle ===== */}
        <div className="relative grid grid-cols-2 gap-2 rounded-2xl bg-slate-100/80 dark:bg-[#0d1424]/80 border border-slate-200/60 dark:border-white/5 p-1.5 shadow-inner">
          {options.map((opt) => {
            const active = isSecondTimer === opt.key;
            return (
              <button
                key={String(opt.key)}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(opt.key)}
                className={`relative rounded-xl px-3 sm:px-4 py-3 sm:py-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400/60 transition-all ${
                  active ? opt.activeBorder : "border-transparent"
                } border-2`}
              >
                {/* Animated gradient background for active */}
                {active && (
                  <motion.div
                    layoutId="attempt-pill-bg"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${opt.gradient} border ${opt.activeBorder}`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-2">
                  {/* Icon + label row */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                        active
                          ? `${opt.badgeBg} ${opt.badgeText}`
                          : "bg-slate-200/60 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {opt.icon}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <div
                        className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                          active ? opt.activeText : opt.inactiveText
                        }`}
                      >
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold hidden sm:block">
                        {opt.en}
                      </div>
                    </div>
                  </div>

                  {/* Count badge */}
                  <div
                    className={`inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-lg tabular-nums transition-all ${
                      active
                        ? `${opt.badgeBg} ${opt.badgeText} border ${opt.badgeBorder}`
                        : "bg-slate-200/60 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <span>{toBanglaNum(opt.count)}</span>
                    <span className="font-semibold">টি বিশ্ববিদ্যালয়</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ===== Footer with status ===== */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 min-w-0 flex-1">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">
              কার্ড ক্লিক করে বিস্তারিত সময়সূচি, ইউনিট ও নিয়মাবলী দেখুন
            </span>
          </div>

          <motion.div
            key={isSecondTimer ? "2nd" : "1st"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`flex items-center gap-1.5 text-[11px] font-black shrink-0 ${
              isSecondTimer
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-sky-600 dark:text-sky-400"
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            {isSecondTimer
              ? `ফিল্টারড (${toBanglaNum(secondTimerCount)}টি)`
              : "সব দেখানো হচ্ছে"}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

