export interface ExamUnit {
  unit: string;
  title: string;
  examDate: string;
  time?: string;
  fee?: string;
  eligibilityNotes?: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  englishName: string;
  category:
    | "general"
    | "engineering"
    | "medical"
    | "agricultural"
    | "cluster"
    | "specialized";
  categoryLabel: string;
  location: string;
  applicationLink: string;
  applicationProcess: string;
  startDate: string;
  endDate: string;
  admitCardDate: string;
  examUnits: ExamUnit[];
  secondTimerAllowed: boolean;
  secondTimerDeduction?: string;
  minGpa: {
    ssc: number;
    hsc: number;
    combined: number;
    scienceOnly?: boolean;
    subjectMin?: {
      physics?: number;
      chemistry?: number;
      math?: number;
      biology?: number;
      english?: number;
    };
  };
  requiredSubjects: string[];
  totalSeats?: number;
  featured?: boolean;
  logoBg?: string;
  logoLetter?: string;
  circularStatus?: "confirmed" | "reported" | "awaiting_circular";
  statusNote?: string;
  eligibleHscBatches?: string;

  /* ===== NEW v13.2: Static venue/calculator/session fallbacks ===== */
  examRegions?: string[]; // Verified exam center cities/divisions
  calculatorPolicy?: boolean | null; // true=allowed, false=banned, null=unknown
  sessionYear?: string; // e.g. "2026-27"
  examMode?: "offline" | "online" | "hybrid" | "unknown";
  admitCardMethod?: string; // e.g. "অনলাইনে ডাউনলোড"
}

export interface UserEligibilityProfile {
  hscGpa: number;
  sscGpa: number;
  group: "science" | "commerce" | "humanities";
  isSecondTimer: boolean;
  subjectGrades: {
    physics: number;
    chemistry: number;
    math: number;
    biology: number;
    english: number;
  };
}

export interface EligibilityEvaluation {
  universityId: string;
  isEligible: boolean;
  matchScore: number;
  reasons: string[];
  missingCriteria: string[];
}

export type TimeFilterOption = "all" | "ongoing" | "upcoming" | "ended";
export type CategoryFilterOption =
  | "all"
  | "general"
  | "engineering"
  | "medical"
  | "agricultural"
  | "cluster";

export interface UniversityUpdate {
  id: string;
  university_id: string | null;
  university_name: string;
  update_type:
    | "admission_circular"
    | "routine_change"
    | "result"
    | "fee"
    | "admit_card";
  title: string;
  raw_content?: string | null;
  extracted_data: {
    exam_date?: string;
    application_start?: string;
    application_end?: string;
    fees?: string;
    fee_amount?: string;
    units?: { name: string; date?: string; fee?: string }[];
    min_gpa?: { ssc?: number; hsc?: number; combined?: number };
    highlights?: string[];
    exam_regions?: string[];
    calculator_allowed?: boolean | null;
    _session_year?: string;
    _is_expired?: boolean;
    _contributor?: string;
    _source?: string;
    [key: string]: any;
  };
  source_urls?: string[];
  status: "pending" | "published" | "rejected";
  severity: "normal" | "important" | "urgent";
  approved_at?: string | null;
  published_at?: string | null;
  created_at: string;
}

/* ===== NEW: Hybrid data resolver utilities ===== */
export type DataSource = "live_scrape" | "static_fallback" | "unknown";

export interface ResolvedVenueInfo {
  regions: string[];
  source: DataSource;
}

export interface ResolvedCalculatorInfo {
  allowed: boolean | null;
  source: DataSource;
}

export interface ResolvedSessionInfo {
  year: string;
  isExpired: boolean;
  source: DataSource;
}
