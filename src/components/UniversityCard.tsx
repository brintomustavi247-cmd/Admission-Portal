import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, BookOpen, MapPin, ChevronRight, Check, AlertTriangle, Info, GraduationCap } from 'lucide-react';
import { University, EligibilityEvaluation } from '../types/admission';
import { UrgencyBadge } from './UrgencyBadge';
import { toBanglaNum, formatBanglaDate, formatBanglaGpa } from '../lib/banglaUtils';

interface UniversityCardProps {
  university: University;
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
    // If the click came from an explicit button or anchor, let that handle it
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }

    // Always show university details modal first on card click
    onOpenModal(university);
  };

  const nextExamUnit = university.examUnits?.[0];

  const logoText = university.logoLetter || university.shortName || university.name.charAt(0);
  const logoFontSize =
    logoText.length <= 2
      ? 'text-base sm:text-lg font-black'
      : logoText.length === 3
      ? 'text-sm sm:text-base font-black tracking-tight'
      : logoText.length === 4
      ? 'text-xs sm:text-[13px] font-black tracking-tighter'
      : 'text-[10px] sm:text-[11px] font-black tracking-tighter px-0.5';

  return (
    <motion.div
      id={`uni-card-${university.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className={`group relative bg-white dark:bg-[#1e2530] rounded-2xl border transition-all duration-300 p-4 sm:p-5 cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between ${
        isSecondTimerMode
          ? 'hover:border-emerald-400 dark:hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100/80 dark:hover:ring-emerald-950/50'
          : 'hover:border-sky-400 dark:hover:border-sky-500 hover:ring-2 hover:ring-sky-100/80 dark:hover:ring-sky-950/50'
      } ${
        evaluation && evaluation.isEligible
          ? 'border-emerald-300/90 dark:border-emerald-600/60 bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-slate-900'
          : evaluation && !evaluation.isEligible
          ? 'border-slate-200/90 dark:border-[#2a3344] opacity-75'
          : 'border-slate-200/90 dark:border-[#2a3344]'
      }`}
    >
      {/* Top Banner / Identity Section */}
      <div>
        <div className="flex items-start gap-3 mb-2.5 sm:mb-3">
          {/* Logo Monogram Avatar with Short Form Acronym */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 select-none text-center ${logoFontSize} ${
              university.logoBg || 'bg-slate-700'
            }`}
          >
            {logoText}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug line-clamp-2">
                {university.name}
              </h3>

              {/* Desktop Urgency Badge */}
              <div className="hidden sm:block shrink-0">
                <UrgencyBadge startDate={university.startDate} endDate={university.endDate} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{university.location}</span>
              </span>
              <span>•</span>
              <span className="font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#232b3a] px-1.5 py-0.5 rounded">
                {university.categoryLabel}
              </span>
              {university.circularStatus === 'confirmed' && (
                <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 px-1.5 py-0.5 rounded text-[10px]">
                  তারিখ ঘোষিত
                </span>
              )}
              {university.circularStatus === 'reported' && (
                <span className="font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800 px-1.5 py-0.5 rounded text-[10px]">
                  সম্ভাব্য সূচি
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Urgency & Deadline Strip */}
        <div className="sm:hidden flex items-center justify-between gap-2 px-2.5 py-1.5 mb-2.5 rounded-xl bg-slate-50/90 dark:bg-[#232b3a]/80 border border-slate-100 dark:border-[#2a3344]">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">আবেদন সময়সীমা</span>
          <UrgencyBadge startDate={university.startDate} endDate={university.endDate} />
        </div>

        {/* Eligibility Match Bar if evaluated */}
        {evaluation && (
          <div className="mb-3.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#232b3a]/70 border border-slate-100 dark:border-[#2a3344] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className={evaluation.isEligible ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}>
                {evaluation.isEligible ? 'আপনি আবেদনের যোগ্য!' : 'শর্ত পূরণ হয়নি'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    evaluation.isEligible ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${evaluation.matchScore}%` }}
                />
              </div>
              <span className="text-xs font-bold font-number text-slate-700 dark:text-slate-200">
                {toBanglaNum(evaluation.matchScore)}%
              </span>
            </div>
          </div>
        )}

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-2.5 my-2 border-y border-slate-100 dark:border-[#2a3344] text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">নূন্যতম জিপিএ</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm font-number">
              সর্বমোট {formatBanglaGpa(university.minGpa.combined)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">২য় বার পরীক্ষার্থী</span>
            {university.secondTimerAllowed ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                সুযোগ আছে
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
                <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                শুধুমাত্র ১ম বার
              </span>
            )}
          </div>

          {nextExamUnit && (
            <div className="col-span-2 flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#232b3a]/80 p-2 rounded-lg mt-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate">
                পরীক্ষা: <strong className="text-slate-800 dark:text-slate-100">{nextExamUnit.unit}</strong> (
                {formatBanglaDate(nextExamUnit.examDate)})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="pt-2 flex items-center justify-between gap-2 mt-2">
        {isSecondTimerMode ? (
          <>
            <button
              id={`btn-view-modal-${university.id}`}
              type="button"
              onClick={() => onOpenModal(university)}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1 py-1 group/btn cursor-pointer"
            >
              <span>বিস্তারিত সময়সূচি</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <a
              id={`btn-apply-direct-${university.id}`}
              href={university.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>আবেদন পোর্টাল</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          <>
            <button
              id={`btn-view-modal-${university.id}`}
              type="button"
              onClick={() => onOpenModal(university)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1 py-1 group/btn cursor-pointer"
            >
              <span>বিস্তারিত সময়সূচি</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <a
              id={`btn-apply-${university.id}`}
              href={university.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 active:scale-95 text-white font-semibold text-xs transition-all shadow-sm"
            >
              <span>আবেদন পোর্টাল</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        )}
      </div>
    </motion.div>
  );
};
