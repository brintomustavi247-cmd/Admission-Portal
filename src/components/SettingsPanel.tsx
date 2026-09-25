import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  X,
  Crown,
  Ticket,
  Copy,
  Check,
  MessageCircle,
  Send,
  LogOut,
  ShieldCheck,
  Mail,
  Bot,
  Lock,
  Gift,
  Download,
} from "lucide-react";

const BKASH_NUMBER = "01XXXXXXXXX";
const WHATSAPP = "https://wa.me/8801XXXXXXXXX";
const TELEGRAM = "https://t.me/TOMAR_CHANNEL";
const APP_URL = "https://varsity-admission-bd.vercel.app";

const TIERS = [
  {
    min: 500,
    name: "SUPERNOVA RUBY",
    icon: "🔥",
    bgGrad: "linear-gradient(135deg,#240c14 0%,#38101e 60%,#13040a 100%)",
    glow: "rgba(251,113,133,0.35)",
    accent: "#fb7185",
    canvas: ["#240c14", "#38101e", "#13040a"],
    cGlow: "rgba(251,113,133,0.4)",
    btn: "linear-gradient(to right,#e11d48,#7f1d1d)",
  },
  {
    min: 100,
    name: "ASTRAL VIOLET",
    icon: "💫",
    bgGrad: "linear-gradient(135deg,#16102e 0%,#201344 60%,#0c081d 100%)",
    glow: "rgba(129,140,248,0.35)",
    accent: "#a78bfa",
    canvas: ["#16102e", "#201344", "#0c081d"],
    cGlow: "rgba(129,140,248,0.4)",
    btn: "linear-gradient(to right,#6366f1,#4c1d95)",
  },
  {
    min: 50,
    name: "COSMOS SAPPHIRE",
    icon: "🌊",
    bgGrad: "linear-gradient(135deg,#0b1329 0%,#0d1e44 60%,#070d1f 100%)",
    glow: "rgba(56,189,248,0.35)",
    accent: "#38bdf8",
    canvas: ["#0b1329", "#0d1e44", "#070d1f"],
    cGlow: "rgba(56,189,248,0.4)",
    btn: "linear-gradient(to right,#0ea5e9,#1e3a8a)",
  },
  {
    min: 0,
    name: "NEBULA MINT",
    icon: "🌿",
    bgGrad: "linear-gradient(135deg,#091a18 0%,#0c2b27 60%,#031412 100%)",
    glow: "rgba(52,211,153,0.3)",
    accent: "#34d399",
    canvas: ["#091a18", "#0c2b27", "#031412"],
    cGlow: "rgba(52,211,153,0.4)",
    btn: "linear-gradient(to right,#10b981,#064e3b)",
  },
];
const tierOf = (v: number) => TIERS.find((t) => v >= t.min) || TIERS[3];

