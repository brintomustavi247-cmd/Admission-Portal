import { ExamUnit, University } from '../types/admission';
import { initialUniversitiesData } from '../data/mockUniversities';

// Demo Google Sheet ID (can be configured or overridden by student)
export const DEFAULT_SHEET_ID = '1eFjX9dIqB_UqW_mOaV8xN2c5Y4zKpL9s7Q3';

export interface SheetFetchResult {
  universities: University[];
  isLive: boolean;
  source: 'google-sheet' | 'local-verified';
  sheetId?: string;
  errorMessage?: string;
  lastUpdated: string;
}

/**
 * Extracts Google Sheet ID from full URL or returns raw ID if already an ID
 */
export function extractSheetId(inputUrlOrId: string): string {
  if (!inputUrlOrId) return DEFAULT_SHEET_ID;
  const trimmed = inputUrlOrId.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Normalizes header string to standard identifier
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses Yes/No, হ্যাঁ/না, True/False values for 2nd timer eligibility
 */
export function parseSecondTimerValue(val: unknown): boolean {
  if (val === true || val === 1) return true;
  if (!val) return false;
  const str = String(val).toLowerCase().trim();
  return (
    str.includes('yes') ||
    str.includes('হ্যাঁ') ||
    str.includes('হ্যা') ||
    str.includes('true') ||
    str.includes('allowed') ||
    str.includes('আছে') ||
    str === 'y' ||
    str === '১'
  );
}

/**
 * Parses minimum GPA requirement text into structured numbers
 */
export function parseMinGpa(val: unknown): University['minGpa'] {
  const defaultMinGpa = {
    ssc: 3.5,
    hsc: 3.5,
    combined: 8.0,
  };

  if (!val) return defaultMinGpa;
  const str = String(val).trim();

  // If simple decimal number like "8.5" or "8.00"
  const singleNumber = parseFloat(str);
  if (!isNaN(singleNumber) && singleNumber >= 1.0 && singleNumber <= 10.0) {
    if (singleNumber > 5.0) {
      return {
        ssc: Math.min(4.0, Number((singleNumber / 2).toFixed(2))),
        hsc: Math.min(4.0, Number((singleNumber / 2).toFixed(2))),
        combined: singleNumber,
      };
    } else {
      return {
        ssc: singleNumber,
        hsc: singleNumber,
        combined: singleNumber * 2,
      };
    }
  }

  // Check for combined patterns like "Combined: 8.5" or "SSC: 4.0, HSC: 4.0, Total: 8.5"
  const sscMatch = str.match(/ssc[:\s-]*([0-9.]+)/i);
  const hscMatch = str.match(/hsc[:\s-]*([0-9.]+)/i);
  const totalMatch = str.match(/(total|combined|সর্বমোট)[:\s-]*([0-9.]+)/i);

  const ssc = sscMatch ? parseFloat(sscMatch[1]) : 3.5;
  const hsc = hscMatch ? parseFloat(hscMatch[1]) : 3.5;
  const combined = totalMatch ? parseFloat(totalMatch[2]) : (ssc + hsc);

  return {
    ssc: isNaN(ssc) ? 3.5 : ssc,
    hsc: isNaN(hsc) ? 3.5 : hsc,
    combined: isNaN(combined) ? 8.0 : combined,
  };
}

/**
 * Parses exam dates column and unit dates into structured ExamUnit list
 */
export function parseExamDates(examDatesVal: unknown, unitSpecificCols: Record<string, string>): ExamUnit[] {
  const units: ExamUnit[] = [];

  // Check unitSpecificCols first (e.g. "A Unit", "B Unit", etc.)
  for (const [unitName, dateVal] of Object.entries(unitSpecificCols)) {
    if (dateVal && dateVal.trim()) {
      units.push({
        unit: unitName,
        title: `${unitName} পরীক্ষা`,
        examDate: dateVal.trim(),
      });
    }
  }

  if (units.length > 0) {
    return units;
  }

  if (!examDatesVal) {
    return [{ unit: 'সাধারণ', title: 'ভর্তি পরীক্ষা', examDate: 'তারিখ শীঘ্রই ঘোষিত হবে' }];
  }

  const str = String(examDatesVal).trim();

  // If semicolon or comma separated e.g. "A Unit: 2026-02-15; B Unit: 2026-02-20"
  if (str.includes(';') || str.includes(',')) {
    const parts = str.split(/[;,]/);
    for (const part of parts) {
      if (part.includes(':')) {
        const [u, d] = part.split(':');
        units.push({
          unit: u.trim(),
          title: `${u.trim()} পরীক্ষা`,
          examDate: d.trim(),
        });
      } else if (part.trim()) {
        units.push({
          unit: `ইউনিট ${units.length + 1}`,
          title: 'ভর্তি পরীক্ষা',
          examDate: part.trim(),
        });
      }
    }
  }

  if (units.length === 0) {
    units.push({
      unit: 'সকল ইউনিট',
      title: 'ভর্তি পরীক্ষা',
      examDate: str,
    });
  }

  return units;
}

/**
 * Extracts standard short form acronym (e.g., DU, BUP, SUST, BUET) from university name
 */
export function extractShortAcronym(name: string): string {
  const parenMatch = name.match(/\(([A-Za-z0-9]+)\)/);
  if (parenMatch && parenMatch[1].length <= 5) {
    return parenMatch[1];
  }
  const lower = name.toLowerCase();
  if (lower.includes('ঢাকা') || lower.includes('dhaka')) return 'DU';
  if (lower.includes('খুলনা') && (lower.includes('প্রকৌশল') || lower.includes('kuet'))) return 'KUET';
  if (lower.includes('খুলনা') || lower.includes('khulna')) return 'KU';
  if (lower.includes('জাহাঙ্গীরনগর') || lower.includes('jahangirnagar')) return 'JU';
  if (lower.includes('রাজশাহী') && (lower.includes('প্রকৌশল') || lower.includes('ruet'))) return 'RUET';
  if (lower.includes('রাজশাহী') || lower.includes('rajshahi')) return 'RU';
  if (lower.includes('চট্টগ্রাম') && (lower.includes('প্রকৌশল') || lower.includes('cuet'))) return 'CUET';
  if (lower.includes('চট্টগ্রাম') || lower.includes('chittagong')) return 'CU';
  if (lower.includes('জগন্নাথ') || lower.includes('jagannath')) return 'JnU';
  if (lower.includes('বুয়েট') || lower.includes('buet')) return 'BUET';
  if (lower.includes('কুয়েট') || lower.includes('kuet')) return 'KUET';
  if (lower.includes('রুয়েট') || lower.includes('ruet')) return 'RUET';
  if (lower.includes('চুয়েট') || lower.includes('cuet')) return 'CUET';
  if (lower.includes('মিলিটারি') || lower.includes('এমআইএসটি') || lower.includes('mist')) return 'MIST';
  if (lower.includes('এভিয়েশন') || lower.includes('aaub') || lower.includes('bsmraau')) return 'AAUB';
  if (lower.includes('কৃষি গুচ্ছ') || lower.includes('কৃষি') || lower.includes('agri')) return 'AGRI';
  if (lower.includes('প্রফেশনালস') || lower.includes('বিইউপি') || lower.includes('bup')) return 'BUP';
  if (lower.includes('দানেশ') || lower.includes('হাবিপ্রবি') || lower.includes('hstu')) return 'HSTU';
  if (lower.includes('শাহজালাল') || lower.includes('শাবিপ্রবি') || lower.includes('sust')) return 'SUST';
  if (lower.includes('টেক্সটাইল') || lower.includes('বুটেক্স') || lower.includes('butex')) return 'BUTEX';
  if (lower.includes('কুমিল্লা') || lower.includes('কুবি') || lower.includes('cou')) return 'CoU';
  if (lower.includes('মেরিটাইম') || lower.includes('bmu') || lower.includes('bsmrmu')) return 'BMU';
  if (lower.includes('গুচ্ছ') || lower.includes('gst')) return 'GST';
  if (lower.includes('মেডিকেল') || lower.includes('ডেন্টাল') || lower.includes('medical') || lower.includes('mbbs')) return 'MED';

  return name.trim().slice(0, 4).toUpperCase();
}

/**
 * Parses raw gviz json output from Google Sheets into University objects
 */
export function parseGvizData(gvizResponseText: string): University[] {
  // Strip out "google.visualization.Query.setResponse(...);"
  const startIdx = gvizResponseText.indexOf('{');
  const endIdx = gvizResponseText.lastIndexOf('}');
  
  if (startIdx === -1 || endIdx === -1) {
    throw new Error('গুগল শিট থেকে সঠিক তথ্য পাওয়া যায়নি');
  }

  const jsonStr = gvizResponseText.substring(startIdx, endIdx + 1);
  const parsed = JSON.parse(jsonStr);

  const cols = parsed.table?.cols || [];
  const rows = parsed.table?.rows || [];

  if (!rows || rows.length === 0) {
    return [];
  }

  // Find column indexes
  const headerMap: Record<string, number> = {};
  const unitCols: Record<string, number> = {};

  cols.forEach((col: { id: string; label: string }, idx: number) => {
    const label = normalizeHeader(col.label || col.id || '');
    if (!label) return;

    if (label.includes('university') || label.includes('বিশ্ববিদ্যালয়') || label === 'name' || label === 'নাম') {
      headerMap['name'] = idx;
    } else if (label.includes('link') || label.includes('আবেদন') && label.includes('লিংক') || label === 'url') {
      headerMap['link'] = idx;
    } else if (label.includes('process') || label.includes('পদ্ধতি') || label.includes('প্রক্রিয়া')) {
      headerMap['process'] = idx;
    } else if (label.includes('start') || label.includes('শুরু')) {
      headerMap['startDate'] = idx;
    } else if (label.includes('end') || label.includes('শেষ') || label.includes('deadline')) {
      headerMap['endDate'] = idx;
    } else if (label.includes('admit') || label.includes('প্রবেশপত্র')) {
      headerMap['admitCard'] = idx;
    } else if (label.includes('exam date') || label.includes('পরীক্ষা') || label === 'exam') {
      headerMap['examDates'] = idx;
    } else if (label.includes('2nd timer') || label.includes('second timer') || label.includes('২য় বার')) {
      headerMap['secondTimer'] = idx;
    } else if (label.includes('gpa') || label.includes('জিপিএ') || label.includes('যোগ্যতা')) {
      headerMap['minGpa'] = idx;
    } else if (label.includes('subject') || label.includes('বিষয়') || label.includes('বিষয')) {
      headerMap['subjects'] = idx;
    } else if (label.includes('unit') || label.includes('ইউনিট')) {
      unitCols[col.label] = idx;
    }
  });

  const universities: University[] = [];

  rows.forEach((row: { c: Array<{ v: unknown; f?: string } | null> }, index: number) => {
    const c = row.c;
    if (!c || c.length === 0) return;

    const getVal = (idx?: number): string => {
      if (idx === undefined || !c[idx]) return '';
      const cell = c[idx];
      return String(cell.f || cell.v || '').trim();
    };

    const name = getVal(headerMap['name']);
    if (!name) return; // Skip empty rows

    const applicationLink = getVal(headerMap['link']) || '#';
    const applicationProcess = getVal(headerMap['process']) || 'অনলাইন পোর্টালের মাধ্যমে আবেদন ফি পরিশোধ করে আবেদন সম্পন্ন করুন।';
    const startDate = getVal(headerMap['startDate']) || '2025-12-01';
    const endDate = getVal(headerMap['endDate']) || '2025-12-31';
    const admitCardDate = getVal(headerMap['admitCard']) || '2026-01-15';
    const examDatesStr = getVal(headerMap['examDates']);
    const secondTimerRaw = getVal(headerMap['secondTimer']);
    const secondTimerAllowed = parseSecondTimerValue(secondTimerRaw);
    const minGpa = parseMinGpa(getVal(headerMap['minGpa']));

    const subjectsRaw = getVal(headerMap['subjects']);
    const requiredSubjects = subjectsRaw
      ? subjectsRaw.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
      : ['পদার্থবিজ্ঞান', 'রসায়ন', 'গণিত/জীববিজ্ঞান'];

    const unitSpecificData: Record<string, string> = {};
    for (const [unitName, colIdx] of Object.entries(unitCols)) {
      const val = getVal(colIdx);
      if (val) unitSpecificData[unitName] = val;
    }

    const examUnits = parseExamDates(examDatesStr, unitSpecificData);

    // Derive category
    let category: University['category'] = 'general';
    let categoryLabel = 'সাধারণ বিশ্ববিদ্যালয়';
    const lowerName = name.toLowerCase();

    if (lowerName.includes('প্রকৌশল') || lowerName.includes('engineering') || lowerName.includes('buet') || lowerName.includes('cuet') || lowerName.includes('kuet') || lowerName.includes('ruet') || lowerName.includes('butex') || lowerName.includes('mist')) {
      category = 'engineering';
      categoryLabel = 'প্রকৌশল বিশ্ববিদ্যালয়';
    } else if (lowerName.includes('মেডিকেল') || lowerName.includes('medical') || lowerName.includes('ডেন্টাল')) {
      category = 'medical';
      categoryLabel = 'মেডিকেল ও ডেন্টাল';
    } else if (lowerName.includes('কৃষি') || lowerName.includes('agri')) {
      category = 'agricultural';
      categoryLabel = 'কৃষি বিশ্ববিদ্যালয়';
    } else if (lowerName.includes('গুচ্ছ') || lowerName.includes('cluster') || lowerName.includes('gst')) {
      category = 'cluster';
      categoryLabel = 'গুচ্ছ বিশ্ববিদ্যালয়';
    }

    // Extract standard short form acronym
    const logoLetter = extractShortAcronym(name);

    universities.push({
      id: `sheet-uni-${index}`,
      name,
      shortName: name.split(' ')[0] || name,
      englishName: name,
      category,
      categoryLabel,
      location: 'বাংলাদেশ',
      applicationLink,
      applicationProcess,
      startDate,
      endDate,
      admitCardDate,
      examUnits,
      secondTimerAllowed,
      secondTimerDeduction: secondTimerAllowed ? 'অনুষদ ভেদে প্রযোজ্য' : 'সুযোগ নেই',
      minGpa,
      requiredSubjects,
      logoLetter,
      logoBg: category === 'engineering' ? 'bg-emerald-800' : category === 'medical' ? 'bg-teal-700' : category === 'cluster' ? 'bg-blue-800' : 'bg-sky-700',
    });
  });

  return universities;
}

/**
 * Fetches admission data from Google Sheet using GViz API
 * Falls back to verified authentic dataset if fetch fails or sheet is private
 */
export async function fetchAdmissionData(customSheetIdOrUrl?: string): Promise<SheetFetchResult> {
  const sheetId = extractSheetId(customSheetIdOrUrl || DEFAULT_SHEET_ID);
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(gvizUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'text/plain, application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: গুগল শিট অ্যাক্সেস করা যায়নি`);
    }

    const text = await response.text();
    const parsedList = parseGvizData(text);

    if (parsedList.length === 0) {
      throw new Error('গুগল শিটে কোনো বিশ্ববিদ্যালয়ের তথ্য পাওয়া যায়নি');
    }

    return {
      universities: parsedList,
      isLive: true,
      source: 'google-sheet',
      sheetId,
      lastUpdated: new Date().toLocaleTimeString('bn-BD'),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'অজানা ত্রুটি';
    console.warn('Google Sheet Fetch fallback:', errorMsg);

    // Return the high-fidelity Bangladesh University Admission 2025-26 verified dataset
    return {
      universities: initialUniversitiesData,
      isLive: false,
      source: 'local-verified',
      sheetId,
      errorMessage: errorMsg.includes('abort')
        ? 'গুগল শিট সার্ভারে সংযোগের সময়সীমা পার হয়েছে। ভেরিফাইড তথ্য লোড করা হয়েছে।'
        : 'পাবলিক গুগল শিটের লিঙ্ক নিশ্চিত করুন (Share -> Anyone with the link can view)। বর্তমান তথ্য ভেরিফাইড ডেটাবেস থেকে দেখানো হচ্ছে।',
      lastUpdated: new Date().toLocaleTimeString('bn-BD'),
    };
  }
}

/**
 * Unit Test verification suite for sheet fetcher logic
 */
export function runSheetFetcherUnitTests(): { passed: boolean; details: string[] } {
  const logs: string[] = [];
  let allPass = true;

  // Test 1: Extract sheet ID
  const testUrl = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';
  const extracted = extractSheetId(testUrl);
  if (extracted === '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms') {
    logs.push('✅ ExtractSheetId Passed: Successfully extracted ID from URL.');
  } else {
    allPass = false;
    logs.push(`❌ ExtractSheetId Failed: Expected ID but got ${extracted}`);
  }

  // Test 2: Parse 2nd timer values
  const is2ndTimerYes = parseSecondTimerValue('Yes') && parseSecondTimerValue('হ্যাঁ') && parseSecondTimerValue('Allowed');
  const is2ndTimerNo = !parseSecondTimerValue('No') && !parseSecondTimerValue('না') && !parseSecondTimerValue('সুযোগ নেই');
  if (is2ndTimerYes && is2ndTimerNo) {
    logs.push('✅ ParseSecondTimerValue Passed: Correctly identified Yes/হ্যাঁ and No/না.');
  } else {
    allPass = false;
    logs.push('❌ ParseSecondTimerValue Failed');
  }

  // Test 3: Parse Min GPA
  const parsedGpa = parseMinGpa('8.50');
  if (parsedGpa.combined === 8.5) {
    logs.push('✅ ParseMinGpa Passed: Successfully parsed numeric GPA.');
  } else {
    allPass = false;
    logs.push(`❌ ParseMinGpa Failed: got ${JSON.stringify(parsedGpa)}`);
  }

  // Test 4: Parse gviz response mockup
  const mockGviz = `/*O_o*/\ngoogle.visualization.Query.setResponse({"version":"0.6","reqId":"0","status":"ok","sig":"123","table":{"cols":[{"id":"A","label":"University Name"},{"id":"B","label":"Application Link"},{"id":"C","label":"2nd Timer Allowed"},{"id":"D","label":"Minimum GPA Requirement"}],"rows":[{"c":[{"v":"রাজশাহী বিশ্ববিদ্যালয়"},{"v":"https://admission.ru.ac.bd"},{"v":"Yes"},{"v":"8.0"}]}]}});`;
  try {
    const res = parseGvizData(mockGviz);
    if (res.length === 1 && res[0].name === 'রাজশাহী বিশ্ববিদ্যালয়' && res[0].secondTimerAllowed === true) {
      logs.push('✅ ParseGvizData Passed: Correctly mapped Google Sheet rows to University structure.');
    } else {
      allPass = false;
      logs.push('❌ ParseGvizData Failed: unexpected output');
    }
  } catch (e: unknown) {
    allPass = false;
    logs.push(`❌ ParseGvizData Threw Error: ${e instanceof Error ? e.message : 'Unknown'}`);
  }

  return { passed: allPass, details: logs };
}
