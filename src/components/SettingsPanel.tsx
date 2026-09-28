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
  Bot,
  Lock,
  Gift,
  Download,
  ExternalLink,
  Users,
  Heart,
  MessageSquareHeart,
  Phone,
  HelpCircle,
  SlidersHorizontal,
  Award,
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
    bgGrad: "linear-gradient(135deg, #1f0a12 0%, #2e0d1b 60%, #0d0408 100%)",
    glow: "rgba(244,63,94,0.3)",
    accent: "#f43f5e",
    canvas: ["#1f0a12", "#2e0d1b", "#0d0408"],
    cGlow: "rgba(244,63,94,0.35)",
    btn: "linear-gradient(to right, #e11d48, #9f1239)",
  },
  {
    min: 100,
    name: "ASTRAL VIOLET",
    icon: "💫",
    bgGrad: "linear-gradient(135deg, #130d24 0%, #1c1138 60%, #0a0714 100%)",
    glow: "rgba(139,92,246,0.3)",
    accent: "#8b5cf6",
    canvas: ["#130d24", "#1c1138", "#0a0714"],
    cGlow: "rgba(139,92,246,0.35)",
    btn: "linear-gradient(to right, #7c3aed, #4c1d95)",
  },
  {
    min: 50,
    name: "COSMOS SAPPHIRE",
    icon: "🌊",
    bgGrad: "linear-gradient(135deg, #081226 0%, #0d1e3d 60%, #050a17 100%)",
    glow: "rgba(14,165,233,0.3)",
    accent: "#0ea5e9",
    canvas: ["#081226", "#0d1e3d", "#050a17"],
    cGlow: "rgba(14,165,233,0.35)",
    btn: "linear-gradient(to right, #0284c7, #1e3a8a)",
  },
  {
    min: 0,
    name: "NEBULA MINT",
    icon: "🌿",
    bgGrad: "linear-gradient(135deg, #071714 0%, #0c2621 60%, #030d0b 100%)",
    glow: "rgba(16,185,129,0.25)",
    accent: "#10b981",
    canvas: ["#071714", "#0c2621", "#030d0b"],
    cGlow: "rgba(16,185,129,0.3)",
    btn: "linear-gradient(to right, #059669, #064e3b)",
  },
];
const tierOf = (v: number) => TIERS.find((t) => v >= t.min) || TIERS[3];

