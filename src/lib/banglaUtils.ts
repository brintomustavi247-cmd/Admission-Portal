/**
 * Bangla language utility functions for dates, numbers, and admission urgency calculation
 */

const banglaDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
  '.': '.',
};

/**
 * Converts English number or string with digits to Bangla numerals
 */
export function toBanglaNum(num: number | string | undefined | null): string {
  if (num === undefined || num === null || num === '') return '০';
  const str = typeof num === 'number' ? num.toString() : String(num);
  return str.replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

/**
 * Formats GPA numbers cleanly with decimals (e.g., 4.0 -> ৪.০০, 3.5 -> ৩.৫০, 8.5 -> ৮.৫০)
 * to ensure complete clarity for students.
 */
export function formatBanglaGpa(gpa: number | string | undefined | null): string {
  if (gpa === undefined || gpa === null || gpa === '') return '০.০০';
  const num = typeof gpa === 'number' ? gpa : parseFloat(String(gpa));
  if (isNaN(num)) return toBanglaNum(gpa);
  const formatted = num.toFixed(2);
  return toBanglaNum(formatted);
}

const banglaMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

/**
 * Formats standard date (YYYY-MM-DD) into readable Bangla format
 */
export function formatBanglaDate(dateStr: string): string {
  if (!dateStr) return 'তারিখ ঘোষণা হয়নি';
  
  // Check if dateStr is already in Bangla
  if (/[\u0980-\u09FF]/.test(dateStr)) {
    return dateStr;
  }

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    if (!isNaN(monthIndex) && monthIndex >= 0 && monthIndex < 12 && !isNaN(day)) {
      return `${toBanglaNum(day)} ${banglaMonths[monthIndex]} ${toBanglaNum(year)}`;
    }
  }

  return toBanglaNum(dateStr);
}

export interface UrgencyInfo {
  status: 'ongoing' | 'upcoming' | 'ended';
  badgeText: string;
  badgeClass: string;
  daysRemaining: number;
  isUrgent: boolean;
}

/**
 * Calculates urgency and remaining days from start and end dates
 */
export function calculateUrgency(startDateStr: string, endDateStr: string): UrgencyInfo {
  const now = new Date();
  // Strip time for clean date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const end = new Date(endDateStr);
  const start = new Date(startDateStr);

  // If invalid dates, return safe default
  if (isNaN(end.getTime())) {
    return {
      status: 'ongoing',
      badgeText: 'আবেদন চলছে',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      daysRemaining: 15,
      isUrgent: false,
    };
  }

  const diffTime = end.getTime() - today.getTime();
  const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (!isNaN(start.getTime()) && today.getTime() < start.getTime()) {
    const startDiff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: 'upcoming',
      badgeText: `${toBanglaNum(startDiff)} দিন পর শুরু`,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      daysRemaining: -startDiff,
      isUrgent: false,
    };
  }

  if (daysDiff < 0) {
    return {
      status: 'ended',
      badgeText: 'আবেদন সমাপ্ত',
      badgeClass: 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#333d4d]',
      daysRemaining: daysDiff,
      isUrgent: false,
    };
  }

  if (daysDiff === 0) {
    return {
      status: 'ongoing',
      badgeText: 'আজই শেষ দিন!',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse font-bold',
      daysRemaining: 0,
      isUrgent: true,
    };
  }

  if (daysDiff <= 3) {
    return {
      status: 'ongoing',
      badgeText: `শেষ হতে ${toBanglaNum(daysDiff)} দিন বাকি!`,
      badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-semibold',
      daysRemaining: daysDiff,
      isUrgent: true,
    };
  }

  if (daysDiff <= 7) {
    return {
      status: 'ongoing',
      badgeText: `${toBanglaNum(daysDiff)} দিন বাকি`,
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      daysRemaining: daysDiff,
      isUrgent: false,
    };
  }

  return {
    status: 'ongoing',
    badgeText: 'আবেদন চলছে',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    daysRemaining: daysDiff,
    isUrgent: false,
  };
}
