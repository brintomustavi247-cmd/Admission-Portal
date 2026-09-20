import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Printer,
  FileText,
  Search,
  Filter,
  Check,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Download,
  Share2,
} from 'lucide-react';
import { formatBanglaDate, toBanglaNum } from '../lib/banglaUtils';

export interface CalendarEvent {
  date: string;
  name: string;
  unit: string;
  status: 'announced' | 'reported' | 'pending';
  secondTimer: boolean;
  time?: string;
  location?: string;
  category?: string;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: '2026-12-05', name: 'এভিয়েশন ও অ্যারোস্পেস বিশ্ববিদ্যালয় (AAUB)', unit: 'স্নাতক পরীক্ষা', status: 'announced', secondTimer: true, time: 'সকাল ১০:০০', location: 'ঢাকা/লালমনিরহাট' },
  { date: '2026-12-05', name: 'ঢাকা বিশ্ববিদ্যালয় (DU)', unit: 'IBA ইউনিট (ব্যবসায় প্রশাসন)', status: 'announced', secondTimer: false, time: 'সকাল ১০:০০ - ১২:০০', location: 'ঢাবি ক্যাম্পাস' },
  { date: '2026-12-12', name: 'ঢাকা বিশ্ববিদ্যালয় (DU)', unit: 'বিজ্ঞান অনুষদভুক্ত ইউনিট', status: 'announced', secondTimer: false, time: 'সকাল ১১:০০ - ১২:৩০', location: '৮টি বিভাগীয় শহর' },
  { date: '2026-12-17', name: 'খুলনা বিশ্ববিদ্যালয় (KU)', unit: 'C ও D স্কুল (কলা ও সমাজবিজ্ঞান)', status: 'announced', secondTimer: true, time: 'সকাল ১০:০০', location: 'খুবি ক্যাম্পাস' },
  { date: '2026-12-18', name: 'খুলনা বিশ্ববিদ্যালয় (KU)', unit: 'A ও B স্কুল (বিজ্ঞান ও স্থাপত্য)', status: 'announced', secondTimer: true, time: 'সকাল ১০:০০', location: 'খুবি ক্যাম্পাস' },
  { date: '2026-12-18', name: 'এমআইএসটি (MIST)', unit: 'C ইউনিট (স্থাপত্য অঙ্কন)', status: 'announced', secondTimer: true, time: 'সকাল ৯:০০ - ১২:০০', location: 'মিরপুর সেনানিবাস' },
  { date: '2026-12-19', name: 'ঢাকা বিশ্ববিদ্যালয় (DU)', unit: 'কলা, আইন ও সামাজিক বিজ্ঞান', status: 'announced', secondTimer: false, time: 'সকাল ১১:০০ - ১২:৩০', location: '৮টি বিভাগীয় শহর' },
  { date: '2026-12-19', name: 'এমআইএসটি (MIST)', unit: 'A ও B ইউনিট (প্রকৌশল বিজ্ঞান)', status: 'announced', secondTimer: true, time: 'সকাল ১০:০০ - ১:০০', location: 'মিরপুর সেনানিবাস' },
  { date: '2026-12-22', name: 'ঢাকা বিশ্ববিদ্যালয় (DU)', unit: 'চারুকলা ইউনিট (অঙ্কন ও তত্ত্বীয়)', status: 'announced', secondTimer: false, time: 'সকাল ১১:০০ - ১২:৩০', location: 'চারুকলা অনুষদ' },
  { date: '2026-12-26', name: 'ঢাকা বিশ্ববিদ্যালয় (DU)', unit: 'ব্যবসায় শিক্ষা ইউনিট', status: 'announced', secondTimer: false, time: 'সকাল ১১:০০ - ১২:৩০', location: '৮টি বিভাগীয় শহর' },
  { date: '2027-01-01', name: 'জগন্নাথ বিশ্ববিদ্যালয় (JnU)', unit: 'A ইউনিট (বিজ্ঞান)', status: 'announced', secondTimer: false, time: 'বিকাল ৩:০০ - ৪:০০', location: 'জবি ক্যাম্পাস ও উপকেন্দ্র' },
  { date: '2027-01-02', name: 'কৃষি গুচ্ছ (৯টি বিশ্ববিদ্যালয়)', unit: 'একক সমন্বিত ভর্তি পরীক্ষা', status: 'announced', secondTimer: true, time: 'সকাল ১১:০০ - ১২:০০', location: 'সারাদেশে ৮টি কেন্দ্র' },
  { date: '2027-01-08', name: 'কুয়েট (KUET)', unit: 'প্রকৌশল ও ইউআরপি বিভাগ', status: 'announced', secondTimer: false, time: 'সকাল ১০:০০ - ১২:৩০', location: 'কুয়েট ক্যাম্পাস' },
  { date: '2027-01-08', name: 'রাজশাহী বিশ্ববিদ্যালয় (RU)', unit: 'B ইউনিট (ব্যবসায় শিক্ষা)', status: 'announced', secondTimer: true, time: '৪টি শিফটে অনুষ্ঠিত', location: 'রাবি ক্যাম্পাস' },
  { date: '2027-01-08', name: 'জগন্নাথ বিশ্ববিদ্যালয় (JnU)', unit: 'E ইউনিট (চারুকলা অনুষদ)', status: 'announced', secondTimer: false, time: 'সকাল ১০:০০ - ১১:৩০', location: 'জবি ক্যাম্পাস' },
  { date: '2027-01-08', name: 'বিইউপি (BUP)', unit: 'সম্ভাব্য প্রথম ধাপের ভর্তি পরীক্ষা', status: 'reported', secondTimer: true, time: 'নির্ধারিত হবে', location: 'মিরপুর সেনানিবাস' },
  { date: '2027-01-09', name: 'রাজশাহী বিশ্ববিদ্যালয় (RU)', unit: 'C ইউনিট (বিজ্ঞান অনুষদ)', status: 'announced', secondTimer: true, time: '৪টি শিফটে অনুষ্ঠিত', location: 'রাবি ক্যাম্পাস' },
  { date: '2027-01-14', name: 'রুয়েট (RUET)', unit: 'সম্ভাব্য প্রকৌশল ও প্রযুক্তি পরীক্ষা', status: 'reported', secondTimer: false, time: 'সকাল ১০:০০', location: 'রুয়েট ক্যাম্পাস' },
  { date: '2027-01-15', name: 'জগন্নাথ বিশ্ববিদ্যালয় (JnU)', unit: 'B ইউনিট (কলা ও আইন অনুষদ)', status: 'announced', secondTimer: false, time: 'সকাল ১০:০০ - ১১:০০', location: 'জবি ক্যাম্পাস' },
  { date: '2027-01-16', name: 'বুয়েট (BUET)', unit: 'স্নাতক প্রাক-নির্বাচনী / মূল পরীক্ষা', status: 'announced', secondTimer: false, time: 'সকাল ১০:০০ - ১২:০০', location: 'বুয়েট ক্যাম্পাস' },
  { date: '2027-01-16', name: 'রাজশাহী বিশ্ববিদ্যালয় (RU)', unit: 'A ইউনিট (মানবিক ও আইন)', status: 'announced', secondTimer: true, time: '৪টি শিফটে অনুষ্ঠিত', location: 'রাবি ক্যাম্পাস' },
  { date: '2027-01-22', name: 'সরকারি ও বেসরকারি মেডিকেল কলেজ', unit: 'এমবিবিএস (MBBS) ভর্তি পরীক্ষা', status: 'reported', secondTimer: true, time: 'সকাল ১০:০০ - ১১:০০', location: 'সারাদেশের কেন্দ্রসমূহ' },
  { date: '2027-01-22', name: 'জগন্নাথ বিশ্ববিদ্যালয় (JnU)', unit: 'C ইউনিট (ব্যবসায় শিক্ষা)', status: 'announced', secondTimer: false, time: 'সকাল ১০:০০ - ১১:০০', location: 'জবি ক্যাম্পাস' },
  { date: '2027-01-23', name: 'জগন্নাথ বিশ্ববিদ্যালয় (JnU)', unit: 'D ইউনিট (সামাজিক বিজ্ঞান)', status: 'announced', secondTimer: false, time: 'সকাল ১০:০০ - ১১:০০', location: 'জবি ক্যাম্পাস' },
  { date: '2027-01-24', name: 'হাবিপ্রবি (HSTU)', unit: 'স্নাতক ১ম বর্ষ ভর্তি পরীক্ষা উইন্ডো', status: 'announced', secondTimer: true, time: 'নির্ধারিত হবে', location: 'দিনাজপুর ক্যাম্পাস' },
  { date: '2027-01-26', name: 'শাবিপ্রবি (SUST)', unit: 'স্নাতক ভর্তি পরীক্ষা (২৬-২৭ জানুয়ারি)', status: 'announced', secondTimer: true, time: 'সকাল ৯:৩০ ও দুপুর ২:৩০', location: 'সিলেট ক্যাম্পাস' },
  { date: '2027-01-29', name: 'বুটেক্স (BUTEX)', unit: 'বিএসসি ইন টেক্সটাইল লিখিত পরীক্ষা', status: 'announced', secondTimer: false, time: 'সকাল ১০:০০ - ১২:০০', location: 'তেজগাঁও, ঢাকা' },
  { date: '2027-01-29', name: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU)', unit: 'C ইউনিট (ব্যবসায় প্রশাসন)', status: 'announced', secondTimer: true, time: 'সকাল ১১:০০', location: 'চবি, ঢাকা ও রাজশাহী' },
  { date: '2027-01-30', name: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU)', unit: 'A ইউনিট (বিজ্ঞান অনুষদ)', status: 'announced', secondTimer: true, time: 'সকাল ১১:০০', location: 'চবি, ঢাকা ও রাজশাহী' },
  { date: '2027-02-03', name: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU)', unit: 'B1 উপ-ইউনিট (নাট্যকলা ও সংগীত)', status: 'announced', secondTimer: true, time: 'সকাল ১১:০০', location: 'চবি ক্যাম্পাস' },
  { date: '2027-02-05', name: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU)', unit: 'B ইউনিট (কলা ও মানববিদ্যা)', status: 'announced', secondTimer: true, time: 'সকাল ১১:০০', location: 'চবি, ঢাকা ও রাজশাহী' },
  { date: '2027-02-06', name: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU)', unit: 'D ইউনিট (সম্মিলিত সমাজবিজ্ঞান)', status: 'announced', secondTimer: true, time: 'সকাল ১১:০০', location: 'চবি, ঢাকা ও রাজশাহী' },
  { date: '2027-02-08', name: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU)', unit: 'D1 উপ-ইউনিট (শারীরিক শিক্ষা)', status: 'announced', secondTimer: true, time: 'সকাল ১১:০০', location: 'চবি ক্যাম্পাস' },
  { date: '2027-03-19', name: 'জিএসটি গুচ্ছ (GST - ২৪ বিশ্ববিদ্যালয়)', unit: 'B ইউনিট (মানবিক অনুষদ)', status: 'announced', secondTimer: true, time: 'বেলা ১২:০০ - ১:০০', location: 'সারাদেশে ২২টি কেন্দ্র' },
  { date: '2027-03-20', name: 'জিএসটি গুচ্ছ (GST - ২৪ বিশ্ববিদ্যালয়)', unit: 'C ইউনিট (ব্যবসায় শিক্ষা)', status: 'announced', secondTimer: true, time: 'বেলা ১২:০০ - ১:০০', location: 'সারাদেশে ২২টি কেন্দ্র' },
  { date: '2027-03-27', name: 'জিএসটি গুচ্ছ (GST - ২৪ বিশ্ববিদ্যালয়)', unit: 'A ইউনিট (বিজ্ঞান অনুষদ)', status: 'announced', secondTimer: true, time: 'বেলা ১২:০০ - ১:০০', location: 'সারাদেশে ২২টি কেন্দ্র' },
];

