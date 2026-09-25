import React from "react";
import { UniversityUpdate } from "../types/admission";
import { X, Calendar, DollarSign, Award, ExternalLink, CheckCircle2 } from "lucide-react";

interface Props {
  update: UniversityUpdate;
  onClose: () => void;
}

export const UpdateDetailModal: React.FC<Props> = ({ update, onClose }) => {
  const d = update.extracted_data || {};

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl text-slate-100">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {update.university_name}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-2 leading-snug">
              {update.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-xs sm:text-sm">
          {d.exam_date && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">পরীক্ষার তারিখ</span>
                <span className="font-bold text-white">{d.exam_date}</span>
              </div>
            </div>
          )}

          {d.fees && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">আবেদন ফি</span>
                <span className="font-bold text-white">{d.fees}</span>
              </div>
            </div>
          )}

          {d.min_gpa && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">নূন্যতম GPA শর্ত</span>
                <span className="font-bold text-white">
                  SSC: {d.min_gpa.ssc ?? '—'} | HSC: {d.min_gpa.hsc ?? '—'} | মোট: {d.min_gpa.combined ?? '—'}
                </span>
              </div>
            </div>
          )}

          {d.highlights && d.highlights.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-slate-400 font-bold text-[11px] block">গুরুত্বপূর্ণ তথ্যসমূহ:</span>
              {d.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}

          {update.source_urls && update.source_urls.length > 0 && (
            <div className="pt-2">
              <span className="text-slate-400 text-[11px] block mb-1.5 font-semibold">অফিসিয়াল উৎস / সার্কুলার:</span>
              {update.source_urls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 underline underline-offset-2 break-all"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" /> {url}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
          >
            বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
};