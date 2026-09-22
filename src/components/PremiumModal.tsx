import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { toBanglaNum } from "../lib/banglaUtils";
import {
  Crown,
  Check,
  X,
  RefreshCw,
  Wallet,
  Clock,
  Copy,
  Ticket,
  MessageCircle,
  Send,
  Calendar,
  ShieldCheck,
  Zap,
  Printer,
  Bell,
  BadgeCheck,
  Headphones,
  LogOut,
  ChevronDown,
} from "lucide-react";

const BKASH_NUMBER = "01XXXXXXXXX";
const WHATSAPP = "https://wa.me/8801XXXXXXXXX";
const TELEGRAM = "https://t.me/TOMAR_CHANNEL";

const BENEFITS = [
  {
    icon: <Calendar className="w-4 h-4" />,
    t: "সব সময়সূচি ও মাস্টার ক্যালেন্ডার",
    d: "২১+ প্রতিষ্ঠানের ভর্তি পরীক্ষার পূর্ণাঙ্গ সময়সূচি — লাইভ আপডেট সহ",
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    t: "আনলিমিটেড যোগ্যতা চেক",
    d: "GPA দিয়ে যতবার খুশি যাচাই + ২য় বার পরীক্ষার্থী ফিল্টার",
  },
  {
    icon: <Printer className="w-4 h-4" />,
    t: "প্রিন্ট ও PDF ডাউনলোড",
    d: "সুন্দর বাংলা টাইপোগ্রাফিতে পুরো সেশনের ক্যালেন্ডার এক ক্লিকে",
  },
  {
    icon: <Bell className="w-4 h-4" />,
    t: "প্রায়োরিটি আপডেট",
    d: "তারিখ পরিবর্তন, প্রবেশপত্র ও রেজাল্ট — সবার আগে নোটিফিকেশন",
  },
  {
    icon: <BadgeCheck className="w-4 h-4" />,
    t: "প্রিমিয়াম ব্যাজ + Cyan Sky Pass",
    d: "সেটিংস-এ exclusive প্রিমিয়াম কার্ড ও HD PNG ডাউনলোড",
  },
  {
    icon: <Headphones className="w-4 h-4" />,
    t: "প্রায়োরিটি সাপোর্ট",
    d: "WhatsApp / Telegram-এ সমস্যায় আগে উত্তর ও সহায়তা",
  },
];

const COMPARE: { f: string; free: string | boolean; pro: string | boolean }[] =
  [
    { f: "সময়সূচি ব্রাউজ", free: "সীমিত", pro: "সম্পূর্ণ" },
    { f: "যোগ্যতা চেক", free: "৩ বার/দিন", pro: "আনলিমিটেড" },
    { f: "প্রিন্ট / PDF", free: false, pro: true },
    { f: "২য় বার ফিল্টার", free: false, pro: true },
    { f: "লাইভ আপডেট", free: "দেরিতে", pro: "তাৎক্ষণিক" },
    { f: "সাপোর্ট", free: "সাধারণ", pro: "প্রায়োরিটি" },
  ];

const Cell: React.FC<{ v: string | boolean; good?: boolean }> = ({
  v,
  good,
}) =>
  typeof v === "boolean" ? (
    v ? (
      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
    ) : (
      <X className="w-4 h-4 text-red-400/70 mx-auto" />
    )
  ) : (
    <span
      className={`text-[10px] font-bold ${good ? "text-emerald-300" : "text-slate-400"}`}
    >
      {v}
    </span>
  );