interface CalendarTimelineProps {
  isSecondTimerOnly?: boolean;
}

export const CalendarTimeline: React.FC<CalendarTimelineProps> = ({
  isSecondTimerOnly = false,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [filterSecondTimer, setFilterSecondTimer] = useState<boolean>(isSecondTimerOnly);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter events
  const filteredEvents = CALENDAR_EVENTS.filter((ev) => {
    // Second timer filter
    if (filterSecondTimer && !ev.secondTimer) return false;

    // Month filter
    if (selectedMonth !== 'all') {
      const evMonth = ev.date.substring(0, 7); // e.g. "2026-12", "2027-01"
      if (evMonth !== selectedMonth) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = ev.name.toLowerCase().includes(q);
      const matchUnit = ev.unit.toLowerCase().includes(q);
      const matchDate = ev.date.includes(q) || formatBanglaDate(ev.date).includes(q);
      if (!matchName && !matchUnit && !matchDate) return false;
    }

    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="calendar-timeline-section" className="space-y-4 sm:space-y-6">
      {/* Printable Schedule Header (Only visible in Print view) */}
      <div className="hidden print:block mb-6 text-center border-b-2 border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-slate-900">
          বাংলাদেশ বিশ্ববিদ্যালয় ভর্তি পরীক্ষা ২০২৬–২৭
        </h1>
        <h2 className="text-base font-bold text-slate-700 mt-1">
          অফিসিয়াল ভর্তি পরীক্ষার মাস্টার ক্যালেন্ডার ও সময়সূচি
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          হালনাগাদ তথ্যভাণ্ডার • সংগৃহীত তথ্য: ২০২৬–২৭ শিক্ষাবর্ষ
        </p>
      </div>

      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-white shadow-xl shadow-slate-950/20 relative overflow-hidden border border-slate-800 print:hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0">
              <CalendarIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight">
                  ভর্তি পরীক্ষার মাস্টার ক্যালেন্ডার
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/30">
                  {toBanglaNum(CALENDAR_EVENTS.length)}টি ঘোষিত তারিখ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sky-100 dark:text-sky-200 mt-1 max-w-xl">
                সকল পাবলিক, মেডিকেল, ইঞ্জিনিয়ারিং ও গুচ্ছভুক্ত বিশ্ববিদ্যালয়ের অফিসিয়াল ভর্তি পরীক্ষার তারিখ ও রুটিন।
              </p>
            </div>
          </div>

          {/* Print / Export Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-print-calendar"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 active:scale-95 text-sky-900 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              title="এই রুটিনটি প্রিন্ট করুন বা PDF হিসেবে সংরক্ষণ করুন"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>প্রিন্ট / PDF সংরক্ষণ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Month Selector & Filters */}
      <div className="bg-white dark:bg-[#1e2530] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#2a3344] shadow-2xs p-3.5 sm:p-5 space-y-3.5 print:hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Month Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'সকল মাস' },
              { id: '2026-12', label: 'ডিসেম্বর ২০২৬' },
              { id: '2027-01', label: 'জানুয়ারি ২০২৭' },
              { id: '2027-02', label: 'ফেব্রুয়ারি ২০২৭' },
              { id: '2027-03', label: 'মার্চ ২০২৭' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMonth(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedMonth === m.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#232b3a] text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-[#2a3344] hover:text-sky-800 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* View Mode & 2nd Timer Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFilterSecondTimer(!filterSecondTimer)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                filterSecondTimer
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-[#232b3a] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#333d4d] hover:bg-slate-100 dark:hover:bg-[#2a3344]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>২য় বার সুযোগ</span>
              {filterSecondTimer && <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-[#232b3a] p-0.5 border border-slate-200 dark:border-[#333d4d]">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-300 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                কার্ড ভিউ
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-300 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                টেবিল ভিউ
              </button>
            </div>
          </div>
        </div>

        {/* Search within Calendar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ক্যালেন্ডারে বিশ্ববিদ্যালয়ের নাম বা ইউনিট খুঁজুন (যেমন: ঢাবি, কুয়েট, কৃষি গুচ্ছ)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#232b3a] border border-slate-200 dark:border-[#333d4d] text-xs sm:text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Events Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 print:hidden">
        <span>
          মোট <strong className="text-sky-800 dark:text-sky-400 font-number">{toBanglaNum(filteredEvents.length)}</strong>টি ভর্তি পরীক্ষার তারিখ দেখানো হচ্ছে
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          ✅ অফিশিয়াল সময়সূচি • সময় ও কেন্দ্রসহ
        </span>
      </div>

      {/* VIEW MODE 1: CARDS (Default Interactive View) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:hidden">
          {filteredEvents.map((ev, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1e2530] rounded-2xl border border-slate-200/90 dark:border-[#2a3344] shadow-2xs hover:shadow-md hover:border-sky-300 dark:hover:border-sky-600 transition-all p-4 flex flex-col justify-between"
            >
              <div>
                {/* Date & Badges */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold text-xs font-number border border-sky-200/70 dark:border-sky-800/80">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    {formatBanglaDate(ev.date)}
                  </span>
                  <div className="flex items-center gap-1">
                    {ev.secondTimer ? (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                        ২য় বার আছে
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#232b3a] px-2 py-0.5 rounded-md">
                        ১ম বার
                      </span>
                    )}
                    {ev.status === 'announced' ? (
                      <span title="অফিসিয়ালি ঘোষিত" className="text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span title="সম্ভাব্য তারিখ" className="text-amber-500 dark:text-amber-400">
                        <Clock className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                {/* University Name */}
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                  {ev.name}
                </h3>
                {/* Unit / Details */}
                <p className="text-xs text-sky-900/80 dark:text-sky-300 font-medium mt-1">
                  {ev.unit}
                </p>
              </div>

              {/* Extra Info Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#2a3344] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                {ev.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    {ev.time}
                  </span>
                )}
                {ev.location && <span className="truncate">{ev.location}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: TABLE (Clean Tabular View & Always used for PRINT) */}
      <div
        className={`${
          viewMode === 'table' ? 'block' : 'hidden'
        } print:block bg-white dark:bg-[#1e2530] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#2a3344] shadow-2xs overflow-hidden transition-colors`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sky-50/80 dark:bg-[#232b3a] text-sky-950 dark:text-sky-200 font-bold border-b border-sky-100 dark:border-[#333d4d]">
              <tr>
                <th className="py-3 px-3 sm:px-4">তারিখ</th>
                <th className="py-3 px-3 sm:px-4">বিশ্ববিদ্যালয়ের নাম</th>
                <th className="py-3 px-3 sm:px-4">ইউনিট / অনুষদ</th>
                <th className="py-3 px-3 sm:px-4">পরীক্ষার সময় ও কেন্দ্র</th>
                <th className="py-3 px-3 sm:px-4 text-center">২য় বার</th>
                <th className="py-3 px-3 sm:px-4 text-center">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEvents.map((ev, idx) => (
                <tr key={idx} className="hover:bg-sky-50/40 dark:hover:bg-[#2a3344]/60 transition-colors">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-sky-900 dark:text-sky-300 font-number whitespace-nowrap">
                    {formatBanglaDate(ev.date)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white">
                    {ev.name}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-600 dark:text-slate-300">
                    {ev.unit}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 dark:text-slate-400 text-xs">
                    {ev.time || 'ঘোষিত হবে'} {ev.location ? `• ${ev.location}` : ''}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    {ev.secondTimer ? (
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                        সুযোগ আছে
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">না</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    {ev.status === 'announced' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ঘোষিত
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        সম্ভাব্য
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print Signature & Footer */}
        <div className="hidden print:flex justify-between items-center p-4 border-t border-slate-200 text-xs text-slate-500 mt-6">
          <span>ডকুমেন্ট প্রস্তুত: বিশ্ববিদ্যালয় ভর্তি তথ্যভাণ্ডার ২০২৬–২৭</span>
          <span>পৃষ্ঠা: ১/১</span>
        </div>
      </div>
    </div>
  );
};
