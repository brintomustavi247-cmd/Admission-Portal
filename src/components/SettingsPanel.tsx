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
            "0 20px 40px -10px rgba(0,0,0,0.7), 0 0 20px -5px rgba(6,182,212,0.25), 0 0 0 1px rgba(103,232,249,0.25) inset",
        }}
      >
        <Satin />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shadow-inner">
              <Crown className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-slate-100 uppercase block leading-none">
                Admission Portal
              </span>
              <span className="text-[9px] tracking-wider text-cyan-400 font-semibold uppercase block mt-1">
                Cyan Sky Pass
              </span>
            </div>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            <span className="text-[9px] font-semibold tracking-wider text-cyan-300 uppercase">
              Unlimited
            </span>
          </div>
        </div>
        <div className="relative z-10 my-auto flex items-center justify-between">
          <div>
            <span className="text-[9px] font-medium tracking-wider text-slate-400 uppercase block">
              Pass ID
            </span>
            <div className="font-mono text-xs sm:text-sm tracking-widest text-slate-100 font-bold mt-0.5">
              {passId}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-medium tracking-wider text-slate-400 uppercase block">
              Access
            </span>
            <div className="text-xs font-bold text-cyan-400 tracking-wide mt-0.5">
              All Privileges
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-end justify-between border-t border-cyan-500/20 pt-2">
          <div className="min-w-0 flex-1">
            <span className="text-[8px] font-medium tracking-wider text-slate-400 uppercase block">
              Member
            </span>
            <span className="text-xs font-bold tracking-wide text-slate-100 uppercase block truncate max-w-[190px]">
              {name}
            </span>
            <span className="text-[9px] font-mono text-cyan-300/80 block">
              ID: {referralCode}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[8px] font-medium tracking-wider text-slate-400 uppercase block">
              Session
            </span>
            <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider block">
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
            "0 20px 40px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(103,232,249,0.2) inset",
        }}
      >
        <Satin />
        <div className="absolute left-0 right-0 top-6 h-8 bg-black/90 border-y border-cyan-500/20" />
        <div className="relative z-10 mt-12 flex items-center">
          <div className="flex-1 h-7 rounded bg-slate-900/90 border border-cyan-500/30 flex items-center justify-end px-3">
            <span className="font-mono text-[10px] font-semibold text-cyan-300 tracking-wider">
              Access Code: 8940
            </span>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-cyan-500/20 pt-2">
          <div>
            <span className="text-[8px] font-medium tracking-wider text-slate-400 uppercase block">
              Security Core
            </span>
            <span className="text-[10px] font-medium text-slate-300 tracking-wider block mt-0.5">
              Polished Cyan Sky
            </span>
          </div>
          <div className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/30">
            <span className="text-[9px] font-bold text-cyan-400 tracking-wider">
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
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.7), 0 0 20px -5px ${t.glow}, 0 0 0 1px rgba(255,255,255,0.15) inset`,
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
              <span className="text-xs font-semibold tracking-wider text-white uppercase block leading-none">
                Admission
              </span>
              <span className="text-[9px] tracking-wider text-white/70 uppercase block mt-1 font-medium">
                {t.name}
              </span>
            </div>
          </div>
        </div>
        <div className="relative z-10 my-auto flex items-center justify-between">
          <div>
            <span className="text-[8px] tracking-wider text-white/50 uppercase block font-medium">
              Card Number
            </span>
            <div className="font-mono text-xs sm:text-sm tracking-wider text-white/90 font-semibold mt-0.5">
              5894 •••• •••• {last4}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] tracking-wider text-white/50 uppercase block font-medium">
              Support
            </span>
            <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
              BDT {total}
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-2">
          <div className="min-w-0 flex-1">
            <span className="text-[8px] tracking-wider text-white/50 uppercase block font-medium">
              Cardholder
            </span>
            <span className="text-xs font-semibold tracking-wide text-white uppercase block truncate max-w-[190px]">
              {name}
            </span>
            <span className="text-[9px] font-mono text-white/60 block">
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
            "0 20px 40px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.15) inset",
        }}
      >
        <Satin />
        <div className="absolute left-0 right-0 top-6 h-8 bg-black/80 border-y border-white/10" />
        <div className="relative z-10 mt-12 flex items-center">
          <div className="flex-1 h-7 rounded bg-slate-100 flex items-center justify-end px-3">
            <span className="font-mono text-[10px] font-bold text-slate-800 tracking-wider">
              CVV 894
            </span>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2">
          <div>
            <span className="text-[8px] tracking-wider text-white/50 uppercase block font-medium">
              Status
            </span>
            <span className="text-[10px] font-medium text-white/80 tracking-wider block mt-0.5">
              Lifetime Supporter
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-white/10 border border-white/20">
            <span className="text-[9px] font-bold text-white tracking-wider">
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
    x.font = "600 32px sans-serif";
    x.fillText(isP ? "✦ ADMISSION PORTAL" : "✦ ADMISSION SUPPORTER", 70, 95);

    x.fillStyle = isP ? "#67e8f9" : "rgba(255,255,255,0.7)";
    x.font = "600 18px monospace";
    x.fillText(isP ? "CYAN SKY PASS" : t.name, 70, 130);

    x.fillStyle = "rgba(255,255,255,0.5)";
    x.font = "500 16px sans-serif";
    x.fillText(isP ? "PASS ID" : "CARD NUMBER", 70, 310);

    x.fillStyle = "#ffffff";
    x.font = "600 40px monospace";
    x.fillText(
      isP
        ? `VIP •••• •••• ${profile.referral_code || "0000"}`
        : `5894 •••• •••• ${last4}`,
      70,
      370,
    );

    x.textAlign = "right";
    x.fillStyle = "rgba(255,255,255,0.5)";
    x.font = "500 16px sans-serif";
    x.fillText(isP ? "ACCESS" : "SUPPORT", W - 70, 310);

    x.fillStyle = isP ? "#38bdf8" : "#ffffff";
    x.font = "600 36px sans-serif";
    x.fillText(isP ? "ALL PRIVILEGES" : `BDT ${total}`, W - 70, 370);

    x.textAlign = "left";
    x.strokeStyle = "rgba(255,255,255,0.15)";
    x.lineWidth = 1.5;
    x.beginPath();
    x.moveTo(70, 560);
    x.lineTo(W - 70, 560);
    x.stroke();

    x.fillStyle = "rgba(255,255,255,0.5)";
    x.font = "500 16px sans-serif";
    x.fillText("CARDHOLDER", 70, 610);

    x.fillStyle = "#ffffff";
    x.font = "600 28px sans-serif";
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
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Drawer Container - Adapts to Light & Dark Theme */}
      <div className="relative w-full max-w-md bg-slate-50 dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col h-full z-10 transition-colors">
        {/* Top Header */}
        <div className="relative px-6 py-4.5 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#111722]/90 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                  সেটিংস ও কন্ট্রোল
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  অ্যাকাউন্ট ও প্রেফারেন্স
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ===== 1. USER PROFILE CARD ===== */}
          <div className="rounded-2xl bg-white dark:bg-[#111722] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm transition-colors">
            <div className="flex items-center gap-3.5 mb-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {(session?.user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {session?.user.email}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                    {profile?.role === "admin" ? "ADMIN" : "USER"}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                      isPremium
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                    }`}
                  >
                    {isPremium && <Crown className="w-3 h-3 text-amber-500" />}
                    {isPremium ? "PREMIUM VIP" : "FREE MEMBER"}
                  </span>
                </div>
              </div>
            </div>

            {profile?.referral_code && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    User ID:
                  </span>
                  <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400 tracking-wider">
                    {profile.referral_code}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/80 border border-cyan-200 dark:border-cyan-500/40 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-[11px]">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-[11px]">কপি</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ===== 2. REFERRAL & INVITE ===== */}
          {profile?.referral_code && (
            <div className="rounded-2xl bg-white dark:bg-[#111722] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm transition-colors">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-400/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    রেফারেল লিংক ও বোনাস
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    বন্ধুদের শেয়ার করুন — বিশেষ ডিসকাউন্ট আনলক করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                    {referralLink}
                  </span>
                </div>
                <button
                  onClick={copyLink}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  {linkCopied ? "কপিকৃত" : "কপি"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/?text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    referralLink,
                  )}&text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  Telegram
                </a>
              </div>
            </div>
          )}

          {/* ===== 3. CYAN SKY PASS SHOWCASE ===== */}
          <div className="rounded-2xl bg-white dark:bg-[#111722] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Cyan Sky Pass
                </h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
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
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> পাস ডাউনলোড (PNG)
                </button>
              </>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                <PremiumCard
                  dim
                  flipped={premiumFlipped}
                  onFlip={togglePremiumCard}
                  passId={passId}
                  name={name}
                  referralCode={profile?.referral_code}
                />
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="w-5 h-5 text-cyan-300 mb-1.5" />
                  <p className="text-xs font-bold text-white">
                    প্রিমিয়াম পাস অ্যাক্সেস লকড
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    সাবস্ক্রাইব করে ফুল প্রিভিলেজ আনলক করুন
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== 4. COSMIC DONOR CARD SHOWCASE ===== */}
          {donationOn && (
            <div className="rounded-2xl bg-white dark:bg-[#111722] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Cosmic Supporter Card
                  </h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                  {hasDonation ? `৳${total} SUPPORTER` : "LOCKED"}
                </span>
              </div>

              {!hasDonation ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
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
                  <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                    <Lock className="w-5 h-5 text-purple-300 mb-1.5" />
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
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    <Gift className="w-8 h-8 text-amber-400 mb-2 animate-bounce" />
                    <button
                      onClick={claim}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
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
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> কার্ড ডাউনলোড (PNG)
                  </button>
                </>
              )}
            </div>
          )}

          {/* ===== 5. DEVELOPER SUPPORT ===== */}
          {donationOn && (
            <div className="rounded-2xl bg-white dark:bg-[#111722] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    ডেভেলপার এনার্জি সাপোর্ট
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    সার্ভার সচল রাখতে ঐচ্ছিক অনুদান
                  </p>
                </div>
                <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {[20, 50, 100, 500].map((v) => (
                  <button
                    key={v}
                    onClick={() => setTip(v)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      tip === v
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                        : "bg-slate-50 dark:bg-[#080b11] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300"
                    }`}
                  >
                    ৳{v}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 mb-2.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  bKash (Send Money):
                </span>
                <button
                  onClick={copyNum}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
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
                  placeholder="TrxID টাইপ করুন"
                  className="flex-1 bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono transition-colors"
                />
                <button
                  onClick={sendTip}
                  disabled={tipBusy}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  সাবমিট
                </button>
              </div>

              {tipMsg && (
                <p className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-2 text-center font-medium">
                  {tipMsg}
                </p>
              )}
            </div>
          )}

          {/* ===== 6. COMMUNITY INSIGHTS ===== */}
          {contribOn && (
            <div className="rounded-2xl bg-white dark:bg-[#111722] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-400/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    ভর্তি তথ্য অবদান রাখুন
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    কোনো গুরুত্বপূর্ণ সার্কুলার জানা থাকলে আপডেট দিন
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  value={contribName}
                  onChange={(e) => setContribName(e.target.value)}
                  placeholder="আপনার নাম (ঐচ্ছিক)"
                  className="w-full bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <select
                  value={contribUni}
                  onChange={(e) => setContribUni(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                >
                  <option value="">— বিশ্ববিদ্যালয় বাছুন —</option>
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
                  placeholder="সঠিক তথ্যের সারসংক্ষেপ..."
                  className="w-full bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <input
                  value={contribUrl}
                  onChange={(e) => setContribUrl(e.target.value)}
                  placeholder="অফিসিয়াল সার্কুলার লিংক (https://...)"
                  className="w-full bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
                />
                <button
                  onClick={submitContribution}
                  disabled={contribBusy}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {contribBusy ? "জমা হচ্ছে..." : "তথ্য জমা দিন"}
                </button>
              </div>

              {contribMsg && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 text-center font-medium">
                  {contribMsg}
                </p>
              )}
            </div>
          )}

          {/* ===== 7. ADMIN PRIVILEGE ===== */}
          {profile?.role === "admin" && onOpenAdmin && (
            <button
              onClick={() => onOpenAdmin?.()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              সুপার অ্যাডমিন ড্যাশবোর্ড
            </button>
          )}

          {/* ===== 8. DIRECT SUPPORT ===== */}
          <div className="rounded-2xl bg-white dark:bg-[#111722] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-500/20 border border-sky-200 dark:border-sky-400/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  জরুরি সাপোর্ট ও হেল্পলাইন
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  যেকোনো প্রয়োজনে সরাসরি যোগাযোগ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                WhatsApp
              </a>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Telegram
              </a>
            </div>
          </div>

          {/* ===== 9. DIRECT FEEDBACK ===== */}
          <div className="rounded-2xl bg-white dark:bg-[#111722] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-400/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  মতামত ও ফিডব্যাক
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  সিস্টেমের ত্রুটি বা নতুন ফিচারের অনুরোধ জানান
                </p>
              </div>
            </div>

            {feedbackSent ? (
              <div className="p-3.5 text-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
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
                  className="w-full bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none transition-colors"
                />
                <input
                  value={feedbackContact}
                  onChange={(e) => setFeedbackContact(e.target.value)}
                  placeholder="ফোন বা ইমেইল (ঐচ্ছিক — উত্তরের জন্য)"
                  className="w-full bg-slate-50 dark:bg-[#080b11] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                />

                {feedbackError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    ⚠️ {feedbackError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={feedbackBusy}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5" />
                  {feedbackBusy ? "পাঠানো হচ্ছে..." : "ফিডব্যাক সাবমিট করুন"}
                </button>
              </form>
            )}
          </div>

          {/* ===== 10. SYSTEM LOGOUT & FOOTER ===== */}
          <div className="pt-2 pb-6 space-y-3">
            <button
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              লগআউট করুন
            </button>
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 tracking-wider">
              PORTAL 2026-27 • EXECUTIVE SUITE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
