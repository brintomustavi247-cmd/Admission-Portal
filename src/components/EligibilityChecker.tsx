import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sliders,
  ChevronDown,
  Award,
  BookOpen,
  Check,
  Building2,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  Languages,
  BookText,
  DollarSign,
  Briefcase,
  TrendingUp,
  Landmark,
  Scale,
} from 'lucide-react';
import { University, EligibilityEvaluation } from '../types/admission';
import { toBanglaNum } from '../lib/banglaUtils';

interface EligibilityCheckerProps {
  universities: University[];
  isSecondTimer: boolean;
  onFilterEvaluations: (results: Record<string, EligibilityEvaluation> | null, onlyEligible: boolean) => void;
  activeOnlyEligible: boolean;
  forceOpen?: boolean;
  onSelectUniversity?: (uni: University) => void;
}

interface GradeOption {
  label: string;
  short: string;
  gpa: number;
}

const GRADE_OPTIONS: GradeOption[] = [
  { label: 'A+ (৫.০)', short: 'A+', gpa: 5.0 },
  { label: 'A (৪.০)', short: 'A', gpa: 4.0 },
  { label: 'A- (৩.৫)', short: 'A-', gpa: 3.5 },
  { label: 'B (৩.০)', short: 'B', gpa: 3.0 },
  { label: 'C (২.০)', short: 'C', gpa: 2.0 },
];

