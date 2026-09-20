import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Link,
  Code2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { runSheetFetcherUnitTests } from '../lib/sheetFetcher';

interface SheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSheetId: string;
  isLive: boolean;
  source: 'google-sheet' | 'local-verified';
  lastUpdated: string;
  errorMessage?: string;
  onApplySheetUrl: (urlOrId: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const SheetConfigModal: React.FC<SheetConfigModalProps> = ({
  isOpen,
  onClose,
  currentSheetId,
  isLive,
  source,
  lastUpdated,
  errorMessage,
  onApplySheetUrl,
  onRefresh,
  isLoading,
}) => {
  const [inputUrl, setInputUrl] = useState(currentSheetId);
  const [testResults, setTestResults] = useState<{ passed: boolean; details: string[] } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onApplySheetUrl(inputUrl.trim());
      onClose();
    }
  };

  const handleRunTests = () => {
    const results = runSheetFetcherUnitTests();
    setTestResults(results);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#1e2530] rounded-3xl shadow-xl border border-slate-200 dark:border-[#2a3344] overflow-hidden z-10 my-auto p-6 transition-colors"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2a3344]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">গুগল শিট ডেটা সোর্স সংযোগ</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Google Sheets gviz API ইন্টিগ্রেশন</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#2a3344] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status Box */}
          <div className="my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#232b3a]/80 border border-slate-200 dark:border-[#333d4d] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">বর্তমান স্ট্যাটাস:</span>
              {isLive ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  লাইভ গুগল শিট সংযুক্ত
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-blue-700 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full">
                  <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  ২০২৫-২৬ ভেরিফাইড ডেটাবেস
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>সর্বশেষ আপডেট:</span>
              <span className="font-bold text-slate-800 dark:text-white">{lastUpdated}</span>
            </div>

            {errorMessage && (
              <div className="pt-2 border-t border-slate-200 dark:border-[#333d4d] text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Connect Custom Sheet Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="sheet-input-url" className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                গুগল শিট লিংক বা শিট আইডি (Google Sheet URL / ID)
              </label>
              <div className="relative">
                <input
                  id="sheet-input-url"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#333d4d] bg-white dark:bg-[#232b3a] text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <Link className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                টিপস: শিটটি অবশ্যই পাবলিক থাকতে হবে (Share ➔ Anyone with the link can view)।
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleRunTests}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#232b3a] hover:bg-slate-200 dark:hover:bg-[#2a3344] text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>ইউনিট টেস্ট চালান</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="p-2 rounded-xl border border-slate-200 dark:border-[#333d4d] hover:bg-slate-50 dark:hover:bg-[#2a3344] text-slate-600 dark:text-slate-300 disabled:opacity-50 cursor-pointer"
                  title="রিফ্রেশ"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  সংরক্ষণ ও লোড করুন
                </button>
              </div>
            </div>
          </form>

          {/* Unit Test Results Display */}
          {testResults && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-900 text-slate-100 text-xs space-y-1.5 max-h-40 overflow-y-auto font-mono">
              <div className="font-bold flex items-center justify-between pb-1 border-b border-slate-800">
                <span>ইউনিট টেস্ট ফলাফল:</span>
                <span className={testResults.passed ? 'text-emerald-400' : 'text-rose-400'}>
                  {testResults.passed ? 'সব টেস্ট পাস করেছে (ALL PASSED)' : 'ত্রুটি পাওয়া গেছে'}
                </span>
              </div>
              {testResults.details.map((detail, idx) => (
                <div key={idx} className="text-[11px] opacity-90">
                  {detail}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
