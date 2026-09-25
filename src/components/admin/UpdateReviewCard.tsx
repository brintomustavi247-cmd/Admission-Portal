import React, { useState } from "react";
import { UniversityUpdate } from "../../types/admission";
import { supabase } from "../../lib/supabase";
import { Check, Trash2, Globe, Calendar, DollarSign } from "lucide-react";

interface Props {
  update: UniversityUpdate;
  onActionDone: () => void;
}

export const UpdateReviewCard: React.FC<Props> = ({ update, onActionDone }) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("university_updates")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", update.id);

    setLoading(false);
    if (error) alert(error.message);
    else onActionDone();
  };

  const handleReject = async () => {
    if (!confirm("মুছে ফেলতে চান?")) return;
    setLoading(true);
    const { error } = await supabase
      .from("university_updates")
      .delete()
      .eq("id", update.id);

    setLoading(false);
    if (error) alert(error.message);
    else onActionDone();
  };

  return (
    <div className="p-4 rounded-xl bg-[#0f141d] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300">
            {update.university_name}
          </span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${update.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
            {update.status.toUpperCase()}
          </span>
        </div>
        <div className="text-xs font-bold text-white leading-snug">
          {update.title}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          {update.extracted_data?.exam_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-400" /> {update.extracted_data.exam_date}
            </span>
          )}
          {update.extracted_data?.fees && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> {update.extracted_data.fees}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {update.status !== "published" && (
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <Check className="w-3.5 h-3.5" /> পাবলিশ ও পুশ
          </button>
        )}
        <button
          onClick={handleReject}
          disabled={loading}
          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 cursor-pointer transition"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};