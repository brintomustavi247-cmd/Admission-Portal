import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { initialUniversitiesData } from "../../data/mockUniversities";
import { Save, Trash2, Plus, Edit3, RotateCcw } from "lucide-react";

interface CardUnitRow {
  unit: string;
  title: string;
  examDate: string;
  fee?: string;
}

export const CardEditor: React.FC = () => {
  const [uniId, setUniId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [note, setNote] = useState("");
  const [units, setUnits] = useState<CardUnitRow[]>([]);
  const [hasOverride, setHasOverride] = useState(false);
  const [msg, setMsg] = useState("");

  const loadUni = async (id: string) => {
    setUniId(id);
    const base = initialUniversitiesData.find((u) => u.id === id);
    const { data } = await supabase
      .from("university_overrides")
      .select("*")
      .eq("university_id", id)
      .single();
    const ov = (data?.data || {}) as Record<string, any>;
    setHasOverride(!!data);
    // override-only id হলে base না পেয়েও খালি form দেখাও (silent no-op বন্ধ)
    setStart(ov.startDate ?? base?.startDate ?? "");
    setEnd(ov.endDate ?? base?.endDate ?? "");
    setNote(ov.statusNote ?? base?.statusNote ?? "");
    setUnits(
      (ov.examUnits ?? base?.examUnits ?? []).map((u: any) => ({ ...u })),
    );
    setMsg(base ? "" : "⚠️ Base data নেই — override থেকে edit হচ্ছে");
  };

  const save = async () => {
    if (!uniId) return;
    const { error } = await supabase.from("university_overrides").upsert({
      university_id: uniId,
      data: {
        startDate: start,
        endDate: end,
        statusNote: note,
        examUnits: units,
      },
      updated_at: new Date().toISOString(),
    });
    setMsg(
      error ? "❌ " + error.message : "✅ Saved — সব user-এর card live update!",
    );
  };

  const clearOverride = async () => {
    if (!uniId || !confirm("Override মুছে base data-য় ফিরবে?")) return;
    await supabase
      .from("university_overrides")
      .delete()
      .eq("university_id", uniId);
    setHasOverride(false);
    loadUni(uniId);
    setMsg("↩️ Base data-য় ফিরে গেছে");
  };

  const setUnit = (i: number, field: string, val: string) =>
    setUnits((p) => p.map((u, n) => (n === i ? { ...u, [field]: val } : u)));

  return (
    <div className="p-4 rounded-2xl bg-[#0f141d] border border-white/10 space-y-3">
      <div className="text-xs font-bold text-white flex items-center gap-2">
        <Edit3 className="w-3.5 h-3.5 text-sky-400" /> Card Editor — যেকোনো
        ভার্সিটির details manually ঠিক করো
      </div>
      <select
        value={uniId}
        onChange={(e) => loadUni(e.target.value)}
        className="w-full bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none"
      >
        <option value="">— ভার্সিটি বাছো —</option>
        {initialUniversitiesData.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      {uniId && (
        <>
          {hasOverride && (
            <div className="text-[10px] font-black text-amber-300">
              ⚠️ Override active — base data নয়
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-slate-400 font-bold mb-1">
                আবেদন শুরু
              </div>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none"
              />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold mb-1">
                আবেদন শেষ
              </div>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none"
              />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold mb-1">
              স্ট্যাটাস নোট
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full bg-[#151b27] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none resize-none"
            />
          </div>
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 font-bold">
              ইউনিট ও পরীক্ষার তারিখ
            </div>
            {units.map((u, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#151b27] border border-white/5"
              >
                <input
                  value={u.unit || ""}
                  onChange={(e) => setUnit(i, "unit", e.target.value)}
                  placeholder="ইউনিট"
                  className="bg-[#0f141d] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                />
                <input
                  type="date"
                  value={u.examDate || ""}
                  onChange={(e) => setUnit(i, "examDate", e.target.value)}
                  className="bg-[#0f141d] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                />
                <input
                  value={u.fee || ""}
                  onChange={(e) => setUnit(i, "fee", e.target.value)}
                  placeholder="ফি"
                  className="bg-[#0f141d] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                />
                <button
                  onClick={() => setUnits((p) => p.filter((_, n) => n !== i))}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 cursor-pointer justify-self-end"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setUnits((p) => [
                  ...p,
                  { unit: "", title: "", examDate: "", fee: "" },
                ])
              }
              className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-[10px] font-black cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> ইউনিট যোগ
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white text-[11px] font-black cursor-pointer flex items-center justify-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Save (live)
            </button>
            {hasOverride && (
              <button
                onClick={clearOverride}
                className="px-3 py-2.5 rounded-xl bg-amber-500/15 text-amber-300 text-[11px] font-black cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
          {msg && (
            <p className="text-[10px] font-bold text-emerald-400 text-center">
              {msg}
            </p>
          )}
        </>
      )}
    </div>
  );
};
