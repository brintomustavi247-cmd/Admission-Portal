import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { MessageSquareHeart, X, Send, PhoneCall } from "lucide-react";

const KEY = "feedback_popup_last_shown";
const WHATSAPP = "https://wa.me/8801XXXXXXXXX";

export const FeedbackPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from("app_settings")
          .select("feedback_popup_enabled")
          .eq("id", 1)
          .single();
        if (data && data.feedback_popup_enabled === false) return;
        const last = Number(localStorage.getItem(KEY) || 0);
        if (Date.now() - last > 7 * 24 * 60 * 60 * 1000) setShow(true);
      } catch {}
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(KEY, String(Date.now()));
    setShow(false);
  };

  const submit = async () => {
    if (msg.trim().length < 5) return;
    await supabase
      .from("app_feedback")
      .insert({ message: msg.trim(), contact: contact.trim() || null });
    setSent(true);
    setTimeout(dismiss, 1800);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="fixed bottom-24 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[65] rounded-2xl bg-white dark:bg-[#1e2530] border-2 border-violet-300 dark:border-violet-700 shadow-2xl p-4"
        >
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">
                অ্যাপটা কেমন লাগছে?
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                Upgrade/সমস্যা জানাতে হেল্পলাইনে বলো
              </p>
            </div>
          </div>
          {sent ? (
            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 py-3 text-center">
              ✅ ধন্যবাদ! তোমার মতামত পৌঁছে গেছে 💜
            </p>
          ) : (
            <>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={2}
                placeholder="সমস্যা / পরামর্শ / নতুন feature idea..."
                className="w-full mb-2 bg-slate-50 dark:bg-[#0f141d] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-[11px] focus:outline-none resize-none"
              />
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="মোবাইল/ইমেইল (ঐচ্ছিক)"
                className="w-full mb-2 bg-slate-50 dark:bg-[#0f141d] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-[11px] focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={submit}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[11px] font-black cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3" /> পাঠাও
                </button>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-[11px] font-black flex items-center justify-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" /> হেল্পলাইন
                </a>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
