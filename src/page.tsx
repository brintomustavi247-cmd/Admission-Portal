/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bangladesh University Admission 2026-27 - Main Dashboard
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "./lib/supabase";
import {
  University,
  TimeFilterOption,
  CategoryFilterOption,
  EligibilityEvaluation,
} from "./types/admission";
import {
  fetchAdmissionData,
  SheetFetchResult,
  DEFAULT_SHEET_ID,
} from "./lib/sheetFetcher";
import { calculateUrgency, toBanglaNum } from "./lib/banglaUtils";
import { Header } from "./components/Header";
import { AttemptToggle } from "./components/AttemptToggle";
import { EligibilityChecker } from "./components/EligibilityChecker";
import { UniversityCard } from "./components/UniversityCard";
import { UniversityModal } from "./components/UniversityModal";
import { SheetConfigModal } from "./components/SheetConfigModal";
import { CalendarTimeline } from "./components/CalendarTimeline";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { SettingsPanel } from "./components/SettingsPanel";
import { SkeletonCard } from "./components/SkeletonCard";
import { UpdateNotifier } from "./components/UpdateNotifier";
import { AppUpdateBanner } from "./components/AppUpdateBanner";
import {
  GraduationCap,
  BookOpen,
  Award,
  SearchX,
  Calendar as CalendarIcon,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

type TabKey = "home" | "eligibility" | "calendar";
type FontKey = "noto" | "anek" | "hind";

const FONT_STORAGE_KEY = "admission_font_pref";
const THEME_STORAGE_KEY = "varsity_theme";

export default function AdmissionDashboard({
  onOpenAdmin,
}: { onOpenAdmin?: () => void } = {}) {
  /* ---------- 1. Data Source ---------- */
  const [sheetData, setSheetData] = useState<SheetFetchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customSheetUrl, setCustomSheetUrl] =
    useState<string>(DEFAULT_SHEET_ID);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  /* ---------- 2. Live Supabase Realtime Updates ---------- */
  const [liveUpdates, setLiveUpdates] = useState<any[]>([]);

  useEffect(() => {
    const fetchLiveUpdates = async () => {
      const { data, error } = await supabase
        .from("university_updates")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!error && data) {
        setLiveUpdates(data);
      }
    };

    fetchLiveUpdates();

    // Instant Realtime sync when admin publishes an update
    const channel = supabase
      .channel("page_live_sync_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "university_updates",
        },
        () => {
          fetchLiveUpdates();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ---------- 3. Navigation ---------- */
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  /* ---------- 4. Preferences ---------- */
  const [isSecondTimer, setIsSecondTimer] = useState<boolean>(false);
  const [fontPreference, setFontPreference] = useState<FontKey>(() => {
    try {
      const saved = localStorage.getItem(FONT_STORAGE_KEY);
      if (saved === "noto" || saved === "anek" || saved === "hind")
        return saved;
    } catch {}
    return "noto";
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  /* ---------- 5. Filters ---------- */
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterOption>("all");

  /* ---------- 6. Eligibility ---------- */
  const [eligibilityResults, setEligibilityResults] = useState<Record<
    string,
    EligibilityEvaluation
  > | null>(null);
  const [onlyShowEligible, setOnlyShowEligible] = useState<boolean>(false);

  /* ---------- 7. Modals ---------- */
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  /* ---------- Side Effects ---------- */
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, "dark");
      } catch {}
    } else {
      root.classList.remove("dark");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, "light");
      } catch {}
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => setIsDarkMode((prev) => !prev), []);

  const handleFontChange = useCallback((font: FontKey) => {
    setFontPreference(font);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, font);
    } catch {}
  }, []);

  /* ---------- Data Loading ---------- */
  const loadData = useCallback(
    async (urlOrId?: string) => {
      setIsLoading(true);
      try {
        const result = await fetchAdmissionData(urlOrId || customSheetUrl);
        setSheetData(result);
      } catch (err) {
        console.error("Failed to load admission data:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [customSheetUrl],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------- Merge Sheet Data with Live Supabase Updates ---------- */
  const rawUniversities = sheetData?.universities || [];

  const universities = useMemo(() => {
    if (!rawUniversities.length) return [];
    if (!liveUpdates.length) return rawUniversities;

    return rawUniversities.map((uni) => {
      const match = liveUpdates.find((u) => {
        if (!u.university_name) return false;
        const dbName = u.university_name.trim().toLowerCase();
        const uniName = uni.name.trim().toLowerCase();
        const short = (uni.shortName || "").trim().toLowerCase();
        return (
          uniName.includes(dbName) ||
          dbName.includes(uniName) ||
          (short && (dbName.includes(short) || short.includes(dbName)))
        );
      });

      if (match) {
        return {
          ...uni,
          circularStatus: "confirmed" as const,
          latestBreakingUpdate: match,
        };
      }
      return uni;
    });
  }, [rawUniversities, liveUpdates]);

  // Keep modal in sync with realtime updates
  const currentSelectedUniversity = useMemo(() => {
    if (!selectedUniversity) return null;
    return (
      universities.find((u) => u.id === selectedUniversity.id) ||
      selectedUniversity
    );
  }, [selectedUniversity, universities]);

  /* ---------- Metrics ---------- */
  const metrics = useMemo(() => {
    const secondTimerCount = universities.filter(
      (u) => u.secondTimerAllowed,
    ).length;
    let ongoingCount = 0;
    let upcomingCount = 0;
    universities.forEach((u) => {
      const status = calculateUrgency(u.startDate, u.endDate).status;
      if (status === "ongoing") ongoingCount++;
      else if (status === "upcoming") upcomingCount++;
    });
    return { secondTimerCount, ongoingCount, upcomingCount };
  }, [universities]);

  /* ---------- Filtering ---------- */
  const filteredUniversities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return universities.filter((uni) => {
      if (isSecondTimer && !uni.secondTimerAllowed) return false;
      if (query) {
        const matchesName =
          uni.name.toLowerCase().includes(query) ||
          uni.shortName.toLowerCase().includes(query) ||
          uni.englishName.toLowerCase().includes(query) ||
          uni.location.toLowerCase().includes(query);
        const matchesUnits = uni.examUnits?.some(
          (u) =>
            u.unit.toLowerCase().includes(query) ||
            u.title.toLowerCase().includes(query),
        );
        if (!matchesName && !matchesUnits) return false;
      }
      if (timeFilter !== "all") {
        if (calculateUrgency(uni.startDate, uni.endDate).status !== timeFilter)
          return false;
      }
      if (categoryFilter !== "all" && uni.category !== categoryFilter)
        return false;
      if (onlyShowEligible && eligibilityResults) {
        const evalResult = eligibilityResults[uni.id];
        if (!evalResult || !evalResult.isEligible) return false;
      }
      return true;
    });
  }, [
    universities,
    isSecondTimer,
    searchQuery,
    timeFilter,
    categoryFilter,
    onlyShowEligible,
    eligibilityResults,
  ]);

  /* ---------- Handlers ---------- */
  const handleOpenModal = useCallback((uni: University) => {
    setSelectedUniversity(uni);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUniversity(null);
  }, []);

  const handleEligibilityEvaluations = useCallback(
    (
      results: Record<string, EligibilityEvaluation> | null,
      onlyEligible: boolean,
    ) => {
      setEligibilityResults(results);
      setOnlyShowEligible(onlyEligible);
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setTimeFilter("all");
    setCategoryFilter("all");
    setOnlyShowEligible(false);
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    timeFilter !== "all" ||
    categoryFilter !== "all" ||
    onlyShowEligible;

  const fontClass =
    fontPreference === "anek"
      ? "font-anek"
      : fontPreference === "hind"
        ? "font-hind"
        : "font-noto";

  return (
    <div
      className={`min-h-screen ${fontClass} transition-colors duration-300 ${
        isDarkMode ? "dark text-slate-100" : "text-slate-900"
      }`}
    >
      {/* 🚀 APP VERSION UPDATE BANNER */}
      <AppUpdateBanner />

      {/* ================= HEADER ================= */}
      <Header
        universities={universities}
        onSelectUniversity={handleOpenModal}
        totalCount={universities.length}
        secondTimerCount={metrics.secondTimerCount}
        ongoingCount={metrics.ongoingCount}
        currentFont={fontPreference}
        onFontChange={handleFontChange}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isSearchOpen={isSearchOpen}
        onSearchOpenChange={setIsSearchOpen}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 sm:pb-16">
        <AnimatePresence mode="wait">
          {/* ==================== HOME TAB ==================== */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-5 sm:space-y-6"
            >
              <HeroMetricsBanner
                totalCount={universities.length}
                secondTimerCount={metrics.secondTimerCount}
                ongoingCount={metrics.ongoingCount}
                upcomingCount={metrics.upcomingCount}
                onNavigateToEligibility={() => setActiveTab("eligibility")}
                onNavigateToCalendar={() => setActiveTab("calendar")}
              />

              <AttemptToggle
                isSecondTimer={isSecondTimer}
                onToggle={(val) => setIsSecondTimer(val)}
                totalUniversitiesCount={universities.length}
                secondTimerCount={metrics.secondTimerCount}
              />

              {!isLoading && filteredUniversities.length > 0 && (
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    <span className="font-bold text-slate-900 dark:text-white font-number">
                      {toBanglaNum(filteredUniversities.length)}
                    </span>{" "}
                    টি বিশ্ববিদ্যালয় পাওয়া গেছে
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      রিসেট করুন
                    </button>
                  )}
                </div>
              )}

              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {!isLoading && filteredUniversities.length > 0 && (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredUniversities.map((uni, idx) => (
                      <motion.div
                        key={uni.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.3,
                          delay: Math.min(idx * 0.03, 0.3),
                        }}
                      >
                        <UniversityCard
                          university={uni}
                          isSecondTimerMode={isSecondTimer}
                          onOpenModal={handleOpenModal}
                          evaluation={
                            eligibilityResults
                              ? eligibilityResults[uni.id]
                              : undefined
                          }
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {!isLoading && filteredUniversities.length === 0 && (
                <EmptyState onReset={handleResetFilters} />
              )}
            </motion.div>
          )}

          {/* ==================== ELIGIBILITY TAB ==================== */}
          {activeTab === "eligibility" && (
            <motion.div
              key="eligibility"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <EligibilityChecker
                universities={universities}
                isSecondTimer={isSecondTimer}
                onFilterEvaluations={handleEligibilityEvaluations}
                activeOnlyEligible={onlyShowEligible}
                onSelectUniversity={handleOpenModal}
              />
            </motion.div>
          )}

          {/* ==================== CALENDAR TAB ==================== */}
          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <CalendarTimeline isSecondTimerOnly={isSecondTimer} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= MODALS & NAV ================= */}
      <SettingsPanel
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenAdmin={onOpenAdmin}
      />
      <UniversityModal
        university={currentSelectedUniversity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <SheetConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentSheetId={customSheetUrl}
        isLive={sheetData?.isLive || false}
        source={sheetData?.source || "local-verified"}
        lastUpdated={sheetData?.lastUpdated || ""}
        errorMessage={sheetData?.errorMessage}
        onApplySheetUrl={(url) => {
          setCustomSheetUrl(url);
          loadData(url);
        }}
        onRefresh={() => loadData(customSheetUrl)}
        isLoading={isLoading}
      />

      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 🔔 LIVE ADMISSION NOTIFICATION BANNER */}
      <UpdateNotifier />
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

const HeroMetricsBanner: React.FC<{
  totalCount: number;
  secondTimerCount: number;
  ongoingCount: number;
  upcomingCount: number;
  onNavigateToEligibility: () => void;
  onNavigateToCalendar: () => void;
}> = ({
  totalCount,
  secondTimerCount,
  ongoingCount,
  upcomingCount,
  onNavigateToEligibility,
  onNavigateToCalendar,
}) => (
  <section
    aria-label="Dashboard Overview"
    className="hero-panel relative overflow-hidden rounded-3xl text-white"
  >
    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

    <div className="relative z-10 p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 backdrop-blur-sm text-sky-300 text-[11px] font-bold mb-3 border border-sky-400/30">
            <Sparkles className="w-3 h-3" />
            <span>ভর্তি সেশন ২০২৬–২৭ • লাইভ আপডেট</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            বিশ্ববিদ্যালয় ভর্তি পোর্টাল
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            সকল পাবলিক, প্রকৌশল, মেডিকেল ও গুচ্ছভুক্ত বিশ্ববিদ্যালয়ের ভর্তি
            পরীক্ষার সময়সূচি, জিপিএ শর্ত ও ২য় বার সুযোগ।
          </p>

          <div className="mt-5 flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onNavigateToEligibility}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 active:scale-95 text-slate-950 text-xs font-black shadow-lg shadow-indigo-500/40 dark:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.35)] transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>যোগ্যতা যাচাই করুন</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToCalendar}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-sky-300" />
              <span>ক্যালেন্ডার দেখুন</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:w-[380px]">
          <MetricCard
            icon={<BookOpen className="w-4 h-4" />}
            label="মোট প্রতিষ্ঠান"
            value={toBanglaNum(totalCount)}
            color="sky"
          />
          <MetricCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="২য় বার সুযোগ"
            value={toBanglaNum(secondTimerCount)}
            color="emerald"
          />
          <MetricCard
            icon={<Clock className="w-4 h-4" />}
            label="চলমান আবেদন"
            value={toBanglaNum(ongoingCount)}
            color="amber"
            pulse={ongoingCount > 0}
          />
          <MetricCard
            icon={<CalendarIcon className="w-4 h-4" />}
            label="আসন্ন পরীক্ষা"
            value={toBanglaNum(upcomingCount)}
            color="indigo"
          />
        </div>
      </div>

      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.07] pointer-events-none hidden lg:flex items-center justify-end pr-10">
        <GraduationCap className="w-64 h-64 text-sky-400" />
      </div>
    </div>
  </section>
);

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "sky" | "emerald" | "amber" | "indigo";
  pulse?: boolean;
}> = ({ icon, label, value, color, pulse }) => {
  const colorClasses = {
    sky: "from-sky-500/25 to-cyan-500/10 border-sky-400/30 text-sky-200",
    emerald:
      "from-emerald-500/25 to-teal-500/10 border-emerald-400/30 text-emerald-200",
    amber:
      "from-amber-500/25 to-orange-500/10 border-amber-400/30 text-amber-200",
    indigo:
      "from-indigo-500/25 to-purple-500/10 border-indigo-400/30 text-indigo-200",
  };
  return (
    <div
      className={`relative p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm overflow-hidden`}
    >
      {pulse && (
        <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
        </span>
      )}
      <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-semibold uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1.5 text-2xl sm:text-3xl font-black text-white font-number tabular-nums">
        {value}
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="py-16 text-center surface-card p-8"
  >
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-[#232b3a] flex items-center justify-center">
      <SearchX className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
      কোনো বিশ্ববিদ্যালয়ের তথ্য পাওয়া যায়নি
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 mb-5">
      আপনার ফিল্টার বা অনুসন্ধান শব্দের পরিবর্তন করে আবার চেষ্টা করুন।
    </p>
    <button
      type="button"
      onClick={onReset}
      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
    >
      সকল ফিল্টার রিসেট করুন
    </button>
  </motion.div>
);
