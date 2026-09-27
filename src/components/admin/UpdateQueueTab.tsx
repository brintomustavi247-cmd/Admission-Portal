import React, { useCallback, useEffect, useState, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import { ManualUpdateForm } from "./ManualUpdateForm";
import { CardEditor } from "./CardEditor";
import { UpdateDetailModal } from "../UpdateDetailModal";
import { initialUniversitiesData } from "../../data/mockUniversities";
import { markSeen } from "../../lib/newsSeen";
import { useAuth } from "../../contexts/AuthContext";
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
  Sparkles,
  Search,
  Filter,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

const norm = (s: string) =>
  String(s || "")
    .replace(/[\s\(\)।,.\-—:]/g, "")
    .toLowerCase();
const digits = (s: string) => String(s || "").replace(/[^\d০-৯]/g, "");

/**
 * Checks if the extracted data contains concrete fields that should trigger card updates.
 * If not, the update will only appear in News, not update the university card.
 */
function hasConcreteCardData(d: any): boolean {
  return Boolean(
    d?.exam_date ||
    d?.application_start ||
    d?.application_deadline ||
    d?.fee_amount ||
    (Array.isArray(d?.units) && d.units.some((u: any) => u?.date || u?.fee)),
  );
}

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
  if (Array.isArray(d.units)) {
    d.units.forEach((u: any) => {
      if (u?.date && dates.includes(u.date)) reasons.push(u.name);
    });
  }

  return { exists: reasons.length > 0, reason: reasons.join(", ") };
}

/**
 * Updates source reliability weight based on admin action (approve/reject)
 */
async function updateSourceWeight(
  sourceUrls: string[],
  action: "approve" | "reject",
) {
  if (!sourceUrls || !sourceUrls.length) return;

  try {
    const src = new URL(sourceUrls[0]).hostname.replace("www.", "");
    await supabase.rpc("update_source_weight", {
      p_source: src,
      p_delta_approved: action === "approve" ? 1 : 0,
      p_delta_rejected: action === "reject" ? 1 : 0,
    });
  } catch (e) {
    console.warn("Source weight update failed:", e);
  }
}

