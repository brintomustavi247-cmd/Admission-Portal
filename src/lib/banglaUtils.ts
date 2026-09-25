/**
 * Bangla language utility functions for dates, numbers, and admission urgency calculation
 * FIXED 25 Sep 2026: empty/missing dates can NEVER return 'ongoing'
 */

const banglaDigits: { [key: string]: string } = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
  ".": ".",
};

/**
 * Converts English number or string with digits to Bangla numerals
 */
export function toBanglaNum(num: number | string | undefined | null): string {
  if (num === undefined || num === null || num === "") return "০";
  const str = typeof num === "number" ? num.toString() : String(num);
  return str.replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

/**
 * Formats GPA numbers cleanly with decimals (e.g., 4.0 -> ৪.০০)
 */
export function formatBanglaGpa(
  gpa: number | string | undefined | null,
): string {
  if (gpa === undefined || gpa === null || gpa === "") return "০.০০";
  const num = typeof gpa === "number" ? gpa : parseFloat(String(gpa));
  if (isNaN(num)) return toBanglaNum(gpa);
  return toBanglaNum(num.toFixed(2));
}

const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

/**
 * Formats standard date (YYYY-MM-DD) into readable Bangla format
 */
export function formatBanglaDate(dateStr: string): string {
  if (!dateStr) return "তারিখ ঘোষণা হয়নি";

  if (/[\u0980-\u09FF]/.test(dateStr)) {
    return dateStr;
  }

  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    if (
      !isNaN(monthIndex) &&
      monthIndex >= 0 &&
      monthIndex < 12 &&
      !isNaN(day)
    ) {
      return `${toBanglaNum(day)} ${banglaMonths[monthIndex]} ${toBanglaNum(year)}`;
    }
  }

  return toBanglaNum(dateStr);
}

export interface UrgencyInfo {
  status: "ongoing" | "upcoming" | "ended";
  badgeText: string;
  badgeClass: string;
  daysRemaining: number;
  isUrgent: boolean;
}

/**
 * Calculates urgency and remaining days from start and end dates.
 *
 * RULES (fixed):
 * - দুটো তারিখই খালি/invalid  => 'upcoming' + "তারিখ ঘোষণার অপেক্ষায়" (কখনো 'ongoing' না)
 * - end অতীতে                  => 'ended'
 * - start ভবিষ্যতে               => 'upcoming' + "X দিন পর শুরু"
 * - start খালি, end ভবিষ্যতে     => 'upcoming' + "আবেদন শীঘ্রই শুরু হবে"
 * - start অতীত, end খালি        => 'ongoing' (শেষ তারিখ ঘোষণা হয়নি)
 * - window-এর ভেতরে             => 'ongoing' + urgency tiers
 */
export function calculateUrgency(
  startDateStr: string,
  endDateStr: string,
): UrgencyInfo {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const DAY = 1000 * 60 * 60 * 24;

  const start =
    startDateStr && startDateStr.trim()
      ? new Date(startDateStr)
      : new Date(NaN);
  const end =
    endDateStr && endDateStr.trim() ? new Date(endDateStr) : new Date(NaN);
  const hasStart = !isNaN(start.getTime());
  const hasEnd = !isNaN(end.getTime());

  const CLS_SLATE =
    "bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#333d4d]";
  const CLS_BLUE = "bg-blue-50 text-blue-700 border-blue-200";
  const CLS_EMERALD =
    "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";

  /* ১) কোনো তারিখ ঘোষণা হয়নি — কখনো "চলছে" না */
  if (!hasStart && !hasEnd) {
    return {
      status: "upcoming",
      badgeText: "তারিখ ঘোষণার অপেক্ষায়",
      badgeClass: CLS_SLATE,
      daysRemaining: 0,
      isUrgent: false,
    };
  }

  /* ২) শেষ তারিখ পেরিয়ে গেছে */
  if (hasEnd && today.getTime() > end.getTime()) {
    return {
      status: "ended",
      badgeText: "আবেদন সমাপ্ত",
      badgeClass: CLS_SLATE,
      daysRemaining: Math.ceil((end.getTime() - today.getTime()) / DAY),
      isUrgent: false,
    };
  }

  /* ৩) শুরু এখনো আসেনি */
  if (hasStart && today.getTime() < start.getTime()) {
    const startDiff = Math.ceil((start.getTime() - today.getTime()) / DAY);
    return {
      status: "upcoming",
      badgeText: `${toBanglaNum(startDiff)} দিন পর শুরু`,
      badgeClass: CLS_BLUE,
      daysRemaining: -startDiff,
      isUrgent: false,
    };
  }

  /* ৪) শুরুর তারিখ ঘোষণা হয়নি, শেষ তারিখ ভবিষ্যতে */
  if (!hasStart && hasEnd) {
    return {
      status: "upcoming",
      badgeText: "আবেদন শীঘ্রই শুরু হবে",
      badgeClass: CLS_BLUE,
      daysRemaining: Math.ceil((end.getTime() - today.getTime()) / DAY),
      isUrgent: false,
    };
  }

  /* ৫) শুরু হয়েছে, শেষ তারিখ ঘোষণা হয়নি */
  if (hasStart && !hasEnd) {
    return {
      status: "ongoing",
      badgeText: "আবেদন চলছে (শেষ তারিখ ঘোষণা হয়নি)",
      badgeClass: CLS_EMERALD,
      daysRemaining: 0,
      isUrgent: false,
    };
  }

  /* ৬) চলমান window — urgency tiers */
  const daysDiff = Math.ceil((end.getTime() - today.getTime()) / DAY);

  if (daysDiff === 0) {
    return {
      status: "ongoing",
      badgeText: "আজই শেষ দিন!",
      badgeClass:
        "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse font-bold",
      daysRemaining: 0,
      isUrgent: true,
    };
  }

  if (daysDiff <= 3) {
    return {
      status: "ongoing",
      badgeText: `শেষ হতে ${toBanglaNum(daysDiff)} দিন বাকি!`,
      badgeClass:
        "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-semibold",
      daysRemaining: daysDiff,
      isUrgent: true,
    };
  }

  if (daysDiff <= 7) {
    return {
      status: "ongoing",
      badgeText: `${toBanglaNum(daysDiff)} দিন বাকি`,
      badgeClass: CLS_EMERALD,
      daysRemaining: daysDiff,
      isUrgent: false,
    };
  }

  return {
    status: "ongoing",
    badgeText: "আবেদন চলছে",
    badgeClass: CLS_EMERALD,
    daysRemaining: daysDiff,
    isUrgent: false,
  };
}
