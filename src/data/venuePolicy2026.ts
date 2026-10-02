/**
 * VENUE + SECOND-TIMER + CALCULATOR POLICY — 2026-27 (KB-verified)
 * FIX v13.6:
 *  - 4-state calculator: allowed / banned / conditional / unknown
 *  - CU (চবি): A ইউনিটে fx-100MS অনুমোদিত, B/B1/B2/C/D/D1 নিষিদ্ধ (unit-wise breakdown)
 *  - fx-100MS explicit mention সব জায়গায়; ইঞ্জিনিয়ারিং ৬টি = ✅, বাকি সব = ❌
 * Source: admissionwar (BUET/CKRUET বিজ্ঞপ্তি), jugantor campus (CU), ruet.ac brochure, DGME বিজ্ঞপ্তি
 */

export type CalcPolicyValue = boolean | "conditional";

export interface VenuePolicy {
  regions: string[];
  venueNote?: string;
  secondTimer: { allowed: boolean; deduction: string };
  calculator: CalcPolicyValue;
  calculatorNote?: string;
  /** CU-এর মতো unit-wise calculator breakdown */
  calculatorUnitBreakdown?: Array<{
    unit: string;
    allowed: boolean;
    note?: string;
  }>;
  source?: string;
}

const CALC_ENG_NOTE =
  "শুধু নন-প্রোগ্রামেবল সায়েন্টিফিক ক্যালকুলেটর অনুমোদিত — Casio fx-100MS, fx-991ES Plus, fx-991EX ClassWiz। গ্রাফিক্যাল/প্রোগ্রামেবল (fx-9860, fx-CG50, TI-84) নিষিদ্ধ।";
const CALC_BAN_NOTE =
  "ক্যালকুলেটর (fx-100MS সহ যেকোনো মডেল) নিষিদ্ধ। বিজ্ঞপ্তিতে ইলেকট্রনিক ডিভাইস নিষিদ্ধের স্পষ্ট উল্লেখ। নিয়ে গেলে বহিষ্কারের ঝুঁকি।";

