import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

/* PWA install prompt — beforeinstallprompt event আসলে ছোট banner দেখায় */
type BIPEvent = Event & { prompt: () => Promise<void> };

export const InstallButton: React.FC = () => {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("install-dismissed") === "1",
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferred || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-2xl bg-[#151a23] border border-sky-500/30 shadow-2xl shadow-sky-500/20 px-4 py-2.5">
      <Download className="w-4 h-4 text-sky-400 shrink-0" />
      <span className="text-[11px] font-bold text-white">
        অ্যাপ ইনস্টল করো — অফলাইনেও চলবে!
      </span>
      <button
        onClick={async () => {
          try {
            await deferred.prompt();
          } catch {}
          setDeferred(null);
        }}
        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-[10px] font-black cursor-pointer active:scale-95 transition"
      >
        Install
      </button>
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem("install-dismissed", "1");
        }}
        className="p-1 rounded-lg hover:bg-white/10 cursor-pointer"
      >
        <X className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
};
