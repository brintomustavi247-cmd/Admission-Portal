/**
 * Bangladesh University Admission 2026-27 - Main Dashboard
 * v4: PREMIUM UI + HASH ROUTER + SEARCH FIX
 */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import { NewsPanel } from "./components/NewsPanel";
import { FeedbackPopup } from "./components/FeedbackPopup";
import { Admin } from "./pages/Admin";
import { unreadUpdates } from "./lib/newsSeen";
import { useAuth } from "./contexts/AuthContext";
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
type RouteView = TabKey | "admin";
type RouteOverlay = "news" | "settings" | "search" | "uni" | null;

const FONT_STORAGE_KEY = "admission_font_pref";
const THEME_STORAGE_KEY = "varsity_theme";

function readRoute(): {
  view: RouteView | "keep";
  overlay: RouteOverlay;
  uniId: string;
} {
  const h = window.location.hash.replace(/^#\/?/, "");
  if (h === "admin") return { view: "admin", overlay: null, uniId: "" };
  if (h === "news" || h === "settings" || h === "search")
    return { view: "keep", overlay: h, uniId: "" };
  if (h.startsWith("uni/"))
    return { view: "keep", overlay: "uni", uniId: h.slice(4) };
  if (h === "home" || h === "eligibility" || h === "calendar")
    return { view: h, overlay: null, uniId: "" };
  return { view: "home", overlay: null, uniId: "" };
}

export default function AdmissionDashboard({
  onOpenAdmin,
}: { onOpenAdmin?: () => void } = {}) {
  const { profile } = useAuth();
  const newsUid = profile?.id || "guest";
  const [newsUnread, setNewsUnread] = useState(0);
  const [route, setRoute] = useState(readRoute);
  const lastTab = useRef<TabKey>("home");

  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, "", "#/home");
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  const go = useCallback((hash: string) => {
    window.location.hash = hash;
  }, []);
  const goBack = useCallback(() => {
    if (window.history.length > 1) window.history.back();
    else go("/" + lastTab.current);
  }, [go]);

  useEffect(() => {
    if (route.view !== "keep" && route.view !== "admin")
      lastTab.current = route.view;
  }, [route]);

  const activeTab: TabKey =
    route.view === "keep" || route.view === "admin"
      ? lastTab.current
      : route.view;
  const showAdmin = route.view === "admin";
  const isNewsOpen = route.overlay === "news";
  const isSettingsOpen = route.overlay === "settings";
  const isSearchOpen = route.overlay === "search";
  const isUniModal = route.overlay === "uni";

  const [sheetData, setSheetData] = useState<SheetFetchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customSheetUrl, setCustomSheetUrl] =
    useState<string>(DEFAULT_SHEET_ID);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  const [liveUpdates, setLiveUpdates] = useState<any[]>([]);
  const [overrides, setOverrides] = useState<Record<string, any>>({});

  const fetchLiveUpdates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("university_updates")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (!error && data) setLiveUpdates(data);
    } catch (e) {
      console.error("Live updates fetch failed:", e);
    }
  }, []);

  useEffect(() => {
    fetchLiveUpdates();
    supabase
      .from("university_overrides")
      .select("*")
      .then(({ data }) => {
        const map: Record<string, any> = {};
        (data || []).forEach((o: any) => {
          map[o.university_id] = o.data || {};
        });
        setOverrides(map);
      });
    const channel = supabase
      .channel("page_live_sync_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "university_updates" },
        () => fetchLiveUpdates(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLiveUpdates]);

  useEffect(() => {
    const recompute = () =>
      setNewsUnread(unreadUpdates(newsUid, liveUpdates).length);
    recompute();
    window.addEventListener("news-seen-changed", recompute);
    return () => window.removeEventListener("news-seen-changed", recompute);
  }, [liveUpdates, newsUid]);

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

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterOption>("all");
  const [eligibilityResults, setEligibilityResults] = useState<Record<
    string,
    EligibilityEvaluation
  > | null>(null);
  const [onlyShowEligible, setOnlyShowEligible] = useState<boolean>(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  const rawUniversities = sheetData?.universities || [];
  useEffect(() => {
    if (isUniModal && route.uniId) {
      const found = rawUniversities.find((u) => u.id === route.uniId);
      if (found && selectedUniversity?.id !== found.id)
        setSelectedUniversity(found);
    }
    if (!isUniModal && selectedUniversity) setSelectedUniversity(null);
  }, [isUniModal, route.uniId, rawUniversities.length]);

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

  const toggleDarkMode = useCallback(() => setIsDarkMode((p) => !p), []);
  const handleFontChange = useCallback((font: FontKey) => {
    setFontPreference(font);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, font);
    } catch {}
  }, []);

  const loadData = useCallback(
    async (urlOrId?: string) => {
      setIsLoading(true);
      try {
        setSheetData(await fetchAdmissionData(urlOrId || customSheetUrl));
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

  const universities = useMemo(() => {
    if (!rawUniversities.length) return [];
    const normalize = (str: string) =>
      str
        .replace(/[\(\)（）\-\_\,\.]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();
    return rawUniversities.map((uni) => {
      let merged: any = uni;
      if (liveUpdates.length) {
        const normUniName = normalize(uni.name);
        const normShort = normalize(uni.shortName || "");
        const normEnglish = normalize(uni.englishName || "");
        const match =
          liveUpdates.find(
            (u) => u.university_id && u.university_id === uni.id,
          ) ||
          liveUpdates.find((u) => {
            if (!u.university_name) return false;
            const normDb = normalize(u.university_name);
            return (
              normUniName.includes(normDb) ||
              normDb.includes(normUniName) ||
              (normShort &&
                (normDb.includes(normShort) || normShort.includes(normDb))) ||
              (normEnglish && normDb.includes(normEnglish))
            );
          });
        if (match) {
          const d = match.extracted_data || {};
          const hasConcrete = Boolean(
            d.exam_date ||
            d.application_start ||
            d.application_deadline ||
            d.fee_amount,
          );
          const startDate = d.application_start || uni.startDate;
          const endDate = d.application_deadline || uni.endDate;
          let examUnits = (uni.examUnits || []).map((u: any) => ({ ...u }));
          if (Array.isArray(d.units) && d.units.length) {
            d.units.forEach((nu: any) => {
              if (!nu || !nu.name) return;
              const nn = normalize(String(nu.name));
              const target = examUnits.find(
                (eu: any) =>
                  normalize(eu.unit).includes(nn) ||
                  nn.includes(normalize(eu.unit)),
              );
              if (target) {
                if (nu.date) target.examDate = nu.date;
                if (nu.fee) target.fee = nu.fee;
              }
            });
          }
          if (d.exam_date && (!Array.isArray(d.units) || !d.units.length)) {
            if (examUnits.length)
              examUnits = examUnits.map((u: any, i: number) =>
                i === 0 ? { ...u, examDate: d.exam_date } : u,
              );
            else
              examUnits = [
                {
                  unit: "ভর্তি পরীক্ষা",
                  title: match.title || "সর্বশেষ আপডেট",
                  examDate: d.exam_date,
                  fee: d.fee_amount || "",
                },
              ];
          }
          if (d.fee_amount && examUnits.length)
            examUnits = examUnits.map((u: any) => ({
              ...u,
              fee: u.fee || d.fee_amount,
            }));
          merged = {
            ...uni,
            startDate,
            endDate,
            examUnits,
            circularStatus: hasConcrete
              ? ("confirmed" as const)
              : uni.circularStatus,
            latestBreakingUpdate: match,
            ...(d.admit_card_date ? { admitCardDate: d.admit_card_date } : {}),
          };
        }
      }
      const ov = overrides[uni.id];
      return ov
        ? { ...merged, ...ov, examUnits: ov.examUnits || merged.examUnits }
        : merged;
    });
  }, [rawUniversities, liveUpdates, overrides]);

  const currentSelectedUniversity = useMemo(() => {
    if (!selectedUniversity) return null;
    return (
      universities.find((u: any) => u.id === selectedUniversity.id) ||
      selectedUniversity
    );
  }, [selectedUniversity, universities]);

  const metrics = useMemo(() => {
    const secondTimerCount = universities.filter(
      (u: any) => u.secondTimerAllowed,
    ).length;
    let ongoingCount = 0,
      upcomingCount = 0;
    universities.forEach((u: any) => {
      const status = calculateUrgency(u.startDate, u.endDate).status;
      if (status === "ongoing") ongoingCount++;
      else if (status === "upcoming") upcomingCount++;
    });
    return { secondTimerCount, ongoingCount, upcomingCount };
  }, [universities]);

  const filteredUniversities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return universities.filter((uni: any) => {
      if (isSecondTimer && !uni.secondTimerAllowed) return false;
      if (query) {
        const matchesName =
          uni.name.toLowerCase().includes(query) ||
          uni.shortName.toLowerCase().includes(query) ||
          uni.englishName.toLowerCase().includes(query) ||
          uni.location.toLowerCase().includes(query);
        const matchesUnits = uni.examUnits?.some(
          (u: any) =>
            u.unit.toLowerCase().includes(query) ||
            u.title.toLowerCase().includes(query),
        );
        if (!matchesName && !matchesUnits) return false;
      }
      if (
        timeFilter !== "all" &&
        calculateUrgency(uni.startDate, uni.endDate).status !== timeFilter
      )
        return false;
      if (categoryFilter !== "all" && uni.category !== categoryFilter)
        return false;
      if (onlyShowEligible && eligibilityResults) {
        const r = eligibilityResults[uni.id];
        if (!r || !r.isEligible) return false;
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

  const handleOpenModal = useCallback(
    (uni: University) => go("/uni/" + uni.id),
    [go],
  );
  const handleSelectFromSearch = useCallback((uni: University) => {
    window.history.replaceState(null, "", "#/uni/" + uni.id);
    setRoute(readRoute());
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

  if (showAdmin) return <Admin onExit={goBack} />;

  return (
    <div
      className={`min-h-screen ${fontClass} transition-colors duration-300 ${isDarkMode ? "dark text-slate-100" : "text-slate-900"}`}
    >
      <AppUpdateBanner />
      <Header
        universities={universities}
        onSelectUniversity={handleSelectFromSearch}
        totalCount={universities.length}
        secondTimerCount={metrics.secondTimerCount}
        ongoingCount={metrics.ongoingCount}
        currentFont={fontPreference}
        onFontChange={handleFontChange}
        activeTab={activeTab}
        onSelectTab={(t) => go("/" + t)}
        isSearchOpen={isSearchOpen}
        onSearchOpenChange={(open) => (open ? go("/search") : goBack())}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenSettings={() => go("/settings")}
        onOpenNews={() => go("/news")}
        newsCount={newsUnread}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 sm:pb-16">
        <AnimatePresence mode="wait">
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
                onNavigateToEligibility={() => go("/eligibility")}
                onNavigateToCalendar={() => go("/calendar")}
              />
              <AttemptToggle
                isSecondTimer={isSecondTimer}
                onToggle={setIsSecondTimer}
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
                    {filteredUniversities.map((uni: any, idx: number) => (
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
      <SettingsPanel
        open={isSettingsOpen}
        onClose={goBack}
        onOpenAdmin={() => {
          window.history.replaceState(null, "", "#/admin");
          setRoute(readRoute());
        }}
      />
      <UniversityModal
        university={currentSelectedUniversity}
        isOpen={isUniModal}
        onClose={goBack}
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
        onSelectTab={(t) => go("/" + t)}
        onOpenSearch={() => go("/search")}
        onOpenSettings={() => go("/settings")}
      />
      <NewsPanel open={isNewsOpen} onClose={goBack} />
      <UpdateNotifier />
      <FeedbackPopup />
    </div>
  );
}

/* ============================================================
   PREMIUM AURORA HERO BANNER
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
    className="relative overflow-hidden rounded-3xl text-white shadow-2xl shadow-sky-900/20"
  >
    {/* Aurora background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0c0a1f]" />
    <motion.div
      className="absolute inset-0 opacity-40"
      animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.4) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(236,72,153,0.3) 0%, transparent 50%)",
        backgroundSize: "200% 200%",
      }}
    />
    <motion.div
      className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-500/30 blur-3xl pointer-events-none"
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none"
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
    />

    <div className="relative z-10 p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sky-200 text-[11px] font-bold mb-4 border border-white/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3 h-3" />
            </motion.div>
            <span>ভর্তি সেশন ২০২৬–২৭ • লাইভ আপডেট</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-sky-100 to-violet-200 bg-clip-text text-transparent"
          >
            বিশ্ববিদ্যালয় ভর্তি পোর্টাল
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed"
          >
            সকল পাবলিক, প্রকৌশল, মেডিকেল ও গুচ্ছভুক্ত বিশ্ববিদ্যালয়ের ভর্তি
            পরীক্ষার সময়সূচি, জিপিএ শর্ত ও ২য় বার সুযোগ।
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center gap-3 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onNavigateToEligibility}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white text-xs font-black shadow-xl shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>যোগ্যতা যাচাই করুন</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onNavigateToCalendar}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-sky-300" />
              <span>ক্যালেন্ডার দেখুন</span>
            </motion.button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 lg:w-[400px]"
        >
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
        </motion.div>
      </div>
      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.06] pointer-events-none hidden lg:flex items-center justify-end pr-10">
        <GraduationCap className="w-72 h-72 text-sky-300" />
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
    sky: "from-sky-500/30 to-cyan-500/15 border-sky-400/40 text-sky-100",
    emerald:
      "from-emerald-500/30 to-teal-500/15 border-emerald-400/40 text-emerald-100",
    amber:
      "from-amber-500/30 to-orange-500/15 border-amber-400/40 text-amber-100",
    indigo:
      "from-indigo-500/30 to-purple-500/15 border-indigo-400/40 text-indigo-100",
  };
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className={`relative p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl overflow-hidden group`}
    >
      {pulse && (
        <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
        </span>
      )}
      <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-bold uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1.5 text-2xl sm:text-3xl font-black text-white font-number tabular-nums drop-shadow-lg">
        {value}
      </div>
    </motion.div>
  );
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="py-20 text-center surface-card p-10 rounded-3xl bg-white/50 dark:bg-[#1e2530]/50 backdrop-blur-sm border border-slate-200/50 dark:border-white/5"
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#232b3a] dark:to-[#1e2530] flex items-center justify-center shadow-lg"
    >
      <SearchX className="w-10 h-10 text-slate-400" />
    </motion.div>
    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
      কোনো বিশ্ববিদ্যালয়ের তথ্য পাওয়া যায়নি
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 mb-6">
      আপনার ফিল্টার বা অনুসন্ধান শব্দের পরিবর্তন করে আবার চেষ্টা করুন।
    </p>
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onReset}
      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white text-xs font-black shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
    >
      সকল ফিল্টার রিসেট করুন
    </motion.button>
  </motion.div>
);