const getGradeLabel = (gpa: number): string => {
  if (gpa >= 5.0) return 'A+ (৫.০)';
  if (gpa >= 4.0) return 'A (৪.০)';
  if (gpa >= 3.5) return 'A- (৩.৫)';
  if (gpa >= 3.0) return 'B (৩.০)';
  if (gpa >= 2.0) return 'C (২.০)';
  return 'F (০.০)';
};

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  universities,
  isSecondTimer: initialSecondTimer,
  onFilterEvaluations,
  activeOnlyEligible,
  forceOpen,
  onSelectUniversity,
}) => {
  /* Raw string inputs (leading-zero bug fix) + derived numbers for logic */
  const [hscInput, setHscInput] = useState<string>("5.00");
  const [sscInput, setSscInput] = useState<string>("5.00");
  const hscGpa = parseFloat(hscInput) || 0;
  const sscGpa = parseFloat(sscInput) || 0;
  const [isSecondTimer, setIsSecondTimer] = useState<boolean>(initialSecondTimer);
  const [group, setGroup] = useState<'science' | 'commerce' | 'humanities'>('science');

  // Science Subjects
  const [physics, setPhysics] = useState<number>(5.0);
  const [chemistry, setChemistry] = useState<number>(5.0);
  const [math, setMath] = useState<number>(5.0);
  const [biology, setBiology] = useState<number>(4.0);

  // Commerce Subjects
  const [accounting, setAccounting] = useState<number>(5.0);
  const [businessOrg, setBusinessOrg] = useState<number>(5.0);
  const [finance, setFinance] = useState<number>(5.0);

  // Humanities Subjects
  const [economics, setEconomics] = useState<number>(5.0);
  const [civics, setCivics] = useState<number>(5.0);
  const [logic, setLogic] = useState<number>(5.0);

  // Common Subjects
  const [english, setEnglish] = useState<number>(4.0);
  const [bangla, setBangla] = useState<number>(4.0);

  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [eligibleCount, setEligibleCount] = useState<number>(0);
  const [evaluationResults, setEvaluationResults] = useState<Record<string, EligibilityEvaluation>>({});

  useEffect(() => {
    setIsSecondTimer(initialSecondTimer);
  }, [initialSecondTimer]);

  // Apply Quick-Set Grade Presets
  const applyPreset = (preset: 'all_aplus' | 'buet_fit' | 'medical_fit' | 'all_a' | 'all_a_minus') => {
    if (preset === 'all_aplus') {
      setPhysics(5.0);
      setChemistry(5.0);
      setMath(5.0);
      setBiology(5.0);
      setEnglish(5.0);
      setBangla(5.0);
      setAccounting(5.0);
      setBusinessOrg(5.0);
      setFinance(5.0);
      setEconomics(5.0);
      setCivics(5.0);
      setLogic(5.0);
    } else if (preset === 'buet_fit') {
      setGroup('science');
      setPhysics(5.0);
      setChemistry(5.0);
      setMath(5.0);
      setEnglish(4.0);
      setBiology(4.0);
      setBangla(4.0);
    } else if (preset === 'medical_fit') {
      setGroup('science');
      setBiology(5.0);
      setChemistry(4.0);
      setPhysics(4.0);
      setEnglish(4.0);
      setMath(3.5);
      setBangla(4.0);
    } else if (preset === 'all_a') {
      setPhysics(4.0);
      setChemistry(4.0);
      setMath(4.0);
      setBiology(4.0);
      setEnglish(4.0);
      setBangla(4.0);
      setAccounting(4.0);
      setBusinessOrg(4.0);
      setFinance(4.0);
      setEconomics(4.0);
      setCivics(4.0);
      setLogic(4.0);
    } else if (preset === 'all_a_minus') {
      setPhysics(3.5);
      setChemistry(3.5);
      setMath(3.5);
      setBiology(3.5);
      setEnglish(3.5);
      setBangla(3.5);
      setAccounting(3.5);
      setBusinessOrg(3.5);
      setFinance(3.5);
      setEconomics(3.5);
      setCivics(3.5);
      setLogic(3.5);
    }
  };

  // Run rigorous evaluation logic considering overall GPA AND Subject-wise Grades
  const runEvaluation = () => {
    const combinedGpa = Number((sscGpa + hscGpa).toFixed(2));
    const evaluations: Record<string, EligibilityEvaluation> = {};
    let count = 0;

    universities.forEach((uni) => {
      const reasons: string[] = [];
      const missingCriteria: string[] = [];
      let isEligible = true;

      // 1. Check 2nd timer restriction
      if (isSecondTimer && !uni.secondTimerAllowed) {
        isEligible = false;
        missingCriteria.push('২য় বার (2nd Timer) ভর্তির সুযোগ নেই');
      }

      // 2. Check Combined GPA
      if (combinedGpa < uni.minGpa.combined) {
        isEligible = false;
        missingCriteria.push(
          `সর্বমোট নূন্যতম জিপিএ ${toBanglaNum(uni.minGpa.combined)} প্রয়োজন (আপনার: ${toBanglaNum(combinedGpa)})`
        );
      } else {
        reasons.push(`সর্বমোট জিপিএ শর্ত পূরণ (${toBanglaNum(combinedGpa)})`);
      }

      // 3. Check SSC & HSC minimums
      if (sscGpa < uni.minGpa.ssc) {
        isEligible = false;
        missingCriteria.push(`এসএসসিতে নূন্যতম ${toBanglaNum(uni.minGpa.ssc)} প্রয়োজন (আপনার: ${toBanglaNum(sscGpa)})`);
      }
      if (hscGpa < uni.minGpa.hsc) {
        isEligible = false;
        missingCriteria.push(`এইচএসসিতে নূন্যতম ${toBanglaNum(uni.minGpa.hsc)} প্রয়োজন (আপনার: ${toBanglaNum(hscGpa)})`);
      }

      // 4. Group Eligibility for specialized domains
      if (group !== 'science') {
        if (
          uni.id === 'buet' ||
          uni.id === 'medical' ||
          uni.category === 'engineering' ||
          uni.category === 'medical' ||
          uni.category === 'agricultural' ||
          uni.minGpa.scienceOnly
        ) {
          isEligible = false;
          missingCriteria.push('শুধুমাত্র বিজ্ঞান বিভাগের শিক্ষার্থীরা আবেদন করতে পারবেন');
        }
      }

      // 5. Precise Subject-Wise Grade Checking based on Official Circulars:
      // A. BUET (বুয়েট): Strict A+ (5.0) in Math, Physics, Chemistry & min A (4.0) in English
      if (uni.id === 'buet') {
        if (group === 'science') {
          if (physics < 5.0) {
            isEligible = false;
            missingCriteria.push(`বুয়েটে পদার্থবিজ্ঞানে A+ (৫.০) আবশ্যক (আপনার: ${getGradeLabel(physics)})`);
          }
          if (chemistry < 5.0) {
            isEligible = false;
            missingCriteria.push(`বুয়েটে রসায়নে A+ (৫.০) আবশ্যক (আপনার: ${getGradeLabel(chemistry)})`);
          }
          if (math < 5.0) {
            isEligible = false;
            missingCriteria.push(`বুয়েটে উচ্চতর গণিতে A+ (৫.০) আবশ্যক (আপনার: ${getGradeLabel(math)})`);
          }
          if (english < 4.0) {
            isEligible = false;
            missingCriteria.push(`বুয়েটে ইংরেজিতে নূন্যতম A (৪.০) আবশ্যক (আপনার: ${getGradeLabel(english)})`);
          }
          if (isEligible) {
            reasons.push('বুয়েটের গণিত, পদার্থ ও রসায়ন A+ শর্ত পূরণ');
          }
        }
      }

      // B. Medical / BDS (মেডিকেল ও ডেন্টাল): Biology min A (4.0), Chem min A- (3.5), Phy min A- (3.5)
      if (uni.id === 'medical') {
        if (group === 'science') {
          if (biology < 4.0) {
            isEligible = false;
            missingCriteria.push(`মেডিকেলে জীববিজ্ঞানে নূন্যতম A (৪.০) আবশ্যক (আপনার: ${getGradeLabel(biology)})`);
          }
          if (chemistry < 3.5) {
            isEligible = false;
            missingCriteria.push(`মেডিকেলে রসায়নে নূন্যতম A- (৩.৫) আবশ্যক (আপনার: ${getGradeLabel(chemistry)})`);
          }
          if (physics < 3.5) {
            isEligible = false;
            missingCriteria.push(`মেডিকেলে পদার্থবিজ্ঞানে নূন্যতম A- (৩.৫) আবশ্যক (আপনার: ${getGradeLabel(physics)})`);
          }
          if (english < 3.0) {
            isEligible = false;
            missingCriteria.push(`মেডিকেলে ইংরেজিতে নূন্যতম B (৩.০) আবশ্যক (আপনার: ${getGradeLabel(english)})`);
          }
          if (isEligible) {
            reasons.push('মেডিকেলের জীববিজ্ঞান ও বিজ্ঞান বিষয় শর্ত পূরণ');
          }
        }
      }

      // C. Engineering Cluster (RUET, KUET, CUET, BUTEX, etc.)
      if (uni.category === 'engineering' && uni.id !== 'buet') {
        if (group === 'science') {
          const reqMin = uni.id === 'butex' ? 4.5 : 4.0;
          const reqLabel = uni.id === 'butex' ? 'A (৪.৫+)' : 'A (৪.০)';
          if (math < reqMin) {
            isEligible = false;
            missingCriteria.push(`উচ্চতর গণিতে নূন্যতম ${reqLabel} প্রয়োজন (আপনার: ${getGradeLabel(math)})`);
          }
          if (physics < reqMin) {
            isEligible = false;
            missingCriteria.push(`পদার্থবিজ্ঞানে নূন্যতম ${reqLabel} প্রয়োজন (আপনার: ${getGradeLabel(physics)})`);
          }
          if (chemistry < reqMin) {
            isEligible = false;
            missingCriteria.push(`রসায়নে নূন্যতম ${reqLabel} প্রয়োজন (আপনার: ${getGradeLabel(chemistry)})`);
          }
          if (english < 3.0) {
            isEligible = false;
            missingCriteria.push(`ইংরেজিতে নূন্যতম B (৩.০) প্রয়োজন (আপনার: ${getGradeLabel(english)})`);
          }
          if (isEligible) {
            reasons.push('ইঞ্জিনিয়ারিং বিষয়ভিত্তিক শর্ত পূরণ');
          }
        }
      }

      // D. Agricultural Cluster (কৃষি গুচ্ছ: BAU, BSMRAU, SAU, etc.)
      if (uni.category === 'agricultural' || uni.name.includes('কৃষি') || uni.id === 'bau') {
        if (group === 'science') {
          if (biology < 3.5) {
            isEligible = false;
            missingCriteria.push(`কৃষি গুচ্ছে জীববিজ্ঞানে নূন্যতম A- (৩.৫) আবশ্যক (আপনার: ${getGradeLabel(biology)})`);
          }
          if (chemistry < 3.5) {
            isEligible = false;
            missingCriteria.push(`কৃষি গুচ্ছে রসায়নে নূন্যতম A- (৩.৫) আবশ্যক (আপনার: ${getGradeLabel(chemistry)})`);
          }
          if (physics < 3.5) {
            isEligible = false;
            missingCriteria.push(`কৃষি গুচ্ছে পদার্থবিজ্ঞানে নূন্যতম A- (৩.৫) আবশ্যক (আপনার: ${getGradeLabel(physics)})`);
          }
          if (math < 3.0) {
            isEligible = false;
            missingCriteria.push(`কৃষি গুচ্ছে গণিতে নূন্যতম B (৩.০) আবশ্যক (আপনার: ${getGradeLabel(math)})`);
          }
          if (isEligible) {
            reasons.push('কৃষি গুচ্ছ বিষয়ভিত্তিক শর্ত পূরণ');
          }
        }
      }

      // E. Dhaka University (ঢাকা বিশ্ববিদ্যালয়)
      if (uni.id === 'du') {
        if (group === 'science') {
          if (physics < 3.5 || chemistry < 3.5) {
            isEligible = false;
            missingCriteria.push(`ঢাবি বিজ্ঞান অনুষদে পদার্থ ও রসায়নে নূন্যতম A- (৩.৫) প্রয়োজন`);
          }
        } else if (group === 'commerce') {
          if (accounting < 3.0 || businessOrg < 3.0) {
            isEligible = false;
            missingCriteria.push(`ঢাবি ব্যবসায় শিক্ষা অনুষদে হিসাববিজ্ঞান ও ব্যবসায়ে নূন্যতম B (৩.০) প্রয়োজন`);
          }
        } else if (group === 'humanities') {
          if (english < 3.0 || bangla < 3.0) {
            isEligible = false;
            missingCriteria.push(`ঢাবি কলা অনুষদে বাংলা ও ইংরেজিতে নূন্যতম B (৩.০) প্রয়োজন`);
          }
        }
      }

      // F. Generic Subject Minimums from Mock Data
      if (uni.minGpa.subjectMin) {
        if (uni.minGpa.subjectMin.physics && physics < uni.minGpa.subjectMin.physics) {
          isEligible = false;
          missingCriteria.push(`পদার্থবিজ্ঞানে নূন্যতম ${getGradeLabel(uni.minGpa.subjectMin.physics)} প্রয়োজন`);
        }
        if (uni.minGpa.subjectMin.chemistry && chemistry < uni.minGpa.subjectMin.chemistry) {
          isEligible = false;
          missingCriteria.push(`রসায়নে নূন্যতম ${getGradeLabel(uni.minGpa.subjectMin.chemistry)} প্রয়োজন`);
        }
        if (uni.minGpa.subjectMin.math && math < uni.minGpa.subjectMin.math) {
          isEligible = false;
          missingCriteria.push(`উচ্চতর গণিতে নূন্যতম ${getGradeLabel(uni.minGpa.subjectMin.math)} প্রয়োজন`);
        }
        if (uni.minGpa.subjectMin.biology && biology < uni.minGpa.subjectMin.biology) {
          isEligible = false;
          missingCriteria.push(`জীববিজ্ঞানে নূন্যতম ${getGradeLabel(uni.minGpa.subjectMin.biology)} প্রয়োজন`);
        }
        if (uni.minGpa.subjectMin.english && english < uni.minGpa.subjectMin.english) {
          isEligible = false;
          missingCriteria.push(`ইংরেজিতে নূন্যতম ${getGradeLabel(uni.minGpa.subjectMin.english)} প্রয়োজন`);
        }
      }

      // Match Score Calculation
      let matchScore = 0;
      if (isEligible) {
        const surplus = Math.max(0, combinedGpa - uni.minGpa.combined);
        matchScore = Math.min(100, Math.round(85 + surplus * 15));
        count++;
      } else if (isSecondTimer && !uni.secondTimerAllowed) {
        matchScore = 0;
      } else {
        const diff = Math.max(0, uni.minGpa.combined - combinedGpa);
        matchScore = Math.max(20, Math.round(70 - diff * 25));
      }

      evaluations[uni.id] = {
        universityId: uni.id,
        isEligible,
        matchScore,
        reasons,
        missingCriteria,
      };
    });

    setEligibleCount(count);
    setEvaluationResults(evaluations);
    setHasEvaluated(true);
    onFilterEvaluations(evaluations, true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#06b6d4', '#10b981', '#38bdf8'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleReset = () => {
    setSscInput("5.00");
    setHscInput("5.00");
    setPhysics(5.0);
    setChemistry(5.0);
    setMath(5.0);
    setBiology(4.0);
    setAccounting(5.0);
    setBusinessOrg(5.0);
    setFinance(5.0);
    setEconomics(5.0);
    setCivics(5.0);
    setLogic(5.0);
    setEnglish(4.0);
    setBangla(4.0);
    setHasEvaluated(false);
    setEvaluationResults({});
    onFilterEvaluations(null, false);
  };

  // Helper component to render each subject grade selector
  const renderSubjectGradeCard = (
    title: string,
    subLabel: string,
    icon: React.ReactNode,
    currentValue: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
    hintTag?: string
  ) => {
    return (
      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#232b3a]/80 border border-slate-200/90 dark:border-[#333d4d] flex flex-col justify-between transition-colors">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-blue-600 dark:text-blue-400 shrink-0">{icon}</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {title}
              </span>
            </div>
            {hintTag && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 whitespace-nowrap">
                {hintTag}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-2">
            {subLabel}
          </span>
        </div>

        {/* Grade Pill Buttons */}
        <div className="grid grid-cols-5 gap-1 pt-1">
          {GRADE_OPTIONS.map((opt) => {
            const isSelected = currentValue === opt.gpa;
            return (
              <button
                key={opt.short}
                type="button"
                onClick={() => setter(opt.gpa)}
                className={`py-1 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs scale-105'
                    : 'bg-white dark:bg-[#1e2530] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#333d4d] hover:bg-slate-100 dark:hover:bg-[#2a3344]'
                }`}
                title={`${title}: ${opt.label}`}
              >
                {opt.short}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div id="section-eligibility-checker" className="space-y-4 sm:space-y-6">
      {/* Header Banner - Sophisticated Deep Tone */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-white shadow-xl shadow-slate-950/20 relative overflow-hidden border border-slate-800">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/20 backdrop-blur-xs flex items-center justify-center text-sky-300 border border-sky-400/30 shadow-inner shrink-0">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                  আমার যোগ্যতা যাচাই ক্যালকুলেটর
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 backdrop-blur-xs text-sky-200 border border-sky-400/30">
                  স্মার্ট এলিজিবিলিটি ও বিষয়ভিত্তিক গ্রেড
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                আপনার এসএসসি, এইচএসসি জিপিএ এবং বিষয়ভিত্তিক গ্রেড প্রদান করুন; বুয়েট, মেডিকেল ও গুচ্ছের বিশেষ শর্ত অনুসারে তাৎক্ষণিক ফলাফল দেখুন।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs Card */}
      <div className="bg-white dark:bg-[#1e2530] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#2a3344] shadow-2xs p-3.5 sm:p-6 space-y-4 sm:space-y-5 transition-colors">
        {/* Core Inputs Grid: HSC, SSC & Total Live Badge */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
          {/* HSC GPA */}
          <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#232b3a]/80 border border-slate-200/90 dark:border-[#333d4d]">
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <label htmlFor="input-hsc-gpa" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                HSC জিপিএ
              </label>
              <button
                type="button"
                onClick={() => setHscInput("5.00")}
                className="text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800 cursor-pointer"
              >
                ৫.০০
              </button>
            </div>
            <input
              id="input-hsc-gpa"
              type="number"
              inputMode="decimal"
              min={0}
              max={5}
              step={0.01}
              value={hscInput}
              onChange={(e) => setHscInput(e.target.value)}
              onBlur={() => {
                const n = parseFloat(hscInput);
                // Leading zero remove + clamp 0–5
                setHscInput(isNaN(n) ? "" : String(Math.min(5, Math.max(0, n))));
              }}
              className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-[#333d4d] bg-white dark:bg-[#1e2530] font-black text-slate-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* SSC GPA */}
          <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#232b3a]/80 border border-slate-200/90 dark:border-[#333d4d]">
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <label htmlFor="input-ssc-gpa" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                SSC জিপিএ
              </label>
              <button
                type="button"
                onClick={() => setSscInput("5.00")}
                className="text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800 cursor-pointer"
              >
                ৫.০০
              </button>
            </div>
            <input
              id="input-ssc-gpa"
              type="number"
              inputMode="decimal"
              min={0}
              max={5}
              step={0.01}
              value={sscInput}
              onChange={(e) => setSscInput(e.target.value)}
              onBlur={() => {
                const n = parseFloat(sscInput);
                // Leading zero remove + clamp 0–5
                setSscInput(isNaN(n) ? "" : String(Math.min(5, Math.max(0, n))));
              }}
              className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-300 dark:border-[#333d4d] bg-white dark:bg-[#1e2530] font-black text-slate-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* Total Combined Live Badge */}
          <div className="col-span-2 md:col-span-1 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800 border border-sky-200 dark:border-[#333d4d] flex items-center justify-between md:flex-col md:items-start md:justify-between">
            <span className="text-xs font-bold text-sky-900 dark:text-sky-300">
              সর্বমোট জিপিএ (SSC+HSC)
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-400 font-number">
              {toBanglaNum((sscGpa + hscGpa).toFixed(2))}
              <span className="text-xs font-normal text-blue-600 dark:text-blue-400 ml-1">/ ১০.০০</span>
            </div>
          </div>
        </div>

        {/* Group Selection & 2nd Timer Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
          {/* Study Group Pills */}
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#232b3a]/80 border border-slate-200/90 dark:border-[#333d4d]">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1.5 sm:mb-2">
              বিভাগ / শাখা পছন্দ:
            </label>
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
              {[
                { id: 'science', label: 'বিজ্ঞান' },
                { id: 'commerce', label: 'ব্যবসায়' },
                { id: 'humanities', label: 'মানবিক' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGroup(g.id as any)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    group === g.id
                      ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs'
                      : 'bg-white dark:bg-[#1e2530] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#333d4d] hover:bg-slate-100 dark:hover:bg-[#2a3344]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attempt: 1st Timer vs 2nd Timer */}
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#232b3a]/80 border border-slate-200/90 dark:border-[#333d4d]">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1.5 sm:mb-2">
              পরীক্ষার সুযোগ (Attempt):
            </label>
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setIsSecondTimer(false)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  !isSecondTimer
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs'
                    : 'bg-white dark:bg-[#1e2530] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#333d4d] hover:bg-slate-100 dark:hover:bg-[#2a3344]'
                }`}
              >
                ১ম বার (1st Timer)
              </button>
              <button
                type="button"
                onClick={() => setIsSecondTimer(true)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isSecondTimer
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs'
                    : 'bg-white dark:bg-[#1e2530] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#333d4d] hover:bg-slate-100 dark:hover:bg-[#2a3344]'
                }`}
              >
                ২য় বার (2nd Timer)
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Subject-Wise Grade Section (Permanently Open & Actionable) */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-[#151a23]/50 border border-slate-200 dark:border-[#2a3344] space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/80 dark:border-[#2a3344]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  এইচএসসি বিষয়ভিত্তিক গ্রেড নির্বাচন (Subject-wise Grade Section)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                বুয়েট, মেডিকেল, গুচ্ছ ইঞ্জিনিয়ারিং ও বিশেষ অনুষদে ভর্তির যোগ্যতা এ গ্রেডগুলোর উপর নির্ভরশীল:
              </p>
            </div>

            {/* Quick Fill Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">কুইক সেট:</span>
              <button
                type="button"
                onClick={() => applyPreset('all_aplus')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 transition-all cursor-pointer shadow-2xs"
              >
                ⭐ সব A+
              </button>
              {group === 'science' && (
                <>
                  <button
                    type="button"
                    onClick={() => applyPreset('buet_fit')}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-[11px] font-bold border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 transition-all cursor-pointer shadow-2xs"
                  >
                    🏛️ বুয়েট ফিট (Math, Phy, Chem A+)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('medical_fit')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all cursor-pointer shadow-2xs"
                  >
                    🩺 মেডিকেল ফিট (Bio A+)
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => applyPreset('all_a')}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#232b3a] text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-[#333d4d] hover:bg-slate-200 dark:hover:bg-[#2a3344] transition-all cursor-pointer"
              >
                A গ্রেড (৪.০)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('all_a_minus')}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#232b3a] text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-[#333d4d] hover:bg-slate-200 dark:hover:bg-[#2a3344] transition-all cursor-pointer"
              >
                A- গ্রেড (৩.৫)
              </button>
            </div>
          </div>

          {/* Subjects Grid according to Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {group === 'science' && (
              <>
                {renderSubjectGradeCard(
                  'উচ্চতর গণিত',
                  'Higher Mathematics',
                  <Calculator className="w-4 h-4" />,
                  math,
                  setMath,
                  'বুয়েটে A+ আবশ্যক'
                )}
                {renderSubjectGradeCard(
                  'পদার্থবিজ্ঞান',
                  'Physics',
                  <Atom className="w-4 h-4" />,
                  physics,
                  setPhysics,
                  'বুয়েটে A+ আবশ্যক'
                )}
                {renderSubjectGradeCard(
                  'রসায়ন',
                  'Chemistry',
                  <FlaskConical className="w-4 h-4" />,
                  chemistry,
                  setChemistry,
                  'বুয়েটে A+ আবশ্যক'
                )}
                {renderSubjectGradeCard(
                  'জীববিজ্ঞান',
                  'Biology',
                  <Dna className="w-4 h-4" />,
                  biology,
                  setBiology,
                  'মেডিকেলে A আবশ্যক'
                )}
                {renderSubjectGradeCard(
                  'ইংরেজি',
                  'English',
                  <Languages className="w-4 h-4" />,
                  english,
                  setEnglish,
                  'বুয়েট / মেডিকেল'
                )}
                {renderSubjectGradeCard(
                  'বাংলা',
                  'Bangla',
                  <BookText className="w-4 h-4" />,
                  bangla,
                  setBangla,
                  'সাধারণ যোগ্যতা'
                )}
              </>
            )}

            {group === 'commerce' && (
              <>
                {renderSubjectGradeCard(
                  'হিসাববিজ্ঞান',
                  'Accounting',
                  <Calculator className="w-4 h-4" />,
                  accounting,
                  setAccounting,
                  'বাণিজ্য অনুষদ'
                )}
                {renderSubjectGradeCard(
                  'ব্যবসায় সংগঠন ও ব্যবস্থাপনা',
                  'Business Org & Mgmt',
                  <Briefcase className="w-4 h-4" />,
                  businessOrg,
                  setBusinessOrg,
                  'বাণিজ্য অনুষদ'
                )}
                {renderSubjectGradeCard(
                  'ফিন্যান্স / ব্যাংকিং',
                  'Finance & Banking',
                  <DollarSign className="w-4 h-4" />,
                  finance,
                  setFinance,
                  'বাণিজ্য অনুষদ'
                )}
                {renderSubjectGradeCard(
                  'ইংরেজি',
                  'English',
                  <Languages className="w-4 h-4" />,
                  english,
                  setEnglish,
                  'ঢাবি / গুচ্ছ বাণিজ্য'
                )}
                {renderSubjectGradeCard(
                  'বাংলা',
                  'Bangla',
                  <BookText className="w-4 h-4" />,
                  bangla,
                  setBangla,
                  'সাধারণ যোগ্যতা'
                )}
                {renderSubjectGradeCard(
                  'অর্থনীতি',
                  'Economics',
                  <TrendingUp className="w-4 h-4" />,
                  economics,
                  setEconomics,
                  'ঐচ্ছিক বিষয়'
                )}
              </>
            )}

            {group === 'humanities' && (
              <>
                {renderSubjectGradeCard(
                  'অর্থনীতি',
                  'Economics',
                  <TrendingUp className="w-4 h-4" />,
                  economics,
                  setEconomics,
                  'সামাজিক বিজ্ঞান'
                )}
                {renderSubjectGradeCard(
                  'পৌরনীতি ও সুশাসন',
                  'Civics & Good Governance',
                  <Landmark className="w-4 h-4" />,
                  civics,
                  setCivics,
                  'মানবিক অনুষদ'
                )}
                {renderSubjectGradeCard(
                  'যুক্তিবিদ্যা / সমাজবিজ্ঞান',
                  'Logic / Sociology',
                  <Scale className="w-4 h-4" />,
                  logic,
                  setLogic,
                  'মানবিক অনুষদ'
                )}
                {renderSubjectGradeCard(
                  'ইংরেজি',
                  'English',
                  <Languages className="w-4 h-4" />,
                  english,
                  setEnglish,
                  'কলা অনুষদ'
                )}
                {renderSubjectGradeCard(
                  'বাংলা',
                  'Bangla',
                  <BookText className="w-4 h-4" />,
                  bangla,
                  setBangla,
                  'কলা অনুষদ'
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 pt-1">
          <button
            id="btn-calculate-eligibility"
            type="button"
            onClick={runEvaluation}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>যোগ্যতা যাচাই করুন (Check Eligibility)</span>
          </button>

          {hasEvaluated && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#333d4d] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2a3344] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="রিসেট করুন"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রিসেট</span>
            </button>
          )}
        </div>
      </div>

      {/* Evaluation Results List */}
      {hasEvaluated && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              আপনি মোট <strong className="text-blue-600 dark:text-blue-400 font-number">{toBanglaNum(eligibleCount)}</strong>টি বিশ্ববিদ্যালয়ে আবেদনের জন্য যোগ্য!
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              সর্বমোট {toBanglaNum(universities.length)}টির মধ্যে
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {universities.map((uni) => {
              const res = evaluationResults[uni.id];
              if (!res) return null;

              return (
                <div
                  key={uni.id}
                  onClick={() => onSelectUniversity?.(uni)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    res.isEligible
                      ? 'bg-white dark:bg-[#1e2530] border-emerald-300/80 dark:border-emerald-800 shadow-2xs hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-600'
                      : 'bg-slate-50/60 dark:bg-[#1e2530]/40 border-slate-200 dark:border-[#2a3344] opacity-65 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          res.isEligible
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {res.isEligible ? 'আবেদনযোগ্য ✓' : 'শর্ত অপূর্ণ ✕'}
                      </span>
                      {res.isEligible && (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-number">
                          {toBanglaNum(res.matchScore)}% ম্যাচ
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{uni.categoryLabel} • {uni.location}</p>

                    <div className="mt-2.5 space-y-1">
                      {res.isEligible ? (
                        res.reasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))
                      ) : (
                        res.missingCriteria.slice(0, 2).map((crit, idx) => (
                          <div key={idx} className="flex items-start gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium leading-tight">
                            <AlertCircle className="w-3 h-3 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                            <span>{crit}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#2a3344] flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold">
                    <span>বিস্তারিত সার্কুলার দেখুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
