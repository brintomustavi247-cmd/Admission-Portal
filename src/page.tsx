/**
 * Bangladesh University Admission 2026-27 - Main Dashboard
 * v4: LINT-CLEAN (react-hooks/refs, set-state-in-effect, purity, exhaustive-deps)
 */
import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useMemo,
  useCallback,
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
  Zap,
} from "lucide-react";

type TabKey = "home" | "eligibility" | "calendar";
type FontKey = "noto" | "anek" | "hind";
type RouteView = TabKey | "admin";
type RouteOverlay = "news" | "settings" | "search" | "uni" | null;

const FONT_STORAGE_KEY = "admission_font_pref";
const THEME_STORAGE_KEY = "varsity_theme";
const THEME_RESET_KEY = "theme_reset_v2";

const Admin = lazy(() =>
  import("./pages/Admin").then((m) => ({ default: m.Admin })),
);

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

const initialTab = (): TabKey => {
  const v = readRoute().view;
  return v === "keep" || v === "admin" ? "home" : (v as TabKey);
};

export default function AdmissionDashboard() {
  const { profile } = useAuth();
  const newsUid = profile?.id || "guest";

  /* ---------- ROUTER STATE (no refs — state only) ---------- */
  const [route, setRoute] = useState(readRoute);
  const [lastTab, setLastTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, "", "#/home");
    const onHash = () => {
      const r = readRoute();
      setRoute(r);
      /* event handler-এ setState = allowed (sync effect-body না) */
      if (r.view !== "keep" && r.view !== "admin") setLastTab(r.view as TabKey);
    };
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
    else go("/" + lastTab);
  }, [go, lastTab]);

  const activeTab: TabKey =
    route.view === "keep" || route.view === "admin" ? lastTab : route.view;
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

  /* stable reference — exhaustive-deps warning fix */
  const rawUniversities = useMemo(
    () => sheetData?.universities ?? [],
    [sheetData],
  );

  const loadData = useCallback(
    (urlOrId?: string) => {
      /* event-handler context — sync setState এখানে OK */
      setIsLoading(true);
      fetchAdmissionData(urlOrId || customSheetUrl)
        .then((d) => {
          setSheetData(d);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load admission data:", err);
          setIsLoading(false);
        });
    },
    [customSheetUrl],
  );

  useEffect(() => {
    let alive = true;
    /* mount: initial isLoading=true already — এখানে sync setState নেই */
    fetchAdmissionData(customSheetUrl)
      .then((d) => {
        if (!alive) return;
        setSheetData(d);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admission data:", err);
        if (alive) setIsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [customSheetUrl]);

  /* ---------- 2. Live Updates + Overrides (all setState inside .then) ---------- */
  const [liveUpdates, setLiveUpdates] = useState<any[]>([]);
  const [overrides, setOverrides] = useState<Record<string, any>>({});

  useEffect(() => {
    let alive = true;
    const refetch = () => {
      supabase
        .from("university_updates")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .then(({ data, error }) => {
          if (alive && !error && data) setLiveUpdates(data);
        });
    };
    refetch();
    supabase
      .from("university_overrides")
      .select("*")
      .then(({ data }) => {
        if (!alive) return;
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
        () => refetch(),
      )
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, []);

  /* unread badge — derived, no sync setState in effect */
  const [seenTick, setSeenTick] = useState(0);
  useEffect(() => {
    const h = () => setSeenTick((t) => t + 1);
    window.addEventListener("news-seen-changed", h);
    return () => window.removeEventListener("news-seen-changed", h);
  }, []);
  const newsUnread = useMemo(
    () => unreadUpdates(newsUid, liveUpdates).length,
    [newsUid, liveUpdates, seenTick],
  );

  /* ---------- Preferences ---------- */
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
      if (saved === "dark") return !!localStorage.getItem(THEME_RESET_KEY);
      if (saved === "light") return false;
    } catch {}
    return false;
  });

  /* ---------- Filters / Eligibility ---------- */
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterOption>("all");
  const [eligibilityResults, setEligibilityResults] = useState<Record<
    string,
    EligibilityEvaluation
  > | null>(null);
  const [onlyShowEligible, setOnlyShowEligible] = useState<boolean>(false);

  /* ---------- Theme effects (localStorage write = OK, setState নেই) ---------- */
  useEffect(() => {
    try {
      if (!localStorage.getItem(THEME_RESET_KEY)) {
        localStorage.removeItem(THEME_STORAGE_KEY);
        localStorage.setItem(THEME_RESET_KEY, "1");
      }
    } catch {}
  }, []);

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

  /* ---------- POWER-MATCHER v2 + OVERRIDES ---------- */
  const universities = useMemo(() => {
    if (!rawUniversities.length) return [];
    const normalize = (str: string) =>
      str
        .replace(/[()（）_.,-]/g, "")
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

  /* ---------- Modal selection: DERIVED (no state, no sync effect) ---------- */
  const currentSelectedUniversity = useMemo(() => {
    if (!isUniModal || !route.uniId) return null;
    return universities.find((u: any) => u.id === route.uniId) || null;
  }, [isUniModal, route.uniId, universities]);

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
    return (
      <Suspense
        fallback={
          <div className="min-h-screen animate-pulse bg-slate-100 dark:bg-[#0d1017]" />
        }
      >
        <Admin onExit={goBack} />
      </Suspense>
    );
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
                liveHeadline={liveUpdates[0]?.title || ""}
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
   HERO v3 — BENTO GRID (mobile-light, zero blur filters)
   ============================================================ */
const HeroMetricsBanner: React.FC<{
  totalCount: number;
  secondTimerCount: number;
  ongoingCount: number;
  upcomingCount: number;
  onNavigateToEligibility: () => void;
  onNavigateToCalendar: () => void;
  liveHeadline?: string;
}> = ({
  totalCount,
  secondTimerCount,
  ongoingCount,
  upcomingCount,
  onNavigateToEligibility,
  onNavigateToCalendar,
  liveHeadline,
}) => (
  <section
    aria-label="Dashboard Overview"
    className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-4"
  >
    <div className="col-span-2 lg:row-span-2 relative overflow-hidden rounded-3xl p-5 sm:p-7 text-white bg-[#0b1220] border border-white/10 shadow-xl shadow-sky-950/20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(420px 240px at 88% -12%, rgba(56,189,248,0.28), transparent 62%), radial-gradient(380px 220px at -8% 112%, rgba(139,92,246,0.25), transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <GraduationCap className="absolute -right-6 -bottom-8 w-40 h-40 text-white/[0.05] pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 text-sky-200 text-[10px] font-black border border-white/15 tracking-wide uppercase">
            Admission 2026–27
          </span>
          {liveHeadline && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-black border border-emerald-400/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              LIVE
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight leading-tight">
          বিশ্ববিদ্যালয় ভর্তি পোর্টাল
        </h1>
        <p className="text-slate-300/90 text-sm mt-2 leading-relaxed max-w-md">
          সকল পাবলিক, প্রকৌশল, মেডিকেল ও গুচ্ছভুক্ত বিশ্ববিদ্যালয়ের ভর্তি
          পরীক্ষার সময়সূচি, জিপিএ শর্ত ও ২য় বার সুযোগ।
        </p>
        <div className="mt-5 flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onNavigateToEligibility}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-sky-100 active:scale-95 text-xs font-black shadow-lg shadow-black/20 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>যোগ্যতা যাচাই করুন</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToCalendar}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4 text-sky-300" />
            <span>ক্যালেন্ডার দেখুন</span>
          </button>
        </div>
        {liveHeadline && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-[11px] text-slate-200 font-semibold truncate">
              {liveHeadline}
            </span>
          </div>
        )}
      </div>
    </div>
    <BentoStat
      icon={<BookOpen className="w-4 h-4" />}
      label="মোট প্রতিষ্ঠান"
      value={toBanglaNum(totalCount)}
      iconBox="bg-sky-500/15 text-sky-500 dark:text-sky-400"
      topLine="from-sky-400/70"
    />
    <BentoStat
      icon={<TrendingUp className="w-4 h-4" />}
      label="২য় বার সুযোগ"
      value={toBanglaNum(secondTimerCount)}
      iconBox="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      topLine="from-emerald-400/70"
    />
    <BentoStat
      icon={<Clock className="w-4 h-4" />}
      label="চলমান আবেদন"
      value={toBanglaNum(ongoingCount)}
      iconBox="bg-amber-500/15 text-amber-600 dark:text-amber-400"
      topLine="from-amber-400/70"
      pulse={ongoingCount > 0}
    />
    <BentoStat
      icon={<CalendarIcon className="w-4 h-4" />}
      label="আসন্ন পরীক্ষা"
      value={toBanglaNum(upcomingCount)}
      iconBox="bg-violet-500/15 text-violet-600 dark:text-violet-400"
      topLine="from-violet-400/70"
    />
  </section>
);

const BentoStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBox: string;
  topLine: string;
  pulse?: boolean;
}> = ({ icon, label, value, iconBox, topLine, pulse }) => (
  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#101828] border border-slate-200/90 dark:border-white/10 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
    <div
      className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${topLine} to-transparent`}
    />
    <div className="flex items-start justify-between gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={`relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBox}`}
      >
        {icon}
        {pulse && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        )}
      </span>
    </div>
    <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-number tabular-nums leading-none">
      {value}
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
