import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { safeUrl } from "../lib/newsSeen";
import { initialUniversitiesData } from "../data/mockUniversities";
import { Send } from "lucide-react";

/**
 * কমিউনিটি তথ্য পাঠানোর box — NewsPanel → "কমিউনিটি" tab-এ render হয়।
 *
 * Flow: এখানকার data `user_contributions` টেবিলে status='pending' দিয়ে যায় →
 * Admin panel/Apps Script approve করলে `university_updates`-এ publish হয়
 * (extracted_data._contributor + _source: 'community' সহ, তাই News-এ নাম দেখায়)।
 */
export const CommunityContributeBox: React.FC = () => {
  const { profile } = useAuth();
  const [nameInput, setNameInput] = useState("");
  const [uniId, setUniId] = useState("");
  const [info, setInfo] = useState("");
  const [srcUrl, setSrcUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const submit = async () => {
    if (info.trim().length < 10) {
      setIsError(true);
      setMsg("❌ কমপক্ষে ১০ অক্ষরের তথ্য লিখো");
      return;
    }
    const cleanUrl = srcUrl.trim() ? safeUrl(srcUrl) : "";
    if (srcUrl.trim() && !cleanUrl) {
      setIsError(true);
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
    setIsError(!!error);
    setMsg(
      error
        ? "❌ " + error.message
        : "✅ ধন্যবাদ! Authority verify করলে News-এ তোমার নামসহ দেখাবে 🎉",
    );
    if (!error) {
      setInfo("");
      setSrcUrl("");
      setNameInput("");
    }
    setTimeout(() => setMsg(""), 5000);
  };

  return (
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
        onClick={submit}
        disabled={busy}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black cursor-pointer disabled:opacity-50 shadow-lg active:scale-95"
      >
        {busy ? "পাঠানো হচ্ছে..." : "📤 তথ্য জমা দাও (Authority verify করবে)"}
      </button>
      {msg && (
        <p
          className={`text-[10px] font-bold text-center mt-2 ${
            isError
              ? "text-rose-600 dark:text-rose-400"
              : "text-emerald-700 dark:text-emerald-400"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
};
