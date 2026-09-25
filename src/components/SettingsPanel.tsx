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

/* ===== COSMIC DONOR TIERS ===== */
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

/* ===== CYAN SKY PREMIUM ===== */
const CYAN = {
  name: "CYAN SKY ELITE",
  bgGrad: "linear-gradient(135deg,#0c2438 0%,#071724 55%,#030910 100%)",
  glow: "rgba(6,182,212,0.22)",
  accent: "#38bdf8",
  accentSoft: "rgba(103,232,249,0.35)",
  canvas: ["#0c2438", "#071724", "#030910"],
  cGlow: "rgba(6,182,212,0.25)",
  btn: "linear-gradient(to right,#0891b2,#0369a1)",
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

  /* ===== Matte satin grain texture ===== */
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

  /* ================ CYAN SKY PREMIUM CARD (flip) ================ */
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
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-[24px] overflow-hidden p-4 flex flex-col justify-between select-none ${dim ? "opacity-40 blur-[1px]" : ""}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: CYAN.bgGrad,
            boxShadow:
              "0 30px 70px -20px rgba(0,0,0,0.95), 0 0 35px -10px rgba(6,182,212,0.28), 0 0 0 1px rgba(103,232,249,0.22) inset, 0 1px 2px 0 rgba(255,255,255,0.25) inset",
          }}
        >
          <Satin />
          <div
            className="absolute -top-16 left-1/4 w-60 h-40 rounded-full pointer-events-none"
            style={{
              background: "rgba(56,189,248,0.08)",
              filter: "blur(48px)",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "rgba(2,132,199,0.18)", filter: "blur(72px)" }}
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            viewBox="0 0 430 271"
            fill="none"
          >
            <line
              x1="0"
              y1="180"
              x2="430"
              y2="180"
              stroke="rgba(103,232,249,0.18)"
              strokeWidth="1"
            />
            <circle cx="280" cy="75" r="1.2" fill="#67e8f9" />
            <circle cx="350" cy="135" r="1.6" fill="#ffffff" opacity="0.6" />
            <circle cx="170" cy="225" r="1" fill="#38bdf8" />
            <path
              d="M375 45 Q375 52 368 52 Q375 52 375 59 Q375 52 382 52 Q375 52 375 45Z"
              fill="#67e8f9"
              opacity="0.7"
            />
          </svg>

          {/* Top */}
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

          {/* Middle */}
          <div className="relative z-10 my-auto flex items-center justify-between">
            <div>
              <span className="text-[8px] font-gaming tracking-[0.25em] text-slate-500 uppercase block">
                PASS ID
              </span>
              <div className="font-mono-num text-sm sm:text-base tracking-[0.2em] text-slate-100 font-bold drop-shadow-sm mt-0.5">
                {passId}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-gaming tracking-[0.25em] text-slate-500 uppercase block">
                ACCESS LEVEL
              </span>
              <div className="font-gaming text-xs sm:text-sm font-black text-cyan-400 tracking-wider mt-0.5">
                ALL PRIVILEGES
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-end justify-between border-t border-cyan-500/20 pt-2.5">
            <div className="min-w-0 flex-1">
              <span className="text-[7px] font-gaming tracking-[0.22em] text-slate-500 uppercase block">
                MEMBER NAME
              </span>
              <span className="text-xs sm:text-sm font-gaming font-black tracking-wider text-slate-100 uppercase block truncate max-w-[200px]">
                {name}
              </span>
              <span className="text-[8px] font-mono-num text-cyan-300/70 block mt-0.5">
                ID: {profile?.referral_code}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[7px] font-gaming tracking-[0.22em] text-slate-500 uppercase block">
                SESSION
              </span>
              <span className="text-[11px] font-mono-num font-bold text-cyan-300 uppercase tracking-widest block">
                2026-27
              </span>
            </div>
          </div>
        </div>

        {/* BACK */}
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
            <svg
              className="w-6 h-6 text-cyan-400/70 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8.5 10a4 4 0 0 1 0 4" />
              <path d="M12 7.5a7.5 7.5 0 0 1 0 9" />
              <path d="M15.5 5a11 11 0 0 1 0 14" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center justify-between border-t border-cyan-500/20 pt-2.5">
            <div>
              <span className="text-[7px] font-gaming tracking-[0.22em] text-slate-500 uppercase block">
                SECURITY VERIFIED
              </span>
              <span className="text-[9px] font-gaming font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
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

  /* ================ COSMIC DONOR CARD (flip) ================ */
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
          className={`absolute inset-0 rounded-[24px] overflow-hidden p-4 flex flex-col justify-between select-none ${dim ? "opacity-40 blur-[1px]" : ""}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: t.bgGrad,
            boxShadow:
              "0 25px 60px -15px rgba(0,0,0,0.85),0 0 0 1px rgba(255,255,255,0.12) inset",
          }}
        >
          <Satin />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 430 271"
            fill="none"
          >
            <path
              d="M275 60 Q275 73 262 73 Q275 73 275 86 Q275 73 288 73 Q275 73 275 60Z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M215 200 Q215 209 206 209 Q215 209 215 218 Q215 209 224 209 Q215 209 215 200Z"
              fill="white"
              opacity="0.75"
            />
            <circle cx="310" cy="140" r="1.6" fill="white" opacity="0.7" />
            <circle cx="370" cy="220" r="1.3" fill="white" opacity="0.5" />
          </svg>
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
              <span className="text-[8px] font-gaming tracking-[0.25em] text-white/50 uppercase block">
                CARD NUMBER
              </span>
              <div className="font-mono-num text-sm sm:text-base tracking-[0.22em] text-white/95 font-bold mt-0.5">
                5894 •••• •••• {last4}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-gaming tracking-[0.22em] text-white/50 uppercase block">
                SUPPORT
              </span>
              <div className="font-gaming text-sm sm:text-base font-black text-white">
                <span className="text-xs text-white/70">BDT</span> {total}
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-2">
            <div className="min-w-0 flex-1">
              <span className="text-[8px] font-gaming tracking-[0.2em] text-white/50 uppercase block">
                CARDHOLDER
              </span>
              <span className="text-xs sm:text-sm font-gaming font-black tracking-wider text-white uppercase block truncate max-w-[200px]">
                {name}
              </span>
              <span className="text-[8px] font-mono-num text-white/60 block mt-0.5">
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
            <svg
              className="w-6 h-6 text-white/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8.5 10a4 4 0 0 1 0 4" />
              <path d="M12 7.5a7.5 7.5 0 0 1 0 9" />
              <path d="M15.5 5a11 11 0 0 1 0 14" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2">
            <div>
              <span className="text-[8px] font-gaming tracking-[0.2em] text-white/50 uppercase block">
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

  /* ================ CANVAS DOWNLOAD (kind = premium | donor) ================ */
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

    if (isP) {
      x.strokeStyle = "rgba(103,232,249,0.18)";
      x.lineWidth = 1.5;
      x.beginPath();
      x.moveTo(70, 520);
      x.lineTo(W - 70, 520);
      x.stroke();
    }

    x.fillStyle = isP ? "#f8fafc" : "#ffffff";
    x.font = '900 30px "Orbitron", sans-serif';
    x.fillText(isP ? "✦  ADMISSION PORTAL" : "✦  ADMISSION", 70, 95);

    x.fillStyle = isP ? "#67e8f9" : "rgba(255,255,255,0.7)";
    x.font = '700 16px "Orbitron", sans-serif';
    x.fillText(isP ? "POLISHED CYAN SKY PASS" : t.name, 125, 128);

    if (isP) {
      x.fillStyle = "rgba(6,182,212,0.12)";
      x.beginPath();
      x.roundRect(W - 240, 70, 170, 44, 22);
      x.fill();
      x.strokeStyle = CYAN.accentSoft;
      x.lineWidth = 1.5;
      x.stroke();
      x.fillStyle = "#cffafe";
      x.font = '800 14px "Orbitron", sans-serif';
      x.textAlign = "center";
      x.fillText("UNLIMITED", W - 155, 98);
      x.textAlign = "left";
    } else {
      const spark = (cx: number, cy: number, s: number, o: number) => {
        x.save();
        x.globalAlpha = o;
        x.fillStyle = "#fff";
        x.beginPath();
        x.moveTo(cx, cy - s);
        x.quadraticCurveTo(cx, cy, cx + s, cy);
        x.quadraticCurveTo(cx, cy, cx, cy + s);
        x.quadraticCurveTo(cx, cy, cx - s, cy);
        x.quadraticCurveTo(cx, cy, cx, cy - s);
        x.closePath();
        x.fill();
        x.restore();
      };
      spark(650, 100, 26, 0.85);
      spark(780, 420, 32, 0.9);
      spark(600, 640, 24, 0.75);
    }

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

    if (isP) {
      x.textAlign = "right";
      x.fillStyle = "#64748b";
      x.font = '700 18px "Orbitron", sans-serif';
      x.fillText("SESSION", W - 70, 615);
      x.fillStyle = "#38bdf8";
      x.font = '700 28px "Share Tech Mono", monospace';
      x.fillText("2026-27", W - 70, 665);
    } else {
      x.beginPath();
      x.arc(W - 140, 640, 36, 0, Math.PI * 2);
      x.fillStyle = "#eb001b";
      x.fill();
      x.beginPath();
      x.arc(W - 95, 640, 36, 0, Math.PI * 2);
      x.fillStyle = "rgba(247,158,27,0.9)";
      x.fill();
    }

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-slate-50 dark:bg-[#151b27] shadow-2xl overflow-y-auto p-5 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            সেটিংস
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 cursor-pointer text-slate-700 dark:text-slate-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account */}
        <div className="rounded-2xl bg-white dark:bg-[#0f141d] border-2 border-slate-200 dark:border-white/10 p-4 mb-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white font-black shrink-0">
              {(session?.user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <Mail className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />{" "}
                {session?.user.email}
              </div>
              <div className="flex gap-1.5 mt-1.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black ${profile?.role === "admin" ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"}`}
                >
                  {profile?.role === "admin" ? "ADMIN" : "USER"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 ${isPremium ? "bg-amber-500 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"}`}
                >
                  {isPremium && <Crown className="w-2.5 h-2.5" />}
                  {isPremium ? "প্রিমিয়াম" : "ফ্রি"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-600 dark:text-slate-400">
                <span className="font-bold uppercase tracking-wider">
                  User ID:
                </span>
                <code className="text-sky-600 dark:text-sky-300 font-black tracking-widest">
                  {profile?.referral_code}
                </code>
                <button
                  onClick={copyCode}
                  className="p-1 rounded bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Referral */}
        {profile?.referral_code && (
          <div className="rounded-2xl bg-white dark:bg-[#0f141d] border-2 border-slate-200 dark:border-white/10 p-4 mb-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">
              <Ticket className="w-3 h-3" /> তোমার রেফারেল কোড
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-center py-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-200 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 font-black tracking-widest text-sm font-gaming">
                {profile.referral_code}
              </code>
              <button
                onClick={copyCode}
                className="p-2.5 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 cursor-pointer text-slate-700 dark:text-slate-200"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 cursor-pointer border-2 border-emerald-200 dark:border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </a>
            </div>
          </div>
        )}

        {/* ===== 🌊 PREMIUM PASS (ON TOP) ===== */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase mb-2 text-sky-700 dark:text-cyan-300">
            <Crown className="w-3 h-3" /> Premium Pass
          </div>
          {isPremium ? (
            <>
              <PremiumCard />
              <p className="text-center text-[10px] text-slate-600 dark:text-slate-400 font-bold mt-2 font-gaming tracking-wider">
                👆 CLICK CARD TO FLIP
              </p>
              <button
                onClick={() => downloadCard("premium")}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-black shadow-lg cursor-pointer active:scale-95 font-gaming tracking-wider uppercase"
                style={{
                  background: CYAN.btn,
                  border: `1px solid ${CYAN.accentSoft}`,
                }}
              >
                <Download className="w-4 h-4" /> Download Cyan Sky Pass (PNG)
              </button>
            </>
          ) : (
            <div
              className="rounded-2xl border-2 border-dashed p-4"
              style={{
                borderColor: CYAN.accentSoft,
                background: "rgba(6,182,212,0.05)",
              }}
            >
              <div className="relative">
                <PremiumCard dim />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center"
                    style={{ border: `1px solid ${CYAN.accentSoft}` }}
                  >
                    <Lock className="w-4 h-4" style={{ color: CYAN.accent }} />
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <div className="text-[11px] font-black font-gaming tracking-wider text-sky-700 dark:text-cyan-300">
                  CYAN SKY PASS 🔒
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Subscription নিলে এই polished matte pass তোমার হবে — ALL
                  PRIVILEGES 👑
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ===== 🌌 COSMIC DONOR CARD ===== */}
        {donationOn && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase mb-2 text-slate-700 dark:text-slate-300">
              <Bot className="w-3 h-3" /> Cosmic Donor Card
            </div>
            {!hasDonation ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-white/5 p-4">
                <div className="relative">
                  <DonorCard dim />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white font-gaming tracking-wider">
                    COSMIC DONOR CARD 🔒
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    BDT 20+ donate করো → admin approve → claim → তারপর download।
                    Click = flip!
                  </p>
                </div>
              </div>
            ) : !claimed ? (
              <div className="relative">
                <DonorCard dim />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-2xl">
                  <Gift className="w-7 h-7 text-amber-300 mb-2 animate-bounce" />
                  <button
                    onClick={claim}
                    className="px-6 py-2.5 rounded-xl text-white text-xs font-black shadow-lg cursor-pointer active:scale-95 font-gaming tracking-wider"
                    style={{
                      background: t.btn,
                      border: `1px solid ${t.accent}`,
                    }}
                  >
                    🎁 CLAIM YOUR CARD
                  </button>
                  <p className="text-[9px] text-slate-300 mt-2 font-bold">
                    {t.icon} {t.name} unlocked — claim koro!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <DonorCard />
                <p className="text-center text-[10px] text-slate-600 dark:text-slate-400 font-bold mt-2 font-gaming tracking-wider">
                  👆 CLICK CARD TO FLIP
                </p>
                <button
                  onClick={() => downloadCard("donor")}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-black shadow-lg cursor-pointer active:scale-95 font-gaming tracking-wider uppercase"
                  style={{ background: t.btn, border: `1px solid ${t.accent}` }}
                >
                  <Download className="w-4 h-4" /> Download Cosmic Card (PNG)
                </button>
              </>
            )}
          </div>
        )}

        {/* Donation box — dark themed for contrast in both modes */}
        {donationOn && (
          <div className="rounded-2xl bg-slate-900 dark:bg-[#0f141d] border-2 border-slate-800 dark:border-white/10 p-4 mb-3 text-white shadow-inner">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  ডেভেলপার রোবট 🤖
                </div>
                <div className="text-[10px] text-slate-300">
                  ঐচ্ছিক tip — রোবটকে energy দাও ⚡
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {[20, 50, 100, 500].map((v) => {
                const vt = tierOf(v);
                return (
                  <button
                    key={v}
                    onClick={() => setTip(v)}
                    className={`py-2 rounded-xl text-[11px] font-black cursor-pointer transition border font-gaming tracking-wider ${tip === v ? "text-white shadow-lg" : "bg-white/5 text-slate-300 hover:bg-white/10 border-transparent"}`}
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
            <div className="flex items-center justify-between gap-2 mb-2 rounded-xl bg-[#0f141d] border border-white/10 px-3 py-2">
              <span className="text-[10px] text-slate-300 font-bold">
                bKash:
              </span>
              <button
                onClick={copyNum}
                className="flex items-center gap-1 text-[10px] font-black text-pink-300 cursor-pointer"
              >
                {numCopied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}{" "}
                {BKASH_NUMBER}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                value={tipTrx}
                onChange={(e) => setTipTrx(e.target.value)}
                placeholder="Donation TrxID"
                className="flex-1 bg-[#0f141d] border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                onClick={sendTip}
                disabled={tipBusy}
                className="px-4 rounded-xl bg-gradient-to-r from-slate-500 to-slate-700 text-white text-[11px] font-black cursor-pointer disabled:opacity-50 shadow-lg"
              >
                পাঠাও
              </button>
            </div>
            {tipMsg && (
              <p className="text-[10px] text-cyan-300 mt-2 text-center font-bold">
                {tipMsg}
              </p>
            )}
          </div>
        )}

        {/* Admin */}
        {profile?.role === "admin" && onOpenAdmin && (
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-600/10 border-2 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-black hover:bg-blue-100 dark:hover:bg-blue-600/20 cursor-pointer mb-3"
          >
            <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
          </button>
        )}

        {/* Help */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border-2 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Help
          </a>
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/15 border-2 border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 text-[11px] font-bold hover:bg-sky-100 dark:hover:bg-sky-500/25 transition"
          >
            <Send className="w-3.5 h-3.5" /> Telegram
          </a>
        </div>

        <button
          onClick={async () => {
            await signOut();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-xs font-black hover:bg-red-100 dark:hover:bg-red-500/20 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> লগআউট
        </button>
        <p className="text-center text-[10px] text-slate-500 dark:text-slate-500 mt-4 font-gaming tracking-widest">
          CYAN SKY + COSMIC SERIES • ২০২৬-২৭
        </p>
      </div>
    </div>
  );
};
