import React from "react";
import { motion } from "motion/react";
import { User, Users, Check } from "lucide-react";
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
  const opts = [
    {
      val: false,
      Icon: User,
      bn: "১ম বারের পরীক্ষার্থী",
      en: "1st Timer",
      count: totalUniversitiesCount,
      sky: true,
    },
    {
      val: true,
      Icon: Users,
      bn: "২য় বারের পরীক্ষার্থী",
      en: "2nd Timer",
      count: secondTimerCount,
      sky: false,
    },
  ];

  return (
    <section
      aria-label="পরীক্ষার সুযোগ"
      className="grid grid-cols-2 gap-2.5 sm:gap-3"
    >
      {opts.map(({ val, Icon, bn, en, count, sky }) => {
        const active = isSecondTimer === val;
        return (
          <motion.button
            key={String(val)}
            type="button"
            aria-pressed={active}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(val)}
            className={`relative flex flex-col gap-2 rounded-2xl border-2 p-3 sm:p-4 text-left transition-colors cursor-pointer ${
              active
                ? sky
                  ? "border-sky-400/80 bg-sky-50 dark:bg-sky-950/30"
                  : "border-emerald-400/80 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#101828] hover:border-slate-300 dark:hover:border-white/25"
            }`}
          >
            {/* ===== Top row: icon + radio check ===== */}
            <div className="flex items-start justify-between">
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  active
                    ? sky
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                      : "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  active
                    ? sky
                      ? "border-sky-500 bg-sky-500"
                      : "border-emerald-500 bg-emerald-500"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {active && (
                  <Check className="w-3 h-3 text-white" strokeWidth={4} />
                )}
              </span>
            </div>

            {/* ===== Labels — full width, কোনো truncate নেই ===== */}
            <div className="min-w-0">
              <div
                className={`text-[12px] sm:text-[13px] font-black leading-snug ${
                  active
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {bn}
              </div>
              <div
                className={`text-[10px] font-bold mt-0.5 uppercase tracking-wide ${
                  sky
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {en}
              </div>
            </div>

            {/* ===== Count pill — full width ===== */}
            <span
              className={`inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-black px-2 py-1.5 rounded-xl tabular-nums ${
                active
                  ? sky
                    ? "bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300"
                    : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
              }`}
            >
              {toBanglaNum(count)}টি বিশ্ববিদ্যালয়
            </span>
          </motion.button>
        );
      })}
    </section>
  );
};