export const VENUE_POLICY_2026_27: Record<string, VenuePolicy> = {
  du: {
    regions: [
      "ঢাকা (মূল ক্যাম্পাস)",
      "চট্টগ্রাম (চবি)",
      "রাজশাহী (রাবি)",
      "সিলেট (শাবিপ্রবি)",
      "বরিশাল (ববি)",
      "খুলনা (খুবি)",
      "রংপুর (বেগম রোকেয়া বি.)",
      "ময়মনসিংহ (কৃষি বি.)",
    ],
    venueNote: "আইবিএ ও চারুকলা ইউনিটের পরীক্ষা শুধুমাত্র ঢাকায় অনুষ্ঠিত হবে।",
    secondTimer: {
      allowed: true,
      deduction:
        "সাধারণত ০.২৫–০.৫ GPA কর্তন (বিজ্ঞপ্তিতে সুনির্দিষ্ট উল্লেখ থাকে)",
    },
    calculator: false,
    calculatorNote:
      "বিজ্ঞপ্তিতে স্পষ্ট: 'মোবাইল ফোন, ক্যালকুলেটর, যেকোনো ধরনের ইলেকট্রনিক ডিভাইস সম্বলিত ঘড়ি ও কলম ব্যবহার সম্পূর্ণ নিষেধ।' fx-100MS সহ সব ক্যালকুলেটর নিষিদ্ধ।",
    source: "admission.eis.du.ac.bd (2025-26)",
  },
  ku: {
    regions: ["খুলনা (খুবি ক্যাম্পাস)"],
    venueNote: "সব ইউনিটের পরীক্ষা নিজ ক্যাম্পাসে।",
    secondTimer: {
      allowed: true,
      deduction: "বিগত বছরগুলোতে ০.২৫ GPA কর্তন হয়েছে",
    },
    calculator: false,
    calculatorNote: CALC_BAN_NOTE,
    source: "এডুডেইলি২৪, Dhaka Tribune বাংলা",
  },
  ju: {
    regions: ["সাভার (জাবি মূল ক্যাম্পাস)"],
    venueNote:
      "২০২৬-২৭ এ বিভাগীয় শহরে কেন্দ্র বাদ (আর্থিক/লজিস্টিক কারণে) — ভর্তি কমিটির সভার সিদ্ধান্ত।",
    secondTimer: {
      allowed: true,
      deduction: "কোন নম্বর কর্তন নেই (সম্পূর্ণ সমসুযোগ)",
    },
    calculator: false,
    calculatorNote: CALC_BAN_NOTE,
    source: "ju-admission.org (2025)",
  },
  ru: {
    regions: [
      "ঢাকা",
      "চট্টগ্রাম",
      "রাজশাহী",
      "খুলনা",
      "সিলেট",
      "রংপুর",
      "বরিশাল",
      "ময়মনসিংহ",
    ],
    venueNote: "২০২৬-২৭ এ প্রথমবারের মতো ৮ বিভাগীয় শহরেই পরীক্ষা নেওয়া হবে।",
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তন হয়" },
    calculator: false,
    calculatorNote: CALC_BAN_NOTE,
    source: "শিক্ষাওয়েব (2026-27)",
  },
  jnu: {
    regions: ["ঢাকা (জবি ক্যাম্পাস)"],
    venueNote:
      "বিভাগীয় শহরে কেন্দ্র থাকার সম্ভাবনা — অফিশিয়াল তালিকা এখনো পুরোপুরি নিশ্চিত নয়।",
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: false,
    calculatorNote:
      "বিজ্ঞপ্তিতে স্পষ্ট: 'ক্যালকুলেটর ব্যবহার করা যাবে না'। fx-100MS নিষিদ্ধ।",
    source: "careerbd",
  },
  cu: {
    regions: ["চট্টগ্রাম (চবি ক্যাম্পাস, হাটহাজারী)"],
    secondTimer: {
      allowed: true,
      deduction: "২য় বার পরীক্ষার্থীদের মোট স্কোর থেকে ৩.০ নম্বর কর্তন",
    },
    calculator: "conditional",
    calculatorNote:
      "A ইউনিটে (বিজ্ঞান) fx-100MS বা এর নিচের সাধারণ ক্যালকুলেটর (Memory Option ছাড়া) অনুমোদিত। B, B1, B2, C, D, D1 ইউনিটে সম্পূর্ণ নিষিদ্ধ। গ্রাফিক্যাল/প্রোগ্রামেবল সব ইউনিটে নিষিদ্ধ।",
    calculatorUnitBreakdown: [
      {
        unit: "A ইউনিট (বিজ্ঞান)",
        allowed: true,
        note: "fx-100MS বা এর নিচের সাধারণ মডেল (Memory Option ছাড়া)",
      },
      { unit: "B ইউনিট (কলা ও মানববিদ্যা)", allowed: false, note: "সম্পূর্ণ নিষিদ্ধ" },
      { unit: "B1 (চারুকলা)", allowed: false, note: "সম্পূর্ণ নিষিদ্ধ" },
      { unit: "B2 (নাট্যকলা ও সংগীত)", allowed: false, note: "সম্পূর্ণ নিষিদ্ধ" },
      { unit: "C ইউনিট (বাণিজ্য)", allowed: false, note: "সম্পূর্ণ নিষিদ্ধ" },
      { unit: "D ইউনিট (সমাজবিজ্ঞান/আইন)", allowed: false, note: "সম্পূর্ণ নিষিদ্ধ" },
      { unit: "D1 (শারীরিক শিক্ষা)", allowed: false, note: "সম্পূর্ণ নিষিদ্ধ" },
    ],
    source: "jugantor.com/campus",
  },
  buet: {
    regions: ["ঢাকা (বুয়েট ক্যাম্পাস)"],
    venueNote: "বাইরে কোনো কেন্দ্রের ঘোষণা এখনও আসেনি।",
    secondTimer: {
      allowed: true,
      deduction: "কোনো কর্তন নেই (শুধু লিখিত পরীক্ষার ভিত্তিতে)",
    },
    calculator: true,
    calculatorNote:
      CALC_ENG_NOTE +
      " বিজ্ঞপ্তিতে স্পষ্ট: 'কেবলমাত্র কলম, পেন্সিল, ইরেজার, শার্পনার ও পরিশিষ্ট-ক অনুসারে অনুমোদিত ক্যালকুলেটর ব্যবহার করা যাবে'।",
    source: "AdmissionWar (BUET বিজ্ঞপ্তি ২০২৬)",
  },
  kuet: {
    regions: [
      "খুলনা (কুয়েট ক্যাম্পাস)",
      "ঢাকা (সম্ভাব্য)",
      "রাজশাহী (সম্ভাব্য)",
    ],
    venueNote: "অফিশিয়াল বিস্তারিত বিজ্ঞপ্তিতে নিশ্চিত হবে।",
    secondTimer: { allowed: true, deduction: "সাধারণত ০.২৫ GPA কর্তন হয়" },
    calculator: true,
    calculatorNote:
      CALC_ENG_NOTE +
      " CKRUET (চুয়েট-কুয়েট-রুয়েট) সমন্বিত বিজ্ঞপ্তিতে একই নিয়ম।",
    source: "AdmissionWar (CKRUET বিজ্ঞপ্তি)",
  },
  ruet: {
    regions: [
      "রাজশাহী (রুয়েট ক্যাম্পাস)",
      "ঢাকা (সম্ভাব্য)",
      "খুলনা (সম্ভাব্য)",
    ],
    secondTimer: { allowed: true, deduction: "সাধারণত ০.২৫ GPA কর্তন হয়" },
    calculator: true,
    calculatorNote: CALC_ENG_NOTE + " CKRUET গাইডলাইন অনুসরণ করে।",
    source: "AdmissionWar (CKRUET বিজ্ঞপ্তি)",
  },
  cuet: {
    regions: [
      "চট্টগ্রাম (চুয়েট ক্যাম্পাস)",
      "ঢাকা (সম্ভাব্য)",
      "খুলনা (সম্ভাব্য)",
    ],
    secondTimer: { allowed: true, deduction: "সাধারণত ০.২৫ GPA কর্তন হয়" },
    calculator: true,
    calculatorNote: CALC_ENG_NOTE + " CKRUET গাইডলাইন অনুসরণ করে।",
    source: "AdmissionWar (CKRUET বিজ্ঞপ্তি)",
  },
  mist: {
    regions: ["ঢাকা (মিরপুর ক্যান্টনমেন্ট)", "চট্টগ্রাম (বিএএফ শাহীন কলেজ)"],
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের নিয়ম" },
    calculator: true,
    calculatorNote:
      CALC_ENG_NOTE +
      " ইঞ্জিনিয়ারিং/স্থাপত্য ইউনিটে অনুমতি আছে।",
    source: "RUET CKRUET brochure",
  },
  aaub: {
    regions: ["লালমনিরহাট (AAUB ক্যাম্পাস)", "ঢাকা (বিএএফ শাহীন কলেজ)"],
    secondTimer: { allowed: true, deduction: "সাধারণত ০.২৫ GPA কর্তন" },
    calculator: true,
    calculatorNote:
      CALC_ENG_NOTE + " প্রকৌশল/বিমান পরিচালনা সংশ্লিষ্ট ইউনিটে অনুমোদিত।",
  },
  bup: {
    regions: ["ঢাকা (BUP ক্যাম্পাস, সেক্টর-১৭, মিরপুর)"],
    secondTimer: { allowed: true, deduction: "০.২৫–০.৫ GPA কর্তন হতে পারে" },
    calculator: false,
    calculatorNote: CALC_BAN_NOTE,
  },
  hstu: {
    regions: ["দিনাজপুর (HSTU ক্যাম্পাস)"],
    venueNote: "বিভাগীয় শহরগুলোতে কেন্দ্র থাকতে পারে।",
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: false,
    calculatorNote: "বিজ্ঞপ্তিতে ক্যালকুলেটর নিষিদ্ধের উল্লেখ। fx-100MS নিষিদ্ধ।",
  },
  sust: {
    regions: [
      "সিলেট (SUST ক্যাম্পাস)",
      "ঢাকা (সম্ভাব্য)",
      "চট্টগ্রাম (সম্ভাব্য)",
    ],
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: false,
    calculatorNote: CALC_BAN_NOTE,
  },
  butex: {
    regions: ["ঢাকা (বুটেক্স ক্যাম্পাস, তেজগাঁও)"],
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: false,
    calculatorNote:
      "টেক্সটাইল ইঞ্জিনিয়ারিং ভর্তি পরীক্ষায় ক্যালকুলেটর অনুমোদিত নয়। fx-100MS নিষিদ্ধ।",
  },
  cou: {
    regions: ["কুমিল্লা (কুবি ক্যাম্পাস)", "চট্টগ্রাম", "রাজশাহী"],
    venueNote: "ফেব্রুয়ারি ২০২৭ পরীক্ষার জন্য ৩ শহরে কেন্দ্র নিশ্চিত।",
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: false,
    calculatorNote:
      "বিজ্ঞপ্তিতে স্পষ্ট: 'ভর্তি পরীক্ষায় ক্যালকুলেটর ব্যবহার করা যাবে না'। fx-100MS নিষিদ্ধ।",
    source: "admissionnotice.com",
  },
  bmu: {
    regions: ["চট্টগ্রাম (স্থায়ী ক্যাম্পাস)"],
    venueNote: "২০২৭ সালের মে থেকে স্থায়ী ক্যাম্পাসে পাঠদান ও পরীক্ষা।",
    secondTimer: {
      allowed: true,
      deduction: "circular অনুযায়ী (নেগেটিভ মার্কিং ০.২৫)",
    },
    calculator: false,
    calculatorNote: CALC_BAN_NOTE,
    source: "দ্য ডেইলি ক্যাম্পাস",
  },
  "agri-cluster": {
    regions: [
      "ময়মনসিংহ (বাংলাদেশ কৃষি বি.)",
      "গাজীপুর (বঙ্গবন্ধু শেখ মুজিবুর রহমান কৃষি বি.)",
      "ঢাকা (শেরেবাংলা কৃষি বি.)",
      "সিলেট (সিলেট কৃষি বি.)",
      "পটুয়াখালী (পবিপ্রবি)",
      "চট্টগ্রাম (চুভাপবি)",
      "হবিগঞ্জ (হবিগঞ্জ কৃষি বি.)",
      "কুড়িগ্রাম (কুড়িগ্রাম কৃষি বি.)",
      "খুলনা (খুলনা কৃষি বি.)",
    ],
    venueNote:
      "৯টি সদস্য বিশ্ববিদ্যালয়ের নিজ নিজ ক্যাম্পাসে কেন্দ্র থাকে। নাটোর/কুমিল্লা আলাদা কেন্দ্র নয় — আগের তথ্যটি ভুল ছিল, সংশোধিত।",
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: false,
    calculatorNote: CALC_BAN_NOTE,
    source: "কৃষি গুচ্ছ কমিটি (সমন্বয়ক: শেকৃবি)",
  },
  gst: {
    regions: ["২০টি অংশগ্রহণকারী বিশ্ববিদ্যালয়ের নিজ নিজ ক্যাম্পাস"],
    venueNote:
      "প্রতিটি বিশ্ববিদ্যালয় নিজ ক্যাম্পাসে পরীক্ষা নেয় (আয়োজনে পবিপ্রবি)।",
    secondTimer: {
      allowed: true,
      deduction:
        "সাধারণত ০.২৫ GPA (গুচ্ছভুক্ত প্রতিটি ভার্সিটি নিজস্ব নীতি প্রয়োগ করে)",
    },
    calculator: false,
    calculatorNote:
      "গুচ্ছভুক্ত সব বিশ্ববিদ্যালয়েই সাধারণত ক্যালকুলেটর নিষিদ্ধ। fx-100MS নিষিদ্ধ।",
    source: "আরটিভি অনলাইন",
  },
  medical: {
    regions: ["সব সরকারি মেডিকেল/ডেন্টাল কলেজ (৩৭টি কেন্দ্র)"],
    venueNote:
      "একই দিনে, অভিন্ন প্রশ্নে পরীক্ষা; প্রতিটি কলেজ নিজস্ব কেন্দ্র হিসেবে কাজ করে।",
    secondTimer: {
      allowed: true,
      deduction:
        "৫ নম্বর কর্তন (পূর্বে ভর্তি হয়ে ছেড়ে দিলে ১০ নম্বর) — DGME নীতিমালা",
    },
    calculator: false,
    calculatorNote: "DGME বিজ্ঞপ্তিতে ক্যালকুলেটর নিষিদ্ধের স্পষ্ট উল্লেখ। fx-100MS নিষিদ্ধ।",
    source: "কালের কণ্ঠ, bd24live",
  },
};
