import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useEscapeClose } from "../hooks/useEscapeClose";
import { initialUniversitiesData } from "../data/mockUniversities";
import { safeUrl } from "../lib/newsSeen";
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
  ExternalLink,
  Users,
  Heart,
  MessageSquareHeart,
  Share2,
  Phone,
  HelpCircle,
  Sparkles,
  Zap,
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

type Tier = (typeof TIERS)[number];

interface PremiumCardProps {
  dim?: boolean;
  flipped: boolean;
  onFlip: () => void;
  passId: string;
  name: string;
  referralCode?: string | null;
}

interface DonorCardProps {
  dim?: boolean;
  flipped: boolean;
  onFlip: () => void;
  tier: Tier;
  total: number;
  last4: string;
  name: string;
  referralCode?: string | null;
}

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

const PremiumCard = ({
  dim,
  flipped,
  onFlip,
  passId,
  name,
  referralCode,
}: PremiumCardProps) => (
  <div
    className="relative w-full aspect-[1.586/1]"
    style={{ perspective: "1200px" }}
  >
    <div
      onClick={() => !dim && onFlip()}
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
              ID: {referralCode}
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

const DonorCard = ({
  dim,
  flipped,
  onFlip,
  tier: t,
  total,
  last4,
  name,
  referralCode,
}: DonorCardProps) => (
  <div
    className="relative w-full aspect-[1.586/1]"
    style={{ perspective: "1200px" }}
  >
    <div
      onClick={() => !dim && onFlip()}
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
              ID: {referralCode}
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
  const [linkCopied, setLinkCopied] = useState(false);
  const [numCopied, setNumCopied] = useState(false);
  const [donationOn, setDonationOn] = useState(false);
  const [contribOn, setContribOn] = useState(true);
  const [tip, setTip] = useState(20);
  const [tipTrx, setTipTrx] = useState("");
  const [tipBusy, setTipBusy] = useState(false);
  const [tipMsg, setTipMsg] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [premiumFlipped, setPremiumFlipped] = useState(false);

  const [contribName, setContribName] = useState("");
  const [contribUni, setContribUni] = useState("");
  const [contribInfo, setContribInfo] = useState("");
  const [contribUrl, setContribUrl] = useState("");
  const [contribBusy, setContribBusy] = useState(false);
  const [contribMsg, setContribMsg] = useState("");

  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackContact, setFeedbackContact] = useState("");
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("app_settings")
      .select("donation_enabled, contribution_enabled")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setDonationOn(data.donation_enabled !== false);
          setContribOn(data.contribution_enabled !== false);
        }
      });
  }, [open]);

  useEscapeClose(open, onClose);

  if (!open) return null;

  const total = profile?.total_donated || 0;
  const hasDonation = total > 0;
  const claimed = !!profile?.donor_card;
  const isPremium = !!profile?.is_premium;
  const t = tierOf(total);
  const cardName = profile
    ? profile.full_name || session?.user.email || "DEV SUPPORTER"
    : "";
  const name = (cardName || "DEV SUPPORTER").toUpperCase();
  const last4 = String(total).padStart(4, "0");
  const passId = `VIP  ••••  ••••  ${profile?.referral_code || "0000"}`;

  const referralLink = profile?.referral_code
    ? `${APP_URL}/?ref=${profile.referral_code}`
    : "";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile?.referral_code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const copyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
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
      `🔗 অ্যাপ: ${referralLink}\n` +
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

  const submitContribution = async () => {
    if (contribInfo.trim().length < 10) {
      setContribMsg("❌ কমপক্ষে ১০ অক্ষরের তথ্য লিখো");
      return;
    }
    const cleanUrl = contribUrl.trim() ? safeUrl(contribUrl) : "";
    if (contribUrl.trim() && !cleanUrl) {
      setContribMsg("❌ সূত্র URL ঠিক না (https://... দিয়ে লেখো)");
      return;
    }
    setContribBusy(true);
    setContribMsg("");
    const uni = initialUniversitiesData.find((u) => u.id === contribUni);
    const { error } = await supabase.from("user_contributions").insert({
      user_id: profile?.id || null,
      contributor_name:
        contribName.trim() ||
        profile?.full_name ||
        `User-${profile?.referral_code || "ANON"}`,
      university_id: contribUni || null,
      university_name: uni?.name || "সাধারণ",
      info_text: contribInfo.trim(),
      source_url: cleanUrl || null,
      status: "pending",
    });
    setContribBusy(false);
    setContribMsg(
      error
        ? "❌ " + error.message
        : "✅ ধন্যবাদ! Authority verify করলে News-এ তোমার নামসহ দেখাবে 🎉",
    );
    setContribInfo("");
    setContribUrl("");
    setContribName("");
    setTimeout(() => setContribMsg(""), 5000);
  };

  const submitFeedback = async () => {
    if (feedbackMsg.trim().length < 5) {
      return;
    }
    setFeedbackBusy(true);
    await supabase.from("app_feedback").insert({
      user_id: profile?.id || null,
      message: feedbackMsg.trim(),
      contact: feedbackContact.trim() || null,
    });
    setFeedbackBusy(false);
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackMsg("");
      setFeedbackContact("");
    }, 3000);
  };

  const togglePremiumCard = () => setPremiumFlipped((v) => !v);
  const toggleDonorCard = () => setFlipped((v) => !v);

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
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-b from-white to-slate-50 dark:from-[#151b27] dark:to-[#0f141d] shadow-2xl overflow-y-auto">
        {/* ===== PREMIUM HEADER ===== */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 px-6 py-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  সেটিংস
                </h2>
                <p className="text-[10px] text-white/80 font-semibold mt-0.5">
                  তোমার অ্যাকাউন্ট ও preferences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white cursor-pointer transition-all active:scale-95"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* ===== ACCOUNT SECTION ===== */}
          <section className="rounded-3xl bg-white dark:bg-[#1e2530] border-2 border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600" />
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-xl border-4 border-white dark:border-[#1e2530]">
                  {(session?.user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-black text-slate-900 dark:text-white truncate flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    {session?.user.email}
                  </div>
                  <div className="flex gap-2 mt-2.5 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        profile?.role === "admin"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {profile?.role === "admin" ? "ADMIN" : "USER"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 ${
                        isPremium
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                          : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {isPremium && <Crown className="w-3 h-3" />}
                      {isPremium ? "PREMIUM" : "FREE"}
                    </span>
                  </div>
                </div>
              </div>

              {profile?.referral_code && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      User ID:
                    </span>
                    <code className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#0f141d] text-blue-700 dark:text-blue-300 font-black tracking-widest text-sm">
                      {profile.referral_code}
                    </code>
                    <button
                      onClick={copyCode}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50 hover:bg-blue-200 dark:hover:bg-blue-950/70 cursor-pointer border border-blue-300 dark:border-blue-800 transition-all active:scale-95"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ===== REFERRAL & SHARING ===== */}
          {profile?.referral_code && (
            <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-[#1e2530] dark:via-[#1a2030] dark:to-[#1e2530] border-2 border-indigo-300 dark:border-indigo-700/60 shadow-xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Ticket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      রেফারেল ও শেয়ারিং
                    </h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                      বন্ধুদের invite করো — discount পাবে!
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                      তোমার কোড
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-center py-3 rounded-xl bg-white dark:bg-[#0f141d] border-2 border-indigo-400 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 font-black tracking-[0.2em] text-lg font-gaming shadow-inner">
                        {profile.referral_code}
                      </code>
                      <button
                        onClick={copyCode}
                        className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg cursor-pointer active:scale-95 transition-all"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                      রেফারেল লিংক
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white dark:bg-[#0f141d] border-2 border-indigo-300 dark:border-indigo-500/40 flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-mono truncate">
                          {referralLink}
                        </span>
                      </div>
                      <button
                        onClick={copyLink}
                        className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg cursor-pointer active:scale-95 transition-all shrink-0"
                      >
                        {linkCopied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/?text=${shareText}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11px] font-black shadow-md cursor-pointer active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-[11px] font-black shadow-md cursor-pointer active:scale-95 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Telegram
                    </a>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-700/60">
                    <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                      বন্ধু তোমার লিংক দিয়ে subscription নিলে তুমি{" "}
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        discount unlock
                      </strong>{" "}
                      পাবে!
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ===== PREMIUM PASS ===== */}
          <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#0b101a] dark:via-[#0f141d] dark:to-[#0b101a] border-2 border-slate-700 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Premium Pass
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {isPremium ? "Unlocked" : "Subscribe to unlock"}
                  </p>
                </div>
              </div>

              {isPremium ? (
                <>
                  <PremiumCard
                    flipped={premiumFlipped}
                    onFlip={togglePremiumCard}
                    passId={passId}
                    name={name}
                    referralCode={profile?.referral_code}
                  />
                  <p className="text-center text-[11px] text-slate-400 font-bold mt-3 font-gaming tracking-wider">
                    👆 CLICK CARD TO FLIP
                  </p>
                  <button
                    onClick={() => downloadCard("premium")}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-xs font-black shadow-xl cursor-pointer active:scale-95 font-gaming tracking-wider uppercase transition-all"
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
                    <PremiumCard
                      dim
                      flipped={premiumFlipped}
                      onFlip={togglePremiumCard}
                      passId={passId}
                      name={name}
                      referralCode={profile?.referral_code}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center border-2 border-cyan-400/40 shadow-xl">
                        <Lock className="w-6 h-6 text-cyan-300" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="text-[13px] font-black font-gaming tracking-wider text-cyan-300 mb-1">
                      CYAN SKY PASS 🔒
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      Subscription নিলে এই polished matte pass তোমার হবে — ALL
                      PRIVILEGES 👑
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ===== DONOR CARD ===== */}
          {donationOn && (
            <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#0b101a] dark:via-[#0f141d] dark:to-[#0b101a] border-2 border-slate-700 dark:border-white/10 shadow-2xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      Cosmic Donor Card
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {hasDonation ? `৳${total} donated` : "Support to unlock"}
                    </p>
                  </div>
                </div>

                {!hasDonation ? (
                  <>
                    <div className="relative">
                      <DonorCard
                        dim
                        flipped={flipped}
                        onFlip={toggleDonorCard}
                        tier={t}
                        total={total}
                        last4={last4}
                        name={name}
                        referralCode={profile?.referral_code}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-xl">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                      <div className="text-[13px] font-black text-white font-gaming tracking-wider mb-1">
                        COSMIC DONOR CARD 🔒
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        BDT 20+ donate করো → admin approve → claim → তারপর
                        download। Click = flip!
                      </p>
                    </div>
                  </>
                ) : !claimed ? (
                  <div className="relative">
                    <DonorCard
                      dim
                      flipped={flipped}
                      onFlip={toggleDonorCard}
                      tier={t}
                      total={total}
                      last4={last4}
                      name={name}
                      referralCode={profile?.referral_code}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
                      <Gift className="w-10 h-10 text-amber-300 mb-3 animate-bounce" />
                      <button
                        onClick={claim}
                        className="px-6 py-3 rounded-xl text-white text-xs font-black shadow-xl cursor-pointer active:scale-95 font-gaming tracking-wider transition-all"
                        style={{
                          background: t.btn,
                          border: `2px solid ${t.accent}`,
                        }}
                      >
                        🎁 CLAIM YOUR CARD
                      </button>
                      <p className="text-[11px] text-slate-300 mt-3 font-bold">
                        {t.icon} {t.name} unlocked — claim koro!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <DonorCard
                      flipped={flipped}
                      onFlip={toggleDonorCard}
                      tier={t}
                      total={total}
                      last4={last4}
                      name={name}
                      referralCode={profile?.referral_code}
                    />
                    <p className="text-center text-[11px] text-slate-400 font-bold mt-3 font-gaming tracking-wider">
                      👆 CLICK CARD TO FLIP
                    </p>
                    <button
                      onClick={() => downloadCard("donor")}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-xs font-black shadow-xl cursor-pointer active:scale-95 font-gaming tracking-wider uppercase transition-all"
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

          {/* ===== DONATION BOX ===== */}
          {donationOn && (
            <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#0f141d] dark:to-[#0f141d] border-2 border-slate-700 dark:border-white/10 shadow-xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">
                      ডেভেলপার রোবট 🤖
                    </div>
                    <div className="text-[11px] text-slate-400 font-semibold">
                      ঐচ্ছিক tip — রোবটকে energy দাও ⚡
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[20, 50, 100, 500].map((v) => {
                    const vt = tierOf(v);
                    return (
                      <button
                        key={v}
                        onClick={() => setTip(v)}
                        className={`py-3 rounded-xl text-[11px] font-black cursor-pointer transition-all border-2 font-gaming tracking-wider ${
                          tip === v
                            ? "text-white shadow-lg scale-105"
                            : "bg-white/5 text-slate-300 hover:bg-white/10 border-transparent"
                        }`}
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

                <div className="flex items-center justify-between gap-3 mb-3 rounded-xl bg-[#0f141d] border-2 border-white/10 px-4 py-3">
                  <span className="text-[11px] text-slate-400 font-bold">
                    bKash:
                  </span>
                  <button
                    onClick={copyNum}
                    className="flex items-center gap-2 text-[11px] font-black text-pink-300 cursor-pointer hover:text-pink-200 transition-all"
                  >
                    {numCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {BKASH_NUMBER}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    value={tipTrx}
                    onChange={(e) => setTipTrx(e.target.value)}
                    placeholder="Donation TrxID"
                    className="flex-1 bg-[#0f141d] border-2 border-white/10 rounded-xl px-4 py-3 text-[11px] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                  <button
                    onClick={sendTip}
                    disabled={tipBusy}
                    className="px-5 rounded-xl bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white text-[11px] font-black cursor-pointer disabled:opacity-50 shadow-lg transition-all"
                  >
                    পাঠাও
                  </button>
                </div>

                {tipMsg && (
                  <p className="text-[11px] text-cyan-300 mt-3 text-center font-bold">
                    {tipMsg}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ===== COMMUNITY CONTRIBUTION ===== */}
          {contribOn && (
            <section className="rounded-3xl bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-[#1a1530] dark:via-[#1e2530] dark:to-[#1a1030] border-2 border-violet-300 dark:border-violet-700/60 shadow-xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      তুমি কিছু জানো?
                    </h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                      তথ্য পাঠাও — News-এ তোমার নামসহ দেখাবে!
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <input
                    value={contribName}
                    onChange={(e) => setContribName(e.target.value)}
                    placeholder="তোমার নাম (দেখাবে: তথ্য দিয়েছেন — ...)"
                    className="w-full bg-white dark:bg-[#0f141d] border-2 border-violet-200 dark:border-violet-700/60 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:border-violet-400 text-slate-900 dark:text-white transition-all"
                  />
                  <select
                    value={contribUni}
                    onChange={(e) => setContribUni(e.target.value)}
                    className="w-full bg-white dark:bg-[#0f141d] border-2 border-violet-200 dark:border-violet-700/60 rounded-xl px-4 py-3 text-[11px] font-bold focus:outline-none text-slate-900 dark:text-white transition-all"
                  >
                    <option value="">— ভার্সিটি বাছো —</option>
                    {initialUniversitiesData.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={contribInfo}
                    onChange={(e) => setContribInfo(e.target.value)}
                    rows={3}
                    placeholder="যেমন: জাবির পরীক্ষা ২০ জানুয়ারি হবে বলে অফিসিয়াল নোটিশে প্রকাশ..."
                    className="w-full bg-white dark:bg-[#0f141d] border-2 border-violet-200 dark:border-violet-700/60 rounded-xl px-4 py-3 text-[11px] focus:outline-none resize-none focus:border-violet-400 text-slate-900 dark:text-white transition-all"
                  />
                  <input
                    value={contribUrl}
                    onChange={(e) => setContribUrl(e.target.value)}
                    placeholder="সূত্র URL (ঐচ্ছিক, https://...)"
                    className="w-full bg-white dark:bg-[#0f141d] border-2 border-violet-200 dark:border-violet-700/60 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:border-violet-400 text-slate-900 dark:text-white transition-all"
                  />
                  <button
                    onClick={submitContribution}
                    disabled={contribBusy}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white text-[11px] font-black cursor-pointer disabled:opacity-50 shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {contribBusy
                      ? "পাঠানো হচ্ছে..."
                      : "📤 তথ্য জমা দাও (Authority verify করবে)"}
                  </button>
                </div>

                {contribMsg && (
                  <p className="text-[11px] font-bold text-center mt-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-200">
                    {contribMsg}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ===== ADMIN ACCESS ===== */}
          {profile?.role === "admin" && onOpenAdmin && (
            <button
              onClick={() => onOpenAdmin?.()}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white text-xs font-black shadow-xl shadow-blue-500/30 cursor-pointer active:scale-95 border-2 border-blue-400/50 transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              সুপার অ্যাডমিন প্যানেল
            </button>
          )}

          {/* ===== HELP LINE ===== */}
          <section className="rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-[#0f1f1a] dark:via-[#0f1f2a] dark:to-[#0f1f1a] border-2 border-emerald-300 dark:border-emerald-700/60 shadow-xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    হেল্পলাইন ও সাপোর্ট
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                    যেকোনো সমস্যায় সরাসরি যোগাযোগ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg cursor-pointer active:scale-95 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-[11px] font-black">WhatsApp</span>
                </a>
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-br from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg cursor-pointer active:scale-95 transition-all"
                >
                  <Send className="w-5 h-5" />
                  <span className="text-[11px] font-black">Telegram</span>
                </a>
              </div>
            </div>
          </section>

          {/* ===== DIRECT FEEDBACK ===== */}
          <section className="rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-[#1a0f1f] dark:via-[#1e2530] dark:to-[#1a0f20] border-2 border-rose-300 dark:border-rose-700/60 shadow-xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <MessageSquareHeart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    মতামত বা সমস্যা
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                    সরাসরি আমাকে জানাও — upgrade করব!
                  </p>
                </div>
              </div>

              {feedbackSent ? (
                <div className="py-8 text-center rounded-xl bg-white/50 dark:bg-white/5">
                  <div className="text-4xl mb-3">💜</div>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    ধন্যবাদ! তোমার মতামত পৌঁছে গেছে
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    rows={3}
                    placeholder="অ্যাপটা কেমন লাগছে? কোনো সমস্যা? নতুন feature idea?"
                    className="w-full bg-white dark:bg-[#0f141d] border-2 border-rose-200 dark:border-rose-700/60 rounded-xl px-4 py-3 text-[11px] focus:outline-none resize-none focus:border-rose-400 text-slate-900 dark:text-white transition-all"
                  />
                  <input
                    value={feedbackContact}
                    onChange={(e) => setFeedbackContact(e.target.value)}
                    placeholder="মোবাইল/ইমেইল (ঐচ্ছিক — reply দিতে)"
                    className="w-full bg-white dark:bg-[#0f141d] border-2 border-rose-200 dark:border-rose-700/60 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:border-rose-400 text-slate-900 dark:text-white transition-all"
                  />
                  <button
                    onClick={submitFeedback}
                    disabled={feedbackBusy || feedbackMsg.trim().length < 5}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 text-white text-[11px] font-black cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    {feedbackBusy ? "পাঠানো হচ্ছে..." : "💜 মতামত পাঠাও"}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ===== LOGOUT ===== */}
          <button
            onClick={async () => {
              await signOut();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 border-2 border-red-400/50 text-white text-xs font-black shadow-lg shadow-red-500/25 cursor-pointer active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" />
            লগআউট
          </button>

          {/* ===== FOOTER ===== */}
          <div className="pt-4 pb-6">
            <p className="text-center text-[10px] text-slate-500 dark:text-slate-500 font-gaming tracking-widest font-semibold">
              CYAN SKY + COSMIC SERIES • ২০২৬-২৭
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
