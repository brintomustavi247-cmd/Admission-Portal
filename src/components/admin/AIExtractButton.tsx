import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
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

    setLoading(true);

    try {
      /* SECURITY: Gemini key আর ব্রাউজারে নেই (আগে VITE_GEMINI_API_KEY bundle-এ যেত)।
         Supabase Edge Function proxy:
           deploy → supabase functions deploy extract-with-gemini
           secret → supabase secrets set GEMINI_API_KEY=... */
      const { data: json, error } = await supabase.functions.invoke(
        "extract-with-gemini",
        { body: { text: inputUrlOrText } },
      );

      if (error) {
        throw new Error(
          error.message ||
            "Edge Function call fail — deploy করা আছে কিনা + GEMINI_API_KEY secret check koro",
        );
      }
      if (json?.error) throw new Error(String(json.error));

      let rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error("AI kono data extract korte pareni.");
      }

      rawText = String(rawText)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(rawText);

      onExtracted(parsed);
      alert(
        "✅ AI safolbhabe data extract koreche! Nicher form check kore 'Queue for Review'-te chapo.",
      );
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