const CYAN = {
  name: "CYAN SKY ELITE",
  bgGrad: "linear-gradient(135deg,#0c2438 0%,#071724 55%,#030910 100%)",
  glow: "rgba(6,182,212,0.22)",
  accent: "#06b6d4",
  accentSoft: "rgba(6,182,212,0.4)",
  canvas: ["#0c2438", "#071724", "#030910"],
  cGlow: "rgba(6,182,212,0.25)",
  btn: "linear-gradient(to right,#0891b2,#0e7490)",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const SettingsPanel: React.FC<Props> = ({
  open,
  onClose,
  onOpenAdmin,
}) => {
  const { session, profile, signOut, refreshProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [numCopied, setNumCopied] = useState(false);
  const [donationOn, setDonationOn] = useState(false);
  const [tip, setTip] = useState(20);
  const [tipTrx, setTipTrx] = useState("");
  const [tipBusy, setTipBusy] = useState(false);
  const [tipMsg, setTipMsg] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [premiumFlipped, setPremiumFlipped] = useState(false);
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    if (!open) return;
    supabase
      .from("app_settings")
      .select("donation_enabled")
      .eq("id", 1)
      .single()
      .then(
        ({ data }) => data && setDonationOn(data.donation_enabled !== false),
      );
  }, [open]);

  useEffect(() => {
    if (profile && !cardName)
      setCardName(profile.full_name || session?.user.email || "DEV SUPPORTER");
  }, [profile, cardName, session]);

  if (!open) return null;

  const total = profile?.total_donated || 0;
  const hasDonation = total > 0;
  const claimed = !!profile?.donor_card;
  const isPremium = !!profile?.is_premium;
  const t = tierOf(total);
  const name = (cardName || "DEV SUPPORTER").toUpperCase();
  const last4 = String(total).padStart(4, "0");
  const passId = `VIP  ••••  ••••  ${profile?.referral_code || "0000"}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile?.referral_code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  const copyNum = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setNumCopied(true);
      setTimeout(() => setNumCopied(false), 1500);
    } catch {}
  };

  const shareText = encodeURIComponent(
    `🎓 বিশ্ববিদ্যালয় ভর্তি পোর্টাল ২০২৬-২৭\n` +
      `সকল পাবলিক, প্রকৌশল, মেডিকেল ও গুচ্ছ ভর্তির সময়সূচি, জিপিএ যোগ্যতা যাচাই, মাস্টার ক্যালেন্ডার ও লাইভ আপডেট — সব এক অ্যাপে।\n` +
      `📌 ফিচার: প্রিন্ট/PDF • ২য় বার ফিল্টার • যোগ্যতা চেক\n` +
      `🔗 অ্যাপ: ${APP_URL}/?ref=${profile?.referral_code}\n` +
      `🆔 আমার User ID (${profile?.referral_code}) দিয়ে register করলে subscription-এ ছাড় পাবেন।`,
  );

  const sendTip = async () => {
    if (!profile || tipTrx.trim().length < 6) {
      setTipMsg("❌ সঠিক TrxID লিখো");
      return;
    }
    setTipBusy(true);
    setTipMsg("");
    const { error } = await supabase.from("payment_requests").insert({
      user_id: profile.id,
      trx_id: tipTrx.trim(),
      plan: "donation",
      amount: tip,
      status: "pending",
    });
    setTipBusy(false);
    setTipMsg(
      error
        ? "❌ ব্যর্থ: " + error.message
        : "🤖 ধন্যবাদ! admin approve করলে DONOR CARD unlock!",
    );
    setTipTrx("");
  };

  const claim = async () => {
    await supabase.rpc("claim_donor_card");
    await refreshProfile();
  };

  const Satin = () => (
    <>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg,#fff 0 1px,transparent 1px 7px)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            "linear-gradient(180deg,rgba(255,255,255,0.06),transparent)",
        }}
      />
    </>
  );

  const PremiumCard = ({ dim }: { dim?: boolean }) => (
    <div
      className="relative w-full aspect-[1.586/1]"
      style={{ perspective: "1200px" }}
    >
      <div
        onClick={() => !dim && setPremiumFlipped(!premiumFlipped)}
        className={`relative w-full h-full cursor-pointer transition-transform duration-700 ${dim ? "pointer-events-none" : ""}`}
        style={{
          transformStyle: "preserve-3d",
          transform: premiumFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className={`absolute inset-0 rounded-[24px] overflow-hidden p-4 flex flex-col justify-between select-none ${dim ? "opacity-50 blur-[1px]" : ""}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: CYAN.bgGrad,
            boxShadow:
              "0 30px 70px -20px rgba(0,0,0,0.95), 0 0 35px -10px rgba(6,182,212,0.28), 0 0 0 1px rgba(103,232,249,0.22) inset, 0 1px 2px 0 rgba(255,255,255,0.25) inset",
          }}
        >
          <Satin />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0e4466] to-[#061e2e] border border-cyan-400/40 flex items-center justify-center shadow-inner">
                <span className="text-cyan-400 text-xs font-black">✦</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-gaming font-black tracking-widest text-slate-100 uppercase block leading-none">
                  ADMISSION PORTAL
                </span>
                <span className="text-[8px] sm:text-[9px] font-gaming tracking-[0.26em] text-cyan-400 font-bold uppercase block mt-1">
                  POLISHED CYAN SKY PASS
                </span>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-full backdrop-blur-md"
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.3)",
              }}
            >
              <span className="text-[8px] font-gaming font-bold tracking-widest text-cyan-300 uppercase">
                UNLIMITED
              </span>
            </div>
          </div>
          <div className="relative z-10 my-auto flex items-center justify-between">
            <div>
              <span className="text-[8px] font-gaming tracking-[0.25em] text-slate-400 uppercase block">
                PASS ID
              </span>
              <div className="font-mono-num text-sm sm:text-base tracking-[0.2em] text-slate-100 font-bold drop-shadow-sm mt-0.5">
                {passId}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-gaming tracking-[0.25em] text-slate-400 uppercase block">
                ACCESS LEVEL
              </span>
              <div className="font-gaming text-xs sm:text-sm font-black text-cyan-400 tracking-wider mt-0.5">
                ALL PRIVILEGES
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between border-t border-cyan-500/20 pt-2.5">
            <div className="min-w-0 flex-1">
              <span className="text-[7px] font-gaming tracking-[0.22em] text-slate-400 uppercase block">
                MEMBER NAME
              </span>
              <span className="text-xs sm:text-sm font-gaming font-black tracking-wider text-slate-100 uppercase block truncate max-w-[200px]">
                {name}
              </span>
              <span className="text-[8px] font-mono-num text-cyan-300/80 block mt-0.5">
                ID: {profile?.referral_code}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[7px] font-gaming tracking-[0.22em] text-slate-400 uppercase block">
                SESSION
              </span>
              <span className="text-[11px] font-mono-num font-bold text-cyan-300 uppercase tracking-widest block">
                2026-27
              </span>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 rounded-[24px] overflow-hidden p-4 flex flex-col justify-between select-none"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background:
              "linear-gradient(135deg,#091a29 0%,#05111c 55%,#02070c 100%)",
            boxShadow:
              "0 30px 70px -20px rgba(0,0,0,0.95), 0 0 0 1px rgba(103,232,249,0.22) inset",
          }}
        >
          <Satin />
          <div className="absolute left-0 right-0 top-6 h-10 bg-[#020508] border-y border-cyan-500/20" />
          <div className="relative z-10 mt-14 flex items-center gap-3">
            <div
              className="flex-1 h-8 rounded-lg flex items-center justify-end px-3"
              style={{
                background: "#0c2236",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              <span className="font-mono-num text-xs font-bold text-cyan-300 tracking-widest">
                ACCESS CODE: 8940
              </span>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between border-t border-cyan-500/20 pt-2.5">
            <div>
              <span className="text-[7px] font-gaming tracking-[0.22em] text-slate-400 uppercase block">
                SECURITY VERIFIED
              </span>
              <span className="text-[9px] font-gaming font-bold text-slate-300 uppercase tracking-wider block mt-0.5">
                POLISHED CYAN SKY CORE
              </span>
            </div>
            <div
              className="w-12 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "#071928",
                border: "1px solid rgba(6,182,212,0.3)",
              }}
            >
              <span className="text-[8px] font-gaming font-black text-cyan-400 tracking-widest">
                PASS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DonorCard = ({ dim }: { dim?: boolean }) => (
    <div
      className="relative w-full aspect-[1.586/1]"
      style={{ perspective: "1200px" }}
    >
      <div
        onClick={() => !dim && setFlipped(!flipped)}
        className={`relative w-full h-full cursor-pointer transition-transform duration-700 ${dim ? "pointer-events-none" : ""}`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className={`absolute inset-0 rounded-[24px] overflow-hidden p-4 flex flex-col justify-between select-none ${dim ? "opacity-50 blur-[1px]" : ""}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: t.bgGrad,
            boxShadow:
              "0 25px 60px -15px rgba(0,0,0,0.85),0 0 0 1px rgba(255,255,255,0.12) inset",
          }}
        >
          <Satin />
          <div
            className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: t.glow }}
          />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <div>
                <span className="text-sm font-gaming font-black tracking-widest text-white uppercase block leading-none">
                  ADMISSION
                </span>
                <span className="text-[9px] font-gaming tracking-[0.22em] text-white/70 uppercase block mt-1.5">
                  {t.name}
                </span>
              </div>
            </div>
          </div>
          <div className="relative z-10 my-auto flex items-center justify-between">
            <div>
              <span className="text-[8px] font-gaming tracking-[0.25em] text-white/60 uppercase block">
                CARD NUMBER
              </span>
              <div className="font-mono-num text-sm sm:text-base tracking-[0.22em] text-white/95 font-bold mt-0.5">
                5894 •••• •••• {last4}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-gaming tracking-[0.25em] text-white/60 uppercase block">
                SUPPORT
              </span>
              <div className="font-gaming text-sm sm:text-base font-black text-white">
                <span className="text-xs text-white/70">BDT</span> {total}
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-2">
            <div className="min-w-0 flex-1">
              <span className="text-[8px] font-gaming tracking-[0.2em] text-white/60 uppercase block">
                CARDHOLDER
              </span>
              <span className="text-xs sm:text-sm font-gaming font-black tracking-wider text-white uppercase block truncate max-w-[200px]">
                {name}
              </span>
              <span className="text-[8px] font-mono-num text-white/70 block mt-0.5">
                ID: {profile?.referral_code}
              </span>
            </div>
            <div className="flex -space-x-3 items-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#eb001b] shadow-md" />
              <div className="w-7 h-7 rounded-full bg-[#f79e1b] mix-blend-screen opacity-95 shadow-md" />
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 rounded-[24px] overflow-hidden p-4 flex flex-col justify-between select-none"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: t.bgGrad,
            boxShadow: "0 25px 60px -15px rgba(0,0,0,0.85)",
          }}
        >
          <Satin />
          <div className="absolute left-0 right-0 top-6 h-10 bg-[#080a10] border-y border-black/40" />
          <div className="relative z-10 mt-14 flex items-center gap-3">
            <div className="flex-1 h-8 rounded bg-slate-200/90 flex items-center justify-end px-3">
              <span className="font-mono-num text-xs font-bold text-slate-800 tracking-widest">
                CVV 894
              </span>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2">
            <div>
              <span className="text-[8px] font-gaming tracking-[0.2em] text-white/60 uppercase block">
                PERPETUAL ACCESS
              </span>
              <span className="text-[10px] font-gaming font-bold text-white uppercase tracking-wider block mt-0.5">
                LIMITED EDITION
              </span>
            </div>
            <div className="w-12 h-7 rounded bg-gradient-to-r from-slate-300 via-white to-slate-400 p-[1px] flex items-center justify-center">
              <span className="text-[8px] font-gaming font-black text-slate-900 tracking-widest">
                2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const downloadCard = (kind: "donor" | "premium") => {
    if (!profile) return;
    const isP = kind === "premium";
    const W = 1200,
      H = 756;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d");
    if (!x) return;
    const r = 48;
    x.beginPath();
    x.moveTo(r, 0);
    x.lineTo(W - r, 0);
    x.quadraticCurveTo(W, 0, W, r);
    x.lineTo(W, H - r);
    x.quadraticCurveTo(W, H, W - r, H);
    x.lineTo(r, H);
    x.quadraticCurveTo(0, H, 0, H - r);
    x.lineTo(0, r);
    x.quadraticCurveTo(0, 0, r, 0);
    x.closePath();
    x.clip();
    const bg = x.createLinearGradient(0, 0, W, H);
    if (isP) {
      bg.addColorStop(0, "#0c2438");
      bg.addColorStop(0.55, "#071724");
      bg.addColorStop(1, "#030910");
    } else {
      bg.addColorStop(0, t.canvas[0]);
      bg.addColorStop(0.6, t.canvas[1]);
      bg.addColorStop(1, t.canvas[2]);
    }
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(255,255,255,0.015)";
    x.lineWidth = 1;
    for (let i = -H; i < W; i += 8) {
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i + H * 0.45, H);
      x.stroke();
    }
    const glow = x.createRadialGradient(
      isP ? W - 120 : 100,
      H - 60,
      20,
      isP ? W - 120 : 100,
      H - 60,
      480,
    );
    glow.addColorStop(0, isP ? CYAN.cGlow : t.cGlow);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = glow;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = isP ? CYAN.accentSoft : "rgba(255,255,255,0.12)";
    x.lineWidth = 3;
    x.stroke();
    x.fillStyle = isP ? "#f8fafc" : "#ffffff";
    x.font = '900 30px "Orbitron", sans-serif';
    x.fillText(isP ? "✦  ADMISSION PORTAL" : "✦  ADMISSION", 70, 95);
    x.fillStyle = isP ? "#67e8f9" : "rgba(255,255,255,0.7)";
    x.font = '700 16px "Orbitron", sans-serif';
    x.fillText(isP ? "POLISHED CYAN SKY PASS" : t.name, 125, 128);
    x.fillStyle = isP ? "#64748b" : "rgba(255,255,255,0.5)";
    x.font = '700 18px "Orbitron", sans-serif';
    x.fillText(isP ? "PASS ID" : "CARD NUMBER", 70, 310);
    x.fillStyle = isP ? "#f1f5f9" : "#ffffff";
    x.font = '700 44px "Share Tech Mono", monospace';
    x.fillText(
      isP
        ? `VIP  ••••  ••••  ${profile.referral_code || "0000"}`
        : `5894  ••••  ••••  ${last4}`,
      70,
      370,
    );
    x.textAlign = "right";
    x.fillStyle = isP ? "#64748b" : "rgba(255,255,255,0.5)";
    x.font = '700 18px "Orbitron", sans-serif';
    x.fillText(isP ? "ACCESS LEVEL" : "SUPPORT", W - 70, 310);
    x.fillStyle = isP ? "#38bdf8" : "#ffffff";
    x.font = isP
      ? '900 32px "Orbitron", sans-serif'
      : '900 48px "Orbitron", sans-serif';
    x.fillText(isP ? "ALL PRIVILEGES" : `BDT ${total}`, W - 70, 370);
    x.textAlign = "left";
    x.strokeStyle = isP ? "rgba(103,232,249,0.15)" : "rgba(255,255,255,0.15)";
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(70, 560);
    x.lineTo(W - 70, 560);
    x.stroke();
    x.fillStyle = isP ? "#64748b" : "rgba(255,255,255,0.5)";
    x.font = '700 18px "Orbitron", sans-serif';
    x.fillText("MEMBER NAME", 70, 615);
    x.fillStyle = "#ffffff";
    x.font = '900 32px "Orbitron", sans-serif';
    x.fillText(name.slice(0, 26), 70, 665);
    x.fillStyle = "rgba(255,255,255,0.6)";
    x.font = '500 20px "Share Tech Mono", monospace';
    x.fillText(`ID: ${profile.referral_code || ""}`, 70, 700);
    x.fillStyle = "rgba(255,255,255,0.5)";
    x.font = '400 22px "Orbitron", sans-serif';
    x.fillText(
      `MATTE SERIES • ${isP ? CYAN.name : t.name} • varsity-admission-bd.vercel.app`,
      70,
      720,
    );
    const a = document.createElement("a");
    a.download = `${kind}-card-${name.replace(/\s+/g, "_")}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-[#151b27] shadow-2xl overflow-y-auto text-slate-900 dark:text-slate-100">
        {/* ===== HEADER ===== */}
        <div className="sticky top-0 z-10 bg-white dark:bg-[#151b27] border-b-2 border-slate-200 dark:border-white/5 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">সেটিংস</h2>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">
              অ্যাকাউন্ট • পাস • সাপোর্ট
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* ===== ACCOUNT ===== */}
          <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#0f141d] dark:to-[#0f141d] border-2 border-blue-200 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600" />
            <div className="p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-xl border-4 border-white dark:border-[#151b27]">
                {(session?.user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black truncate flex items-center gap-1.5 text-slate-900 dark:text-white">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />{" "}
                  {session?.user.email}
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black ${profile?.role === "admin" ? "bg-blue-600 text-white shadow-md" : "bg-slate-300 dark:bg-white/10 text-slate-800 dark:text-slate-200"}`}
                  >
                    {profile?.role === "admin" ? "ADMIN" : "USER"}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" : "bg-slate-300 dark:bg-white/10 text-slate-800 dark:text-slate-200"}`}
                  >
                    {isPremium && <Crown className="w-3 h-3" />}{" "}
                    {isPremium ? "প্রিমিয়াম" : "ফ্রি"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-700 dark:text-slate-300 font-bold">
                  <span className="uppercase tracking-wider">User ID:</span>
                  <code className="text-blue-700 dark:text-blue-300 font-black tracking-widest text-sm">
                    {profile?.referral_code}
                  </code>
                  <button
                    onClick={copyCode}
                    className="p-1.5 rounded-lg bg-blue-100 dark:bg-white/5 hover:bg-blue-200 dark:hover:bg-white/10 cursor-pointer border border-blue-300 dark:border-white/10"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ===== REFERRAL ===== */}
          {profile?.referral_code && (
            <section className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#0f141d] dark:to-[#0f141d] border-2 border-indigo-300 dark:border-white/10 p-4 shadow-lg">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-3">
                <Ticket className="w-4 h-4" /> তোমার রেফারেল কোড
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-center py-3.5 rounded-xl bg-white dark:bg-[#151b27] border-2 border-indigo-400 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 font-black tracking-[0.2em] text-lg font-gaming shadow-inner">
                  {profile.referral_code}
                </code>
                <button
                  onClick={copyCode}
                  className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={`https://wa.me/?text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-3 font-semibold leading-relaxed">
                বন্ধুকে এই কোড দাও — সে ছাড় পাবে, তুমিও!
              </p>
            </section>
          )}

          {/* ===== PREMIUM PASS (dark showcase) ===== */}
          <section>
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2 text-cyan-700 dark:text-cyan-300">
              <Crown className="w-4 h-4" /> Premium Pass
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#0b101a] dark:to-[#0b101a] border-2 border-slate-700 dark:border-white/10 p-4 shadow-xl">
              {isPremium ? (
                <>
                  <PremiumCard />
                  <p className="text-center text-[11px] text-slate-300 font-bold mt-3 font-gaming tracking-wider">
                    👆 CLICK CARD TO FLIP
                  </p>
                  <button
                    onClick={() => downloadCard("premium")}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-xs font-black shadow-xl cursor-pointer active:scale-95 font-gaming tracking-wider uppercase"
                    style={{
                      background: CYAN.btn,
                      border: `2px solid ${CYAN.accentSoft}`,
                    }}
                  >
                    <Download className="w-4 h-4" /> Download Cyan Sky Pass
                    (PNG)
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <PremiumCard dim />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center border-2 border-cyan-400/40 shadow-xl">
                        <Lock className="w-5 h-5 text-cyan-300" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <div className="text-[12px] font-black font-gaming tracking-wider text-cyan-300">
                      CYAN SKY PASS 🔒
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-semibold">
                      Subscription নিলে এই polished matte pass তোমার হবে — ALL
                      PRIVILEGES 👑
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ===== DONOR CARD (dark showcase) ===== */}
          {donationOn && (
            <section>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2 text-slate-800 dark:text-slate-200">
                <Bot className="w-4 h-4" /> Cosmic Donor Card
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#0b101a] dark:to-[#0b101a] border-2 border-slate-700 dark:border-white/10 p-4 shadow-xl">
                {!hasDonation ? (
                  <>
                    <div className="relative">
                      <DonorCard dim />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black/70 border-2 border-white/30 flex items-center justify-center shadow-xl">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <div className="text-[12px] font-black text-white font-gaming tracking-wider">
                        COSMIC DONOR CARD 🔒
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-semibold">
                        BDT 20+ donate করো → admin approve → claim → তারপর
                        download। Click = flip!
                      </p>
                    </div>
                  </>
                ) : !claimed ? (
                  <div className="relative">
                    <DonorCard dim />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-2xl">
                      <Gift className="w-8 h-8 text-amber-300 mb-2 animate-bounce" />
                      <button
                        onClick={claim}
                        className="px-6 py-3 rounded-xl text-white text-xs font-black shadow-xl cursor-pointer active:scale-95 font-gaming tracking-wider"
                        style={{
                          background: t.btn,
                          border: `2px solid ${t.accent}`,
                        }}
                      >
                        🎁 CLAIM YOUR CARD
                      </button>
                      <p className="text-[10px] text-slate-300 mt-2 font-bold">
                        {t.icon} {t.name} unlocked — claim koro!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <DonorCard />
                    <p className="text-center text-[11px] text-slate-300 font-bold mt-3 font-gaming tracking-wider">
                      👆 CLICK CARD TO FLIP
                    </p>
                    <button
                      onClick={() => downloadCard("donor")}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-xs font-black shadow-xl cursor-pointer active:scale-95 font-gaming tracking-wider uppercase"
                      style={{
                        background: t.btn,
                        border: `2px solid ${t.accent}`,
                      }}
                    >
                      <Download className="w-4 h-4" /> Download Cosmic Card
                      (PNG)
                    </button>
                  </>
                )}
              </div>
            </section>
          )}

          {/* ===== DONATION BOX (always dark) ===== */}
          {donationOn && (
            <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#0f141d] dark:to-[#0f141d] border-2 border-slate-700 dark:border-white/10 p-4 text-white shadow-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">
                    ডেভেলপার রোবট 🤖
                  </div>
                  <div className="text-[11px] text-slate-300 font-semibold">
                    ঐচ্ছিক tip — রোবটকে energy দাও ⚡
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[20, 50, 100, 500].map((v) => {
                  const vt = tierOf(v);
                  return (
                    <button
                      key={v}
                      onClick={() => setTip(v)}
                      className={`py-2.5 rounded-xl text-[11px] font-black cursor-pointer transition border-2 font-gaming tracking-wider ${tip === v ? "text-white shadow-lg scale-105" : "bg-white/5 text-slate-300 hover:bg-white/10 border-transparent"}`}
                      style={
                        tip === v
                          ? { background: vt.bgGrad, borderColor: vt.accent }
                          : undefined
                      }
                    >
                      {v} BDT
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between gap-2 mb-2 rounded-xl bg-[#0f141d] border-2 border-white/10 px-3 py-2.5">
                <span className="text-[11px] text-slate-300 font-bold">
                  bKash:
                </span>
                <button
                  onClick={copyNum}
                  className="flex items-center gap-1 text-[11px] font-black text-pink-300 cursor-pointer"
                >
                  {numCopied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  {BKASH_NUMBER}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  value={tipTrx}
                  onChange={(e) => setTipTrx(e.target.value)}
                  placeholder="Donation TrxID"
                  className="flex-1 bg-[#0f141d] border-2 border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={sendTip}
                  disabled={tipBusy}
                  className="px-5 rounded-xl bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white text-[11px] font-black cursor-pointer disabled:opacity-50 shadow-lg"
                >
                  পাঠাও
                </button>
              </div>
              {tipMsg && (
                <p className="text-[11px] text-cyan-300 mt-2 text-center font-bold">
                  {tipMsg}
                </p>
              )}
            </section>
          )}

          {/* ===== ADMIN ===== */}
          {profile?.role === "admin" && onOpenAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-xl shadow-blue-500/30 cursor-pointer active:scale-95 border-2 border-blue-400/50"
            >
              <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
            </button>
          )}

          {/* ===== HELP ===== */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11px] font-black shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95 border-2 border-emerald-400/50"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Help
            </a>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-[11px] font-black shadow-lg shadow-sky-500/25 cursor-pointer active:scale-95 border-2 border-sky-400/50"
            >
              <Send className="w-4 h-4" /> Telegram
            </a>
          </div>

          {/* ===== LOGOUT ===== */}
          <button
            onClick={async () => {
              await signOut();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 border-2 border-red-400/50 text-white text-xs font-black shadow-lg shadow-red-500/25 cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4" /> লগআউট
          </button>

          <p className="text-center text-[11px] text-slate-600 dark:text-slate-400 pt-2 pb-4 font-gaming tracking-widest font-semibold">
            CYAN SKY + COSMIC SERIES • ২০২৬-২৭
          </p>
        </div>
      </div>
    </div>
  );
};
