import React from "react";

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl bg-white dark:bg-[#1e2530] border border-slate-200 dark:border-[#2a3344] p-5 space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-[#232b3a]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-[#232b3a] rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-[#232b3a] rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 dark:bg-[#232b3a] rounded w-full" />
      <div className="h-3 bg-slate-200 dark:bg-[#232b3a] rounded w-5/6" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 bg-slate-200 dark:bg-[#232b3a] rounded-full w-20" />
      <div className="h-6 bg-slate-200 dark:bg-[#232b3a] rounded-full w-16" />
    </div>
  </div>
);
