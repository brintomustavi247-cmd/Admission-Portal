import React, { useState } from "react";
import { useUniversityUpdates } from "../hooks/useUniversityUpdates";
import { UpdateDetailModal } from "./UpdateDetailModal";
import { Sparkles, X, ArrowRight, BellRing } from "lucide-react";

export const UpdateNotifier: React.FC = () => {
  const { latestUpdate, dismissUpdate } = useUniversityUpdates();
  const [modalOpen, setModalOpen] = useState(false);

  if (!latestUpdate) return null;

  return (
    <>
      <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 sm:max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="relative overflow-hidden rounded-2xl bg-[#0f172a]/95 backdrop-blur-xl border border-sky-400/30 p-4 shadow-2xl shadow-sky-950/50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500" />
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                <BellRing className="w-4 h-4 animate-bounce" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {latestUpdate.university_name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">নতুন তথ্য</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug truncate">
                  {latestUpdate.title}
                </h4>
                {latestUpdate.extracted_data?.exam_date && (
                  <p className="text-[11px] text-slate-300 mt-1">
                    📅 পরীক্ষা: <span className="text-amber-300 font-semibold">{latestUpdate.extracted_data.exam_date}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => dismissUpdate(latestUpdate.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition"
            >
              বিস্তারিত দেখুন <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => dismissUpdate(latestUpdate.id)}
              className="py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition"
            >
              পরে দেখব
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <UpdateDetailModal
          update={latestUpdate}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};