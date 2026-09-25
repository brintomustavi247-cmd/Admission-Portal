import React, { useEffect, useState } from "react";
import { DownloadCloud, RefreshCw, X, ArrowUpRight } from "lucide-react";

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
    <aside
      aria-label="App update notification"
      className="fixed bottom-24 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 z-[110] sm:max-w-md animate-in fade-in slide-in-from-bottom-6 duration-300 pointer-events-auto"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#090d16]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-slate-100 p-4">
        {/* Top Active Ambient Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />
        
        {/* Ambient Radial Spotlight */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            {/* Status Indicator Icon */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <DownloadCloud className="w-5 h-5 animate-pulse" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  v-latest
                </span>
                <span className="text-xs font-bold text-white tracking-tight">
                  নতুন সিস্টেম আপডেট প্রস্তুত
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                সর্বশেষ ভর্তি রুটিন ও পারফরম্যান্স ফিক্স লোড করতে অ্যাপটি রিফ্রেশ করুন।
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowReload(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between gap-2 relative z-10">
          <span className="text-[10px] text-slate-500 font-medium">
            ১ সেকেন্ডে ইনস্ট্যান্ট লোড হবে
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReload(false)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              পরে
            </button>
            <button
              onClick={handleUpdate}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-[0_4px_16px_rgba(16,185,129,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>আপডেট নিন</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};