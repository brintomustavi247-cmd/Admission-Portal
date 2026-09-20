import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, GraduationCap, Building2, School, Check, ExternalLink } from 'lucide-react';
import { University } from '../types/admission';
import { toBanglaNum } from '../lib/banglaUtils';

interface QuickVarsitySelectorProps {
  universities: University[];
  onSelectUniversity: (uni: University) => void;
  onFilterByCategory?: (category: string) => void;
  isSecondTimer: boolean;
}

export const QuickVarsitySelector: React.FC<QuickVarsitySelectorProps> = ({
  universities,
  onSelectUniversity,
  isSecondTimer,
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Top popular universities
  const popularIds = ['du', 'ku', 'buet', 'medical', 'ru', 'cu', 'gst', 'cuet', 'sust', 'bup'];
  const popularUniversities = universities.filter((u) => popularIds.includes(u.id));

  // Filtered list for search dropdown
  const searchResults = search.trim()
    ? universities.filter((u) => {
        const q = search.toLowerCase().trim();
        return (
          u.name.toLowerCase().includes(q) ||
          u.shortName.toLowerCase().includes(q) ||
          u.englishName.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q)
        );
      })
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section
      id="quick-varsity-selector"
      className="bg-white/95 dark:bg-[#1e2530]/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#2a3344] shadow-sm p-3.5 sm:p-5 mb-5 relative transition-colors"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* Title & Quick Jump Description */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <GraduationCap className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                দ্রুত নিজের বিশ্ববিদ্যালয় বেছে নিন
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800">
                এক ক্লিকে তথ্য
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              নাম সার্চ করুন বা নিচে জনপ্রিয় ভার্সিটিতে ট্যাপ করে বিস্তারিত সার্কুলার ও জিপিএ দেখুন
            </p>
          </div>
        </div>

        {/* Instant Search Bar with Dropdown */}
        <div ref={dropdownRef} className="relative w-full lg:max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ভার্সিটির নাম বা সংক্ষেপ খুঁজুন (যেমন: ঢাবি, বুয়েট, খুবি, রাবি)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#333d4d] bg-slate-50/90 dark:bg-[#232b3a]/90 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-inner"
            />
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {isOpen && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#1e2530] rounded-2xl border border-slate-200 dark:border-[#2a3344] shadow-xl z-50 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
              >
                {searchResults.map((uni) => (
                  <button
                    key={uni.id}
                    type="button"
                    onClick={() => {
                      onSelectUniversity(uni);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className="w-full text-left p-3 hover:bg-sky-50/70 dark:hover:bg-[#2a3344]/80 active:bg-sky-100 flex items-center justify-between gap-2.5 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${
                          uni.logoBg || 'bg-slate-700'
                        }`}
                      >
                        {uni.shortName ? uni.shortName.slice(0, 3) : uni.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 truncate">
                          {uni.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                          <span>{uni.location}</span>
                          <span>•</span>
                          <span>{uni.categoryLabel}</span>
                          {uni.secondTimerAllowed && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-1 rounded">
                              ২য় বার অনুমোদিত
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Click Chips of Top Universities */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#2a3344]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>জনপ্রিয় প্রতিষ্ঠান:</span>
          </span>

          {popularUniversities.map((uni) => {
            const is2nd = isSecondTimer && uni.secondTimerAllowed;
            return (
              <button
                key={uni.id}
                type="button"
                onClick={() => onSelectUniversity(uni)}
                className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                  isSecondTimer && !uni.secondTimerAllowed
                    ? 'bg-slate-50 dark:bg-[#232b3a]/40 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-[#2a3344] line-through opacity-70'
                    : 'bg-white dark:bg-[#232b3a] hover:bg-sky-50 dark:hover:bg-[#2a3344] text-slate-700 dark:text-slate-200 hover:text-sky-700 dark:hover:text-sky-300 border-slate-200/90 dark:border-[#333d4d] hover:border-sky-300 dark:hover:border-slate-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    uni.circularStatus === 'confirmed' ? 'bg-emerald-500' : 'bg-sky-400'
                  }`}
                />
                <span>{uni.shortName || uni.name}</span>
                {isSecondTimer && uni.secondTimerAllowed && (
                  <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-1 rounded">
                    ২য়
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
