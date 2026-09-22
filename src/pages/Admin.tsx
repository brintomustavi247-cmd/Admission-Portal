import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { toBanglaNum } from "../lib/banglaUtils";
import {
  ArrowLeft,
  Users,
  Crown,
  Clock,
  Power,
  Check,
  X,
  Search,
  Ticket,
  CalendarClock,
  Save,
  Heart,
  Megaphone,
  Banknote,
} from "lucide-react";

interface AdminUser {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  access_enabled: boolean;
  is_premium: boolean;
  premium_expires_at: string | null;
  referral_code: string | null;
  referred_by: string | null;
  discount_unlocked: boolean;
  total_donated: number;
  email: string | null;
}
interface Payment {
  id: string;
  user_id: string;
  trx_id: string;
  sender_phone: string | null;
  plan: string;
  amount: number;
  status: string;
  referral_code: string | null;
  created_at: string;
  profiles?: { full_name: string | null; phone: string | null } | null;
}
const SESSION_END = "2027-12-31T23:59:59.000Z";

const Switch: React.FC<{ on: boolean; onChange: () => void }> = ({
  on,
  onChange,
}) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${on ? "bg-emerald-500" : "bg-slate-600"}`}
  >
    <span
      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`}
    />
  </button>
);

export const Admin: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subEnabled, setSubEnabled] = useState(false);
  const [referralOn, setReferralOn] = useState(true);
  const [donationOn, setDonationOn] = useState(true);
  const [freeUntil, setFreeUntil] = useState("");
  const [basePrice, setBasePrice] = useState(99);
  const [referralPrice, setReferralPrice] = useState(49);
  const [announcement, setAnnouncement] = useState("");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    const [{ data: u }, { data: p }, { data: s }] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("payment_requests")
        .select("*, profiles(full_name, phone)")
        .order("created_at", { ascending: false }),
      supabase.from("app_settings").select("*").eq("id", 1).single(),
    ]);
    setUsers((u as AdminUser[]) || []);
    setPayments((p as Payment[]) || []);
    if (s) {
      setSubEnabled(s.subscription_enabled);
      setReferralOn(s.referral_discount_enabled);
      setDonationOn(s.donation_enabled !== false);
      setFreeUntil(s.free_until ? s.free_until.slice(0, 10) : "");
      setBasePrice(s.base_price ?? 99);
      setReferralPrice(s.referral_price ?? 49);
      setAnnouncement(s.announcement_text || "");
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (!profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#151a23] text-white flex items-center justify-center">
        অ্যাডমিন নয়
      </div>
    );
  }

  const saveSettings = async () => {
    const { data, error } = await supabase
      .from("app_settings")
      .update({
        subscription_enabled: subEnabled,
        referral_discount_enabled: referralOn,
        donation_enabled: donationOn,
        free_until: freeUntil
          ? new Date(freeUntil + "T23:59:59").toISOString()
          : null,
        base_price: basePrice,
        referral_price: referralPrice,
        announcement_text: announcement,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
      .select();

    if (error) {
      console.error("settings save failed:", error);
      setSaved("❌ Save failed: " + error.message);
    } else if (!data || data.length === 0) {
      setSaved("❌ Save হয়নি — RLS permission সমস্যা (SQL fix run করো)");
    } else {
      setSaved("✅ Saved — সব user-এর কাছে live!");
    }
    setTimeout(() => setSaved(""), 4000);
  };

  const toggleUser = async (
    u: AdminUser,
    field: "access_enabled" | "is_premium",
  ) => {
    const val = !u[field];
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, [field]: val } : x)),
    );
    const { error } = await supabase
      .from("profiles")
      .update({ [field]: val })
      .eq("id", u.id);
    if (error) {
      console.error("user update failed:", error);
      alert("❌ Update failed: " + error.message);
    }
  };

  const decidePayment = async (p: Payment, approve: boolean) => {
    if (approve) {
      if (p.plan === "season") {
        await supabase
          .from("profiles")
          .update({ is_premium: true, premium_expires_at: SESSION_END })
          .eq("id", p.user_id);
      }
      if (p.plan === "donation") {
        const { data: u } = await supabase
          .from("profiles")
          .select("total_donated")
          .eq("id", p.user_id)
          .single();
        await supabase
          .from("profiles")
          .update({ total_donated: (u?.total_donated || 0) + p.amount })
          .eq("id", p.user_id);
      }
      if (p.referral_code) {
        const { data: owner } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", p.referral_code.toUpperCase())
          .single();
        if (owner && owner.id !== p.user_id) {
          await supabase
            .from("profiles")
            .update({ discount_unlocked: true })
            .eq("id", owner.id);
          await supabase
            .from("profiles")
            .update({ referred_by: owner.id })
            .eq("id", p.user_id);
        }
      }
    }
    const { error } = await supabase
      .from("payment_requests")
      .update({ status: approve ? "approved" : "rejected" })
      .eq("id", p.id);
    if (error) alert("❌ Payment update failed: " + error.message);
    load();
  };

  const filtered = users.filter(
    (u) =>
      !q.trim() ||
      (u.full_name || "").toLowerCase().includes(q.toLowerCase()) ||
      (u.phone || "").includes(q) ||
      (u.referral_code || "").toLowerCase().includes(q.toLowerCase()) ||
      u.id.toLowerCase().includes(q.toLowerCase()),
  );
  const premiumCount = users.filter((u) => u.is_premium).length;
  const pending = payments.filter((p) => p.status === "pending");
  const revenueSeason = payments
    .filter((p) => p.status === "approved" && p.plan === "season")
    .reduce((a, b) => a + b.amount, 0);
  const revenueDonation = payments
    .filter((p) => p.status === "approved" && p.plan === "donation")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 pb-16">
      {/* ===== USER DETAIL MODAL ===== */}
      {selected && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-[#151b27] border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-white">ইউজার ডিটেইলস</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white font-black shrink-0">
                {(selected.full_name || selected.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-white truncate">{selected.full_name || '—'}</div>
                <div className="text-[10px] text-slate-400 truncate">{selected.email || 'email নেই'}</div>
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              {[
                ['User ID', selected.id],
                ['রেফারেল কোড', selected.referral_code || '—'],
                ['ফোন', selected.phone || '—'],
                ['Role', selected.role],
                ['অ্যাক্সেস', selected.access_enabled ? '✅ চালু' : '❌ বন্ধ'],
                ['প্রিমিয়াম', selected.is_premium ? `✅ ${selected.premium_expires_at ? selected.premium_expires_at.slice(0, 10) : ''}` : '❌ নেই'],
                ['মোট ডোনেশন', `৳${toBanglaNum(selected.total_donated || 0)}`],
                ['Discount unlocked', selected.discount_unlocked ? '✅' : '❌'],
              ].map(([k, v]) => (
                <div key={k as string} className="flex items-start justify-between gap-3 rounded-xl bg-[#0f141d] border border-white/5 px-3 py-2">
                  <span className="text-slate-400 font-bold shrink-0">{k}</span>
                  <span className="text-slate-200 font-bold text-right break-all">{v as string}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">পেমেন্ট হিস্টরি (TrxID + bKash)</div>
              {payments.filter((p) => p.user_id === selected.id).length === 0 ? (
                <div className="text-[10px] text-slate-500 text-center py-3 rounded-xl bg-[#0f141d] border border-white/5">কোনো পেমেন্ট নেই</div>
              ) : (
                <div className="space-y-2">
                  {payments.filter((p) => p.user_id === selected.id).map((p) => (
                    <div key={p.id} className="rounded-xl bg-[#0f141d] border border-white/5 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white">৳{toBanglaNum(p.amount)} • {p.plan}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${p.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : p.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>{p.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">TrxID: {p.trx_id}</div>
                      {p.sender_phone && <div className="text-[10px] text-slate-400">bKash নম্বর: {p.sender_phone}</div>}
                      <div className="text-[9px] text-slate-500 mt-1">{new Date(p.created_at).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={() => { toggleUser(selected, 'access_enabled'); setSelected({ ...selected, access_enabled: !selected.access_enabled }); }}
                className={`py-2.5 rounded-xl text-[11px] font-black cursor-pointer ${selected.access_enabled ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}>
                {selected.access_enabled ? 'অ্যাক্সেস বন্ধ করো' : 'অ্যাক্সেস চালু করো'}
              </button>
              <button onClick={() => { toggleUser(selected, 'is_premium'); setSelected({ ...selected, is_premium: !selected.is_premium }); }}
                className={`py-2.5 rounded-xl text-[11px] font-black cursor-pointer ${selected.is_premium ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                {selected.is_premium ? 'প্রিমিয়াম বাতিল' : 'প্রিমিয়াম দাও'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="sticky top-0 z-30 bg-[#151a23]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-black text-white">
              সুপার অ্যাডমিন প্যানেল
            </h1>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/15 text-blue-300 font-bold">
            ADMIN
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 space-y-5">
        {/* ===== MASTER CONTROLS ===== */}
        <div className="bg-[#151b27] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${subEnabled ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}
              >
                <Power className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  সাবস্ক্রিপশন (Paywall)
                </div>
                <p className="text-[11px] text-slate-400">
                  {subEnabled
                    ? "ON — ফ্রি user রা paywall দেখবে"
                    : "OFF — সবাই ফ্রি"}
                </p>
              </div>
            </div>
            <Switch
              on={subEnabled}
              onChange={() => setSubEnabled(!subEnabled)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${referralOn ? "bg-blue-500/15 text-blue-400" : "bg-slate-500/15 text-slate-400"}`}
              >
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  রেফারেল ডিসকাউন্ট
                </div>
                <p className="text-[11px] text-slate-400">
                  {referralOn
                    ? `ON — code-এ ৳${toBanglaNum(referralPrice)}`
                    : "OFF — সবাই base price"}
                </p>
              </div>
            </div>
            <Switch
              on={referralOn}
              onChange={() => setReferralOn(!referralOn)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${donationOn ? "bg-violet-500/15 text-violet-400" : "bg-slate-500/15 text-slate-400"}`}
              >
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  ডোনেশন সিস্টেম
                </div>
                <p className="text-[11px] text-slate-400">
                  {donationOn
                    ? "ON — settings-এ donation + donor card"
                    : "OFF — লুকানো"}
                </p>
              </div>
            </div>
            <Switch
              on={donationOn}
              onChange={() => setDonationOn(!donationOn)}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Base Price (৳)
              </div>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f141d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Referral Price (৳)
              </div>
              <input
                type="number"
                value={referralPrice}
                onChange={(e) =>
                  setReferralPrice(parseInt(e.target.value) || 0)
                }
                className="w-full bg-[#0f141d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <CalendarClock className="w-3 h-3" /> ফ্রি পিরিয়ড শেষ
              </div>
              <input
                type="date"
                value={freeUntil}
                onChange={(e) => setFreeUntil(e.target.value)}
                className="w-full bg-[#0f141d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
              <Megaphone className="w-3 h-3" /> Announcement (সব user-এর app-এ
              banner)
            </div>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={2}
              placeholder="যেমন: ২৫ সেপ্টেম্বর থেকে প্রিমিয়াম চালু!"
              className="w-full bg-[#0f141d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveSettings}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-black shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> Settings Save
            </button>
            {saved && (
              <span className="text-[11px] text-emerald-400 font-bold">
                {saved}
              </span>
            )}
          </div>
        </div>

        {/* ===== REVENUE STATS ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              icon: <Users className="w-4 h-4" />,
              l: "ইউজার",
              v: String(users.length),
            },
            {
              icon: <Crown className="w-4 h-4" />,
              l: "প্রিমিয়াম",
              v: String(premiumCount),
            },
            {
              icon: <Clock className="w-4 h-4" />,
              l: "পেন্ডিং",
              v: String(pending.length),
            },
            {
              icon: <Banknote className="w-4 h-4" />,
              l: "সাবস্ক্রিপশন আয়",
              v: `৳${toBanglaNum(revenueSeason)}`,
            },
            {
              icon: <Heart className="w-4 h-4" />,
              l: "ডোনেশন আয়",
              v: `৳${toBanglaNum(revenueDonation)}`,
            },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-[#151b27] border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                {s.icon}
                {s.l}
              </div>
              <div className="text-xl font-black text-white mt-1 font-number">
                {s.v}
              </div>
            </div>
          ))}
        </div>

        {/* ===== PENDING PAYMENTS ===== */}
        {pending.length > 0 && (
          <div className="bg-[#151b27] border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> পেমেন্ট অনুমোদন
            </h2>
            <div className="space-y-2">
              {pending.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#0f141d] border border-white/5 p-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {p.profiles?.full_name || "ইউজার"} • ৳
                      {toBanglaNum(p.amount)}
                      <span
                        className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-black ${p.plan === "donation" ? "bg-violet-500/20 text-violet-300" : "bg-blue-500/20 text-blue-300"}`}
                      >
                        {p.plan === "donation" ? "DONATION" : "SEASON"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      TrxID: {p.trx_id} • {p.sender_phone || "—"}{" "}
                      {p.referral_code && `• code: ${p.referral_code}`}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => decidePayment(p, true)}
                      className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => decidePayment(p, false)}
                      className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== USERS ===== */}
        <div className="bg-[#151b27] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-sm font-bold text-white">ইউজার তালিকা</h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="নাম / নম্বর / কোড"
                className="bg-[#0f141d] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-[11px] text-white placeholder:text-slate-500 focus:outline-none w-44"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-white/10">
                  <th className="py-2 pr-3 font-bold">ইউজার</th>
                  <th className="py-2 pr-3 font-bold">কোড / ডোনেশন</th>
                  <th className="py-2 pr-3 font-bold">অ্যাক্সেস</th>
                  <th className="py-2 font-bold">প্রিমিয়াম</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelected(u)}
                    className="border-b border-white/5 cursor-pointer hover:bg-white/[0.03] transition"
                  >
                    <td className="py-2.5 pr-3">
                      <div className="font-bold text-white">
                        {u.full_name || "—"}{" "}
                        {u.role === "admin" && (
                          <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 text-[9px] font-black">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate max-w-[140px]">
                        {u.email || "—"}
                      </div>
                      <div className="text-slate-500">
                        {u.phone || "—"}
                      </div>
                      <div className="text-[9px] text-slate-600 font-mono mt-0.5">
                        ID: {u.id.slice(0, 8)}…
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <code className="text-blue-300 font-bold">
                        {u.referral_code || "—"}
                      </code>
                      <div className="text-[9px] text-violet-300 font-bold">
                        ৳{toBanglaNum(u.total_donated || 0)} donated
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <Switch
                        on={u.access_enabled}
                        onChange={() => toggleUser(u, "access_enabled")}
                      />
                    </td>
                    <td className="py-2.5">
                      <Switch
                        on={u.is_premium}
                        onChange={() => toggleUser(u, "is_premium")}
                      />
                      {u.is_premium && (
                        <div className="text-[9px] text-emerald-400 mt-0.5">
                          {u.premium_expires_at
                            ? u.premium_expires_at.slice(0, 10)
                            : "—"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
