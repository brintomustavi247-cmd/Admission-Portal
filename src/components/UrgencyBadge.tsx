import React from "react";
import { Clock, CheckCircle2, CalendarClock, CalendarX } from "lucide-react";

interface UrgencyBadgeProps {
  startDate?: string;
  endDate?: string;
}

const DAY = 86400000;
const BN = "০১২৩৪৫৬৭৮৯";
const bn = (n: number | string) =>
  String(n).replace(/\d/g, (d) => BN[Number(d)]);

/* local-midnight timestamp — দিনের হিসাব exact রাখতে (time-of-day বাদ) */
const dayStart = (value?: string) => {
  if (!value) return NaN;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return NaN;
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/**
 * ৪টা স্পষ্ট state:
 *  1. তারিখ নেই        → "তারিখ ঘোষণার অপেক্ষায়" (slate)
 *  2. এখনো শুরু হয়নি  → "শুরু হবে X দিন পর"   (sky)   = upcoming
 *  3. চলমান            → "আবেদন চলমান · শেষ হবে X দিনে" (emerald pulse)
 *  4. শেষ হয়ে গেছে     → "আবেদন সময়সীমা শেষ"  (rose muted)
 */
export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  startDate,
  endDate,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = today.getTime();
  const start = dayStart(startDate);
  const end = dayStart(endDate);

  /* 1) কোনো তারিখ ঘোষিত/parse-যোগ্য নয় */
  if (Number.isNaN(start) && Number.isNaN(end)) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-[#232b3a] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#2a3344] whitespace-nowrap">
        <Clock className="w-3 h-3 shrink-0" />
        তারিখ ঘোষণার অপেক্ষায়
      </span>
    );
  }

  /* 2) Upcoming — এখনো শুরু হয়নি */
  if (!Number.isNaN(start) && now < start) {
    const days = Math.max(1, Math.ceil((start - now) / DAY));
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 whitespace-nowrap">
        <CalendarClock className="w-3 h-3 shrink-0" />
        শুরু হবে {bn(days)} দিন পর
      </span>
    );
  }

  /* 3) Ended — শেষ তারিখ পেরিয়ে গেছে (ongoing-এর আগে check) */
  if (!Number.isNaN(end) && now > end) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 whitespace-nowrap opacity-80">
        <CalendarX className="w-3 h-3 shrink-0" />
        আবেদন সময়সীমা শেষ
      </span>
    );
  }

  /* 4a) Ongoing — শেষ তারিখ এখনো ঘোষিত হয়নি (ভুলভাবে "শেষ" বলে না) */
  if (Number.isNaN(end)) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 whitespace-nowrap animate-pulse">
        <CheckCircle2 className="w-3 h-3 shrink-0" />
        আবেদন চলমান · শেষ তারিখ ঘোষণা হয়নি
      </span>
    );
  }

  /* 4b) Ongoing — আবেদন চলমান */
  const left = Math.max(0, Math.ceil((end - now) / DAY));
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 whitespace-nowrap animate-pulse">
      <CheckCircle2 className="w-3 h-3 shrink-0" />
      আবেদন চলমান · শেষ হবে {bn(left)} দিনে
    </span>
  );
};

export default UrgencyBadge;
