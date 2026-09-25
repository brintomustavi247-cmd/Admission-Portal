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
  category: 'general' | 'engineering' | 'medical' | 'agricultural' | 'cluster' | 'specialized';
  categoryLabel: string;
  location: string;
  applicationLink: string;
  applicationProcess: string;
  startDate: string;
  endDate: string;
  admitCardDate: string;
  examUnits: ExamUnit[];
  secondTimerAllowed: boolean;
  secondTimerDeduction?: string; // e.g. "৫ নম্বর কর্তন"
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
  circularStatus?: 'confirmed' | 'reported' | 'awaiting_circular';
  statusNote?: string;
  eligibleHscBatches?: string;
}

export interface UserEligibilityProfile {
  hscGpa: number;
  sscGpa: number;
  group: 'science' | 'commerce' | 'humanities';
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
  matchScore: number; // 0 to 100
  reasons: string[];
  missingCriteria: string[];
}

export type TimeFilterOption = 'all' | 'ongoing' | 'upcoming' | 'ended';
export type CategoryFilterOption = 'all' | 'general' | 'engineering' | 'medical' | 'agricultural' | 'cluster';
// Existing code thakbe, shudhu niche ei part-ta add koro:

export interface UniversityUpdate {
  id: string;
  university_id: string | null;
  university_name: string;
  update_type: 'admission_circular' | 'routine_change' | 'result' | 'fee' | 'admit_card';
  title: string;
  raw_content?: string | null;
  extracted_data: {
    exam_date?: string;
    application_start?: string;
    application_end?: string;
    fees?: string;
    units?: { unit: string; date?: string; fee?: string }[];
    min_gpa?: { ssc?: number; hsc?: number; combined?: number };
    highlights?: string[];
  };
  source_urls?: string[];
  status: 'pending' | 'published' | 'rejected';
  severity: 'normal' | 'important' | 'urgent';
  approved_at?: string | null;
  published_at?: string | null;
  created_at: string;
}