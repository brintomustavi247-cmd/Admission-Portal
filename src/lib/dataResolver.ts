import {
  University,
  ResolvedVenueInfo,
  ResolvedCalculatorInfo,
  ResolvedSessionInfo,
  DataSource,
} from "../types/admission";
import { VENUE_POLICY_2026_27, VenuePolicy } from "../data/venuePolicy2026";

/**
 * HYBRID DATA RESOLVER — v13.3
 * Fallback chain: live scrape → static config (mockUniversities) → KB policy map (venuePolicy2026)
 * FIX: resolveVenuePolicy export added; regions/calculator/session এ policy map fallback যোগ।
 */

export interface BreakingUpdateData {
  title?: string;
  extracted_data?: {
    exam_date?: string;
    application_start?: string;
    application_end?: string;
    fees?: string;
    fee_amount?: string;
    exam_regions?: string[];
    calculator_allowed?: boolean | null;
    _session_year?: string;
    _is_expired?: boolean;
    units?: Array<{ name: string; date?: string; fee?: string }>;
  };
  source_urls?: string[];
}

/* ===== Static data expired কিনা: সব exam date অতীতে হলে expired ===== */
function staticExpired(university: University): boolean {
  const dates: string[] = [];
  if (university.endDate) dates.push(university.endDate);
  (university.examUnits || []).forEach((u) => {
    if (u.examDate) dates.push(u.examDate);
  });
  if (dates.length === 0) return false;
  const now = Date.now();
  return dates.every((d) => {
    const t = new Date(d).getTime();
    return !Number.isNaN(t) && t < now;
  });
}

/* ===== NEW: KB policy map access ===== */
export function resolveVenuePolicy(
  university: University,
): VenuePolicy | undefined {
  return VENUE_POLICY_2026_27[university.id];
}

export function resolveRegions(
  university: University,
  breaking?: BreakingUpdateData | null,
): ResolvedVenueInfo {
  const liveRegions = breaking?.extracted_data?.exam_regions || [];
  if (liveRegions.length > 0) {
    return { regions: liveRegions, source: "live_scrape" };
  }
  const staticRegions = university.examRegions || [];
  if (staticRegions.length > 0) {
    return { regions: staticRegions, source: "static_fallback" };
  }
  const policy = resolveVenuePolicy(university);
  if (policy && policy.regions.length > 0) {
    return { regions: policy.regions, source: "static_fallback" };
  }
  return { regions: [], source: "unknown" };
}

export function resolveCalculator(
  university: University,
  breaking?: BreakingUpdateData | null,
): ResolvedCalculatorInfo {
  // 1) Live scrape
  const live = breaking?.extracted_data?.calculator_allowed;
  if (live === true) return { allowed: true, source: "live_scrape" };
  if (live === false) return { allowed: false, source: "live_scrape" };

  // 2) Static config (mockUniversities)
  const stat = university.calculatorPolicy;
  if (stat === true) return { allowed: true, source: "static_fallback" };
  if (stat === false) return { allowed: false, source: "static_fallback" };
  if (stat === "conditional") {
    return {
      allowed: "conditional",
      source: "static_fallback",
      unitBreakdown: resolveVenuePolicy(university)?.calculatorUnitBreakdown,
    };
  }

  // 3) KB policy map
  const policy = resolveVenuePolicy(university);
  if (policy) {
    if (policy.calculator === true) {
      return { allowed: true, source: "static_fallback" };
    }
    if (policy.calculator === false) {
      return { allowed: false, source: "static_fallback" };
    }
    if (policy.calculator === "conditional") {
      return {
        allowed: "conditional",
        source: "static_fallback",
        unitBreakdown: policy.calculatorUnitBreakdown,
      };
    }
  }

  return { allowed: null, source: "unknown" };
}

export function resolveSession(
  university: University,
  breaking?: BreakingUpdateData | null,
): ResolvedSessionInfo {
  const liveYear = breaking?.extracted_data?._session_year;
  const liveExpired = breaking?.extracted_data?._is_expired === true;
  if (liveYear) {
    return { year: liveYear, isExpired: liveExpired, source: "live_scrape" };
  }
  if (university.sessionYear) {
    return {
      year: university.sessionYear,
      isExpired: staticExpired(university),
      source: "static_fallback",
    };
  }
  const policy = resolveVenuePolicy(university);
  if (policy) {
    return { year: "2026-27", isExpired: false, source: "static_fallback" };
  }
  return { year: "", isExpired: false, source: "unknown" };
}

export function sourceLabel(source: DataSource): string {
  if (source === "live_scrape") return "🔴 লাইভ";
  if (source === "static_fallback") return "🔵 যাচাইকৃত";
  return "";
}

export function sourceColor(source: DataSource): string {
  if (source === "live_scrape")
    return "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
  if (source === "static_fallback")
    return "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800";
  return "text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600";
}
