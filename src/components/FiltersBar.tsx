import React from 'react';
import { Search, Filter, Clock, GraduationCap, X } from 'lucide-react';
import { TimeFilterOption, CategoryFilterOption } from '../types/admission';
import { toBanglaNum } from '../lib/banglaUtils';

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  timeFilter: TimeFilterOption;
  onTimeFilterChange: (opt: TimeFilterOption) => void;
  categoryFilter: CategoryFilterOption;
  onCategoryFilterChange: (opt: CategoryFilterOption) => void;
  totalFiltered: number;
  ongoingCount: number;
  upcomingCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  totalFiltered,
  ongoingCount,
  upcomingCount,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div id="filters-bar" className="bg-white dark:bg-[#1e2530] rounded-2xl border border-slate-200 dark:border-[#2a3344] p-3.5 sm:p-4 mb-6 shadow-2xs space-y-3 transition-colors">
      {/* Search Input and Counts */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            id="input-search-university"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="বিশ্ববিদ্যালয়ের নাম, সংক্ষেপ (যেমন: ঢাবি, বুয়েট) বা অবস্থান খুঁজুন..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#232b3a]/90 border border-slate-200 dark:border-[#333d4d] text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            পাওয়া গেছে: <strong className="text-slate-900 dark:text-white font-number">{toBanglaNum(totalFiltered)}</strong>টি প্রতিষ্ঠান
          </span>
          {hasActiveFilters && (
            <button
              id="btn-clear-filters"
              type="button"
              onClick={onResetFilters}
              className="text-blue-600 dark:text-blue-400 hover:text-sky-800 dark:hover:text-sky-300 font-semibold underline text-xs cursor-pointer ml-1"
            >
              রিসেট
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Row */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#2a3344]">
        {/* Time Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:overflow-visible sm:flex-wrap">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-1 flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>সময়:</span>
          </span>

          <button
            type="button"
            onClick={() => onTimeFilterChange('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              timeFilter === 'all'
                ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a3344]'
            }`}
          >
            সব সময়
          </button>

          <button
            type="button"
            onClick={() => onTimeFilterChange('ongoing')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              timeFilter === 'ongoing'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>আবেদন চলছে ({toBanglaNum(ongoingCount)})</span>
          </button>

          <button
            type="button"
            onClick={() => onTimeFilterChange('upcoming')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              timeFilter === 'upcoming'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-950/70 border border-sky-200 dark:border-sky-800'
            }`}
          >
            আসন্ন ({toBanglaNum(upcomingCount)})
          </button>

          <button
            type="button"
            onClick={() => onTimeFilterChange('ended')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              timeFilter === 'ended'
                ? 'bg-slate-700 dark:bg-slate-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a3344]'
            }`}
          >
            শেষ হয়েছে
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:overflow-visible sm:flex-wrap">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-1 flex items-center gap-1 shrink-0">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>শাখা:</span>
          </span>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-slate-900 dark:bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a3344]'
            }`}
          >
            সকল
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('general')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              categoryFilter === 'general'
                ? 'bg-slate-900 dark:bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a3344]'
            }`}
          >
            সাধারণ
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('engineering')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              categoryFilter === 'engineering'
                ? 'bg-slate-900 dark:bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a3344]'
            }`}
          >
            প্রকৌশল
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('medical')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              categoryFilter === 'medical'
                ? 'bg-slate-900 dark:bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a3344]'
            }`}
          >
            মেডিকেল
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('agricultural')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              categoryFilter === 'agricultural'
                ? 'bg-slate-900 dark:bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a3344]'
            }`}
          >
            কৃষি
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('cluster')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              categoryFilter === 'cluster'
                ? 'bg-slate-900 dark:bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a3344]'
            }`}
          >
            গুচ্ছ
          </button>
        </div>
      </div>
    </div>
  );
};
