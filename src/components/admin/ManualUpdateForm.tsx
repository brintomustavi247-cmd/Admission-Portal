import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PlusCircle, Loader2 } from "lucide-react";

interface Props {
  initialData?: any;
  onSuccess: () => void;
}

export const ManualUpdateForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const [uniName, setUniName] = useState(initialData?.university_name || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [examDate, setExamDate] = useState(initialData?.extracted_data?.exam_date || "");
  const [fees, setFees] = useState(initialData?.extracted_data?.fees || "");
  const [source, setSource] = useState(initialData?.source_urls?.[0] || "");
  const [loading, setLoading] = useState(false);

  // Sync state whenever AI extraction provides new initialData
  useEffect(() => {
    if (initialData) {
      if (initialData.university_name) setUniName(initialData.university_name);
      if (initialData.title) setTitle(initialData.title);
      if (initialData.extracted_data?.exam_date) setExamDate(initialData.extracted_data.exam_date);
      if (initialData.extracted_data?.fees) setFees(initialData.extracted_data.fees);
      if (initialData.source_urls && initialData.source_urls.length > 0) {
        setSource(initialData.source_urls[0]);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uniName.trim() || !title.trim()) {
      alert("⚠️ অনুগ্রহ করে বিশ্ববিদ্যালয়ের নাম এবং আপডেট শিরোনাম পূরণ করুন!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        university_name: uniName.trim(),
        title: title.trim(),
        status: "pending",
        extracted_data: {
          exam_date: examDate.trim() || undefined,
          fees: fees.trim() || undefined,
        },
        source_urls: source.trim() ? [source.trim()] : [],
      };

      const { data, error } = await supabase
        .from("university_updates")
        .insert([payload])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        alert("❌ সংরক্ষণ করা যায়নি! ত্রুটি: " + error.message);
      } else if (!data || data.length === 0) {
        alert("⚠️ ডেটাবেসে সংরক্ষিত হয়নি! Supabase RLS Policy চেক করুন।");
      } else {
        alert("✅ সফলভাবে আপডেট কিউতে যুক্ত হয়েছে!");
        // ফর্ম ক্লিয়ার করা
        setUniName("");
        setTitle("");
        setExamDate("");
        setFees("");
        setSource("");
        // প্যারেন্ট কিউ লিস্ট রিফ্রেশ করা
        onSuccess();
      }
    } catch (err: any) {
      console.error("Unexpected submission error:", err);
      alert("❌ অপ্রত্যাশিত ত্রুটি: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-3"
    >
      <div className="text-xs font-bold text-white flex items-center gap-1.5">
        <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> নতুন আপডেট তৈরি / এন্ট্রি
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={uniName}
          onChange={(e) => setUniName(e.target.value)}
          placeholder="বিশ্ববিদ্যালয়ের নাম (যেমন: জাহাঙ্গীরনগর বিশ্ববিদ্যালয়)"
          className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
          required
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="আপডেট শিরোনাম (যেমন: ভর্তি পরীক্ষা শুরু ১৭ জানুয়ারি)"
          className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
          required
        />
        <input
          type="text"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          placeholder="পরীক্ষার তারিখ (যেমন: ১৭ জানুয়ারি)"
          className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
        />
        <input
          type="text"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          placeholder="আবেদন ফি (যেমন: ৳১০০০)"
          className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
        />
      </div>

      <input
        type="text"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="ওয়েবসাইট লিংক / সোর্স URL (ঐচ্ছিক)"
        className="w-full bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-95"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            সংরক্ষণ হচ্ছে...
          </>
        ) : (
          "কিউতে যুক্ত করুন (Queue for Review)"
        )}
      </button>
    </form>
  );
};