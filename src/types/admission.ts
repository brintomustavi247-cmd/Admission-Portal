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
