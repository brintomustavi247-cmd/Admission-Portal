import React from "react";
import { motion } from "motion/react";
import {
  ExternalLink,
  Calendar,
  MapPin,
  ChevronRight,
  Check,
  AlertTriangle,
  Zap,
  Calculator,
  Clock,
} from "lucide-react";
import { University, EligibilityEvaluation } from "../types/admission";
import { UrgencyBadge } from "./UrgencyBadge";
import { formatBanglaDate, formatBanglaGpa } from "../lib/banglaUtils";

interface UniversityCardProps {
  university: University & {
    latestBreakingUpdate?: {
      title: string;
      extracted_data?: {
        exam_date?: string;
        fees?: string;
        fee_amount?: string;
        exam_regions?: string[];
        calculator_allowed?: boolean | null;
        _session_year?: string;
        _is_expired?: boolean;
      };
    };
  };
  isSecondTimerMode: boolean;
  onOpenModal: (uni: University) => void;
  evaluation?: EligibilityEvaluation;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  isSecondTimerMode,
  onOpenModal,
  evaluation,
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    onOpenModal(university);
  };

  const nextExamUnit = university.examUnits?.[0];
  const logoText =
    university.logoLetter || university.shortName || university.name.charAt(0);
  const logoFontSize =
    logoText.length <= 2
      ? "text-base sm:text-lg font-black"
      : logoText.length === 3
        ? "text-sm sm:text-base font-black tracking-tight"
        : logoText.length === 4
          ? "text-xs sm:text-[13px] font-black tracking-tighter"
          : "text-[10px] sm:text-[11px] font-black tracking-tighter px-0.5";

  const breaking = university.latestBreakingUpdate;
  const regions = breaking?.extracted_data?.exam_regions || [];
  const calcAllowed = breaking?.extracted_data?.calculator_allowed;
  const sessionYear = breaking?.extracted_data?._session_year;
  const isExpired = breaking?.extracted_data?._is_expired === true;

  /* Expired হলে card dim হবে, active হলে normal */
  const cardOpacity = isExpired ? "opacity-90" : "";

  /* Ring color logic: expired = slate, active breaking = amber, normal = sky */
  const ringClass = isExpired
    ? "ring-2 ring-slate-400/40 border-slate-400 dark:border-slate-500/60"
    : breaking
      ? "ring-2 ring-amber-500/50 border-amber-400 dark:border-amber-500/60"
      : isSecondTimerMode
        ? "hover:border-emerald-400 dark:hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100/80 dark:hover:ring-emerald-950/50"
        : "hover:border-sky-400 dark:hover:border-sky-500 hover:ring-2 hover:ring-sky-100/80 dark:hover:ring-sky-950/50";

  /* Eligibility border */
  const eligibilityBorder =
    evaluation && evaluation.isEligible
      ? "border-emerald-300/90 dark:border-emerald-600/60 bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-slate-900"
      : evaluation && !evaluation.isEligible
        ? "border-slate-200/90 dark:border-[#2a3344] opacity-75"
        : "border-slate-200/90 dark:border-[#2a3344]";

  return (
    <motion.div
      id={`uni-card-${university.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className={`group relative bg-white dark:bg-[#1e2530] rounded-2xl border transition-all duration-300 p-4 sm:p-5 cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between ${cardOpacity} ${ringClass} ${eligibilityBorder}`}
    >
      <div>
        {/* ===== EXPIRED SESSION WARNING BANNER ===== */}
        {isExpired && sessionYear && (
          <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-slate-500/10 border border-slate-400/40 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">আগের সেশনের তথ্য ({sessionYear})</span>
            </div>
            <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-slate-500 text-white font-black tracking-wide">
              EXPIRED
            </span>
          </div>
        )}

        {/* ===== LIVE BREAKING ALERT BANNER (only for active) ===== */}
        {breaking && !isExpired && (
          <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-between gap-1.5 animate-in fade-in duration-300">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-300 truncate">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="truncate">{breaking.title}</span>
            </div>
            {breaking.extracted_data?.exam_date && (
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                {formatBanglaDate(breaking.extracted_data.exam_date)}
              </span>
            )}
          </div>
        )}

        {/* ===== HEADER: Logo + Name + Badges ===== */}
        <div className="flex items-start gap-3 mb-2.5 sm:mb-3">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 select-none text-center ${logoFontSize} ${
              university.logoBg || "bg-slate-700"
            } ${isExpired ? "opacity-70" : ""}`}
          >
            {logoText}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-sm sm:text-base font-bold leading-snug line-clamp-2 transition-colors ${
                  isExpired
                    ? "text-slate-600 dark:text-slate-400"
                    : "text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400"
                }`}
              >
                {university.name}
              </h3>
              <div className="hidden sm:block shrink-0">
                <UrgencyBadge
                  startDate={university.startDate}
                  endDate={university.endDate}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{university.location}</span>
              </span>
              <span>•</span>
              <span
                className={`font-medium px-1.5 py-0.5 rounded ${
                  isExpired
                    ? "text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-[#232b3a]"
                    : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#232b3a]"
                }`}
              >
                {university.categoryLabel}
              </span>

              {/* ===== SESSION YEAR BADGE ===== */}
              {sessionYear && (
                <span
                  className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${
                    isExpired
                      ? "text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600"
                      : "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800"
                  }`}
                >
                  সেশন: {sessionYear}
                </span>
              )}

              {university.circularStatus === "confirmed" && !isExpired && (
                <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 px-1.5 py-0.5 rounded text-[10px]">
                  তারিখ ঘোষিত
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ===== MOBILE URGENCY ===== */}
        <div className="sm:hidden flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2.5 rounded-xl bg-slate-50/90 dark:bg-[#232b3a]/80 border border-slate-100 dark:border-[#2a3344]">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            আবেদন সময়সীমা
          </span>
          <UrgencyBadge
            startDate={university.startDate}
            endDate={university.endDate}
          />
        </div>

        {/* ===== INFO GRID ===== */}
        <div className="grid grid-cols-2 gap-2.5 py-2.5 my-2 border-y border-slate-100 dark:border-[#2a3344] text-xs">
          {/* Minimum GPA */}
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
              নূন্যতম জিপিএ
            </span>
            <span
              className={`font-bold text-sm font-number ${
                isExpired
                  ? "text-slate-500 dark:text-slate-500"
                  : "text-slate-800 dark:text-slate-100"
              }`}
            >
              সর্বমোট {formatBanglaGpa(university.minGpa.combined)}
            </span>
          </div>

          {/* 2nd Timer */}
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
              ২য় বার সুযোগ
            </span>
            {university.secondTimerAllowed ? (
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  isExpired
                    ? "text-slate-500 dark:text-slate-500"
                    : "text-emerald-700 dark:text-emerald-400"
                }`}
              >
                <Check
                  className={`w-3.5 h-3.5 ${
                    isExpired
                      ? "text-slate-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                />
                সুযোগ আছে
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  isExpired
                    ? "text-slate-500 dark:text-slate-500"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                শুধুমাত্র ১ম বার
              </span>
            )}
          </div>

          {/* ===== VENUE / EXAM REGIONS ===== */}
          {regions.length > 0 && (
            <div
              className={`col-span-2 flex items-center gap-1.5 p-2 rounded-lg mt-1 border ${
                isExpired
                  ? "bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  : "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-slate-600 dark:text-slate-300"
              }`}
            >
              <MapPin
                className={`w-3.5 h-3.5 shrink-0 ${
                  isExpired
                    ? "text-slate-500"
                    : "text-indigo-600 dark:text-indigo-400"
                }`}
              />
              <span className="truncate text-[11px]">
                পরীক্ষার কেন্দ্র:{" "}
                <strong
                  className={
                    isExpired
                      ? "text-slate-600 dark:text-slate-400"
                      : "text-indigo-800 dark:text-indigo-200"
                  }
                >
                  {regions.length}টি বিভাগ
                </strong>
                <span
                  className={`ml-1 ${
                    isExpired
                      ? "text-slate-500"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  ({regions.slice(0, 3).join(", ")}
                  {regions.length > 3 ? "..." : ""})
                </span>
              </span>
            </div>
          )}

          {/* ===== CALCULATOR POLICY ===== */}
          {calcAllowed !== null && calcAllowed !== undefined && (
            <div
              className={`col-span-2 flex items-center gap-1.5 p-2 rounded-lg mt-1 border text-[11px] ${
                isExpired
                  ? "bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  : calcAllowed
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200"
              }`}
            >
              {calcAllowed ? (
                <>
                  <Calculator
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isExpired
                        ? "text-slate-500"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  />
                  <span>
                    🧮 ক্যালকুলেটর <strong>ব্যবহার করা যাবে</strong>
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isExpired
                        ? "text-slate-500"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  />
                  <span>
                    🧮 ক্যালকুলেটর <strong>নিষিদ্ধ</strong>
                  </span>
                </>
              )}
            </div>
          )}

          {/* ===== NEXT EXAM DATE ===== */}
          {(breaking?.extracted_data?.exam_date || nextExamUnit) && (
            <div
              className={`col-span-2 flex items-center gap-1.5 p-2 rounded-lg mt-1 ${
                isExpired
                  ? "bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-500"
                  : "bg-slate-50 dark:bg-[#232b3a]/80 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Calendar
                className={`w-3.5 h-3.5 shrink-0 ${
                  isExpired
                    ? "text-slate-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              />
              <span className="truncate">
                পরীক্ষা:{" "}
                <strong
                  className={
                    isExpired
                      ? "text-slate-500 dark:text-slate-500"
                      : "text-slate-800 dark:text-slate-100"
                  }
                >
                  {breaking?.extracted_data?.exam_date
                    ? formatBanglaDate(breaking.extracted_data.exam_date)
                    : `${nextExamUnit?.unit} (${formatBanglaDate(nextExamUnit?.examDate)})`}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===== FOOTER ACTIONS ===== */}
      <div className="pt-2 flex items-center justify-between gap-2 mt-2">
        <button
          type="button"
          onClick={() => onOpenModal(university)}
          className={`text-xs font-bold flex items-center gap-1 py-1 cursor-pointer ${
            isExpired
              ? "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              : "text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300"
          }`}
        >
          <span>{isExpired ? "আগের তথ্য দেখুন" : "বিস্তারিত সময়সূচি"}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <a
          href={university.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-semibold text-xs transition-all shadow-sm active:scale-95 ${
            isExpired
              ? "bg-slate-500 hover:bg-slate-600 opacity-75"
              : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
          }`}
        >
          <span>{isExpired ? "আগের পোর্টাল" : "আবেদন পোর্টাল"}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
};
