/**
 * UpdateNotifier v5 — SKY BLUE premium (app brand color)
 * ✅ পুরো card আকাশী-নীল gradient — header/logo-এর সাথে match
 * ✅ Severity শুধু ছোট badge-এ (🚨 জরুরি = লাল pill), পুরো card নয়
 * ✅ Pop-in spring + সাদা progress line + 10s auto-hide
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
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 border border-sky-300/40 shadow-2xl shadow-sky-950/50">
              {/* shine highlight */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(320px 130px at 88% -12%, rgba(255,255,255,0.30), transparent 62%)",
                }}
              />
              {/* auto-hide progress line */}
              <motion.div
                className="absolute top-0 left-0 h-1 bg-white/70"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: SHOW_MS / 1000, ease: "linear" }}
              />

              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  {/* bell icon + ping */}
                  <div className="relative w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
                    <BellRing className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-900 bg-white/90 px-2 py-0.5 rounded-full">
                        নতুন আপডেট
                      </span>
                      {urgent && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white border border-red-300/50 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> জরুরি
                        </span>
                      )}
                      {important && !urgent && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                          গুরুত্বপূর্ণ
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-black text-white leading-snug line-clamp-2 drop-shadow-sm">
                      {latestUpdate.title}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      <span className="text-[9px] font-bold text-white bg-white/15 border border-white/25 px-2 py-0.5 rounded-lg truncate max-w-[60%]">
                        {latestUpdate.university_name}
                      </span>
                      {examDate && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-sky-700 bg-white/95 px-2 py-0.5 rounded-lg shrink-0">
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
                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition shrink-0 cursor-pointer"
                    title="বন্ধ করো"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-sky-50 text-sky-700 text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
                  >
                    বিস্তারিত দেখুন <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisible(false);
                      dismissUpdate(latestUpdate.id);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-[11px] font-bold transition cursor-pointer"
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
