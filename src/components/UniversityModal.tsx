import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  MapPin,
  Check,
  AlertTriangle,
  Copy,
  CheckCircle2,
  BookOpen,
  School,
  Info,
} from 'lucide-react';
import { University } from '../types/admission';
import { UrgencyBadge } from './UrgencyBadge';
import { toBanglaNum, formatBanglaDate, calculateUrgency, formatBanglaGpa } from '../lib/banglaUtils';

interface UniversityModalProps {
  university: University | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UniversityModal: React.FC<UniversityModalProps> = ({
  university,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!university) return null;

  const urgency = calculateUrgency(university.startDate, university.endDate);

  const logoText = university.logoLetter || university.shortName || university.name.charAt(0);
  const modalLogoFontSize =
    logoText.length <= 2
      ? 'text-lg sm:text-2xl font-black'
      : logoText.length === 3
      ? 'text-base sm:text-xl font-black tracking-tight'
      : logoText.length === 4
      ? 'text-xs sm:text-base font-black tracking-tight'
      : 'text-[11px] sm:text-sm font-black tracking-tighter px-0.5';

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card - Flex column with max-height and sticky footer */}
          <motion.div
            id="university-detail-modal"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#1e2530] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-[#2a3344] overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col transition-colors"
          >
            {/* Header - Compact on mobile */}
            <div className="shrink-0 relative bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-3.5 sm:p-6">
              {/* Close Button */}
              <button
                id="btn-close-modal"
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-start gap-2.5 sm:gap-4 pr-7 sm:pr-8">
                {/* University Logo Monogram with Acronym */}
                <div
                  className={`w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md border border-white/20 shrink-0 text-center select-none ${modalLogoFontSize} ${
                    university.logoBg || 'bg-sky-600'
                  }`}
                >
                  {logoText}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
                      {university.categoryLabel}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-300 shrink-0" />
                      <span className="truncate">{university.location}</span>
                    </span>
                  </div>

                  <h2 className="text-base sm:text-2xl font-bold tracking-tight text-white leading-tight">
                    {university.name}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-300 truncate mt-0.5">
                    {university.englishName}
                  </p>
                </div>
              </div>

              {/* Urgency Highlight Banner inside modal header */}
              <div className="mt-2.5 pt-2 sm:mt-3.5 sm:pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-1.5 text-[11px] sm:text-xs">
                <div className="flex items-center gap-1.5 text-slate-200 min-w-0">
                  <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="truncate">
                    আবেদন:{' '}
                    <strong className="text-white font-medium">
                      {formatBanglaDate(university.startDate)} – {formatBanglaDate(university.endDate)}
                    </strong>
                  </span>
                </div>

                <div className="shrink-0">
                  <UrgencyBadge startDate={university.startDate} endDate={university.endDate} />
                </div>
              </div>
            </div>