export const UpdateQueueTab: React.FC = () => {
  const { profile } = useAuth();
  const uid = profile?.id || "guest";

  const [updates, setUpdates] = useState<any[]>([]);
  const [contribs, setContribs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "published" | "rejected"
  >("all");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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

    const items = u.data || [];
    setUpdates(items);
    markSeen(
      uid,
      "updates",
      items.filter((x: any) => x.status === "published").map((x: any) => x.id),
    );
    setContribs(c.data || []);
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Publish update with concrete data check
   * ⚠️ Rule: Only updates card if concrete fields exist (dates, fees, etc.)
   * Otherwise, only appears in News panel
   */
  const publish = async (id: string) => {
    const item = updates.find((u) => u.id === id);
    if (!item) return;

    const hasConcrete = hasConcreteCardData(item.extracted_data);

    const { error } = await supabase
      .from("university_updates")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      showToast("❌ Publish failed: " + error.message, "error");
      return;
    }

    // Update source reliability weight
    await updateSourceWeight(item.source_urls, "approve");

    if (hasConcrete) {
      showToast("✅ Published! Card updated with new dates/fees", "success");
    } else {
      showToast("✅ Published to News (no concrete card data)", "warning");
    }

    load();
  };

  const remove = async (id: string) => {
    if (!confirm("মুছে ফেলবে?")) return;
    const item = updates.find((u) => u.id === id);

    await supabase.from("university_updates").delete().eq("id", id);

    if (item?.source_urls) {
      await updateSourceWeight(item.source_urls, "reject");
    }

    showToast("🗑️ Update deleted", "success");
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

    showToast("↩️ Rolled back successfully", "success");
    load();
  };

  const bulkDelete = async () => {
    if (!selected.length || !confirm(`${selected.length}টা entry মুছবে?`))
      return;
    await supabase.from("university_updates").delete().in("id", selected);
    setSelected([]);
    showToast(`🗑️ ${selected.length} entries deleted`, "success");
    load();
  };

  const deleteExisted = async () => {
    const ids = updates
      .filter((u) => u.status === "pending" && existsInApp(u).exists)
      .map((u) => u.id);
    if (!ids.length || !confirm(`${ids.length}টা "আগেই আছে" entry মুছবে?`))
      return;
    await supabase.from("university_updates").delete().in("id", ids);
    showToast(`🗑️ ${ids.length} duplicate entries removed`, "success");
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

    if (!error) {
      await supabase
        .from("user_contributions")
        .update({ status: "approved" })
        .eq("id", c.id);
      showToast(
        `✅ Approved! ${c.contributor_name}-এর তথ্য News-এ যোগ হয়েছে`,
        "success",
      );
    } else {
      showToast("❌ Approval failed: " + error.message, "error");
    }
    load();
  };

  const rejectContrib = async (c: any) => {
    await supabase
      .from("user_contributions")
      .update({ status: "rejected" })
      .eq("id", c.id);
    showToast("❌ Contribution rejected", "warning");
    load();
  };

  /**
   * Deep Research — triggers manual webhook scan for a specific university
   */
  const deepResearch = async () => {
    const uniId = prompt(
      "কোন ভার্সিটির জন্য deep research? (id দাও: du, gst, buet, medical...)",
    );
    if (!uniId) return;

    try {
      const webhookUrl = `https://script.google.com/macros/s/AKfycbzQXZbXvYQZbXvYQZbXvYQZbXvYQZbXvYQZbXv/exec?key=ami123badlo&uni=${uniId}`;
      showToast("🔬 Deep research started...", "success");

      const res = await fetch(webhookUrl);
      const json = await res.json();

      if (json.ok) {
        showToast(
          `✅ Research complete! ${json.data?.title || "Check queue"}`,
          "success",
        );
        load();
      } else {
        showToast(`❌ Research failed: ${json.error}`, "error");
      }
    } catch (e) {
      showToast("❌ Webhook error — check deployment", "error");
    }
  };

  // ========== FILTERING & STATS ==========
  const filteredUpdates = useMemo(() => {
    return updates.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesUni =
          item.university_name?.toLowerCase().includes(q) ||
          item.university_id?.toLowerCase().includes(q);
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesContent = item.raw_content?.toLowerCase().includes(q);

        if (!matchesUni && !matchesTitle && !matchesContent) return false;
      }

      return true;
    });
  }, [updates, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = updates.length;
    const pending = updates.filter((u) => u.status === "pending").length;
    const published = updates.filter((u) => u.status === "published").length;
    const rejected = updates.filter((u) => u.status === "rejected").length;
    const verified = updates.filter((u) => u.extracted_data?._verified).length;
    const community = updates.filter(
      (u) => u.extracted_data?._source === "community",
    ).length;

    return { total, pending, published, rejected, verified, community };
  }, [updates]);

  const pending = updates.filter((u) => u.status === "pending");
  const existedCount = pending.filter((u) => existsInApp(u).exists).length;

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border-2 ${
            toast.type === "success"
              ? "bg-emerald-500/90 border-emerald-400 text-white"
              : toast.type === "error"
                ? "bg-red-500/90 border-red-400 text-white"
                : "bg-amber-500/90 border-amber-400 text-white"
          }`}
        >
          <p className="text-xs font-bold">{toast.message}</p>
        </div>
      )}

      <ManualUpdateForm onSuccess={load} />

      {/* ========== STATISTICS DASHBOARD ========== */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-[#0f141d] border border-white/10">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
            Total
          </div>
          <div className="text-xl font-black text-white">{stats.total}</div>
        </div>
        <div className="p-3 rounded-xl bg-[#0f141d] border border-amber-500/30">
          <div className="text-[10px] text-amber-300 font-bold uppercase mb-1">
            Pending
          </div>
          <div className="text-xl font-black text-amber-300">
            {stats.pending}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#0f141d] border border-emerald-500/30">
          <div className="text-[10px] text-emerald-300 font-bold uppercase mb-1">
            Published
          </div>
          <div className="text-xl font-black text-emerald-300">
            {stats.published}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#0f141d] border border-slate-500/30">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
            Rejected
          </div>
          <div className="text-xl font-black text-slate-400">
            {stats.rejected}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#0f141d] border border-violet-500/30">
          <div className="text-[10px] text-violet-300 font-bold uppercase mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Verified
          </div>
          <div className="text-xl font-black text-violet-300">
            {stats.verified}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#0f141d] border border-pink-500/30">
          <div className="text-[10px] text-pink-300 font-bold uppercase mb-1 flex items-center gap-1">
            <Users className="w-3 h-3" /> Community
          </div>
          <div className="text-xl font-black text-pink-300">
            {stats.community}
          </div>
        </div>
      </div>

      {/* ========== CONTROLS & FILTERS ========== */}
      <div className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            আপডেট কিউ ({filteredUpdates.length} updates)
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Deep Research Button */}
            <button
              onClick={deepResearch}
              className="px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/30 text-[10px] font-black cursor-pointer hover:bg-violet-500/25 flex items-center gap-1"
              title="Deep Research (Perplexity-style deep scan)"
            >
              <Sparkles className="w-3 h-3" /> 🔬 Deep Research
            </button>

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
              title="রিফ্রেশ"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ভার্সিটি বা title খোঁজো..."
              className="w-full bg-[#151b27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-[11px] text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none cursor-pointer"
          >
            <option value="all">সব Status</option>
            <option value="pending">Pending ({stats.pending})</option>
            <option value="published">Published ({stats.published})</option>
            <option value="rejected">Rejected ({stats.rejected})</option>
          </select>
        </div>
      </div>

      {/* ========== UPDATES QUEUE ========== */}
      <div className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-3">
        {filteredUpdates.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            {updates.length === 0
              ? "কোনো আপডেট এন্ট্রি নেই।"
              : "Filter-এ কোনো update পাওয়া যায়নি।"}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredUpdates.map((item) => {
              const ex = existsInApp(item);
              const isSel = selected.includes(item.id);
              const hasConcrete = hasConcreteCardData(item.extracted_data);
              const isVerified = item.extracted_data?._verified;
              const isCommunity = item.extracted_data?._source === "community";

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    item.status === "published"
                      ? "bg-[#12201a] border-emerald-500/20"
                      : ex.exists
                        ? "bg-[#151b27] border-slate-600/40 opacity-80"
                        : "bg-[#151b27] border-amber-500/30"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
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

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Badge */}
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

                        {/* Verification Badge */}
                        {isVerified && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> যাচাইকৃত
                          </span>
                        )}

                        {/* Community Badge */}
                        {isCommunity && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" /> কমিউনিটি
                          </span>
                        )}

                        {/* Concrete Data Indicator */}
                        {item.status === "pending" &&
                          (hasConcrete ? (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" /> Card update
                            </span>
                          ) : (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-300 border border-slate-500/30">
                              শুধু News
                            </span>
                          ))}

                        {/* Existed Check */}
                        {item.status === "pending" && ex.exists && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-300 border border-slate-500/30">
                            ✅ আগেই আছে: {ex.reason}
                          </span>
                        )}

                        <h4 className="text-xs font-bold text-white truncate">
                          {item.university_name}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-300 truncate">
                        {item.title}
                      </p>

                      <div className="flex items-center gap-3 flex-wrap text-[10px] text-slate-400">
                        {item.extracted_data?.exam_date && (
                          <div className="flex items-center gap-1 text-sky-400">
                            <Clock className="w-3 h-3" />{" "}
                            {item.extracted_data.exam_date}
                          </div>
                        )}
                        {item.extracted_data?.fee_amount && (
                          <div className="flex items-center gap-1 text-emerald-400">
                            💰 {item.extracted_data.fee_amount}
                          </div>
                        )}
                        {item.source_urls?.length > 0 && (
                          <div className="flex items-center gap-1">
                            🔗 {item.source_urls.length} sources
                          </div>
                        )}
                        {item.extracted_data?._confidence && (
                          <div className="flex items-center gap-1">
                            📊{" "}
                            {Math.round(item.extracted_data._confidence * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setDetail(item)}
                      className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 cursor-pointer transition-colors"
                      title="Detail preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {item.status !== "published" && (
                      <button
                        onClick={() => publish(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-white text-[11px] font-bold cursor-pointer active:scale-95 flex items-center gap-1 transition-all ${
                          hasConcrete
                            ? "bg-emerald-600 hover:bg-emerald-500"
                            : "bg-sky-600 hover:bg-sky-500"
                        }`}
                        title={
                          hasConcrete
                            ? "Publish & update card"
                            : "Publish to News only"
                        }
                      >
                        <CheckCircle className="w-3 h-3" />
                        {hasConcrete ? "পাবলিশ ও পুশ" : "News-এ পাঠাও"}
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
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer transition-colors"
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

      {/* ========== COMMUNITY CONTRIBUTIONS ========== */}
      <div className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-3">
        <div className="text-xs font-bold text-white flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-violet-400" />
          কমিউনিটি তথ্য ({contribs.length} pending)
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
              <div className="text-[10px] font-black text-violet-300 flex items-center gap-2">
                🤝 {c.contributor_name}
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">
                  {c.university_name || "সাধারণ"}
                </span>
              </div>

              <p className="text-[11px] text-slate-200 leading-relaxed">
                {c.info_text}
              </p>

              {c.source_url && (
                <a
                  href={c.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-sky-400 underline break-all inline-block"
                >
                  📎 {c.source_url}
                </a>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => approveContrib(c)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <CheckCircle className="w-3 h-3" /> Approve → News-এ যাবে
                </button>
                <button
                  onClick={() => rejectContrib(c)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 text-[10px] font-black cursor-pointer hover:bg-rose-500/25 transition-colors"
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
