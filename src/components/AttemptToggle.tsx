import React from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  GraduationCap,
  AlertCircle,
  Compass,
  Zap,
} from "lucide-react";
import { toBanglaNum } from "../lib/banglaUtils";

interface AttemptToggleProps {
  isSecondTimer: boolean;
  onToggle: (isSecondTimer: boolean) => void;
  totalUniversitiesCount: number;
  secondTimerCount: number;
}

export const AttemptToggle: React.FC<AttemptToggleProps> = ({
  isSecondTimer,
  onToggle,
  totalUniversitiesCount,
  secondTimerCount,
}) => {
  return (
    <div
      id="attempt-toggle-container"
      className="w-full max-w-2xl mx-auto my-6"
    >
      <div className="bg-white dark:bg-[#1e2530] p-2 rounded-3xl border border-slate-200/90 dark:border-[#2a3344] shadow-sm transition-colors">
        {/* Top explanatory prompt */}
        <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>আপনার পরীক্ষার সুযোগ নির্বাচন করুন:</span>
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {isSecondTimer
              ? "২য় বার ফিল্টার সক্রিয়"
              : "সকল বিশ্ববিদ্যালয় প্রদর্শিত"}
          </span>
        </div>

        {/* The Toggle Buttons */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 bg-slate-100/90 dark:bg-[#232b3a]/90 p-1.5 rounded-2xl relative">
          {/* Option 1: First Timer */}
          <button
            id="btn-toggle-1st-timer"
            type="button"
            onClick={() => onToggle(false)}
            className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              !isSecondTimer
                ? "text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-[#2a3344]/50"
            }`}
          >
            {!isSecondTimer && (
              <motion.div
                layoutId="toggle-active-bg"
                className="absolute inset-0 bg-sky-600 rounded-xl -z-10 shadow-md"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <UserCheck
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${!isSecondTimer ? "text-white" : "text-slate-500 dark:text-slate-400"}`}
            />
            <span className="hidden sm:inline">
              ১ম বারের পরীক্ষার্থী (1st Timer)
            </span>
            <span className="sm:hidden">১ম বার (1st)</span>
            <span
              className={`text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-number shrink-0 ${
                !isSecondTimer
                  ? "bg-sky-700/80 text-sky-100"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {toBanglaNum(totalUniversitiesCount)}টি
            </span>
          </button>

          {/* Option 2: Second Timer */}
          <button
            id="btn-toggle-2nd-timer"
            type="button"
            onClick={() => onToggle(true)}
            className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              isSecondTimer
                ? "text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-[#2a3344]/50"
            }`}
          >
            {isSecondTimer && (
              <motion.div
                layoutId="toggle-active-bg"
                className="absolute inset-0 bg-emerald-600 rounded-xl -z-10 shadow-md"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <GraduationCap
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isSecondTimer ? "text-yellow-200" : "text-emerald-600 dark:text-emerald-400"}`}
            />
            <span className="hidden sm:inline">
              ২য় বারের পরীক্ষার্থী (2nd Timer)
            </span>
            <span className="sm:hidden">২য় বার (2nd)</span>
            <span
              className={`text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-number shrink-0 ${
                isSecondTimer
                  ? "bg-emerald-700/80 text-emerald-100"
                  : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {toBanglaNum(secondTimerCount)}টি
            </span>
          </button>
        </div>

        {/* Dynamic Contextual Helper Banner */}
        <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#232b3a]/70 text-xs flex items-center justify-between text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            {isSecondTimer ? (
              <>
                <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                  কার্ডে ক্লিক করে ২য় বার নীতিমালা, নম্বর কর্তন ও বিস্তারিত
                  সময়সূচি দেখুন।
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  কার্ডে ক্লিক করে বিস্তারিত সময়সূচি, ইউনিট ও নিয়মাবলী দেখুন।
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
