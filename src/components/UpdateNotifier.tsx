/**
 * UpdateNotifier — iOS-style system notification
 * ✅ স্বাভাবিক premium app-এর মতো: clean card, subtle shadow, no gimmicks
 * ✅ Tap = details modal • ✕ = dismiss • 8s পরে auto-hide
 * ✅ Light + dark dual mode, mobile-first width
 */
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useUniversityUpdates } from "../hooks/useUniversityUpdates";
import { UpdateDetailModal } from "./UpdateDetailModal";
import { formatBanglaDate } from "../lib/banglaUtils";
import { GraduationCap, X } from "lucide-react";

const AUTO_HIDE_MS = 8000;

export const UpdateNotifier: React.FC = () => {
  const { latestUpdate, dismissUpdate } = useUniversityUpdates();
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  /* নতুন update এলে আবার দেখাও */
  useEffect(() => {
    setVisible(true);
  }, [latestUpdate?.id]);

  /* auto-hide (modal খোলা থাকলে pause) */
  useEffect(() => {
    if (!latestUpdate || modalOpen || !visible) return;
    const t = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    return () => clearTimeout(t);
  }, [latestUpdate, modalOpen, visible]);

  if (!latestUpdate) return null;
  const examDate = latestUpdate.extracted_data?.exam_date;

  return (
    <>
      <AnimatePresence>
        {visible && !modalOpen && (
          <motion.div
            key={latestUpdate.id}
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -72, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="fixed top-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[420px] z-[95]"
          >
            <div
              role="status"
              onClick={() => setModalOpen(true)}
              className="flex items-start gap-3 rounded-2xl bg-white/95 dark:bg-[#1c2430]/95 backdrop-blur border border-slate-200/70 dark:border-white/10 shadow-lg shadow-slate-900/10 dark:shadow-black/40 p-3.5 cursor-pointer select-none"
            >
              {/* app icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>

              {/* text block */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] font-semibold text-slate-900 dark:text-white truncate">
                    ভর্তি পোর্টাল
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                    এইমাত্র
                  </span>
                </div>
                <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-snug mt-0.5 line-clamp-2">
                  {latestUpdate.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {latestUpdate.university_name}
                  {examDate && ` • পরীক্ষা ${formatBanglaDate(examDate)}`}
                </p>
              </div>

              {/* dismiss */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setVisible(false);
                  dismissUpdate(latestUpdate.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition shrink-0 cursor-pointer"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && (
        <UpdateDetailModal
          update={latestUpdate}
          onClose={() => {
            setModalOpen(false);
            dismissUpdate(latestUpdate.id);
          }}
        />
      )}
    </>
  );
};
