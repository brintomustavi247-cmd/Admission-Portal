import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUniversityUpdates } from "../hooks/useUniversityUpdates";
import { UpdateDetailModal } from "./UpdateDetailModal";
import { formatBanglaDate } from "../lib/banglaUtils";
import {
  X,
  ArrowRight,
  BellRing,
  Calendar,
  ShieldCheck,
  Link2,
} from "lucide-react";

type Severity = "urgent" | "important" | "normal";

/* severity অনুযায়ী color theme */
const ACCENTS: Record<
  Severity,
  {
    border: string;
    bar: string;
    chip: string;
    icon: string;
    dot: string;
    glow: string;
    label: string;
  }
> = {
  urgent: {
    border: "border-rose-400/40",
    bar: "from-rose-500 via-orange-500 to-amber-400",
    chip: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    icon: "text-rose-300",
    dot: "bg-rose-400",
    glow: "shadow-rose-950/50",
    label: "🚨 জরুরি আপডেট",
  },
  important: {
    border: "border-amber-400/40",
    bar: "from-amber-400 via-orange-400 to-yellow-300",
    chip: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    icon: "text-amber-300",
    dot: "bg-amber-400",
    glow: "shadow-amber-950/40",
    label: "❗ গুরুত্বপূর্ণ",
  },
  normal: {
    border: "border-sky-400/40",
    bar: "from-sky-400 via-blue-500 to-violet-500",
    chip: "bg-sky-500/15 text-sky-300 border-sky-400/30",
    icon: "text-sky-300",
    dot: "bg-sky-400",
    glow: "shadow-sky-950/50",
    label: "🔔 নতুন তথ্য",
  },
};

export const UpdateNotifier: React.FC = () => {
  const { latestUpdate, dismissUpdate } = useUniversityUpdates();
  const [modalOpen, setModalOpen] = useState(false);

  const u = latestUpdate;
  const a = ACCENTS[(u?.severity as Severity) || "normal"];
  const verified = !!u?.extracted_data?._verified;
  const sources: number = u?.source_urls?.length || 0;

  return (
    <>
      <AnimatePresence>
        {u && (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 64, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-24 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-[60] sm:max-w-md"
          >
            <div
              className={`relative overflow-hidden rounded-2xl bg-[#0b1220]/95 border ${a.border} shadow-2xl ${a.glow}`}
            >
              {/* top gradient accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${a.bar}`}
              />
              {/* soft corner glow (static gradient — mobile-light) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(320px 130px at 88% -20%, rgba(56,189,248,0.13), transparent 62%)",
                }}
              />

              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  {/* bell icon + live dot */}
                  <div
                    className={`relative w-10 h-10 rounded-xl bg-white/5 border ${a.border} flex items-center justify-center shrink-0`}
                  >
                    <BellRing className={`w-5 h-5 ${a.icon}`} />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${a.dot}`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${a.dot}`}
                      />
                    </span>
                  </div>

                  {/* content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${a.chip}`}
                      >
                        {u.university_name}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {a.label}
                      </span>
                      {verified && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> যাচাইকৃত
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-white leading-snug line-clamp-2">
                      {u.title}
                    </h4>
                    <div className="flex items-center gap-2.5 flex-wrap mt-1.5 text-[10px] text-slate-400 font-semibold">
                      {u.extracted_data?.exam_date && (
                        <span className="inline-flex items-center gap-1 text-amber-300">
                          <Calendar className="w-3 h-3" />
                          পরীক্ষা:{" "}
                          {formatBanglaDate(u.extracted_data.exam_date)}
                        </span>
                      )}
                      {sources > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          {sources} সূত্র
                        </span>
                      )}
                    </div>
                  </div>

                  {/* close */}
                  <button
                    onClick={() => dismissUpdate(u.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
                    title="বন্ধ করো"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/40 active:scale-95 transition cursor-pointer"
                  >
                    বিস্তারিত দেখুন <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => dismissUpdate(u.id)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-bold transition cursor-pointer"
                  >
                    পরে দেখব
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && u && (
        <UpdateDetailModal update={u} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
