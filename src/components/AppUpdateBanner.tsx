import React, { useEffect, useState } from "react";
import { RefreshCw, Sparkles, X } from "lucide-react";

export const AppUpdateBanner: React.FC = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShowReload(true);
      }

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShowReload(true);
          }
        });
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  if (!showReload) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 z-[100] sm:max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-xl border border-sky-400/40 p-3.5 shadow-2xl shadow-sky-950/70 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">
                নতুন অ্যাপ আপডেট এসেছে!
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5">
                নতুন ফিচার ও তথ্য লোড করতে আপডেট করুন।
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReload(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-2.5 flex justify-end gap-2">
          <button
            onClick={() => setShowReload(false)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 font-semibold cursor-pointer"
          >
            পরে
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            এখনই আপডেট করুন
          </button>
        </div>
      </div>
    </div>
  );
};