const CYAN = {
  name: "CYAN SKY ELITE",
  bgGrad: "linear-gradient(135deg, #061924 0%, #0b2536 55%, #02090e 100%)",
  glow: "rgba(6,182,212,0.25)",
  accent: "#06b6d4",
  accentSoft: "rgba(6,182,212,0.4)",
  canvas: ["#061924", "#0b2536", "#02090e"],
  cGlow: "rgba(6,182,212,0.3)",
  btn: "linear-gradient(to right, #0891b2, #0e7490)",
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
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(115deg,#fff 0 1px,transparent 1px 7px)",
      }}
    />
    <div
      className="absolute inset-x-0 top-0 h-1/2"
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,0.05),transparent)",
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
          dim ? "opacity-30 blur-[1px]" : ""
        }`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: CYAN.bgGrad,
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.9), 0 0 25px -5px rgba(6,182,212,0.25), 0 0 0 1px rgba(103,232,249,0.25) inset",
        }}
      >
        <Satin />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shadow-inner">
              <Crown className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-slate-100 uppercase block leading-none">
                ADMISSION PORTAL
              </span>
              <span className="text-[8px] font-mono tracking-widest text-cyan-400 font-semibold uppercase block mt-1">
                CYAN SKY PASS
              </span>
            </div>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            <span className="text-[8px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
              UNLIMITED
            </span>
          </div>
        </div>
        <div className="relative z-10 my-auto flex items-center justify-between">
          <div>
            <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase block">
              PASS ID
            </span>
            <div className="font-mono text-xs sm:text-sm tracking-widest text-slate-100 font-bold mt-0.5">
              {passId}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase block">
              ACCESS
            </span>
            <div className="font-mono text-xs font-bold text-cyan-400 tracking-wider mt-0.5">
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
            "linear-gradient(135deg,#06131c 0%,#030a0f 55%,#010406 100%)",
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(103,232,249,0.2) inset",
        }}
      >
        <Satin />
        <div className="absolute left-0 right-0 top-6 h-8 bg-black/90 border-y border-cyan-500/20" />
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
              SECURITY CORE
            </span>
            <span className="text-[9px] font-mono font-semibold text-slate-300 tracking-wider block mt-0.5">
              POLISHED CYAN SKY
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
          dim ? "opacity-30 blur-[1px]" : ""
        }`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: t.bgGrad,
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.9), 0 0 25px -5px ${t.glow}, 0 0 0 1px rgba(255,255,255,0.15) inset`,
        }}
      >
        <Satin />
        <div
          className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full blur-2xl pointer-events-none opacity-40"
          style={{ background: t.glow }}
        />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-white/90" />
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
            "0 25px 50px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.15) inset",
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
  const [feedbackError, setFeedbackError] = useState("");

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

  const submitFeedback = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!feedbackMsg.trim()) {
      setFeedbackError("অনুগ্রহ করে আপনার মতামত লিখুন");
      return;
    }
    if (feedbackMsg.trim().length < 3) {
      setFeedbackError("মতামত অত্যন্ত সংক্ষিপ্ত (কমপক্ষে ৩ অক্ষর)");
      return;
    }
    setFeedbackBusy(true);
    setFeedbackError("");

    try {
      const { error } = await supabase.from("app_feedback").insert({
        user_id: profile?.id || null,
        message: feedbackMsg.trim(),
        contact: feedbackContact.trim() || null,
      });

      if (error) {
        setFeedbackError("ব্যর্থ হয়েছে: " + error.message);
      } else {
        setFeedbackSent(true);
        setFeedbackMsg("");
        setFeedbackContact("");
        setTimeout(() => {
          setFeedbackSent(false);
        }, 4000);
      }
    } catch (err: any) {
      setFeedbackError("সমস্যা হয়েছে: " + (err.message || "নেটওয়ার্ক এরর"));
    } finally {
      setFeedbackBusy(false);
    }
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
      {/* Matte Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Drawer */}
      <div className="relative w-full max-w-md bg-[#080b11] border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col h-full z-10 text-slate-200">
        {/* Header Bar */}
        <div className="relative px-6 py-4.5 border-b border-white/10 bg-[#0c1017]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wider text-white uppercase font-mono">
                  SETTINGS &amp; CONTROLS
                </h2>
                <p className="text-[10px] text-cyan-400 font-semibold tracking-wide">
                  Account Preferences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 flex items-center justify-center text-slate-400 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ===== 1. USER PROFILE CARD ===== */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0e131d] border border-cyan-500/20 p-4 shadow-xl">
            <div className="flex items-center gap-3.5 mb-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-blue-600 text-white font-mono font-bold text-lg flex items-center justify-center shadow-lg">
                {(session?.user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate font-mono">
                  {session?.user.email}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10">
                    {profile?.role === "admin" ? "ADMIN" : "USER"}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 ${
                      isPremium
                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                        : "bg-white/5 text-slate-400 border border-white/10"
                    }`}
                  >
                    {isPremium && (
                      <Crown className="w-2.5 h-2.5 text-amber-400" />
                    )}
                    {isPremium ? "PREMIUM VIP" : "FREE MEMBER"}
                  </span>
                </div>
              </div>
            </div>

            {profile?.referral_code && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#06080e] border border-cyan-500/20 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    PORTAL ID:
                  </span>
                  <span className="font-mono text-xs font-bold text-cyan-300 tracking-widest">
                    {profile.referral_code}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-400 text-[11px]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px]">COPY</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ===== 2. REFERRAL & INVITE ACCELERATOR ===== */}
          {profile?.referral_code && (
            <div className="relative overflow-hidden rounded-2xl bg-[#0e131d] border border-indigo-500/30 p-4 shadow-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
                  <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    রেফারেল লিংক ও বোনাস
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    বন্ধুদের শেয়ার করুন — ডিসকাউন্ট আনলক করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#06080e] border border-indigo-500/20 flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-300 truncate">
                    {referralLink}
                  </span>
                </div>
                <button
                  onClick={copyLink}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-mono font-bold tracking-wider transition-all cursor-pointer shrink-0 shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                >
                  {linkCopied ? "COPIED" : "COPY LINK"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/?text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
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
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white border border-sky-400/40 text-xs font-bold transition-all shadow-md shadow-sky-950/40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram
                </a>
              </div>
            </div>
          )}

          {/* ===== 3. CYAN SKY PASS SHOWCASE ===== */}
          <div className="rounded-2xl bg-[#0e131d] border border-cyan-500/30 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="text-xs font-bold text-white tracking-wide">
                  Cyan Sky Pass
                </h3>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/40">
                {isPremium ? "ACTIVE" : "LOCKED"}
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
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono tracking-wider shadow-lg shadow-cyan-600/30 border border-cyan-400/40 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> DOWNLOAD PASS (PNG)
                </button>
              </>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-white/5">
                <PremiumCard
                  dim
                  flipped={premiumFlipped}
                  onFlip={togglePremiumCard}
                  passId={passId}
                  name={name}
                  referralCode={profile?.referral_code}
                />
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="w-5 h-5 text-cyan-400 mb-1.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <p className="text-xs font-bold text-white">
                    প্রিমিয়াম পাস অ্যাক্সেস লকড
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    সাবস্ক্রাইব করে ফুল প্রিভিলেজ আনলক করুন
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== 4. COSMIC DONOR CARD SHOWCASE ===== */}
          {donationOn && (
            <div className="rounded-2xl bg-[#0e131d] border border-purple-500/30 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    Cosmic Supporter Card
                  </h3>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-400/40">
                  {hasDonation ? `৳${total} SUPPORTER` : "LOCKED"}
                </span>
              </div>

              {!hasDonation ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/5">
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
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                    <Lock className="w-5 h-5 text-purple-400 mb-1.5 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <p className="text-xs font-bold text-white">
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
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    <Gift className="w-8 h-8 text-amber-400 mb-2 animate-bounce" />
                    <button
                      onClick={claim}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black tracking-wider transition-all shadow-lg shadow-amber-500/30 cursor-pointer"
                    >
                      CLAIM CARD NOW
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
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold font-mono tracking-wider shadow-lg shadow-purple-600/30 border border-purple-400/40 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> DOWNLOAD SUPPORTER CARD
                    (PNG)
                  </button>
                </>
              )}
            </div>
          )}

          {/* ===== 5. DEVELOPER ENERGY VAULT ===== */}
          {donationOn && (
            <div className="rounded-2xl bg-[#0e131d] border border-cyan-500/20 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    ডেভেলপার এনার্জি সাপোর্ট
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    সার্ভার সচল রাখতে ঐচ্ছিক অনুদান
                  </p>
                </div>
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {[20, 50, 100, 500].map((v) => (
                  <button
                    key={v}
                    onClick={() => setTip(v)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      tip === v
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                        : "bg-[#06080e] text-slate-400 border-white/10 hover:border-cyan-500/40 hover:text-white"
                    }`}
                  >
                    ৳{v}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#06080e] border border-pink-500/20 mb-2.5">
                <span className="text-[10px] font-mono text-slate-400">
                  bKash (Send Money):
                </span>
                <button
                  onClick={copyNum}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
                >
                  {numCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-pink-400" />
                  )}
                  {BKASH_NUMBER}
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  value={tipTrx}
                  onChange={(e) => setTipTrx(e.target.value)}
                  placeholder="TrxID টাইপ করুন"
                  className="flex-1 bg-[#06080e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
                />
                <button
                  onClick={sendTip}
                  disabled={tipBusy}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold disabled:opacity-50 transition-all cursor-pointer shrink-0 shadow-lg shadow-cyan-600/30 border border-cyan-400/40"
                >
                  সাবমিট
                </button>
              </div>

              {tipMsg && (
                <p className="text-[11px] text-cyan-300 mt-2 text-center font-mono">
                  {tipMsg}
                </p>
              )}
            </div>
          )}

          {/* ===== 6. COMMUNITY INSIGHTS ===== */}
          {contribOn && (
            <div className="rounded-2xl bg-[#0e131d] border border-emerald-500/30 p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    ভর্তি তথ্য অবদান রাখুন
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    কোনো গুরুত্বপূর্ণ সার্কুলার জানা থাকলে আপডেট দিন
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  value={contribName}
                  onChange={(e) => setContribName(e.target.value)}
                  placeholder="আপনার নাম (ঐচ্ছিক)"
                  className="w-full bg-[#06080e] border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <select
                  value={contribUni}
                  onChange={(e) => setContribUni(e.target.value)}
                  className="w-full bg-[#06080e] border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 transition-colors"
                >
                  <option value="">— বিশ্ববিদ্যালয় বাছুন —</option>
                  {initialUniversitiesData.map((u) => (
                    <option
                      key={u.id}
                      value={u.id}
                      className="bg-slate-900 text-white"
                    >
                      {u.name}
                    </option>
                  ))}
                </select>
                <textarea
                  value={contribInfo}
                  onChange={(e) => setContribInfo(e.target.value)}
                  rows={2}
                  placeholder="সঠিক তথ্যের সারসংক্ষেপ..."
                  className="w-full bg-[#06080e] border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none focus:border-emerald-400 transition-colors"
                />
                <input
                  value={contribUrl}
                  onChange={(e) => setContribUrl(e.target.value)}
                  placeholder="অফিসিয়াল সার্কুলার লিংক (https://...)"
                  className="w-full bg-[#06080e] border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                />
                <button
                  onClick={submitContribution}
                  disabled={contribBusy}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30 border border-emerald-400/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  {contribBusy ? "জমা হচ্ছে..." : "তথ্য জমা দিন"}
                </button>
              </div>

              {contribMsg && (
                <p className="text-[11px] text-emerald-300 mt-2 text-center font-mono">
                  {contribMsg}
                </p>
              )}
            </div>
          )}

          {/* ===== 7. ADMIN PRIVILEGE ===== */}
          {profile?.role === "admin" && onOpenAdmin && (
            <button
              onClick={() => onOpenAdmin?.()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-mono font-bold tracking-wider shadow-lg shadow-indigo-600/30 border border-indigo-400/40 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              SUPER ADMIN CONSOLE
            </button>
          )}

          {/* ===== 8. DIRECT EXECUTIVE LINE ===== */}
          <div className="rounded-2xl bg-[#0e131d] border border-sky-500/30 p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">
                  জরুরি সাপোর্ট ও যোগাযোগ
                </h3>
                <p className="text-[10px] text-slate-400">
                  যেকোনো সমস্যায় সরাসরি মেসেজ দিন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white border border-sky-400/40 text-xs font-bold transition-all shadow-md shadow-sky-950/40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Telegram
              </a>
            </div>
          </div>

          {/* ===== 9. DIRECT FEEDBACK ===== */}
          <div className="rounded-2xl bg-[#0e131d] border border-rose-500/30 p-4 shadow-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-400/40 flex items-center justify-center">
                <MessageSquareHeart className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">
                  মতামত ও ফিডব্যাক
                </h3>
                <p className="text-[10px] text-slate-400">
                  সিস্টেমের ত্রুটি বা নতুন ফিচারের অনুরোধ জানান
                </p>
              </div>
            </div>

            {feedbackSent ? (
              <div className="p-3.5 text-center rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-semibold text-emerald-300">
                ✅ ধন্যবাদ! আপনার মূল্যবান মতামত সফলভাবে পৌঁছেছে।
              </div>
            ) : (
              <form onSubmit={submitFeedback} className="space-y-2">
                <textarea
                  value={feedbackMsg}
                  onChange={(e) => {
                    setFeedbackMsg(e.target.value);
                    if (feedbackError) setFeedbackError("");
                  }}
                  rows={2}
                  placeholder="আপনার মতামত বা সমস্যা লিখুন..."
                  className="w-full bg-[#06080e] border border-rose-500/30 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none transition-colors"
                />
                <input
                  value={feedbackContact}
                  onChange={(e) => setFeedbackContact(e.target.value)}
                  placeholder="ফোন বা ইমেইল (ঐচ্ছিক — উত্তরের জন্য)"
                  className="w-full bg-[#06080e] border border-rose-500/30 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                />

                {feedbackError && (
                  <p className="text-[11px] text-rose-400 font-medium">
                    ⚠️ {feedbackError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={feedbackBusy}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30 border border-rose-400/40"
                >
                  <Heart className="w-3.5 h-3.5" />
                  {feedbackBusy ? "পাঠানো হচ্ছে..." : "ফিডব্যাক সাবমিট করুন"}
                </button>
              </form>
            )}
          </div>

          {/* ===== 10. SYSTEM LOGOUT & TERMINAL FOOTER ===== */}
          <div className="pt-2 pb-6 space-y-3">
            <button
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/60 to-red-950/60 hover:from-rose-900/80 hover:to-red-900/80 text-rose-300 hover:text-white text-xs font-bold tracking-wider transition-all cursor-pointer shadow-lg shadow-rose-950/40"
            >
              <LogOut className="w-4 h-4" />
              TERMINATE SESSION (LOGOUT)
            </button>
            <p className="text-center text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              PORTAL 2026-27 • EXECUTIVE SUITE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
