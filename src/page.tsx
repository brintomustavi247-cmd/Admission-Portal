/**
 * Bangladesh University Admission 2026-27 - Main Dashboard
 * v3: HASH ROUTER — phone back button = tab/panel navigation
 *     #/home #/eligibility #/calendar #/admin #/news #/settings #/search #/uni/<id>
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

/* ---------- hash parse ---------- */
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

  /* ---------- ROUTER STATE ---------- */
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

  /* ---------- 1. Data Source ---------- */
  const [sheetData, setSheetData] = useState<SheetFetchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customSheetUrl, setCustomSheetUrl] =
    useState<string>(DEFAULT_SHEET_ID);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  /* ---------- 2. Live Updates + Overrides ---------- */
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

  /* ---------- 7. Selected university (modal) ---------- */
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  /* sync modal selection with #/uni/<id> */
  const rawUniversities = sheetData?.universities || [];
  useEffect(() => {
    if (isUniModal && route.uniId) {
      const found = rawUniversities.find((u) => u.id === route.uniId);
      if (found && selectedUniversity?.id !== found.id)
        setSelectedUniversity(found);
    }
    if (!isUniModal && selectedUniversity) setSelectedUniversity(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUniModal, route.uniId, rawUniversities.length]);

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

  const toggleDarkMode = useCallback(() => setIsDarkMode((p) => !p), []);
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

  /* ---------- POWER-MATCHER v2 + OVERRIDES ---------- */
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
            if (examUnits.length) {
              examUnits = examUnits.map((u: any, i: number) =>
                i === 0 ? { ...u, examDate: d.exam_date } : u,
              );
            } else {
              examUnits = [
                {
                  unit: "ভর্তি পরীক্ষা",
                  title: match.title || "সর্বশেষ আপডেট",
                  examDate: d.exam_date,
                  fee: d.fee_amount || "",
                },
              ];
            }
          }
          if (d.fee_amount && examUnits.length) {
            examUnits = examUnits.map((u: any) => ({
              ...u,
              fee: u.fee || d.fee_amount,
            }));
          }
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

  /* ---------- Metrics ---------- */
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

  /* ---------- Filtering ---------- */
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

  /* ---------- Handlers ---------- */
  const handleOpenModal = useCallback(
    (uni: University) => go("/uni/" + uni.id),
    [go],
  );
  /* Search থেকে select করলে /search entry-টা replace করি —
      যাতে back চাপলে search আবার না খোলে, সরাসরি আগের page-এ যায় */
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

  /* ---------- ADMIN VIEW ---------- */
  if (showAdmin) {
    return <Admin onExit={goBack} />;
  }

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 sm:pb-16">
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
   SUB-COMPONENTS (অপরিবর্তিত)
   ============================================================ */
/* ============================================================
   HERO BANNER v2 — "Scoreboard" style
   ✅ No blur-3xl, no backdrop-blur, no heavy shadows
   ✅ Single thin gradient strip + flat divider stats
   ✅ 60fps on low-end phones
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
    className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101828] text-slate-900 dark:text-white shadow-sm"
  >
    {/* Thin accent strip (cheap linear-gradient, no blur) */}
    <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500" />

    {/* Subtle corner watermark (opacity only, no blur) */}
    <GraduationCap className="absolute -right-8 -bottom-10 w-48 h-48 text-slate-900/[0.04] dark:text-white/[0.04] pointer-events-none hidden sm:block" />

    <div className="relative p-5 sm:p-7">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        {/* Left: identity + CTA */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-black border border-sky-200 dark:border-sky-800">
              <Sparkles className="w-3 h-3" />
              ভর্তি সেশন ২০২৬–২৭
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              লাইভ আপডেট চালু
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            বিশ্ববিদ্যালয় ভর্তি পোর্টাল
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed max-w-lg">
            সকল পাবলিক, প্রকৌশল, মেডিকেল ও গুচ্ছভুক্ত বিশ্ববিদ্যালয়ের ভর্তি
            পরীক্ষার সময়সূচি, জিপিএ শর্ত ও ২য় বার সুযোগ।
          </p>

          <div className="mt-4 flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onNavigateToEligibility}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>যোগ্যতা যাচাই করুন</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToCalendar}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>ক্যালেন্ডার দেখুন</span>
            </button>
          </div>
        </div>

        {/* Right: flat scoreboard (divider-based, zero blur) */}
        <div className="grid grid-cols-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d1424] divide-x divide-slate-200 dark:divide-white/10 overflow-hidden w-full lg:w-auto lg:min-w-[420px]">
          <StatCell
            icon={<BookOpen className="w-3.5 h-3.5" />}
            value={toBanglaNum(totalCount)}
            label="প্রতিষ্ঠান"
            accent="text-sky-600 dark:text-sky-400"
          />
          <StatCell
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            value={toBanglaNum(secondTimerCount)}
            label="২য় বার"
            accent="text-emerald-600 dark:text-emerald-400"
          />
          <StatCell
            icon={<Clock className="w-3.5 h-3.5" />}
            value={toBanglaNum(ongoingCount)}
            label="চলমান"
            accent="text-amber-600 dark:text-amber-400"
            pulse={ongoingCount > 0}
          />
          <StatCell
            icon={<CalendarIcon className="w-3.5 h-3.5" />}
            value={toBanglaNum(upcomingCount)}
            label="আসন্ন"
            accent="text-violet-600 dark:text-violet-400"
          />
        </div>
      </div>
    </div>
  </section>
);

/* Flat stat cell — no gradients, no blur, no shadows */
const StatCell: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
  pulse?: boolean;
}> = ({ icon, value, label, accent, pulse }) => (
  <div className="px-1.5 py-3 sm:px-4 sm:py-4 text-center">
    <div className={`inline-flex items-center gap-1 ${accent}`}>
      {icon}
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
    </div>
    <div className="mt-1 text-xl sm:text-2xl font-black tabular-nums font-number text-slate-900 dark:text-white leading-none">
      {value}
    </div>
    <div className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
      {label}
    </div>
  </div>
);

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
