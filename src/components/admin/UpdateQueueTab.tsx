import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ManualUpdateForm } from "./ManualUpdateForm";
import { CardEditor } from "./CardEditor";
import { UpdateDetailModal } from "../UpdateDetailModal";
import { initialUniversitiesData } from "../../data/mockUniversities";
import {
  RefreshCw,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  Users,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

const norm = (s: string) =>
  String(s || "")
    .replace(/[\s\(\)।,.\-—:]/g, "")
    .toLowerCase();
const digits = (s: string) => String(s || "").replace(/[^\d০-৯]/g, "");

function existsInApp(item: any): { exists: boolean; reason: string } {
  const base =
    initialUniversitiesData.find((b) => b.id === item.university_id) ||
    initialUniversitiesData.find(
      (b) =>
        norm(b.name).includes(norm(item.university_name)) ||
        norm(item.university_name).includes(norm(b.name)),
    );
  if (!base) return { exists: false, reason: "" };
  const d = item.extracted_data || {};
  const dates = (base.examUnits || []).map((u) => u.examDate);
  const fees = (base.examUnits || []).map((u) => u.fee || "");
  const reasons: string[] = [];
  if (d.exam_date && dates.includes(d.exam_date))
    reasons.push("পরীক্ষার তারিখ");
  if (d.application_start && base.startDate === d.application_start)
    reasons.push("আবেদন শুরু");
  if (d.application_deadline && base.endDate === d.application_deadline)
    reasons.push("আবেদন শেষ");
  if (
    d.fee_amount &&
    fees.some((f) => digits(f) && digits(f) === digits(d.fee_amount))
  )
    reasons.push("ফি");
  if (Array.isArray(d.units))
    d.units.forEach((u: any) => {
      if (u?.date && dates.includes(u.date)) reasons.push(u.name);
    });
  return { exists: reasons.length > 0, reason: reasons.join(", ") };
}

export const UpdateQueueTab: React.FC = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [contribs, setContribs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<any | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [u, c] = await Promise.all([
      supabase
        .from("university_updates")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("user_contributions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
    ]);
    setUpdates(u.data || []);
    setContribs(c.data || []);
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const publish = async (id: string) => {
    const { error } = await supabase
      .from("university_updates")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", id);
    alert(
      error
        ? "❌ " + error.message
        : "✅ Published! Concrete data থাকলে card update, নাহলে শুধু News-এ।",
    );
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("মুছে ফেলবে?")) return;
    await supabase.from("university_updates").delete().eq("id", id);
    load();
  };
  const rollback = async (id: string) => {
    if (
      !confirm(
        "Rollback? Update unpublish হবে এবং card আগের অবস্থায় ফিরে যাবে।",
      )
    )
      return;
    await supabase
      .from("university_updates")
      .update({ status: "rejected", published_at: null })
      .eq("id", id);
    load();
  };
  const bulkDelete = async () => {
    if (!selected.length || !confirm(`${selected.length}টা entry মুছবে?`))
      return;
    await supabase.from("university_updates").delete().in("id", selected);
    setSelected([]);
    load();
  };
  const deleteExisted = async () => {
    const ids = updates
      .filter((u) => u.status === "pending" && existsInApp(u).exists)
      .map((u) => u.id);
    if (!ids.length || !confirm(`${ids.length}টা "আগেই আছে" entry মুছবে?`))
      return;
    await supabase.from("university_updates").delete().in("id", ids);
    load();
  };
  const toggle = (id: string) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const approveContrib = async (c: any) => {
    const { error } = await supabase.from("university_updates").insert({
      university_id: c.university_id || null,
      university_name: c.university_name || "সাধারণ",
      update_type: "circular",
      title: c.info_text.slice(0, 80),
      raw_content: c.info_text,
      extracted_data: {
        _contributor: c.contributor_name,
        _source: "community",
      },
      source_urls: c.source_url ? [c.source_url] : [],
      severity: "normal",
      status: "published",
      published_at: new Date().toISOString(),
    });
    if (!error)
      await supabase
        .from("user_contributions")
        .update({ status: "approved" })
        .eq("id", c.id);
    load();
  };
  const rejectContrib = async (c: any) => {
    await supabase
      .from("user_contributions")
      .update({ status: "rejected" })
      .eq("id", c.id);
    load();
  };

  const pending = updates.filter((u) => u.status === "pending");
  const existedCount = pending.filter((u) => existsInApp(u).exists).length;

  return (
    <div className="space-y-5">
      <ManualUpdateForm onSuccess={load} />

      <div className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{" "}
            আপডেট কিউ ({pending.length} pending)
          </div>
          <div className="flex items-center gap-2">
            {existedCount > 0 && (
              <button
                onClick={deleteExisted}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-black cursor-pointer hover:bg-amber-500/25 flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" /> আগেই আছে ({existedCount})
                মুছো
              </button>
            )}
            {selected.length > 0 && (
              <button
                onClick={bulkDelete}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-black cursor-pointer hover:bg-rose-500/25 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> নির্বাচিত ({selected.length})
                মুছো
              </button>
            )}
            <button
              onClick={load}
              disabled={loading}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {updates.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            কোনো আপডেট এন্ট্রি নেই।
          </div>
        ) : (
          <div className="space-y-2.5">
            {updates.map((item) => {
              const ex = existsInApp(item);
              const isSel = selected.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.status === "published"
                      ? "bg-[#12201a] border-emerald-500/20"
                      : ex.exists
                        ? "bg-[#151b27] border-slate-600/40 opacity-80"
                        : "bg-[#151b27] border-amber-500/30"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {item.status === "pending" && (
                      <button
                        onClick={() => toggle(item.id)}
                        className="mt-0.5 cursor-pointer shrink-0"
                        title="Select"
                      >
                        {isSel ? (
                          <CheckSquare className="w-4 h-4 text-sky-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            item.status === "published"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : item.status === "rejected"
                                ? "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.status === "pending" &&
                          (ex.exists ? (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-300 border border-slate-500/30">
                              ✅ আগেই আছে: {ex.reason}
                            </span>
                          ) : (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                              🆕 নতুন — push দরকার
                            </span>
                          ))}
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
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setDetail(item)}
                      className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 cursor-pointer"
                      title="Detail preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {item.status !== "published" && (
                      <button
                        onClick={() => publish(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" /> পাবলিশ ও পুশ
                      </button>
                    )}
                    {item.status === "published" && (
                      <button
                        onClick={() => rollback(item.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-black cursor-pointer hover:bg-amber-500/25 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Rollback
                      </button>
                    )}
                    <button
                      onClick={() => remove(item.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-3">
        <div className="text-xs font-bold text-white flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-violet-400" /> কমিউনিটি তথ্য (
          {contribs.length} pending)
        </div>
        {contribs.length === 0 ? (
          <div className="py-5 text-center text-[11px] text-slate-500">
            কোনো contribution অপেক্ষায় নেই।
          </div>
        ) : (
          contribs.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl bg-[#151b27] border border-violet-500/20 space-y-1.5"
            >
              <div className="text-[10px] font-black text-violet-300">
                🤝 {c.contributor_name} • {c.university_name || "সাধারণ"}
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                {c.info_text}
              </p>
              {c.source_url && (
                <a
                  href={c.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-sky-400 underline break-all"
                >
                  সূত্র
                </a>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => approveContrib(c)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" /> Approve → News-এ যাবে
                </button>
                <button
                  onClick={() => rejectContrib(c)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 text-[10px] font-black cursor-pointer hover:bg-rose-500/25"
                >
                  বাতিল
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CardEditor />

      {detail && (
        <UpdateDetailModal update={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
};
