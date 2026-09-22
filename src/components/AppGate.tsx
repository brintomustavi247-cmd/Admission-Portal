import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { PremiumPaywall } from "./PremiumModal";
import { FreePeriodPopup } from "./FreePeriodPopup";
import { InstallButton } from "./InstallButton";
import { track } from "../lib/track";
import {
  ShieldOff,
  RefreshCw,
  Megaphone,
  MessageCircle,
  Send,
  Copy,
  Check,
} from "lucide-react";

const WHATSAPP = "https://wa.me/8801XXXXXXXXX";
const TELEGRAM = "https://t.me/TOMAR_CHANNEL";

export const AppGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { profile, loading, refreshProfile } = useAuth();
  const [subEnabled, setSubEnabled] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () =>
      supabase
        .from("app_settings")
        .select("subscription_enabled, announcement_text")
        .eq("id", 1)
        .single()
        .then(({ data, error }) => {
          if (!alive) return;
          if (error || !data) {
            setSubEnabled(false);
            return;
          }
          setSubEnabled(!!data.subscription_enabled);
          setAnnouncement(data.announcement_text || "");
        });
    load();
    const ch = supabase
      .channel("settings-watch")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "app_settings" },
        () => load(),
      )
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, []);

  /* heartbeat — online status (প্রতি ২ মিনিট) */
  useEffect(() => {
    const beat = () => { supabase.rpc('touch_last_seen').then(() => {}); };
    beat();
    const iv = setInterval(beat, 120000);
    return () => clearInterval(iv);
  }, []);

  /* global tap tracker — কোন button/card-এ tap করলো */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('button, a');
      if (!el) return;
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      if (!txt) return;
      const card = el.closest('[class*="rounded-2xl"], [class*="rounded-3xl"]');
      const nameEl = card ? card.querySelector('h3, h2, [class*="font-black"]') : null;
      track('tap', { button: txt, context: (nameEl?.textContent || '').trim().slice(0, 40) });
    };
    window.addEventListener('click', h, true);
    return () => window.removeEventListener('click', h, true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0d1017]">
        <img
          src="/icons/icon-512.png"
          alt="logo"
          className="w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-sky-500/40 animate-pulse"
        />
        <div className="text-white font-black text-lg">
          বিশ্ববিদ্যালয় ভর্তি <span className="text-sky-400">২০৬-৭</span>
        </div>
        <RefreshCw className="w-5 h-5 animate-spin text-sky-400" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#151a23] text-slate-200 p-6 text-center">
        <RefreshCw className="w-10 h-10 text-red-400 mb-3" />
        <h2 className="text-lg font-black text-white">
          প্রোফাইল লোড করা যায়নি
        </h2>
        <button
          onClick={() => refreshProfile()}
          className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ===== BLOCKED — কিন্তু ADMIN কখনো না ===== */
  if (!profile.access_enabled && profile.role !== "admin") {
    const uid = profile.referral_code || profile.id.slice(0, 8).toUpperCase();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#151a23] text-slate-200 p-6 text-center">
        <ShieldOff className="w-14 h-14 text-red-400 mb-4" />
        <h2 className="text-xl font-black text-white">
          অ্যাক্সেস বন্ধ করা হয়েছে
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          তোমার অ্যাকাউন্টের অ্যাক্সেস বর্তমানে নিষ্ক্রিয়। সাপোর্ট টিমের সাথে
          যোগাযোগ করো।
        </p>

        {/* User ID box */}
        <div className="mt-5 rounded-2xl bg-[#0f141d] border border-white/10 px-5 py-3 flex items-center gap-3">
          <div className="text-left">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              তোমার User ID
            </div>
            <code className="text-base font-black text-sky-300 tracking-widest">
              {uid}
            </code>
          </div>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(uid);
                setCopiedId(true);
                setTimeout(() => setCopiedId(false), 1500);
              } catch {}
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            {copiedId ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 max-w-xs">
          এই ID-এর screenshot সাপোর্ট-এ পাঠিও — admin এক ক্লিকে অ্যাক্সেস চালু
          করে দিতে পারবেন
        </p>

        {/* Support buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5 w-full max-w-xs">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/25 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-bold hover:bg-sky-500/25 transition"
          >
            <Send className="w-3.5 h-3.5" /> Telegram
          </a>
        </div>

        <button
          onClick={() => refreshProfile()}
          className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
        >
          আবার চেক করো
        </button>
      </div>
    );
  }

  const premiumActive =
    profile.is_premium &&
    (!profile.premium_expires_at ||
      new Date(profile.premium_expires_at).getTime() > Date.now());

  if (subEnabled && profile.role !== "admin" && !premiumActive) {
    return <PremiumPaywall />;
  }

  return (
    <>
      {announcement && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold px-4 py-2 text-center flex items-center justify-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5 shrink-0" /> {announcement}
        </div>
      )}
      {children}
      <FreePeriodPopup />
      <InstallButton />
    </>
  );
};
