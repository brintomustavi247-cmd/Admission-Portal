import React, { useEffect, useState } from "react";
import { useEscapeClose } from "../hooks/useEscapeClose";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ExternalLink,
  Calendar,
  GraduationCap,
  MapPin,
  Check,
  AlertTriangle,
  Copy,
  CheckCircle2,
  Zap,
  Calculator,
  Clock,
  Ban,
} from "lucide-react";
import { University } from "../types/admission";
import { formatBanglaDate, formatBanglaGpa } from "../lib/banglaUtils";

const BN = "০১২৩৪৫৬৭৮৯";
const bnToEnDigits = (s: string) =>
  s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));
const digitsOnly = (s: string) => bnToEnDigits(s.replace(/[^\d০-৯]/g, ""));

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const englishDateShort = (iso: string) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${EN_MONTHS[m - 1]} ${y}`;
};

const BN_UNIT_EN: Record<string, string> = {
  এ: "A",
  বি: "B",
  সি: "C",
  ডি: "D",
  ই: "E",
  এফ: "F",
};
const unitInitial = (n: string) => n.split(" ")[0] || n;
const unitEnLetter = (n: string) => BN_UNIT_EN[n.split(" ")[0]] || "";

const UNIT_COLORS = [
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
  "from-indigo-500 to-blue-700",
  "from-fuchsia-500 to-purple-700",
];

const REGION_COLORS = [
  "bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-700",
  "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
  "bg-violet-100 dark:bg-violet-950/50 text-violet-800 dark:text-violet-200 border-violet-300 dark:border-violet-700",
  "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700",
  "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700",
  "bg-cyan-100 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700",
  "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700",
  "bg-fuchsia-100 dark:bg-fuchsia-950/50 text-fuchsia-800 dark:text-fuchsia-200 border-fuchsia-300 dark:border-fuchsia-700",
];

/* ===== Expired region colors (muted slate) ===== */
const REGION_COLORS_EXPIRED =
  "bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600";

interface UniversityModalProps {
  university:
    | (University & {
        latestBreakingUpdate?: {
          title: string;
          extracted_data?: {
            exam_date?: string;
            application_start?: string;
            application_end?: string;
            fees?: string;
            fee_amount?: string;
            exam_regions?: string[];
            calculator_allowed?: boolean | null;
            _session_year?: string;
            _is_expired?: boolean;
            units?: Array<{ name: string; date?: string; fee?: string }>;
          };
          source_urls?: string[];
        };
      })
    | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UniversityModal: React.FC<UniversityModalProps> = ({
  university,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  useEscapeClose(isOpen, onClose);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!university) return null;

  const breaking = university.latestBreakingUpdate;
  const liveExamDate = breaking?.extracted_data?.exam_date || "";
  const appStart =
    breaking?.extracted_data?.application_start || university.startDate;
  const appEnd =
    breaking?.extracted_data?.application_end || university.endDate;
  const firstExam = liveExamDate || university.examUnits?.[0]?.examDate || "";
  const regions = breaking?.extracted_data?.exam_regions || [];
  const calcAllowed = breaking?.extracted_data?.calculator_allowed;
  const sessionYear = breaking?.extracted_data?._session_year;
  const isExpired = breaking?.extracted_data?._is_expired === true;
  const extractedUnits = breaking?.extracted_data?.units || [];

  const logoText =
    university.logoLetter || university.shortName || university.name.charAt(0);
  const modalLogoFontSize =
    logoText.length <= 2
      ? "text-lg sm:text-2xl font-black"
      : logoText.length === 3
        ? "text-base sm:text-xl font-black tracking-tight"
        : logoText.length === 4
          ? "text-xs sm:text-base font-black tracking-tight"
          : "text-[11px] sm:text-sm font-black tracking-tighter px-0.5";

  const handleCopyLink = () => {
    if (university.applicationLink) {
      navigator.clipboard.writeText(university.applicationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ===== Next session prediction for expired data ===== */
  const getNextSession = () => {
    if (!sessionYear) return "";
    const parts = sessionYear.split("-");
    if (parts.length === 2) {
      const startYear = parseInt(parts[0]);
      const endYearSuffix = parseInt(parts[1]);
      return `${startYear + 1}-${String(endYearSuffix + 1).padStart(2, "0")}`;
    }
    const year = parseInt(sessionYear);
    if (!isNaN(year)) return `${year + 1}`;
    return "";
  };

  const nextSession = getNextSession();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />
          <motion.div
            id="university-detail-modal"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col transition-colors ${
              isExpired
                ? "bg-white dark:bg-[#1e2530] border-slate-300 dark:border-slate-700"
                : "bg-white dark:bg-[#1e2530] border-slate-200 dark:border-[#2a3344]"
            }`}
          >
            {/* ===== HEADER ===== */}
            <div
              className={`shrink-0 relative text-white p-3.5 sm:p-6 ${
                isExpired
                  ? "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700"
                  : "bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-start gap-2.5 sm:gap-4 pr-7 sm:pr-8">
                <div
                  className={`w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md border border-white/20 shrink-0 text-center select-none ${modalLogoFontSize} ${
                    university.logoBg || "bg-sky-600"
                  } ${isExpired ? "opacity-80" : ""}`}
                >
                  {logoText}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        isExpired
                          ? "bg-slate-500/30 text-slate-200 border-slate-400/30"
                          : "bg-sky-500/30 text-sky-100 border-sky-400/30"
                      }`}
                    >
                      {university.categoryLabel}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-300 shrink-0" />
                      <span className="truncate">{university.location}</span>
                    </span>
                    {/* ===== SESSION YEAR BADGE ===== */}
                    {sessionYear && (
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
                          isExpired
                            ? "bg-slate-500/40 text-slate-200 border-slate-400/40"
                            : "bg-emerald-500/40 text-emerald-100 border-emerald-400/40"
                        }`}
                      >
                        সেশন: {sessionYear}{" "}
                        {isExpired && (
                          <span className="text-slate-300">(আগের)</span>
                        )}
                      </span>
                    )}
                  </div>
                  <h2
                    className={`text-base sm:text-2xl font-bold tracking-tight leading-tight ${
                      isExpired ? "text-slate-100" : "text-white"
                    }`}
                  >
                    {university.name}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-200 truncate mt-0.5">
                    {university.englishName}
                  </p>
                </div>
              </div>
            </div>

            {/* ===== SCROLLABLE CONTENT ===== */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3 sm:space-y-4">
              {/* ===== EXPIRED SESSION WARNING BANNER ===== */}
              {isExpired && sessionYear && (
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border-2 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-slate-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-500 text-white shrink-0 mt-0.5 shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-500 text-white">
                      আগের সেশনের তথ্য
                    </span>
                    <div className="font-black text-sm mt-1 leading-snug text-slate-900 dark:text-white">
                      {sessionYear} সেশনের তথ্য (সময়সীমা শেষ)
                    </div>
                    <p className="text-[11px] mt-1 opacity-90 leading-relaxed text-slate-700 dark:text-slate-300">
                      {nextSession
                        ? `নতুন সেশনের (${nextSession}) তথ্য প্রকাশিত হলে আপডেট হবে। ততক্ষণ এই তথ্য reference হিসেবে ব্যবহার করুন।`
                        : "নতুন সেশনের তথ্য প্রকাশিত হলে আপডেট হবে।"}
                    </p>
                  </div>
                </div>
              )}

              {/* ===== LIVE BREAKING ALERT (only for active) ===== */}
              {breaking && !isExpired && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-500/60 text-amber-900 dark:text-amber-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0 mt-0.5 shadow-sm">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                      সরাসরি লাইভ আপডেট
                    </span>
                    <div className="font-black text-sm text-slate-900 dark:text-white mt-1 leading-snug">
                      {breaking.title}
                    </div>
                    {liveExamDate && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-400/20 border border-amber-300 dark:border-amber-500/30 text-xs font-bold text-amber-900 dark:text-amber-200">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        পরীক্ষার সংশোধিত তারিখ:{" "}
                        <span className="underline">
                          {formatBanglaDate(liveExamDate)}
                        </span>
                        <span className="opacity-70 font-semibold">
                          ({englishDateShort(liveExamDate)})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== DATE GRID (3 columns) ===== */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                <div
                  className={`p-2 sm:p-3 rounded-xl border text-center ${
                    isExpired
                      ? "bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700"
                      : "bg-slate-100 dark:bg-[#232b3a]/80 border-slate-300 dark:border-[#333d4d]"
                  }`}
                >
                  <span
                    className={`text-[10px] sm:text-xs font-semibold block mb-0.5 ${
                      isExpired
                        ? "text-slate-500 dark:text-slate-500"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    আবেদন শুরু
                  </span>
                  <div
                    className={`font-bold text-[11px] sm:text-sm truncate ${
                      isExpired
                        ? "text-slate-500 dark:text-slate-500"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {formatBanglaDate(appStart)}
                  </div>
                  <div className="text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase truncate opacity-60">
                    {englishDateShort(appStart) || "—"}
                  </div>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-xl border text-center ${
                    isExpired
                      ? "bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700"
                      : "bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60"
                  }`}
                >
                  <span
                    className={`text-[10px] sm:text-xs font-semibold block mb-0.5 ${
                      isExpired
                        ? "text-slate-500 dark:text-slate-500"
                        : "text-amber-900 dark:text-amber-300"
                    }`}
                  >
                    শেষ তারিখ
                  </span>
                  <div
                    className={`font-bold text-[11px] sm:text-sm truncate ${
                      isExpired
                        ? "text-slate-500 dark:text-slate-500"
                        : "text-amber-950 dark:text-amber-100"
                    }`}
                  >
                    {formatBanglaDate(appEnd)}
                  </div>
                  <div className="text-[9px] font-bold text-amber-800 dark:text-amber-400/70 tracking-wider uppercase truncate opacity-60">
                    {englishDateShort(appEnd) || "—"}
                  </div>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-xl border text-center ${
                    isExpired
                      ? "bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700"
                      : "bg-sky-100 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800/60"
                  }`}
                >
                  <span
                    className={`text-[10px] sm:text-xs font-semibold block mb-0.5 ${
                      isExpired
                        ? "text-slate-500 dark:text-slate-500"
                        : "text-sky-900 dark:text-sky-300"
                    }`}
                  >
                    পরীক্ষার তারিখ
                  </span>
                  <div
                    className={`font-bold text-[11px] sm:text-sm truncate ${
                      isExpired
                        ? "text-slate-500 dark:text-slate-500"
                        : "text-sky-950 dark:text-sky-100"
                    }`}
                  >
                    {firstExam
                      ? formatBanglaDate(firstExam)
                      : "ঘোষণার অপেক্ষায়"}
                  </div>
                  <div className="text-[9px] font-bold text-sky-800 dark:text-sky-400/70 tracking-wider uppercase truncate opacity-60">
                    {englishDateShort(firstExam) || "—"}
                  </div>
                </div>
              </div>

              {/* ===== EXAM REGIONS GRID ===== */}
              {regions.length > 0 && (
                <div
                  className={`p-3.5 rounded-xl border-2 ${
                    isExpired
                      ? "bg-slate-100 dark:bg-slate-800/60 border-slate-400 dark:border-slate-600"
                      : "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-300 dark:border-indigo-700/60"
                  }`}
                >
                  <h3
                    className={`text-xs sm:text-sm font-bold mb-3 flex items-center gap-1.5 ${
                      isExpired
                        ? "text-slate-700 dark:text-slate-300"
                        : "text-indigo-900 dark:text-indigo-100"
                    }`}
                  >
                    <MapPin
                      className={`w-4 h-4 shrink-0 ${
                        isExpired
                          ? "text-slate-500"
                          : "text-indigo-600 dark:text-indigo-400"
                      }`}
                    />
                    <span>পরীক্ষার কেন্দ্র ({regions.length}টি বিভাগ)</span>
                    {isExpired && (
                      <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded bg-slate-500 text-white">
                        আগের সেশন
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {regions.map((region, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded-lg border text-xs sm:text-sm font-bold text-center ${
                          isExpired
                            ? REGION_COLORS_EXPIRED
                            : REGION_COLORS[idx % REGION_COLORS.length]
                        }`}
                      >
                        📍 {region}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== CALCULATOR POLICY BANNER ===== */}
              {calcAllowed !== null && calcAllowed !== undefined && (
                <div
                  className={`p-3.5 rounded-xl border-2 flex items-start gap-3 ${
                    isExpired
                      ? "bg-slate-100 dark:bg-slate-800/60 border-slate-400 dark:border-slate-600"
                      : calcAllowed
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700"
                        : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 shadow-sm ${
                      isExpired
                        ? "bg-slate-500 text-white"
                        : calcAllowed
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white"
                    }`}
                  >
                    {calcAllowed ? (
                      <Calculator className="w-4 h-4" />
                    ) : (
                      <Ban className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-black text-sm ${
                        isExpired ? "text-slate-700 dark:text-slate-300" : ""
                      }`}
                    >
                      🧮 ক্যালকুলেটর নীতি
                    </div>
                    <div
                      className={`font-bold text-xs sm:text-sm mt-1 ${
                        isExpired
                          ? "text-slate-600 dark:text-slate-400"
                          : calcAllowed
                            ? "text-emerald-950 dark:text-emerald-100"
                            : "text-rose-950 dark:text-rose-100"
                      }`}
                    >
                      {calcAllowed
                        ? "ক্যালকুলেটর ব্যবহার করা যাবে ✅"
                        : "ক্যালকুলেটর ব্যবহার করা যাবে না ❌"}
                    </div>
                    <p
                      className={`text-[11px] mt-1 leading-relaxed ${
                        isExpired
                          ? "text-slate-500 dark:text-slate-500"
                          : "opacity-80"
                      }`}
                    >
                      {calcAllowed
                        ? "সাধারণ/সায়েন্টিফিক ক্যালকুলেটর পরীক্ষার হলে নেওয়া যাবে।"
                        : "পরীক্ষার হলে কোনো ধরনের ক্যালকুলেটর অনুমোদিত নয়। ম্যানুয়ালি হিসাব করতে হবে।"}
                    </p>
                  </div>
                </div>
              )}

              {/* ===== UNITS FROM EXTRACTED DATA ===== */}
              {extractedUnits.length > 0 && (
                <div>
                  <h3
                    className={`text-xs sm:text-sm font-bold mb-2 flex items-center gap-1.5 ${
                      isExpired
                        ? "text-slate-600 dark:text-slate-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    <Calendar
                      className={`w-4 h-4 shrink-0 ${
                        isExpired
                          ? "text-slate-500"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    />
                    <span>ইউনিট ভিত্তিক তথ্য {isExpired && "(আগের সেশন)"}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {extractedUnits.map((unit, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 sm:p-3 rounded-xl border ${
                          isExpired
                            ? "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60"
                            : "border-slate-300 dark:border-[#333d4d] bg-white dark:bg-[#232b3a]"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${
                              UNIT_COLORS[idx % UNIT_COLORS.length]
                            } flex items-center justify-center text-white text-sm sm:text-base font-black shrink-0 shadow-sm select-none ${
                              isExpired ? "opacity-50" : ""
                            }`}
                          >
                            {unitInitial(unit.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5">
                              <span
                                className={`font-black text-[13px] sm:text-sm leading-snug ${
                                  isExpired
                                    ? "text-slate-500 dark:text-slate-500"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                {unit.name}
                              </span>
                              {unit.fee && (
                                <span
                                  className={`shrink-0 text-[10px] sm:text-[11px] px-2 py-1 rounded-lg font-black whitespace-nowrap ${
                                    isExpired
                                      ? "bg-slate-200 dark:bg-slate-700 text-slate-500 border border-slate-300 dark:border-slate-600"
                                      : "bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                                  }`}
                                >
                                  {unit.fee}
                                </span>
                              )}
                            </div>
                            {unit.date && (
                              <p
                                className={`text-[11px] mt-0.5 ${
                                  isExpired
                                    ? "text-slate-500"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {formatBanglaDate(unit.date)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== 2ND TIMER ===== */}
              <div
                className={`p-2.5 sm:p-3.5 rounded-xl border-2 flex items-start gap-2.5 ${
                  university.secondTimerAllowed
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100"
                    : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 text-amber-950 dark:text-amber-100"
                } ${isExpired ? "opacity-70" : ""}`}
              >
                {university.secondTimerAllowed ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs sm:text-sm">
                    {university.secondTimerAllowed
                      ? "২য় বার সুযোগ অনুমোদিত (2nd Timer)"
                      : "২য় বার সুযোগ নেই (শুধুমাত্র ১ম বার)"}
                  </div>
                  <p className="text-[11px] sm:text-xs mt-0.5 opacity-90 leading-relaxed text-slate-800 dark:text-slate-300">
                    {university.secondTimerDeduction ||
                      "মেধা তালিকায় যোগ্য হলে ২য় বার আবেদন করা যাবে।"}
                  </p>
                </div>
              </div>

              {/* ===== MINIMUM GPA ===== */}
              <div
                className={`p-2.5 sm:p-3.5 rounded-xl bg-slate-100 dark:bg-[#232b3a]/60 border border-slate-300 dark:border-[#333d4d] ${
                  isExpired ? "opacity-70" : ""
                }`}
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>নূন্যতম জিপিএ ও প্রয়োজনীয় বিষয়</span>
                </h3>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center mb-2">
                  <div className="bg-white dark:bg-[#232b3a] p-1.5 sm:p-2 rounded-lg border border-slate-300 dark:border-[#333d4d]">
                    <span className="text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 block">
                      এসএসসি
                    </span>
                    <strong className="text-sm sm:text-base text-slate-900 dark:text-slate-100 font-bold">
                      {formatBanglaGpa(university.minGpa.ssc)}
                    </strong>
                  </div>
                  <div className="bg-white dark:bg-[#232b3a] p-1.5 sm:p-2 rounded-lg border border-slate-300 dark:border-[#333d4d]">
                    <span className="text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 block">
                      এইচএসসি
                    </span>
                    <strong className="text-sm sm:text-base text-slate-900 dark:text-slate-100 font-bold">
                      {formatBanglaGpa(university.minGpa.hsc)}
                    </strong>
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-950/40 p-1.5 sm:p-2 rounded-lg border border-emerald-300 dark:border-emerald-800">
                    <span className="text-[10px] sm:text-[11px] text-emerald-900 dark:text-emerald-300 font-semibold block">
                      মোট জিপিএ
                    </span>
                    <strong className="text-sm sm:text-base text-emerald-800 dark:text-emerald-300 font-bold">
                      {formatBanglaGpa(university.minGpa.combined)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ===== EXAM UNITS (from university config, with fallback) ===== */}
              <div>
                <h3
                  className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 mb-2 ${
                    isExpired
                      ? "text-slate-600 dark:text-slate-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  <Calendar
                    className={`w-4 h-4 shrink-0 ${
                      isExpired
                        ? "text-slate-500"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                  <span>
                    অনুষদ ও ইউনিট ভিত্তিক পরীক্ষার তারিখ{" "}
                    {isExpired && "(আগের সেশন)"}
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {university.examUnits && university.examUnits.length > 0 ? (
                    university.examUnits.map((unit, idx) => {
                      const fee =
                        breaking?.extracted_data?.fees ||
                        breaking?.extracted_data?.fee_amount ||
                        unit.fee ||
                        "";
                      const unitDate = liveExamDate || unit.examDate;
                      const enLetter = unitEnLetter(unit.unit);
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 sm:p-3 rounded-xl border ${
                            isExpired
                              ? "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60"
                              : "border-slate-300 dark:border-[#333d4d] bg-white dark:bg-[#232b3a]"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${
                                UNIT_COLORS[idx % UNIT_COLORS.length]
                              } flex items-center justify-center text-white text-sm sm:text-base font-black shrink-0 shadow-sm select-none ${
                                isExpired ? "opacity-50" : ""
                              }`}
                            >
                              {unitInitial(unit.unit)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1.5">
                                <span
                                  className={`font-black text-[13px] sm:text-sm leading-snug ${
                                    isExpired
                                      ? "text-slate-500 dark:text-slate-500"
                                      : "text-slate-900 dark:text-white"
                                  }`}
                                >
                                  {unit.unit}
                                  {enLetter && (
                                    <span className="ml-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                      ({enLetter})
                                    </span>
                                  )}
                                </span>
                                {fee ? (
                                  <span
                                    className={`shrink-0 text-[10px] sm:text-[11px] px-2 py-1 rounded-lg font-black whitespace-nowrap ${
                                      isExpired
                                        ? "bg-slate-200 dark:bg-slate-700 text-slate-500 border border-slate-300 dark:border-slate-600"
                                        : "bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                                    }`}
                                  >
                                    {fee.startsWith("৳") ? fee : `৳ ${fee}`}
                                    {digitsOnly(fee) && (
                                      <span className="ml-1 font-semibold opacity-70">
                                        ({digitsOnly(fee)})
                                      </span>
                                    )}
                                  </span>
                                ) : (
                                  <span
                                    className={`shrink-0 text-[10px] px-2 py-1 rounded-lg font-semibold whitespace-nowrap ${
                                      isExpired
                                        ? "bg-slate-200 dark:bg-slate-700 text-slate-500"
                                        : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                                    }`}
                                  >
                                    ফি ঘোষণার অপেক্ষায়
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-[11px] sm:text-xs mt-0.5 leading-snug ${
                                  isExpired
                                    ? "text-slate-500"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {unit.title}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-[#333d4d] flex items-center justify-between gap-2">
                            <span
                              className={`text-[11px] font-medium ${
                                isExpired
                                  ? "text-slate-500"
                                  : "text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              পরীক্ষার তারিখ:
                            </span>
                            <div className="text-right">
                              <strong
                                className={`block text-[13px] sm:text-sm font-black ${
                                  isExpired
                                    ? "text-slate-500"
                                    : "text-blue-700 dark:text-blue-300"
                                }`}
                              >
                                {unitDate
                                  ? formatBanglaDate(unitDate)
                                  : "ঘোষণার অপেক্ষায়"}
                              </strong>
                              <span className="block text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase">
                                {englishDateShort(unitDate) || "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-xs text-slate-700 dark:text-slate-300 py-2 text-center">
                      পরীক্ষার বিস্তারিত তারিখ শীঘ্রই প্রকাশিত হবে।
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== FOOTER ===== */}
            <div
              className={`shrink-0 p-2.5 sm:p-4 backdrop-blur-xs border-t flex items-center justify-between gap-2 ${
                isExpired
                  ? "bg-slate-100 dark:bg-slate-800/95 border-slate-300 dark:border-slate-700"
                  : "bg-slate-100 dark:bg-[#1e2530]/95 border-slate-300 dark:border-[#2a3344]"
              }`}
            >
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white dark:bg-[#232b3a] hover:bg-slate-200 dark:hover:bg-[#2a3344] text-slate-800 dark:text-slate-200 border border-slate-400 dark:border-[#333d4d] text-xs font-semibold transition-all shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                    <span>কপি লিংক</span>
                  </>
                )}
              </button>
              <a
                href={university.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 ${
                  isExpired
                    ? "bg-slate-500 hover:bg-slate-600"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                }`}
              >
                <GraduationCap
                  className={`w-4 h-4 shrink-0 ${
                    isExpired ? "text-slate-200" : "text-emerald-100"
                  }`}
                />
                <span>
                  {isExpired
                    ? "আগের সেশনের পোর্টাল"
                    : "আবেদন পোর্টাল (Apply Now)"}
                </span>
                <ExternalLink
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                    isExpired ? "text-slate-200" : "text-emerald-200"
                  }`}
                />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
