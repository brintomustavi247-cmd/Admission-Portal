import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!university) return null;

  const breaking = university.latestBreakingUpdate;
  const liveExamDate = breaking?.extracted_data?.exam_date || "";
  const appStart =
    breaking?.extracted_data?.application_start || university.startDate;
  const appEnd =
    breaking?.extracted_data?.application_end || university.endDate;
  const firstExam = liveExamDate || university.examUnits?.[0]?.examDate || "";

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
            className="relative w-full max-w-2xl bg-white dark:bg-[#1e2530] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-[#2a3344] overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col transition-colors"
          >
            <div className="shrink-0 relative bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-3.5 sm:p-6">
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
                  className={`w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md border border-white/20 shrink-0 text-center select-none ${modalLogoFontSize} ${university.logoBg || "bg-sky-600"}`}
                >
                  {logoText}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-100 border border-sky-400/30">
                      {university.categoryLabel}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-300 shrink-0" />
                      <span className="truncate">{university.location}</span>
                    </span>
                  </div>
                  <h2 className="text-base sm:text-2xl font-bold tracking-tight text-white leading-tight">
                    {university.name}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-200 truncate mt-0.5">
                    {university.englishName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3 sm:space-y-4">
              {breaking && (
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

              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-slate-100 dark:bg-[#232b3a]/80 border border-slate-300 dark:border-[#333d4d] text-center">
                  <span className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-0.5">
                    আবেদন শুরু
                  </span>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] sm:text-sm truncate">
                    {formatBanglaDate(appStart)}
                  </div>
                  <div className="text-[9px] font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase truncate">
                    {englishDateShort(appStart) || "—"}
                  </div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-center">
                  <span className="text-[10px] sm:text-xs text-amber-900 dark:text-amber-300 font-semibold block mb-0.5">
                    শেষ তারিখ
                  </span>
                  <div className="font-bold text-amber-950 dark:text-amber-100 text-[11px] sm:text-sm truncate">
                    {formatBanglaDate(appEnd)}
                  </div>
                  <div className="text-[9px] font-bold text-amber-800 dark:text-amber-400/70 tracking-wider uppercase truncate">
                    {englishDateShort(appEnd) || "—"}
                  </div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-sky-100 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800/60 text-center">
                  <span className="text-[10px] sm:text-xs text-sky-900 dark:text-sky-300 font-semibold block mb-0.5">
                    পরীক্ষার তারিখ
                  </span>
                  <div className="font-bold text-sky-950 dark:text-sky-100 text-[11px] sm:text-sm truncate">
                    {firstExam
                      ? formatBanglaDate(firstExam)
                      : "ঘোষণার অপেক্ষায়"}
                  </div>
                  <div className="text-[9px] font-bold text-sky-800 dark:text-sky-400/70 tracking-wider uppercase truncate">
                    {englishDateShort(firstExam) || "—"}
                  </div>
                </div>
              </div>

              <div
                className={`p-2.5 sm:p-3.5 rounded-xl border-2 flex items-start gap-2.5 ${university.secondTimerAllowed ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100" : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 text-amber-950 dark:text-amber-100"}`}
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

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-100 dark:bg-[#232b3a]/60 border border-slate-300 dark:border-[#333d4d]">
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

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>অনুষদ ও ইউনিট ভিত্তিক পরীক্ষার তারিখ</span>
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
                          className="p-2.5 sm:p-3 rounded-xl border border-slate-300 dark:border-[#333d4d] bg-white dark:bg-[#232b3a]"
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${UNIT_COLORS[idx % UNIT_COLORS.length]} flex items-center justify-center text-white text-sm sm:text-base font-black shrink-0 shadow-sm select-none`}
                            >
                              {unitInitial(unit.unit)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1.5">
                                <span className="font-black text-slate-900 dark:text-white text-[13px] sm:text-sm leading-snug">
                                  {unit.unit}
                                  {enLetter && (
                                    <span className="ml-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                      ({enLetter})
                                    </span>
                                  )}
                                </span>
                                {fee ? (
                                  <span className="shrink-0 text-[10px] sm:text-[11px] px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-black whitespace-nowrap">
                                    {fee.startsWith("৳") ? fee : `৳ ${fee}`}
                                    {digitsOnly(fee) && (
                                      <span className="ml-1 font-semibold opacity-70">
                                        ({digitsOnly(fee)})
                                      </span>
                                    )}
                                  </span>
                                ) : (
                                  <span className="shrink-0 text-[10px] px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold whitespace-nowrap">
                                    ফি ঘোষণার অপেক্ষায়
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
                                {unit.title}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-[#333d4d] flex items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                              পরীক্ষার তারিখ:
                            </span>
                            <div className="text-right">
                              <strong className="block text-[13px] sm:text-sm font-black text-blue-700 dark:text-blue-300">
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

            <div className="shrink-0 p-2.5 sm:p-4 bg-slate-100 dark:bg-[#1e2530]/95 backdrop-blur-xs border-t border-slate-300 dark:border-[#2a3344] flex items-center justify-between gap-2">
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
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-emerald-100 shrink-0" />
                <span>আবেদন পোর্টাল (Apply Now)</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200 shrink-0" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
