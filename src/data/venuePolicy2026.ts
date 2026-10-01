/**
 * VENUE + SECOND-TIMER POLICY — 2026-27 (KB-verified, September 2026)
 * Source: shikkhaweb, edudaily24, careerbd, thedailycampus, ctgcampus, rtvonline, bd24live, kalerkantho
 * Card এ এটা দেখানো হয় না — শুধু UniversityModal (details) এ ব্যবহার হয়।
 */

export interface VenuePolicy {
  regions: string[];
  venueNote?: string;
  secondTimer: { allowed: boolean; deduction: string };
  calculator: boolean | null;
  calculatorNote?: string;
  source?: string;
}

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
    calculator: null,
    calculatorNote: "২০২৬-২৭ বিজ্ঞপ্তিতে এখনো উল্লেখ নেই",
    source: "শিক্ষাওয়েব (2026-27)",
  },
  ku: {
    regions: ["খুলনা (খুবি ক্যাম্পাস)"],
    venueNote: "সব ইউনিটের পরীক্ষা নিজ ক্যাম্পাসে।",
    secondTimer: {
      allowed: true,
      deduction: "বিগত বছরগুলোতে ০.২৫ GPA কর্তন হয়েছে",
    },
    calculator: null,
    source: "এডুডেইলি২৪",
  },
  ju: {
    regions: ["সাভার (জাবি মূল ক্যাম্পাস)"],
    venueNote:
      "২০২৬-২৭ এ বিভাগীয় শহরে কেন্দ্র বাদ (আর্থিক/লজিস্টিক কারণে) — ভর্তি কমিটির সভার সিদ্ধান্ত।",
    secondTimer: {
      allowed: true,
      deduction: "কোন নম্বর কর্তন নেই (সম্পূর্ণ সমসুযোগ)",
    },
    calculator: null,
    source: "ভর্তি কমিটি সভা, ২২ সেপ্টেম্বর ২০২৬",
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
    calculator: null,
    source: "শিক্ষাওয়েব (2026-27)",
  },
  jnu: {
    regions: ["ঢাকা (জবি ক্যাম্পাস)"],
    venueNote:
      "বিভাগীয় শহরে কেন্দ্র থাকার সম্ভাবনা — অফিশিয়াল তালিকা এখনো পুরোপুরি নিশ্চিত নয়।",
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: null,
  },
  cu: {
    regions: ["চট্টগ্রাম (চবি ক্যাম্পাস, হাটহাজারী)"],
    secondTimer: {
      allowed: true,
      deduction: "২য় বার পরীক্ষার্থীদের মোট স্কোর থেকে ৩.০ নম্বর কর্তন",
    },
    calculator: null,
  },
  buet: {
    regions: ["ঢাকা (বুয়েট ক্যাম্পাস)"],
    venueNote: "বাইরে কোনো কেন্দ্রের ঘোষণা এখনও আসেনি।",
    secondTimer: {
      allowed: true,
      deduction: "কোনো কর্তন নেই (শুধু লিখিত পরীক্ষার ভিত্তিতে)",
    },
    calculator: null,
    source: "প্রথম আলো",
  },
  kuet: {
    regions: [
      "খুলনা (কুয়েট ক্যাম্পাস)",
      "ঢাকা (সম্ভাব্য)",
      "রাজশাহী (সম্ভাব্য)",
    ],
    venueNote: "অফিশিয়াল বিস্তারিত বিজ্ঞপ্তিতে নিশ্চিত হবে।",
    secondTimer: { allowed: true, deduction: "সাধারণত ০.২৫ GPA কর্তন হয়" },
    calculator: null,
    source: "ক্যারিয়ার বিডি",
  },
  ruet: {
    regions: [
      "রাজশাহী (রুয়েট ক্যাম্পাস)",
      "ঢাকা (সম্ভাব্য)",
      "খুলনা (সম্ভাব্য)",
    ],
    secondTimer: { allowed: true, deduction: "সাধারণত ০.২৫ GPA কর্তন হয়" },
    calculator: null,
    source: "ক্যারিয়ার বিডি",
  },
  cuet: {
    regions: [
      "চট্টগ্রাম (চুয়েট ক্যাম্পাস)",
      "ঢাকা (সম্ভাব্য)",
      "খুলনা (সম্ভাব্য)",
    ],
    secondTimer: { allowed: true, deduction: "সাধারণত ০.২৫ GPA কর্তন হয়" },
    calculator: null,
    source: "ক্যারিয়ার বিডি",
  },
  mist: {
    regions: ["ঢাকা (মিরপুর ক্যান্টনমেন্ট)", "চট্টগ্রাম (বিএএফ শাহীন কলেজ)"],
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের নিয়ম" },
    calculator: null,
    source: "দ্য ডেইলি ক্যাম্পাস",
  },
  aaub: {
    regions: ["লালমনিরহাট (AAUB ক্যাম্পাস)", "ঢাকা (বিএএফ শাহীন কলেজ)"],
    secondTimer: { allowed: true, deduction: "সাধারণত ০.২৫ GPA কর্তন" },
    calculator: null,
  },
  bup: {
    regions: ["ঢাকা (BUP ক্যাম্পাস, সেক্টর-১৭, মিরপুর)"],
    secondTimer: { allowed: true, deduction: "০.২৫–০.৫ GPA কর্তন হতে পারে" },
    calculator: null,
  },
  hstu: {
    regions: ["দিনাজপুর (HSTU ক্যাম্পাস)"],
    venueNote: "বিভাগীয় শহরগুলোতে কেন্দ্র থাকতে পারে।",
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: null,
  },
  sust: {
    regions: [
      "সিলেট (SUST ক্যাম্পাস)",
      "ঢাকা (সম্ভাব্য)",
      "চট্টগ্রাম (সম্ভাব্য)",
    ],
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: null,
  },
  butex: {
    regions: ["ঢাকা (বুটেক্স ক্যাম্পাস, তেজগাঁও)"],
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: null,
  },
  cou: {
    regions: ["কুমিল্লা (কুবি ক্যাম্পাস)", "চট্টগ্রাম", "রাজশাহী"],
    venueNote: "ফেব্রুয়ারি ২০২৭ পরীক্ষার জন্য ৩ শহরে কেন্দ্র নিশ্চিত।",
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: null,
    source: "সিটিজি ক্যাম্পাস",
  },
  bmu: {
    regions: ["চট্টগ্রাম (স্থায়ী ক্যাম্পাস)"],
    venueNote: "২০২৭ সালের মে থেকে স্থায়ী ক্যাম্পাসে পাঠদান ও পরীক্ষা।",
    secondTimer: {
      allowed: true,
      deduction: "circular অনুযায়ী (নেগেটিভ মার্কিং ০.২৫)",
    },
    calculator: null,
    source: "দ্য ডেইলি ক্যাম্পাস",
  },
  "agri-cluster": {
    regions: [
      "ময়মনসিংহ (BAU)",
      "গাজীপুর (SAU)",
      "সিলেট (GAU)",
      "পটুয়াখালী (PSTU)",
      "চট্টগ্রাম (CVASU)",
      "রংপুর",
      "খুলনা",
      "কুমিল্লা",
      "নাটোর",
    ],
    secondTimer: { allowed: true, deduction: "০.২৫ GPA কর্তনের প্রবণতা" },
    calculator: null,
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
    calculator: null,
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
    calculator: null,
    source: "কালের কণ্ঠ, bd24live",
  },
};
