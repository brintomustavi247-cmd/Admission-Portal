import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  onExtracted: (data: any) => void;
}

export const AIExtractButton: React.FC<Props> = ({ onExtracted }) => {
  const [inputUrlOrText, setInputUrlOrText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!inputUrlOrText.trim()) {
      alert("Prothome circular-er text ba link paste koro!");
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      alert("VITE_GEMINI_API_KEY paoya jayni! Vercel ba .env.local check koro.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `You are an expert Bangladeshi University admission circular analyzer. Extract admission details from the following news or circular text/url:
"${inputUrlOrText}"

Return ONLY a pure valid JSON object in this exact structure without markdown backticks:
{
  "university_name": "University Name in Bangla (e.g. জাহাঙ্গীরনগর বিশ্ববিদ্যালয়)",
  "title": "Short title in Bangla (e.g. জাবি ভর্তি পরীক্ষা শুরু ১৭ জানুয়ারি)",
  "update_type": "admission_circular",
  "extracted_data": {
    "exam_date": "Exam date in Bangla (e.g. ১৭ জানুয়ারি)",
    "application_start": "",
    "application_end": "",
    "fees": "",
    "highlights": []
  },
  "source_urls": ["${inputUrlOrText.startsWith("http") ? inputUrlOrText : ""}"]
}`;

      const requestPayload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      };

      const headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey.trim(),
      };

      // Try with gemini-2.5-flash
      let res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers,
          body: JSON.stringify(requestPayload),
        }
      );

      // Fallback to gemini-1.5-flash
      if (!res.ok) {
        res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
          {
            method: "POST",
            headers,
            body: JSON.stringify(requestPayload),
          }
        );
      }

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error?.message || "Google Gemini API error occurred");
      }

      let rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error("AI kono data extract korte pareni.");
      }

      rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(rawText);

      onExtracted(parsed);
      alert("✅ AI safolbhabe data extract koreche! Nicher form check kore 'Queue for Review'-te chapo.");
    } catch (err: any) {
      console.error("AI Extraction Error:", err);
      alert("AI Extraction Error:\n" + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 via-violet-900/20 to-sky-900/20 border border-sky-500/20 space-y-2">
      <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" /> ১-ক্লিক AI এক্সট্রাক্টর
      </div>
      <p className="text-[11px] text-slate-400">
        কোনো সার্কুলারের নিউজ লিংক বা টেক্সট এখানে পেস্ট করো — AI ফর্ম স্বয়ংক্রিয় পূরণ করবে।
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputUrlOrText}
          onChange={(e) => setInputUrlOrText(e.target.value)}
          placeholder="সার্কুলার লিংক বা নিউজের অংশ পেস্ট করুন..."
          className="flex-1 bg-[#0b101b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50"
        />
        <button
          type="button"
          onClick={handleExtract}
          disabled={loading || !inputUrlOrText.trim()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              আনছে...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              AI দিয়ে আনুন
            </>
          )}
        </button>
      </div>
    </div>
  );
};