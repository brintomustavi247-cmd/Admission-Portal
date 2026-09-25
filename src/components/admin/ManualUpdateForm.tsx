import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { PlusCircle } from "lucide-react";

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

  // Sync if initialData provided by AI
  React.useEffect(() => {
    if (initialData) {
      if (initialData.university_name) setUniName(initialData.university_name);
      if (initialData.title) setTitle(initialData.title);
      if (initialData.extracted_data?.exam_date) setExamDate(initialData.extracted_data.exam_date);
      if (initialData.extracted_data?.fees) setFees(initialData.extracted_data.fees);
      if (initialData.source_urls?.[0]) setSource(initialData.source_urls[0]);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniName.trim() || !title.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("university_updates").insert({
      university_name: uniName,
      title: title,
      status: "pending",
      extracted_data: {
        exam_date: examDate,
        fees: fees,
      },
      source_urls: source ? [source] : [],
    });

    setLoading(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      setUniName("");
      setTitle("");
      setExamDate("");
      setFees("");
      setSource("");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-3">
      <div className="text-xs font-bold text-white flex items-center gap-1.5">
        <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> নতুন আপডেট তৈরি / এন্ট্রি
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={uniName}
          onChange={(e) => setUniName(e.target.value)}
          placeholder="বিশ্ববিদ্যালয়ের নাম (যেমন: ঢাকা বিশ্ববিদ্যালয়)"
          className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          required
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="আপডেট শিরোনাম (যেমন: ক ইউনিট পরীক্ষার রুটিন প্রকাশ)"
          className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          required
        />
        <input
          type="text"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          placeholder="পরীক্ষার তারিখ (যেমন: ১৫ মে ২০২৬)"
          className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        />
        <input
          type="text"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          placeholder="আবেদন ফি (যেমন: ৳১০০০)"
          className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        />
      </div>
      <input
        type="text"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="ওয়েবসাইট লিংক / সোর্স URL (ঐচ্ছিক)"
        className="w-full bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition"
      >
        {loading ? "সংরক্ষণ হচ্ছে..." : "কিউতে যুক্ত করুন (Queue for Review)"}
      </button>
    </form>
  );
};