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
      className={`relative w-full h-full cursor-pointer transition-transform duration-700 ${
        dim ? "pointer-events-none" : ""
      }`}
      style={{
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      <div
        className={`absolute inset-0 rounded-2xl overflow-hidden p-4 flex flex-col justify-between select-none ${
          dim ? "opacity-40 blur-[0.5px]" : ""
        }`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: CYAN.bgGrad,
          boxShadow:
            "0 20px 40px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(103,232,249,0.2) inset",
        }}
      >
        <Satin />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center">
              <span className="text-cyan-400 text-xs font-black">✦</span>
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-100 uppercase block leading-none">
                ADMISSION PORTAL
              </span>
              <span className="text-[8px] font-mono tracking-widest text-cyan-400 font-semibold uppercase block mt-1">
                CYAN SKY PASS
              </span>
            </div>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20">
            <span className="text-[8px] font-mono font-semibold tracking-wider text-cyan-300 uppercase">
              UNLIMITED
            </span>
          </div>
        </div>
        <div className="relative z-10 my-auto flex items-center justify-between">
          <div>
            <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase block">
              PASS ID
            </span>
            <div className="font-mono text-xs sm:text-sm tracking-widest text-slate-100 font-semibold mt-0.5">
              {passId}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase block">
              ACCESS
            </span>
            <div className="font-mono text-[11px] font-bold text-cyan-400 tracking-wider mt-0.5">
              ALL PRIVILEGES
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-end justify-between border-t border-cyan-500/20 pt-2">
          <div className="min-w-0 flex-1">
            <span className="text-[7px] font-mono tracking-wider text-slate-400 uppercase block">
              MEMBER
            </span>
            <span className="text-xs font-bold tracking-wide text-slate-100 uppercase block truncate max-w-[190px]">
              {name}
            </span>
            <span className="text-[8px] font-mono text-cyan-300/80 block">
              ID: {referralCode}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[7px] font-mono tracking-wider text-slate-400 uppercase block">
              SESSION
            </span>
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest block">
              2026-27
            </span>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden p-4 flex flex-col justify-between select-none"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background:
            "linear-gradient(135deg,#091a29 0%,#05111c 55%,#02070c 100%)",
          boxShadow:
            "0 20px 40px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(103,232,249,0.2) inset",
        }}
      >
        <Satin />
        <div className="absolute left-0 right-0 top-6 h-8 bg-black/80 border-y border-cyan-500/20" />
        <div className="relative z-10 mt-12 flex items-center">
          <div className="flex-1 h-7 rounded bg-slate-900/90 border border-cyan-500/30 flex items-center justify-end px-3">
            <span className="font-mono text-[10px] font-semibold text-cyan-300 tracking-widest">
              ACCESS CODE: 8940
            </span>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-cyan-500/20 pt-2">
          <div>
            <span className="text-[7px] font-mono tracking-wider text-slate-400 uppercase block">
              VERIFICATION
            </span>
            <span className="text-[9px] font-mono font-semibold text-slate-300 tracking-wider block mt-0.5">
              POLISHED CYAN CORE
            </span>
          </div>
          <div className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/30">
            <span className="text-[8px] font-mono font-bold text-cyan-400 tracking-widest">
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
      className={`relative w-full h-full cursor-pointer transition-transform duration-700 ${
        dim ? "pointer-events-none" : ""
      }`}
      style={{
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      <div
        className={`absolute inset-0 rounded-2xl overflow-hidden p-4 flex flex-col justify-between select-none ${
          dim ? "opacity-40 blur-[0.5px]" : ""
        }`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: t.bgGrad,
          boxShadow:
            "0 20px 40px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1) inset",
        }}
      >
        <Satin />
        <div
          className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full blur-2xl pointer-events-none opacity-40"
          style={{ background: t.glow }}
        />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white/90" />
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase block leading-none">
                ADMISSION
              </span>
              <span className="text-[9px] font-mono tracking-widest text-white/70 uppercase block mt-1">
                {t.name}
              </span>
            </div>
          </div>
        </div>
        <div className="relative z-10 my-auto flex items-center justify-between">
          <div>
            <span className="text-[8px] font-mono tracking-widest text-white/50 uppercase block">
              CARD NUMBER
            </span>
            <div className="font-mono text-xs sm:text-sm tracking-widest text-white/90 font-semibold mt-0.5">
              5894 •••• •••• {last4}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono tracking-widest text-white/50 uppercase block">
              SUPPORT
            </span>
            <div className="font-mono text-xs sm:text-sm font-bold text-white">
              BDT {total}
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-2">
          <div className="min-w-0 flex-1">
            <span className="text-[7px] font-mono tracking-wider text-white/50 uppercase block">
              CARDHOLDER
            </span>
            <span className="text-xs font-semibold tracking-wide text-white uppercase block truncate max-w-[190px]">
              {name}
            </span>
            <span className="text-[8px] font-mono text-white/60 block">
              ID: {referralCode}
            </span>
          </div>
          <div className="flex -space-x-2 items-center shrink-0">
            <div className="w-5 h-5 rounded-full bg-[#eb001b]/90 shadow-sm" />
            <div className="w-5 h-5 rounded-full bg-[#f79e1b]/90 shadow-sm" />
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden p-4 flex flex-col justify-between select-none"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: t.bgGrad,
          boxShadow:
            "0 20px 40px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1) inset",
        }}
      >
        <Satin />
        <div className="absolute left-0 right-0 top-6 h-8 bg-black/80 border-y border-white/10" />
        <div className="relative z-10 mt-12 flex items-center">
          <div className="flex-1 h-7 rounded bg-slate-100 flex items-center justify-end px-3">
            <span className="font-mono text-[10px] font-bold text-slate-800 tracking-widest">
              CVV 894
            </span>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2">
          <div>
            <span className="text-[7px] font-mono tracking-wider text-white/50 uppercase block">
              STATUS
            </span>
            <span className="text-[9px] font-mono font-semibold text-white/80 tracking-wider block mt-0.5">
              LIFETIME SUPPORTER
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-white/10 border border-white/20">
            <span className="text-[8px] font-mono font-bold text-white tracking-widest">
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
    ? profile.full_name || session?.user.email || "SUPPORTER"
    : "";
  const name = (cardName || "SUPPORTER").toUpperCase();
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
      `সকল পাবলিক, প্রকৌশল, মেডিকেল ও গুচ্ছ ভর্তির সময়সূচি, যোগ্যতা যাচাই ও লাইভ আপডেট এক অ্যাপে।\n` +
      `🔗 অ্যাপ: ${referralLink}\n` +
      `🆔 রেফারেল কোড: ${profile?.referral_code}`,
  );

  const sendTip = async () => {
    if (!profile || tipTrx.trim().length < 6) {
      setTipMsg("❌ সঠিক TrxID লিখুন");
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
        : "✅ ধন্যবাদ! ভেরিফাই হলে ডোনার কার্ড আনলক হবে।",
    );
    setTipTrx("");
  };

  const claim = async () => {
    await supabase.rpc("claim_donor_card");
    await refreshProfile();
  };

  const submitContribution = async () => {
    if (contribInfo.trim().length < 10) {
      setContribMsg("❌ কমপক্ষে ১০ অক্ষরের তথ্য লিখুন");
      return;
    }
    const cleanUrl = contribUrl.trim() ? safeUrl(contribUrl) : "";
    if (contribUrl.trim() && !cleanUrl) {
      setContribMsg("❌ সূত্র URL সঠিক নয় (https://... দিয়ে লিখুন)");
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
        : "✅ ধন্যবাদ! যাচাই সম্পন্ন হলে নিউজে দেখানো হবে।",
    );
    setContribInfo("");
    setContribUrl("");
    setContribName("");
    setTimeout(() => setContribMsg(""), 5000);
  };

  const submitFeedback = async () => {
    if (feedbackMsg.trim().length < 5) return;
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
    const r = 36;
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

    x.fillStyle = isP ? "#f8fafc" : "#ffffff";
    x.font = "bold 32px sans-serif";
    x.fillText(isP ? "✦ ADMISSION PORTAL" : "✦ ADMISSION SUPPORTER", 70, 95);

    x.fillStyle = isP ? "#67e8f9" : "rgba(255,255,255,0.7)";
    x.font = "600 18px monospace";
    x.fillText(isP ? "CYAN SKY PASS" : t.name, 70, 130);

    x.fillStyle = "rgba(255,255,255,0.5)";
    x.font = "600 16px sans-serif";
    x.fillText(isP ? "PASS ID" : "CARD NUMBER", 70, 310);

    x.fillStyle = "#ffffff";
    x.font = "bold 40px monospace";
    x.fillText(
      isP
        ? `VIP •••• •••• ${profile.referral_code || "0000"}`
        : `5894 •••• •••• ${last4}`,
      70,
      370,
    );

    x.textAlign = "right";
    x.fillStyle = "rgba(255,255,255,0.5)";
    x.font = "600 16px sans-serif";
    x.fillText(isP ? "ACCESS" : "SUPPORT", W - 70, 310);

    x.fillStyle = isP ? "#38bdf8" : "#ffffff";
    x.font = "bold 36px monospace";
    x.fillText(isP ? "ALL PRIVILEGES" : `BDT ${total}`, W - 70, 370);

    x.textAlign = "left";
    x.strokeStyle = "rgba(255,255,255,0.15)";
    x.lineWidth = 1.5;
    x.beginPath();
    x.moveTo(70, 560);
    x.lineTo(W - 70, 560);
    x.stroke();

    x.fillStyle = "rgba(255,255,255,0.5)";
    x.font = "600 16px sans-serif";
    x.fillText("CARDHOLDER", 70, 610);

    x.fillStyle = "#ffffff";
    x.font = "bold 28px sans-serif";
    x.fillText(name.slice(0, 26), 70, 655);

    x.fillStyle = "rgba(255,255,255,0.6)";
    x.font = "500 18px monospace";
    x.fillText(`ID: ${profile.referral_code || ""}`, 70, 690);

    const a = document.createElement("a");
    a.download = `${kind}-card-${name.replace(/\s+/g, "_")}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Drawer */}
      <div className="relative w-full max-w-md bg-slate-50 dark:bg-[#0c1017] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col h-full z-10">
        {/* Minimal Clean Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-white dark:bg-[#111722] border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              সেটিংস
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              অ্যাকাউন্ট ও কনফিগারেশন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ===== 1. USER PROFILE CARD ===== */}
          <div className="bg-white dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
            <div className="flex items-center gap-3.5 mb-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white/10 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {(session?.user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {session?.user.email}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                    {profile?.role === "admin" ? "ADMIN" : "USER"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 ${
                      isPremium
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                    }`}
                  >
                    {isPremium && <Crown className="w-2.5 h-2.5" />}
                    {isPremium ? "PREMIUM" : "FREE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Minimal User ID Banner */}
            {profile?.referral_code && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0d14] border border-slate-200/80 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    User ID:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                    {profile.referral_code}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 text-[11px]">
                        কপি হয়েছে
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">কপি</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ===== 2. REFERRAL & INVITE ===== */}
          {profile?.referral_code && (
            <div className="bg-white dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    রেফারেল লিংক
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    বন্ধুদের সাথে শেয়ার করে ডিসকাউন্ট আনলক করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate">
                    {referralLink}
                  </span>
                </div>
                <button
                  onClick={copyLink}
                  className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                >
                  {linkCopied ? "কপিকৃত" : "কপি"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/?text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    referralLink,
                  )}&text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-500/20 text-xs font-semibold hover:bg-sky-100 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram
                </a>
              </div>
            </div>
          )}

          {/* ===== 3. PREMIUM PASS SHOWCASE ===== */}
          <div className="bg-white dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-cyan-500 shrink-0" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Cyan Sky Pass
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                {isPremium ? "Active" : "Locked"}
              </span>
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
                <button
                  onClick={() => downloadCard("premium")}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> কার্ড ডাউনলোড (PNG)
                </button>
              </>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <PremiumCard
                  dim
                  flipped={premiumFlipped}
                  onFlip={togglePremiumCard}
                  passId={passId}
                  name={name}
                  referralCode={profile?.referral_code}
                />
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="w-5 h-5 text-slate-300 mb-1.5" />
                  <p className="text-xs font-semibold text-white">
                    প্রিমিয়াম সাবস্ক্রিপশনে আনলক হবে
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== 4. DONOR CARD SHOWCASE ===== */}
          {donationOn && (
            <div className="bg-white dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-500 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Cosmic Donor Card
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                  {hasDonation ? `৳${total} Donated` : "Support to Unlock"}
                </span>
              </div>

              {!hasDonation ? (
                <div className="relative rounded-2xl overflow-hidden">
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
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                    <Lock className="w-5 h-5 text-slate-300 mb-1.5" />
                    <p className="text-xs font-semibold text-white">
                      ৳২০+ অনুদানে বিশেষ কার্ড আনলক হবে
                    </p>
                  </div>
                </div>
              ) : !claimed ? (
                <div className="relative rounded-2xl overflow-hidden">
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
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    <Gift className="w-7 h-7 text-amber-300 mb-2 animate-bounce" />
                    <button
                      onClick={claim}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                    >
                      ক্লেম করুন
                    </button>
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
                  <button
                    onClick={() => downloadCard("donor")}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> কার্ড ডাউনলোড (PNG)
                  </button>
                </>
              )}
            </div>
          )}

          {/* ===== 5. DONATION BOX ===== */}
          {donationOn && (
            <div className="bg-white dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    ডেভেলপার সাপোর্ট
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    সার্ভার মেইনটেন্যান্স অনুদান (ঐচ্ছিক)
                  </p>
                </div>
                <Bot className="w-4 h-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[20, 50, 100, 500].map((v) => (
                  <button
                    key={v}
                    onClick={() => setTip(v)}
                    className={`py-1.5 rounded-lg text-xs font-semibold font-mono border transition-all cursor-pointer ${
                      tip === v
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent"
                        : "bg-slate-50 dark:bg-[#0a0d14] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100"
                    }`}
                  >
                    ৳{v}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 mb-2.5">
                <span className="text-[11px] text-slate-500 font-medium">
                  bKash (Personal):
                </span>
                <button
                  onClick={copyNum}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {numCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  {BKASH_NUMBER}
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  value={tipTrx}
                  onChange={(e) => setTipTrx(e.target.value)}
                  placeholder="TrxID লিখুন"
                  className="flex-1 bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  onClick={sendTip}
                  disabled={tipBusy}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold disabled:opacity-50 transition-opacity cursor-pointer shrink-0"
                >
                  পাঠান
                </button>
              </div>

              {tipMsg && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 text-center">
                  {tipMsg}
                </p>
              )}
            </div>
          )}

          {/* ===== 6. COMMUNITY CONTRIBUTION ===== */}
          {contribOn && (
            <div className="bg-white dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    তথ্য আপডেট পাঠান
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ভর্তি সংক্রান্ত কোনো তথ্য জানা থাকলে জমা দিন
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  value={contribName}
                  onChange={(e) => setContribName(e.target.value)}
                  placeholder="আপনার নাম (ঐচ্ছিক)"
                  className="w-full bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <select
                  value={contribUni}
                  onChange={(e) => setContribUni(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="">— বিশ্ববিদ্যালয় নির্বাচন করুন —</option>
                  {initialUniversitiesData.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <textarea
                  value={contribInfo}
                  onChange={(e) => setContribInfo(e.target.value)}
                  rows={2}
                  placeholder="তথ্য বিস্তারিত লিখুন..."
                  className="w-full bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none focus:ring-1 focus:ring-slate-400"
                />
                <input
                  value={contribUrl}
                  onChange={(e) => setContribUrl(e.target.value)}
                  placeholder="অফিসিয়াল নোটিশের লিংক (https://...)"
                  className="w-full bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  onClick={submitContribution}
                  disabled={contribBusy}
                  className="w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {contribBusy ? "পাঠানো হচ্ছে..." : "জমা দিন"}
                </button>
              </div>

              {contribMsg && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 text-center">
                  {contribMsg}
                </p>
              )}
            </div>
          )}

          {/* ===== 7. ADMIN BUTTON (IF APPLICABLE) ===== */}
          {profile?.role === "admin" && onOpenAdmin && (
            <button
              onClick={() => onOpenAdmin?.()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              সুপার অ্যাডমিন ড্যাশবোর্ড
            </button>
          )}

          {/* ===== 8. HELPLINE & SUPPORT ===== */}
          <div className="bg-white dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  সরাসরি সহায়তা
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  যেকোনো প্রয়োজনে মেসেজ দিন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                WhatsApp
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-sky-500" />
                Telegram
              </a>
            </div>
          </div>

          {/* ===== 9. FEEDBACK ===== */}
          <div className="bg-white dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquareHeart className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  মতামত ও পরামর্শ
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  অ্যাপটি আরও উন্নত করতে ফিডব্যাক দিন
                </p>
              </div>
            </div>

            {feedbackSent ? (
              <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-[#0a0d14] text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ধন্যবাদ! আপনার বার্তা পৌঁছে গেছে।
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  rows={2}
                  placeholder="আপনার মতামত লিখুন..."
                  className="w-full bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none focus:ring-1 focus:ring-slate-400"
                />
                <input
                  value={feedbackContact}
                  onChange={(e) => setFeedbackContact(e.target.value)}
                  placeholder="ফোন বা ইমেইল (ঐচ্ছিক)"
                  className="w-full bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  onClick={submitFeedback}
                  disabled={feedbackBusy || feedbackMsg.trim().length < 5}
                  className="w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  {feedbackBusy ? "পাঠানো হচ্ছে..." : "ফিডব্যাক পাঠান"}
                </button>
              </div>
            )}
          </div>

          {/* ===== 10. LOGOUT & FOOTER ===== */}
          <div className="pt-2 pb-6 space-y-3">
            <button
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              লগআউট করুন
            </button>
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-mono tracking-wider">
              PORTAL 2026-27 • VERSION 2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
