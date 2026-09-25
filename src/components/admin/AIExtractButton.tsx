import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  onExtracted: (data: any) => void;
}

export const AIExtractButton: React.FC<Props> = ({ onExtracted }) => {
  const [inputUrlOrText, setInputUrlOrText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!inputUrlOrText.trim()) return;
    setLoading(true);

    try {
      // Direct call to Gemini API using client GEMINI_API_KEY
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert("VITE_GEMINI_API_KEY not configured in .env.local!");
        setLoading(false);
        return;
      }

      const prompt = `You are an expert Bangladeshi University admission circular analyzer. Extract admission details from the following news or circular text/url:
"${inputUrlOrText}"

Return ONLY a pure valid JSON object in this exact structure without markdown backticks:
{
  "university_name": "University Name in Bangla (e.g. ঢাকা বিশ্ববিদ্যালয়)",
  "title": "Short title in Bangla (e.g. ঢাকা বিশ্ববিদ্যালয় ক-ইউনিট ভর্তি বিজ্ঞপ্তি)",
  "update_type": "admission_circular",
  "extracted_data": {
    "exam_date": "Date string or Bangla text",
    "application_start": "Start date",
    "application_end": "End date",
    "fees": "e.g. ৳১০০০",
    "min_gpa": { "ssc": 3.5, "hsc": 3.5, "combined": 8.0 },
    "highlights": ["3-4 bullet points in Bangla"]
  },
  "source_urls": ["${inputUrlOrText.startsWith('http') ? inputUrlOrText : ''}"]
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const json = await res.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        onExtracted(parsed);
      }
    } catch (err: any) {
      console.error(err);
      alert("AI extraction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 via-violet-900/20 to-sky-900/20 border border-sky-500/20 space-y-2">
      <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" /> ১-ক্লিক AI এক্সট্রাক্টর (Gemini)
      </div>
      <p className="text-[11px] text-slate-400">
        কোনো সার্কুলারের নিউজ লিংক বা টেক্সট এখানে পেস্ট করো — AI বাকি ফর্ম স্বয়ংক্রিয় পূরণ করবে।
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputUrlOrText}
          onChange={(e) => setInputUrlOrText(e.target.value)}
          placeholder="সার্কুলার লিংক বা নিউজের অংশ পেস্ট করুন..."
          className="flex-1 bg-[#0b101b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          onClick={handleExtract}
          disabled={loading || !inputUrlOrText.trim()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          AI দিয়ে আনুন
        </button>
      </div>
    </div>
  );
};