/**
 * UpdateNotifier v3 — "BREAKING NEWS STRIP"
 * ✅ Top-center slim horizontal bar (TV breaking-news style)
 * ✅ Severity rail (লাল/হলুদ/নীল) + ping dot + auto-hide progress line
 * ✅ Tap strip বা "দেখুন" → detail modal; modal বন্ধ হলে seen mark
 * ✅ Mobile-light: কোনো blur orb নেই, শুধু ১টা backdrop-blur bar
 */
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useUniversityUpdates } from "../hooks/useUniversityUpdates";
import { UpdateDetailModal } from "./UpdateDetailModal";
import { formatBanglaDate } from "../lib/banglaUtils";
import {
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  CalendarDays,
  X,
  Zap,
} from "lucide-react";

const SHOW_MS = 12000;

const SEV: Record<
  string,
  { rail: string; chip: string; icon: React.ReactNode; label: string }
> = {
  urgent: {
    rail: "from-rose-500 to-orange-500",
    chip: "bg-rose-500/20 text-rose-300",
    icon: <Zap className="w-4 h-4" />,
    label: "ব্রেকিং",
  },
  important: {
    rail: "from-amber-400 to-yellow-500",
    chip: "bg-amber-500/20 text-amber-300",
    icon: <AlertTriangle className="w-4 h-4" />,
    label: "গুরুত্বপূর্ণ",
  },
  normal: {
    rail: "from-sky-500 to-indigo-500",
    chip: "bg-sky-500/20 text-sky-300",
    icon: <BellRing className="w-4 h-4" />,
    label: "নতুন",
  },
};

export const UpdateNotifier: React.FC = () => {
  const { latestUpdate, dismissUpdate } = useUniversityUpdates();
  const [modalOpen, setModalOpen] = useState(false);

  /* auto-hide (modal খোলা থাকলে pause) */
  useEffect(() => {
    if (!latestUpdate || modalOpen) return;
    const t = setTimeout(() => dismissUpdate(latestUpdate.id), SHOW_MS);
    return () => clearTimeout(t);
  }, [latestUpdate, modalOpen, dismissUpdate]);

  if (!latestUpdate) return null;

  const sev = SEV[latestUpdate.severity] || SEV.normal;
  const examDate = latestUpdate.extracted_data?.exam_date;

  const closeDetail = () => {
    setModalOpen(false);
    dismissUpdate(latestUpdate.id);
  };

  return (
    <>
      <AnimatePresence>
        {!modalOpen && (
          <motion.div
            key={latestUpdate.id}
            initial={{ y: -90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed top-2 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-[560px] z-[95]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-xl shadow-2xl shadow-black/60">
              {/* severity rail (বাঁয়ে) */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${sev.rail}`}
              />

              <div className="flex items-center gap-2.5 pl-4 pr-2 py-2.5">
                {/* icon + ping */}
                <div
                  className={`relative w-9 h-9 rounded-xl bg-gradient-to-br ${sev.rail} flex items-center justify-center text-white shrink-0 shadow-lg`}
                >
                  {sev.icon}
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
                </div>

                {/* headline (tap = detail) */}
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="flex-1 min-w-0 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${sev.chip}`}
                    >
                      {sev.label}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 truncate">
                      {latestUpdate.university_name}
                    </span>
                  </div>
                  <p className="text-[12px] font-black text-white truncate mt-0.5">
                    {latestUpdate.title}
                  </p>
                </button>

                {/* date chip (desktop) */}
                {examDate && (
                  <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-1 rounded-lg shrink-0">
                    <CalendarDays className="w-3 h-3" />
                    {formatBanglaDate(examDate)}
                  </span>
                )}

                {/* actions */}
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-sky-100 text-slate-900 text-[10px] font-black cursor-pointer active:scale-95 transition-all"
                >
                  দেখুন <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => dismissUpdate(latestUpdate.id)}
                  className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
                  title="বন্ধ করো"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* auto-hide progress line */}
              <motion.div
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${sev.rail}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: SHOW_MS / 1000, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && (
        <UpdateDetailModal update={latestUpdate} onClose={closeDetail} />
      )}
    </>
  );
};
