import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { UniversityUpdate } from "../../types/admission";
import { AIExtractButton } from "./AIExtractButton";
import { ManualUpdateForm } from "./ManualUpdateForm";
import { UpdateReviewCard } from "./UpdateReviewCard";
import { RefreshCw, Radio } from "lucide-react";

export const UpdateQueueTab: React.FC = () => {
  const [updates, setUpdates] = useState<UniversityUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("university_updates")
      .select("*")
      .order("created_at", { ascending: false });

    setUpdates((data as UniversityUpdate[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return (
    <div className="space-y-6">
      <AIExtractButton onExtracted={(data) => setAiData(data)} />
      <ManualUpdateForm initialData={aiData} onSuccess={() => { setAiData(null); fetchUpdates(); }} />

      <div className="bg-[#151b27] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white">আপডেট কিউ ও লাইভ স্টেটাস</h3>
          </div>
          <button
            onClick={fetchUpdates}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {updates.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            কোনো আপডেট এন্ট্রি নেই।
          </div>
        ) : (
          <div className="space-y-2.5">
            {updates.map((u) => (
              <UpdateReviewCard key={u.id} update={u} onActionDone={fetchUpdates} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};