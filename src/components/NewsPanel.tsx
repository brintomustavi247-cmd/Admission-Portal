import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { UpdateDetailModal } from "./UpdateDetailModal";
import { initialUniversitiesData } from "../data/mockUniversities";
import { getSeen, markSeen, safeUrl } from "../lib/newsSeen";
import { useEscapeClose } from "../hooks/useEscapeClose";
import { Newspaper, X, Send, Users, Calendar, Megaphone, ExternalLink } from "lucide-react";

type Tab = "news" | "community";

export const NewsPanel: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { profile } = useAuth();
  const uid = profile?.id || "guest";
  const [tab, setTab] = useState<Tab>("news");
  const [all, setAll] = useState<any[]>([]);
  const [contribEnabled, setContribEnabled] = useState(true);
  const [detail, setDetail] = useState<any | null>(null);
  const [seenTick, setSeenTick] = useState(0);

  const [nameInput, setNameInput] = useState("");
  const [uniId, setUniId] = useState("");
  const [info, setInfo] = useState("");
  const [srcUrl, setSrcUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Escape → panel close (ভেতরের detail modal খোলা থাকলে সেটাই আগে বন্ধ হবে)
  useEscapeClose(open && !detail, onClose);

  const load = async () => {
    const [n, s] = await Promise.all([
      supabase
        .from("university_updates")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(60),
      supabase
        .from("app_settings")
        .select("contribution_enabled")
        .eq("id", 1)
        .single(),
    ]);
    setAll(n.data || []);
    if (s.data) setContribEnabled(s.data.contribution_enabled !== false);
  };
  useEffect(() => {
    if (open) load();
  }, [open]);

  const official = all.filter((n) => n.extracted_data?._source !== "community");
  const community = all.filter((n) => n.extracted_data?._source === "community");

  const seen = new Set(getSeen(uid, "updates"));
  const unreadOfficial = official.filter((n) => !seen.has(n.id)).length;
  const unreadCommunity = community.filter((n) => !seen.has(n.id)).length;

  useEffect(() => {
    if (!open) return;
    const list = tab === "news" ? official : community;
    markSeen(
      uid,
      "updates",
      list.map((n) => n.id),
    );
    setSeenTick((t) => t + 1);
  }, [open, tab, all.length]);

  const openDetail = (n: any) => {
    markSeen(uid, "updates", [n.id]);
    setSeenTick((t) => t + 1);
    setDetail(n);
  };

  const submitContribution = async () => {
    if (info.trim().length < 10) {
      setMsg("❌ কমপক্ষে ১০ অক্ষরের তথ্য লিখো");
      return;
    }
    const cleanUrl = srcUrl.trim() ? safeUrl(srcUrl) : "";
    if (srcUrl.trim() && !cleanUrl) {
      setMsg("❌ সূত্র URL টা ঠিক না (https://... দিয়ে লেখো)");
      return;
    }
    setBusy(true);
    const uni = initialUniversitiesData.find((u) => u.id === uniId);
    const { error } = await supabase.from("user_contributions").insert({
      user_id: profile?.id || null,
      contributor_name:
        nameInput.trim() ||
        profile?.full_name ||
        `User-${profile?.referral_code || "ANON"}`,
      university_id: uniId || null,
      university_name: uni?.name || "সাধারণ",
      info_text: info.trim(),
      source_url: cleanUrl || null,
      status: "pending",
    });
    setBusy(false);
    setMsg(
      error
        ? "❌ " + error.message
        : "✅ ধন্যবাদ! Authority verify করলে News-এ তোমার নামসহ দেখাবে 🎉",
    );
    setInfo("");
    setSrcUrl("");
    setNameInput("");
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-slate-50 dark:bg-[#151b27] shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Newspaper className="w-5 h-5" />
                  <div>
                    <h2 className="text-base font-black">ভর্তি সংবাদ</h2>
                    <p className="text-[10px] opacity-80 font-semibold">লাইভ আপডেট + কমিউনিটি তথ্য</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              {/* ===== বড় TOGGLE TABS + count + unread dot ===== */}
              <div className="flex gap-2 mt-3">
                <button onClick={() => setTab("news")}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-black flex items-center justify-center gap-1.5 cursor-pointer transition border-2 ${
                    tab === "news" ? "bg-white text-blue-700 border-white shadow-lg" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}>
                  <Megaphone className="w-3.5 h-3.5" /> সংবাদ
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${tab === "news" ? "bg-blue-100 text-blue-700" : "bg-white/20 text-white"}`}>{official.length}</span>
                  {unreadOfficial > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                </button>
                <button onClick={() => setTab("community")}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-black flex items-center justify-center gap-1.5 cursor-pointer transition border-2 ${
                    tab === "community" ? "bg-white text-emerald-700 border-white shadow-lg" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}>
                  <Users className="w-3.5 h-3.5" /> কমিউনিটি
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${tab === "community" ? "bg-emerald-100 text-emerald-700" : "bg-white/20 text-white"}`}>{community.length}</span>
                  {unreadCommunity > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3" key={seenTick}>
              {/* ===== OFFICIAL NEWS ===== */}
              {tab === "news" && (
                <>
                  {official.length === 0 && (
                    <div className="py-10 text-center text-slate-500 dark:text-slate-400 text-xs font-bold">
                      <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-40" /> এখনো কোনো সংবাদ প্রকাশ হয়নি
                    </div>
                  )}
                  {official.map(n => (
                    <button key={n.id} onClick={() => openDetail(n)}
                      className={`w-full text-left p-3.5 rounded-2xl bg-white dark:bg-[#1e2530] border-2 shadow-sm hover:border-sky-300 dark:hover:border-sky-600 transition cursor-pointer ${
                        seen.has(n.id) ? "border-slate-200 dark:border-white/10" : "border-sky-400 dark:border-sky-500"}`}>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">{n.university_name}</span>
                        {n.severity === "urgent" && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white">🚨 জরুরি</span>}
                        {!seen.has(n.id) && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white">নতুন</span>}
                        <span className="text-[9px] text-slate-400 ml-auto">{new Date(n.published_at || n.created_at).toLocaleDateString("bn-BD")}</span>
                      </div>
                      <h3 className="text-[13px] font-black text-slate-900 dark:text-white leading-snug">{n.title}</h3>
                      {n.extracted_data?.exam_date && (
                        <p className="text-[11px] text-sky-700 dark:text-sky-300 font-bold mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {n.extracted_data.exam_date}
                        </p>
                      )}
                    </button>
                  ))}
                </>
              )}

              {/* ===== COMMUNITY ===== */}
              {tab === "community" && (
                <>
                  {community.length === 0 && (
                    <div className="py-10 text-center text-slate-500 dark:text-slate-400 text-xs font-bold">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" /> এখনো কোনো কমিউনিটি তথ্য নেই
                    </div>
                  )}
                  {community.map(c => {
                    const href = safeUrl(c.source_urls?.[0]);
                    return (
                      <button key={c.id} onClick={() => openDetail(c)}
                        className={`w-full text-left p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 shadow-sm hover:border-emerald-400 transition cursor-pointer ${
                          seen.has(c.id) ? "border-emerald-200 dark:border-emerald-800" : "border-emerald-400 dark:border-emerald-500"}`}>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">🤝 {c.extracted_data?._contributor || "কমিউনিটি"}</span>
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-emerald-200 dark:border-emerald-700">{c.university_name}</span>
                          {!seen.has(c.id) && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white">নতুন</span>}
                          <span className="text-[9px] text-slate-400 ml-auto">{new Date(c.published_at || c.created_at).toLocaleDateString("bn-BD")}</span>
                        </div>
                        <h3 className="text-[13px] font-black text-slate-900 dark:text-white leading-snug">{c.title}</h3>
                        {c.raw_content && c.raw_content !== c.title && (
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{c.raw_content}</p>
                        )}
                        {href && (
                          <span onClick={(e) => { e.stopPropagation(); window.open(href, "_blank"); }}
                            className="inline-flex items-center gap-1 text-[10px] text-sky-600 dark:text-sky-400 underline mt-1.5 cursor-pointer">
                            <ExternalLink className="w-3 h-3" /> সূত্র
                          </span>
                        )}
                      </button>
                    );
                  })}
                </>
              )}

              {/* ===== CONTRIB BOX ===== */}
              {tab === "community" && contribEnabled && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#1e2530] dark:to-[#1a2030] border-2 border-indigo-200 dark:border-indigo-800">
                  <h3 className="text-xs font-black text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> তুমি কিছু জানো? তথ্য পাঠাও!
                  </h3>
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="তোমার নাম (দেখাবে: তথ্য দিয়েছেন — ...)"
                    className="w-full mb-2 bg-white dark:bg-[#0f141d] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-[11px] focus:outline-none"
                  />
                  <select
                    value={uniId}
                    onChange={(e) => setUniId(e.target.value)}
                    className="w-full mb-2 bg-white dark:bg-[#0f141d] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-[11px] font-bold focus:outline-none"
                  >
                    <option value="">— ভার্সিটি বাছো —</option>
                    {initialUniversitiesData.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    rows={3}
                    placeholder="যেমন: জাবির পরীক্ষা ২০ জানুয়ারি হবে বলে অফিসিয়াল নোটিশে প্রকাশ..."
                    className="w-full mb-2 bg-white dark:bg-[#0f141d] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-[11px] focus:outline-none resize-none"
                  />
                  <input
                    value={srcUrl}
                    onChange={(e) => setSrcUrl(e.target.value)}
                    placeholder="সূত্র URL (ঐচ্ছিক, https://...)"
                    className="w-full mb-2 bg-white dark:bg-[#0f141d] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-[11px] focus:outline-none"
                  />
                  <button
                    onClick={submitContribution}
                    disabled={busy}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black cursor-pointer disabled:opacity-50 shadow-lg active:scale-95"
                  >
                    {busy
                      ? "পাঠানো হচ্ছে..."
                      : "📤 তথ্য জমা দাও (Authority verify করবে)"}
                  </button>
                  {msg && (
                    <p className="text-[10px] font-bold text-center mt-2 text-slate-700 dark:text-slate-200">
                      {msg}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          {detail && <UpdateDetailModal update={detail} onClose={() => setDetail(null)} />}
        </div>
      )}
    </AnimatePresence>
  );
};
