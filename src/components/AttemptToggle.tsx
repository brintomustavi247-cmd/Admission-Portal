import React from "react";
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
      label: "১ম বারের পরীক্ষার্থী",
      count: totalUniversitiesCount, // ✅ ১ম বার = সব বিশ্ববিদ্যালয় (২১)
      accent: "sky" as const,
    },
    {
      val: true,
      Icon: Users,
      label: "২য় বারের পরীক্ষার্থী",
      count: secondTimerCount, // ✅ ২য় বার সুযোগ আছে এমন (১৪)
      accent: "emerald" as const,
    },
  ];

  return (
    <section
      aria-label="পরীক্ষার সুযোগ"
      className="grid grid-cols-2 gap-2.5 sm:gap-3"
    >
      {opts.map(({ val, Icon, label, count, accent }) => {
        const active = isSecondTimer === val;
        const sky = accent === "sky";
        return (
          <button
            key={String(val)}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(val)}
            className={`relative flex items-center gap-2.5 sm:gap-3 rounded-2xl border-2 px-3 sm:px-4 py-3 sm:py-3.5 transition-all cursor-pointer active:scale-[0.98] ${
              active
                ? sky
                  ? "border-sky-400/80 bg-sky-50 dark:bg-sky-950/30"
                  : "border-emerald-400/80 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#101828] hover:border-slate-300 dark:hover:border-white/25"
            }`}
          >
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                active
                  ? sky
                    ? "bg-sky-500 text-white"
                    : "bg-emerald-500 text-white"
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
            </span>

            <span
              className={`flex-1 min-w-0 text-left text-[12px] sm:text-[13px] font-black truncate ${
                active
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {label}
            </span>

            <span
              className={`shrink-0 text-[10px] sm:text-[11px] font-black px-2 py-1 rounded-lg tabular-nums ${
                active
                  ? sky
                    ? "bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300"
                    : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
              }`}
            >
              {toBanglaNum(count)}টি
            </span>

            {active && (
              <span
                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                  sky ? "bg-sky-500" : "bg-emerald-500"
                }`}
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
              </span>
            )}
          </button>
        );
      })}
    </section>
  );
};
