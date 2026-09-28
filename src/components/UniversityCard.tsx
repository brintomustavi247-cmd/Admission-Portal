import React from "react";
import { motion } from "motion/react";
import {
  ExternalLink,
  Calendar,
  MapPin,
  ChevronRight,
  Check,
  AlertTriangle,
  GraduationCap,
  Zap,
  Sparkles,
} from "lucide-react";
import { University, EligibilityEvaluation } from "../types/admission";
import { UrgencyBadge } from "./UrgencyBadge";
import {
  toBanglaNum,
  formatBanglaDate,
  formatBanglaGpa,
} from "../lib/banglaUtils";

interface UniversityCardProps {
  university: University & {
    latestBreakingUpdate?: {
      title: string;
      extracted_data?: {
        exam_date?: string;
        fees?: string;
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
  const hasBreaking = Boolean(breaking);

  return (
    <motion.div
      id={`uni-card-${university.id}`}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.99 }}
      onClick={handleCardClick}
      className={`group relative rounded-3xl overflow-hidden transition-all duration-300 p-4 sm:p-5 cursor-pointer flex flex-col justify-between backdrop-blur-xl ${
        hasBreaking
          ? "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30 border-2 border-amber-300/60 dark:border-amber-500/40 shadow-lg shadow-amber-500/10"
          : evaluation?.isEligible
            ? "bg-gradient-to-br from-emerald-50/80 via-white to-white dark:from-emerald-950/20 dark:via-[#1e2530] dark:to-[#1e2530] border-2 border-emerald-300/60 dark:border-emerald-600/40 shadow-lg shadow-emerald-500/10"
            : evaluation && !evaluation.isEligible
              ? "bg-white/50 dark:bg-[#1e2530]/50 border border-slate-200/60 dark:border-white/5 opacity-60"
              : "bg-white/95 dark:bg-[#1e2530]/95 border border-slate-200/80 dark:border-white/10 shadow-md hover:shadow-xl"
      }`}
    >
      {/* Animated gradient border for breaking updates */}
      {hasBreaking && (
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-60 pointer-events-none"
          animate={{
            background: [
              "linear-gradient(0deg, rgba(245,158,11,0.15) 0%, rgba(239,68,68,0.15) 100%)",
              "linear-gradient(180deg, rgba(245,158,11,0.15) 0%, rgba(239,68,68,0.15) 100%)",
              "linear-gradient(360deg, rgba(245,158,11,0.15) 0%, rgba(239,68,68,0.15) 100%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Eligibility indicator strip */}
      {evaluation?.isEligible && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
      )}

      <div className="relative">
        {/* Live Breaking Alert Banner */}
        {breaking && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 dark:from-amber-500/30 dark:via-orange-500/25 dark:to-rose-500/20 border border-amber-400/50 dark:border-amber-500/40 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 dark:text-amber-200 truncate min-w-0">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              </motion.div>
              <span className="truncate">{breaking.title}</span>
            </div>
            {breaking.extracted_data?.exam_date && (
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black shadow-sm">
                {formatBanglaDate(breaking.extracted_data.exam_date)}
              </span>
            )}
          </motion.div>
        )}

        {/* Header: Logo + Name + Urgency */}
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 select-none text-center ${logoFontSize} ${
              university.logoBg || "bg-slate-700"
            } ring-2 ring-white/20 dark:ring-white/10`}
          >
            {logoText}
          </motion.div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug line-clamp-2">
                {university.name}
              </h3>
              <div className="hidden sm:block shrink-0">
                <UrgencyBadge
                  startDate={university.startDate}
                  endDate={university.endDate}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[100px]">
                  {university.location}
                </span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#232b3a] px-1.5 py-0.5 rounded-md">
                {university.categoryLabel}
              </span>
              {university.circularStatus === "confirmed" && (
                <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> ঘোষিত
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Urgency */}
        <div className="sm:hidden flex items-center justify-between gap-2 px-3 py-2 mb-3 rounded-xl bg-slate-50/90 dark:bg-[#232b3a]/80 border border-slate-100 dark:border-[#2a3344]">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
            আবেদন সময়সীমা
          </span>
          <UrgencyBadge
            startDate={university.startDate}
            endDate={university.endDate}
          />
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 my-2 border-y border-slate-200/60 dark:border-white/5">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold uppercase tracking-wider">
              নূন্যতম জিপিএ
            </span>
            <span className="font-black text-slate-900 dark:text-white text-sm font-number">
              {formatBanglaGpa(university.minGpa.combined)}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold uppercase tracking-wider">
              ২য় বার সুযোগ
            </span>
            {university.secondTimerAllowed ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                আছে
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-slate-500 dark:text-slate-400 text-sm">
                <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                ১ম বার
              </span>
            )}
          </div>

          {(breaking?.extracted_data?.exam_date || nextExamUnit) && (
            <div className="col-span-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/40 dark:to-blue-950/40 p-2.5 rounded-xl mt-1 border border-sky-200/60 dark:border-sky-800/40">
              <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">
                পরীক্ষা:{" "}
                <strong className="text-slate-900 dark:text-white font-black">
                  {breaking?.extracted_data?.exam_date
                    ? formatBanglaDate(breaking.extracted_data.exam_date)
                    : `${nextExamUnit?.unit} (${formatBanglaDate(nextExamUnit?.examDate)})`}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-2 mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(university);
          }}
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1 py-1.5 cursor-pointer group/btn"
        >
          <span>বিস্তারিত</span>
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.span>
        </button>

        <a
          href={university.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30"
        >
          <span>আবেদন</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
};
