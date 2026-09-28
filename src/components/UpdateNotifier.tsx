/**
 * UpdateNotifier v2 — Premium live-update toast
 * ✅ severity-colored gradient ring + glass card + progress bar
 * ✅ spring slide-in, auto-dismiss 14s, modal খুললে pause
 * ✅ mobile-light: কোনো blur orb / heavy shadow নেই
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { getSeen, markSeen } from "../lib/newsSeen";
import { formatBanglaDate } from "../lib/banglaUtils";
import { UpdateDetailModal } from "./UpdateDetailModal";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  CalendarDays,
  X,
  Zap,
} from "lucide-react";

const SHOW_MS = 14000;

const SEV = {
  urgent: {
    ring: "from-rose-500 via-red-500 to-orange-500",
    chip: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    icon: <Zap className="w-4 h-4" />,
    label: "জরুরি আপডেট",
  },
  important: {
    ring: "from-amber-400 via-orange-400 to-yellow-400",
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: <AlertTriangle className="w-4 h-4" />,
    label: "গুরুত্বপূর্ণ",
  },
  normal: {
    ring: "from-sky-500 via-blue-500 to-indigo-500",
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    icon: <BellRing className="w-4 h-4" />,
    label: "নতুন তথ্য",
  },
} as const;
type SevKey = keyof typeof SEV;

export const UpdateNotifier: React.FC = () => {
  const { profile } = useAuth();
  const uid = profile?.id || "guest";
  const [all, setAll] = useState<any[]>([]);
  const [seenTick, setSeenTick] = useState(0);
  const [hiddenId, setHiddenId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* live fetch + realtime INSERT subscribe */
  useEffect(() => {
    let alive = true;
    const load = () =>
      supabase
        .from("university_updates")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (alive && data) setAll(data);
        });
    load();
    const ch = supabase
      .channel("notifier_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "university_updates" },
        () => load(),
      )
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, []);

  /* সর্বশেষ UNSEEN update টাই toast হবে */
  const latest = useMemo(() => {
    const seen = new Set(getSeen(uid, "updates"));
    return all.find((n) => !seen.has(n.id)) || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, uid, seenTick]);

  const show = latest && latest.id !== hiddenId ? latest : null;

  const dismiss = useCallback(
    (id: string) => {
      markSeen(uid, "updates", [id]);
      setHiddenId(id);
      setSeenTick((t) => t + 1);
    },
    [uid],
  );

  /* auto-dismiss (modal খোলা থাকলে pause) */
  useEffect(() => {
    if (!show || modalOpen) return;
    const t = setTimeout(() => dismiss(show.id), SHOW_MS);
    return () => clearTimeout(t);
  }, [show, modalOpen, dismiss]);

  const sevKey: SevKey =
    show?.severity === "urgent" || show?.severity === "important"
      ? show.severity
      : "normal";
  const sev = SEV[sevKey];

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed top-3 left-3 right-3 sm:left-auto sm:right-5 sm:w-[400px] z-[95]"
          >
            {/* gradient ring border */}
            <div
              className={`rounded-2xl p-[1.5px] bg-gradient-to-r ${sev.ring} shadow-2xl shadow-black/50`}
            >
              <div className="relative rounded-[15px] bg-[#0c1220]/95 backdrop-blur-xl overflow-hidden">
                {/* auto-dismiss progress bar */}
                {!modalOpen && (
                  <motion.div
                    className={`absolute top-0 left-0 h-0.5 bg-gradient-to-r ${sev.ring}`}
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: SHOW_MS / 1000, ease: "linear" }}
                  />
                )}

                <div className="p-3.5 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sev.ring} flex items-center justify-center text-white shrink-0 shadow-lg`}
                    >
                      {sev.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${sev.chip} flex items-center gap-1`}
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-70" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
                          </span>
                          {sev.label}
                        </span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 truncate max-w-[55%]">
                          {show.university_name}
                        </span>
                      </div>

                      <p className="text-[12px] sm:text-[13px] font-black text-white leading-snug line-clamp-2">
                        {show.title}
                      </p>

                      {show.extracted_data?.exam_date && (
                        <span className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-lg">
                          <CalendarDays className="w-3 h-3" />
                          পরীক্ষা:{" "}
                          {formatBanglaDate(show.extracted_data.exam_date)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => dismiss(show.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
                      title="বন্ধ করো"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        markSeen(uid, "updates", [show.id]);
                        setSeenTick((t) => t + 1);
                        setModalOpen(true);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/25 active:scale-95 transition cursor-pointer"
                    >
                      বিস্তারিত দেখুন <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => dismiss(show.id)}
                      className="py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition cursor-pointer"
                    >
                      পরে দেখব
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && show && (
        <UpdateDetailModal update={show} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
