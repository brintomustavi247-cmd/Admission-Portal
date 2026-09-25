import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { ManualUpdateForm } from "./ManualUpdateForm";
import { RefreshCw, CheckCircle, Clock, Trash2, Globe } from "lucide-react";

export const UpdateQueueTab: React.FC = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUpdates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("university_updates")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);
    if (!error && data) {
      setUpdates(data);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handlePublish = async (id: string) => {
    const { error } = await supabase
      .from("university_updates")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Publish fail: " + error.message);
    } else {
      alert("✅ Update published & pushed live!");
      fetchUpdates();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return;
    const { error } = await supabase
      .from("university_updates")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchUpdates();
    }
  };

  return (
    <div className="space-y-6">
      {/* Integrated Form (AI Extractor + Manual Entry inside) */}
      <ManualUpdateForm onSuccess={fetchUpdates} />

      {/* Queue and Live Status Section */}
      <div className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            আপডেট কিউ ও লাইভ স্টেটাস
          </div>
          <button
            onClick={fetchUpdates}
            disabled={loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {updates.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            কোনো আপডেট এন্ট্রি নেই।
          </div>
        ) : (
          <div className="space-y-2.5">
            {updates.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#151b27] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        item.status === "published"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.university_name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">
                    {item.title}
                  </p>
                  {item.extracted_data?.exam_date && (
                    <div className="text-[10px] text-sky-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> পরীক্ষার তারিখ:{" "}
                      {item.extracted_data.exam_date}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status !== "published" && (
                    <button
                      onClick={() => handlePublish(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <CheckCircle className="w-3 h-3" />
                      পাবলিশ ও পুশ
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