export const PremiumPaywall: React.FC = () => {
  const { session, profile, refreshProfile, signOut } = useAuth();
  const [referralOn, setReferralOn] = useState(true);
  const [basePrice, setBasePrice] = useState(99);
  const [referralPrice, setReferralPrice] = useState(49);
  const [code, setCode] = useState("");
  const [codeOwner, setCodeOwner] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [codeMsg, setCodeMsg] = useState("");
  const [trx, setTrx] = useState("");
  const [sender, setSender] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [numCopied, setNumCopied] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setReferralOn(data.referral_discount_enabled);
        setBasePrice(data.base_price ?? 99);
        setReferralPrice(data.referral_price ?? 49);
      });
    if (!profile) return;
    supabase
      .from("payment_requests")
      .select("*")
      .eq("user_id", profile.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => setPending(data || null));
  }, [profile]);

  if (!profile) return null;

  const ownDiscount = profile.discount_unlocked || !!profile.referred_by;
  const price =
    referralOn && (ownDiscount || !!codeOwner) ? referralPrice : basePrice;
  const discounted = price === referralPrice;

  const verifyCode = async () => {
    setCodeMsg("");
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setCodeMsg("কোড লিখো");
      return;
    }
    const { data } = await supabase.rpc("check_referral_code", { code: c });
    const row = Array.isArray(data) ? data[0] : data;
    if (row && row.owner_id !== profile.id) {
      setCodeOwner({ id: row.owner_id, name: row.owner_name || "friend" });
      setCodeMsg("✅ কোড সক্রিয়! দাম কমে হলো ৳" + toBanglaNum(referralPrice));
    } else {
      setCodeOwner(null);
      setCodeMsg("❌ কোড সঠিক নয় (নিজের কোড দেওয়া যাবে না)");
    }
  };

  const copyNum = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setNumCopied(true);
      setTimeout(() => setNumCopied(false), 1500);
    } catch {}
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile.referral_code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const submit = async () => {
    if (trx.trim().length < 6 || sender.trim().length < 11) {
      setMsg("সঠিক TrxID এবং bKash নম্বর লিখো");
      return;
    }
    setBusy(true);
    setMsg("");
    const { error } = await supabase.from("payment_requests").insert({
      user_id: profile.id,
      trx_id: trx.trim(),
      sender_phone: sender.trim(),
      plan: "season",
      amount: price,
      referral_code: codeOwner ? code.trim().toUpperCase() : null,
      status: "pending",
    });
    setBusy(false);
    if (error) setMsg("সাবমিট ব্যর্থ: " + error.message);
    else {
      setPending({ plan: "season", amount: price, status: "pending" });
      setTrx("");
      setSender("");
      setMsg("সাবমিট সফল! Admin approve করলেই premium খুলে যাবে");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 overflow-y-auto">
      {/* ===== TOP BAR: logo + profile menu ===== */}
      <div className="sticky top-0 z-30 bg-[#10141d]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/icons/icon-512.png"
              alt="logo"
              className="w-8 h-8 rounded-lg bg-white object-cover shadow"
            />
            <span className="text-xs font-black text-white">
              ভর্তি পোর্টাল <span className="text-sky-400">২০-৭</span>
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenu(!menu)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                {(session?.user.email || "U").charAt(0).toUpperCase()}
              </div>
              <span className="text-[10px] text-slate-300 font-bold max-w-[110px] truncate">
                {session?.user.email}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
            {menu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#151b27] border border-white/10 shadow-2xl p-2 z-40">
                <div className="px-3 py-2 text-[10px] text-slate-400 truncate border-b border-white/5 mb-1">
                  বর্তমান অ্যাকাউন্ট:
                  <br />
                  <span className="text-slate-200 font-bold">
                    {session?.user.email}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    setMenu(false);
                    await signOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-400 text-[11px] font-bold hover:bg-red-500/10 cursor-pointer transition"
                >
                  <LogOut className="w-3.5 h-3.5" /> লগআউট / অ্যাকাউন্ট বদলাও
                </button>
                <p className="px-3 py-1.5 text-[9px] text-slate-500 leading-relaxed">
                  অন্য email-এ premium থাকলে সেই email দিয়ে login করে app
                  ব্যবহার করো
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-10">
        {/* ===== HERO ===== */}
        <div className="relative mt-4 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 text-center shadow-2xl shadow-blue-500/20">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg">
            <Crown className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="relative text-2xl font-black text-white mt-3">
            প্রিমিয়াম অ্যাক্সেস
          </h2>
          <p className="relative text-[11px] text-blue-100 mt-1.5 leading-relaxed">
            একবারই pay করো — পুরো সেশন ২০২৬-২৭ জুড়ে সব ফিচার আনলিমিটেড
          </p>
          <div className="relative flex items-center justify-center gap-2 mt-4 flex-wrap">
            {[
              "লাইফটাইম সেশন পাস",
              "কোনো মাসিক ফি নেই",
              "১০ মিনিটে activate",
            ].map((x) => (
              <span
                key={x}
                className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[9px] font-bold text-white"
              >
                {x}
              </span>
            ))}
          </div>
        </div>

        {/* ===== BENEFITS ===== */}
        <div className="mt-6">
          <div className="text-[10px] font-black text-sky-400 tracking-widest uppercase mb-3">
            প্রিমিয়াম-এ যা যা পাচ্ছো
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {BENEFITS.map((b) => (
              <div
                key={b.t}
                className="flex items-start gap-3 rounded-2xl bg-[#151b27] border border-white/10 p-3.5 hover:border-sky-400/30 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500/20 to-violet-500/20 border border-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div>
                  <div className="text-xs font-black text-white">{b.t}</div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    {b.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== COMPARISON ===== */}
        <div className="mt-6 rounded-2xl bg-[#151b27] border border-white/10 overflow-hidden">
          <div className="grid grid-cols-3 bg-[#0f141d] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider">
            <span className="text-slate-400">ফিচার</span>
            <span className="text-center text-slate-400">ফ্রি</span>
            <span className="text-center text-amber-300 flex items-center justify-center gap-1">
              <Crown className="w-3 h-3" /> প্রিমিয়াম
            </span>
          </div>
          {COMPARE.map((r, i) => (
            <div
              key={r.f}
              className={`grid grid-cols-3 px-4 py-2.5 items-center ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
            >
              <span className="text-[10px] font-bold text-slate-300">
                {r.f}
              </span>
              <span className="text-center">
                <Cell v={r.free} />
              </span>
              <span className="text-center">
                <Cell v={r.pro} good />
              </span>
            </div>
          ))}
        </div>

        {/* ===== PRICE ===== */}
        <div
          className={`mt-6 rounded-2xl p-5 border text-center ${discounted ? "bg-emerald-500/10 border-emerald-500/40" : "bg-[#151b27] border-white/10"}`}
        >
          {discounted && (
            <div className="text-[10px] font-black text-emerald-300 uppercase tracking-wider mb-1">
              🎁 রেফারেল ডিসকাউন্ট আনলকড!
            </div>
          )}
          <div className="flex items-baseline justify-center gap-2">
            {discounted && (
              <span className="text-lg text-slate-500 line-through font-bold">
                ৳{toBanglaNum(basePrice)}
              </span>
            )}
            <span className="text-5xl font-black text-white">
              ৳{toBanglaNum(price)}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5">
            one-time payment • পুরো সেশন ২০২৬-২৭ valid
          </div>
          <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-[10px] text-amber-300 font-bold">
            ⚡ Launch offer — ফ্রি সময় শেষ হলে দাম ৳{toBanglaNum(basePrice)}{" "}
            fixed হয়ে যাবে
          </div>
        </div>

        {/* ===== REFERRAL CODE ===== */}
        {referralOn && !ownDiscount && !codeOwner && (
          <div className="mt-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="রেফারেল / User ID কোড (থাকলে দাও)"
                  className="w-full bg-[#151b27] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none uppercase"
                />
              </div>
              <button
                onClick={verifyCode}
                className="px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 cursor-pointer"
              >
                যাচাই
              </button>
            </div>
            {codeMsg && (
              <p
                className={`text-[11px] mt-1.5 ${codeOwner ? "text-emerald-400" : "text-red-400"}`}
              >
                {codeMsg}
              </p>
            )}
          </div>
        )}

        {/* ===== PAYMENT ===== */}
        {pending ? (
          <div className="mt-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 text-center">
            <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-amber-300">
              অনুমোদনের অপেক্ষায়
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Admin approve করলেই access খুলে যাবে (সাধারণত ১০ মিনিট)
            </p>
            <button
              onClick={refreshProfile}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> স্ট্যাটাস রিফ্রেশ
            </button>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-[#151b27] border border-white/10 p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
                <Wallet className="w-4 h-4" /> bKash Send Money
              </div>
              <button
                onClick={copyNum}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-500/10 text-pink-300 text-[10px] font-black cursor-pointer"
              >
                {numCopied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}{" "}
                {BKASH_NUMBER}
              </button>
            </div>
            <div className="space-y-1.5 text-[10px] text-slate-400 mb-3">
              <div>
                ১. উপরের নম্বরে{" "}
                <strong className="text-white">৳{toBanglaNum(price)}</strong>{" "}
                Send Money করো
              </div>
              <div>২. তোমার নম্বর + TrxID নিচে লিখো</div>
              <div>৩. Admin approve করলেই premium ✅</div>
            </div>
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="তোমার bKash নম্বর"
              className="w-full bg-[#0f141d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none mb-2"
            />
            <input
              value={trx}
              onChange={(e) => setTrx(e.target.value)}
              placeholder="TrxID"
              className="w-full bg-[#0f141d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none mb-3"
            />
            <button
              onClick={submit}
              disabled={busy}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition disabled:opacity-50"
            >
              {busy
                ? "সাবমিট হচ্ছে..."
                : `৳${toBanglaNum(price)} pay করে unlock করো`}
            </button>
          </div>
        )}
        {msg && (
          <p className="text-[11px] text-center text-sky-300 mt-3">{msg}</p>
        )}

        {/* ===== OWN CODE ===== */}
        {profile.referral_code && (
          <div className="mt-4 rounded-2xl bg-[#151b27] border border-white/10 p-3.5">
            <div className="text-[10px] text-slate-400 font-bold mb-2">
              তোমার কোড share করো — friend signup করলেই তোমার দাম ৳
              {toBanglaNum(referralPrice)}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-center py-2 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-300 font-black tracking-widest text-sm">
                {profile.referral_code}
              </code>
              <button
                onClick={copyCode}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-300" />
                )}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🎓 বিশ্ববিদ্যালয় ভর্তি পোর্টাল ২০২৬-২৭\nসকল ভর্তির সময়সূচি, যোগ্যতা চেক ও মাস্টার ক্যালেন্ডার এক অ্যাপে।\n🔗 ${"https://varsity-admission-bd.vercel.app"}/?ref=${profile.referral_code}\n🆔 আমার User ID (${profile.referral_code}) দিয়ে register করলে ছাড় পাবেন।`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>
        )}

        {/* ===== HELP ===== */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/25 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Help
          </a>
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-bold hover:bg-sky-500/25 transition"
          >
            <Send className="w-3.5 h-3.5" /> Telegram Channel
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 mt-5 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" /> লাইভ আপডেট
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" /> পুরো সেশন valid
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> ১০ মিনিটে activate
          </span>
        </div>
      </div>
    </div>
  );
};
