/**
 * UpdateNotifier v6 — DEEP MIDNIGHT INDIGO + CYAN + GOLD
 * ✅ গভীর navy-indigo gradient base (হালকা না — deep & rich)
 * ✅ Cyan glow icon + gold date chip + indigo glass chips
 * ✅ Pop-in spring + cyan progress line + 10s auto-hide
 */
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useUniversityUpdates } from "../hooks/useUniversityUpdates";
import { UpdateDetailModal } from "./UpdateDetailModal";
import { formatBanglaDate } from "../lib/banglaUtils";
import { ArrowRight, BellRing, CalendarDays, X, Zap } from "lucide-react";

const SHOW_MS = 10000;

export const UpdateNotifier: React.FC = () => {
  const { latestUpdate, dismissUpdate } = useUniversityUpdates();
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [latestUpdate?.id]);

  useEffect(() => {
    if (!latestUpdate || modalOpen || !visible) return;
    const t = setTimeout(() => setVisible(false), SHOW_MS);
    return () => clearTimeout(t);
  }, [latestUpdate, modalOpen, visible]);

  if (!latestUpdate) return null;
  const examDate = latestUpdate.extracted_data?.exam_date;
  const urgent = latestUpdate.severity === "urgent";
  const important = latestUpdate.severity === "important";

  return (
    <>
      <AnimatePresence>
        {visible && !modalOpen && (
          <motion.div
            key={latestUpdate.id}
            initial={{ y: 90, scale: 0.88, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 70, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 480, damping: 26 }}
            className="fixed bottom-24 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-[400px] z-[95]"
          >
            {/* ===== DEEP MIDNIGHT CARD ===== */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-[#0a0f2c] via-[#141b45] to-[#1b1040] shadow-2xl shadow-indigo-950/60">
              {/* top spectrum strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />
              {/* deep cyan shine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(340px 140px at 88% -12%, rgba(34,211,238,0.22), transparent 62%), radial-gradient(260px 120px at -10% 110%, rgba(168,85,247,0.18), transparent 60%)",
                }}
              />
              {/* auto-hide progress */}
              <motion.div
                className="absolute top-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: SHOW_MS / 1000, ease: "linear" }}
              />

              <div className="relative p-4 pt-4.5">
                <div className="flex items-start gap-3">
                  {/* cyan glow icon */}
                  <div className="relative w-11 h-11 rounded-xl bg-indigo-500/25 border border-indigo-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-inner shadow-indigo-950/50">
                    <BellRing className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-400/15 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                        নতুন আপডেট
                      </span>
                      {urgent && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> জরুরি
                        </span>
                      )}
                      {important && !urgent && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-300/30">
                          গুরুত্বপূর্ণ
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] font-black text-indigo-50 leading-snug line-clamp-2 drop-shadow-sm">
                      {latestUpdate.title}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      <span className="text-[9px] font-bold text-indigo-100 bg-white/10 border border-white/15 px-2 py-0.5 rounded-lg truncate max-w-[60%]">
                        {latestUpdate.university_name}
                      </span>
                      {examDate && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-300 bg-amber-400/15 border border-amber-300/30 px-2 py-0.5 rounded-lg shrink-0">
                          <CalendarDays className="w-3 h-3" />
                          {formatBanglaDate(examDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setVisible(false);
                      dismissUpdate(latestUpdate.id);
                    }}
                    className="p-1.5 rounded-lg text-indigo-300/60 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
                    title="বন্ধ করো"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/50 active:scale-95 transition cursor-pointer"
                  >
                    বিস্তারিত দেখুন <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisible(false);
                      dismissUpdate(latestUpdate.id);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-indigo-100 text-[11px] font-bold transition cursor-pointer"
                  >
                    পরে দেখব
                  </button>
                </div>
              </div>
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