            {/* Modal Body - Scrollable content with compact padding */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3 sm:space-y-4">
              {/* Important Timeline Cards - Compact 3-Column Grid on Mobile */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-[#232b3a]/80 border border-slate-200/80 dark:border-[#333d4d] text-center">
                  <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block mb-0.5">আবেদন শুরু</span>
                  <div className="font-bold text-slate-800 dark:text-slate-100 text-[11px] sm:text-sm truncate">
                    {formatBanglaDate(university.startDate)}
                  </div>
                </div>

                <div className="p-2 sm:p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center">
                  <span className="text-[10px] sm:text-xs text-amber-800 dark:text-amber-300 font-semibold block mb-0.5">
                    শেষ তারিখ
                  </span>
                  <div className="font-bold text-amber-950 dark:text-amber-100 text-[11px] sm:text-sm truncate">
                    {formatBanglaDate(university.endDate)}
                  </div>
                </div>

                <div className="p-2 sm:p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-center">
                  <span className="text-[10px] sm:text-xs text-sky-800 dark:text-sky-300 font-semibold block mb-0.5">
                    প্রবেশপত্র
                  </span>
                  <div className="font-bold text-sky-950 dark:text-sky-100 text-[11px] sm:text-sm truncate">
                    {formatBanglaDate(university.admitCardDate)}
                  </div>
                </div>
              </div>

              {/* 2nd Timer Rule Highlight */}
              <div
                className={`p-2.5 sm:p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  university.secondTimerAllowed
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100'
                    : 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-100'
                }`}
              >
                {university.secondTimerAllowed ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="font-bold text-xs sm:text-sm">
                      {university.secondTimerAllowed
                        ? '২য় বার সুযোগ অনুমোদিত (2nd Timer)'
                        : '২য় বার সুযোগ নেই (শুধুমাত্র ১ম বার)'}
                    </div>
                    {university.eligibleHscBatches && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#232b3a] border border-slate-200 dark:border-[#333d4d] text-slate-800 dark:text-slate-200">
                        ব্যাচ: {university.eligibleHscBatches}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs mt-0.5 opacity-90 leading-relaxed text-slate-700 dark:text-slate-300">
                    {university.secondTimerDeduction ||
                      (university.secondTimerAllowed
                        ? 'মেধা তালিকায় যোগ্য হলে ২য় বার আবেদন করা যাবে।'
                        : 'শুধুমাত্র চলতি শিক্ষাবর্ষের নিয়মিত শিক্ষার্থীরা অংশ নিতে পারবে।')}
                  </p>
                  {university.statusNote && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-[#333d4d] text-[10px] sm:text-[11px] font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 shrink-0" />
                      <span className="truncate">{university.statusNote}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Minimum GPA & Subject Requirements */}
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-[#232b3a]/60 border border-slate-200/90 dark:border-[#333d4d]">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>নূন্যতম জিপিএ ও প্রয়োজনীয় বিষয়</span>
                </h3>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center mb-2">
                  <div className="bg-white dark:bg-[#232b3a] p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-[#333d4d]">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">এসএসসি জিপিএ</span>
                    <strong className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-bold font-number">
                      {formatBanglaGpa(university.minGpa.ssc)}
                    </strong>
                  </div>
                  <div className="bg-white dark:bg-[#232b3a] p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-[#333d4d]">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">এইচএসসি জিপিএ</span>
                    <strong className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-bold font-number">
                      {formatBanglaGpa(university.minGpa.hsc)}
                    </strong>
                  </div>
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/40 p-1.5 sm:p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold block">
                      মোট জিপিএ
                    </span>
                    <strong className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-bold font-number">
                      {formatBanglaGpa(university.minGpa.combined)}
                    </strong>
                  </div>
                </div>

                {university.requiredSubjects && university.requiredSubjects.length > 0 && (
                  <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-1 mt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">আবশ্যকীয় বিষয়:</span>
                    {university.requiredSubjects.map((subj, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-[#232b3a] border border-slate-200 dark:border-[#333d4d] text-slate-700 dark:text-slate-300"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Exam Schedule Grid (Unit-wise) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>অনুষদ ও ইউনিট ভিত্তিক পরীক্ষার তারিখ</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    মোট {toBanglaNum(university.examUnits?.length || 0)}টি ইউনিট
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {university.examUnits && university.examUnits.length > 0 ? (
                    university.examUnits.map((unit, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 sm:p-3 rounded-xl border border-slate-200/90 dark:border-[#333d4d] hover:border-sky-300 dark:hover:border-sky-500 transition-colors bg-white dark:bg-[#232b3a] shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{unit.unit}</span>
                          {unit.fee && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                              {unit.fee}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{unit.title}</p>
                        <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-[#333d4d] flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400">পরীক্ষার তারিখ:</span>
                          <strong className="text-blue-700 dark:text-blue-400 font-semibold">
                            {formatBanglaDate(unit.examDate)}
                          </strong>
                        </div>
                        {unit.time && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{unit.time}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-xs text-slate-500 dark:text-slate-400 py-2 text-center">
                      পরীক্ষার বিস্তারিত তারিখ শীঘ্রই প্রকাশিত হবে।
                    </div>
                  )}
                </div>
              </div>

              {/* Application Process Guidelines */}
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-sky-50/40 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/60">
                <h3 className="text-xs sm:text-sm font-bold text-sky-950 dark:text-sky-200 mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>আবেদন প্রক্রিয়া ও নিয়মাবলী</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {university.applicationProcess}
                </p>
              </div>
            </div>

            {/* Modal Sticky Footer CTA - ALWAYS VISIBLE AT BOTTOM */}
            <div className="shrink-0 p-2.5 sm:p-4 bg-slate-50/95 dark:bg-[#1e2530]/95 backdrop-blur-xs border-t border-slate-200 dark:border-[#2a3344] flex items-center justify-between gap-2">
              <button
                id="btn-copy-admission-link"
                type="button"
                onClick={handleCopyLink}
                title="পোর্টাল লিংক কপি করুন"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white dark:bg-[#232b3a] hover:bg-slate-100 dark:hover:bg-[#2a3344] active:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-[#333d4d] text-xs font-semibold transition-all shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="hidden sm:inline">লিংক কপি হয়েছে!</span>
                    <span className="sm:hidden">কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="hidden sm:inline">পোর্টাল লিংক কপি করুন</span>
                    <span className="sm:hidden">কপি লিংক</span>
                  </>
                )}
              </button>

              <a
                id="btn-modal-apply-now"
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

