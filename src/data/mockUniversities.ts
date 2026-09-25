import { University } from "../types/admission";

export const initialUniversitiesData: University[] = [
  // 1. ঢাকা বিশ্ববিদ্যালয় (ঢাবি) - DU
  {
    id: "du",
    name: "ঢাকা বিশ্ববিদ্যালয় (ঢাবি)",
    shortName: "ঢাবি",
    englishName: "University of Dhaka (DU)",
    category: "general",
    categoryLabel: "সাধারণ বিশ্ববিদ্যালয়",
    location: "ঢাকা",
    applicationLink: "https://admission.eis.du.ac.bd/",
    applicationProcess:
      "অনলাইন পোর্টাল থেকে এসএসসি ও এইচএসসি রোল, রেজিস্ট্রেশন ও বোর্ড দিয়ে আবেদন সম্পন্ন করুন। ফি ব্যাংকিং/অনলাইনে জমা দিন।",
    startDate: "2026-11-11",
    endDate: "2026-11-25",
    admitCardDate: "",
    secondTimerAllowed: false,
    secondTimerDeduction: "সুযোগ নেই (শুধুমাত্র HSC 2026 ব্যাচ)",
    eligibleHscBatches: "শুধুমাত্র HSC 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ আবেদন ১১–২৫ নভেম্বর এবং ভর্তি পরীক্ষা: IBA ৫ ডিসেম্বর, বিজ্ঞান ১২ ডিসেম্বর, কলা/আইন/সামাজিক বিজ্ঞান ১৯ ডিসেম্বর, চারুকলা ২২ ডিসেম্বর, ব্যবসায় শিক্ষা ২৬ ডিসেম্বর—পূর্ণাঙ্গ বর্তমান সার্কুলারের সব শর্ত এখনো আলাদাভাবে নিশ্চিত নয়।",
    minGpa: {
      ssc: 3.5,
      hsc: 3.5,
      combined: 8.0,
      subjectMin: {
        physics: 3.5,
        chemistry: 3.5,
        math: 3.5,
        biology: 3.5,
        english: 3.0,
      },
    },
    requiredSubjects: ["বিজ্ঞান অনুষদের জন্য পদার্থ, রসায়ন ও গণিত/জীববিজ্ঞান"],
    totalSeats: 6010,
    featured: true,
    logoBg: "bg-red-700",
    logoLetter: "DU",
    examUnits: [
      {
        unit: "IBA",
        title: "Institute of Business Administration",
        examDate: "2026-12-05",
        time: "সকাল ১০:০০ - ১২:০০",
        fee: "১৫০০ টাকা",
      },
      {
        unit: "বিজ্ঞান ইউনিট",
        title: "বিজ্ঞান অনুষদভুক্ত বিষয়সমূহ",
        examDate: "2026-12-12",
        time: "সকাল ১১:০০ - ১২:৩০",
        fee: "১০৫০ টাকা",
      },
      {
        unit: "কলা, আইন ও সামাজিক বিজ্ঞান",
        title: "মানবিক ও সম্মিলিত অনুষদ",
        examDate: "2026-12-19",
        time: "সকাল ১১:০০ - ১২:৩০",
        fee: "১০৫০ টাকা",
      },
      {
        unit: "চারুকলা ইউনিট",
        title: "চারুকলা অনুষদ",
        examDate: "2026-12-22",
        time: "সকাল ১১:০০ - ১২:৩০",
        fee: "১০৫০ টাকা",
      },
      {
        unit: "ব্যবসায় শিক্ষা ইউনিট",
        title: "বাণিজ্য অনুষদভুক্ত বিষয়সমূহ",
        examDate: "2026-12-26",
        time: "সকাল ১১:০০ - ১২:৩০",
        fee: "১০৫০ টাকা",
      },
    ],
  },

  // 2. খুলনা বিশ্ববিদ্যালয় (খুবি) - KU
  {
    id: "ku",
    name: "খুলনা বিশ্ববিদ্যালয় (খুবি)",
    shortName: "খুবি",
    englishName: "Khulna University (KU)",
    category: "general",
    categoryLabel: "সাধারণ বিশ্ববিদ্যালয়",
    location: "গল্লামারী, খুলনা",
    applicationLink: "https://ku.ac.bd/admission",
    applicationProcess:
      "অনলাইনে নির্ধারিত ফরম পূরণ করে মোবাইল ব্যাংকিংয়ের মাধ্যমে ফি প্রদান করুন। ২য় বারের শিক্ষার্থীরাও আবেদন করতে পারবেন।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ ভর্তি পরীক্ষা ১৭ ডিসেম্বর (C ও D) ও ১৮ ডিসেম্বর (A ও B) রিপোর্টেড/ঘোষিত; আবেদনকাল ও পূর্ণাঙ্গ শর্তের বর্তমান সার্কুলার ছাড়া তারিখ দেখানো হয়নি।",
    minGpa: {
      ssc: 3.5,
      hsc: 3.5,
      combined: 8.0,
      subjectMin: {
        physics: 3.5,
        chemistry: 3.5,
        math: 3.5,
        english: 3.0,
      },
    },
    requiredSubjects: [
      "A ও B স্কুলের জন্য বিজ্ঞান ব্যাকগ্রাউন্ড",
      "C ও D স্কুলের জন্য সকল বিভাগ",
    ],
    totalSeats: 1215,
    featured: true,
    logoBg: "bg-emerald-800",
    logoLetter: "KU",
    examUnits: [
      {
        unit: "C ও D স্কুল",
        title: "কলা, মানবিক, সামাজিক বিজ্ঞান ও ব্যবস্থাপনা",
        examDate: "2026-12-17",
        time: "সকাল ও বিকাল সেশন",
        fee: "১২০০ টাকা",
      },
      {
        unit: "A ও B স্কুল",
        title: "বিজ্ঞান, প্রকৌশল, প্রযুক্তি ও জীববিজ্ঞান",
        examDate: "2026-12-18",
        time: "সকাল ও বিকাল সেশন",
        fee: "১২০০ টাকা",
      },
    ],
  },

  // 3. জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (জাবি) - JU
  {
    id: "ju",
    name: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (জাবি)",
    shortName: "জাবি",
    englishName: "Jahangirnagar University (JU)",
    category: "general",
    categoryLabel: "সাধারণ বিশ্ববিদ্যালয়",
    location: "সাভার, ঢাকা",
    applicationLink: "https://ju-admission.org/",
    applicationProcess:
      "অনলাইন পোর্টালে লগইন করে ইউনিট ভিত্তিক আবেদন করুন। বিকাশ, রকেট বা নগদে ফি প্রদান করুন।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ ভর্তি পরীক্ষার সময়সূচি এখনো চূড়ান্ত নয়; জানুয়ারি ২০২৭-এ সম্ভাব্য শুরুর কথা রিপোর্ট হয়েছে। ২য় বার নীতির পূর্ণাঙ্গ বর্তমান শর্ত/কাটার তথ্যও চূড়ান্ত সার্কুলার সাপেক্ষে।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 8.5,
      subjectMin: {
        physics: 3.5,
        chemistry: 3.5,
        math: 3.5,
        biology: 3.5,
        english: 3.5,
      },
    },
    requiredSubjects: ["A ইউনিটে বিজ্ঞান; D ইউনিটে জীববিজ্ঞান নূন্যতম ৩.৫"],
    totalSeats: 1989,
    featured: true,
    logoBg: "bg-rose-800",
    logoLetter: "JU",
    examUnits: [],
  },

  // 4. রাজশাহী বিশ্ববিদ্যালয় (রাবি) - RU
  {
    id: "ru",
    name: "রাজশাহী বিশ্ববিদ্যালয় (রাবি)",
    shortName: "রাবি",
    englishName: "University of Rajshahi (RU)",
    category: "general",
    categoryLabel: "সাধারণ বিশ্ববিদ্যালয়",
    location: "মতিহার, রাজশাহী",
    applicationLink: "https://admission.ru.ac.bd/",
    applicationProcess:
      "প্রাথমিক আবেদন ১২–২৭ নভেম্বর ২০২৬। প্রাথমিক সিলেকশনের পর নির্বাচিত শিক্ষার্থীরা চূড়ান্ত আবেদন করবে।",
    startDate: "2026-11-12",
    endDate: "2026-11-27",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "প্রাথমিক আবেদন ১২–২৭ নভেম্বর ২০২৬। ভর্তি পরীক্ষা ৮ জানুয়ারি (B), ৯ জানুয়ারি (C) এবং ১৬ জানুয়ারি ২০২৭ (A)।",
    minGpa: {
      ssc: 3.5,
      hsc: 3.5,
      combined: 8.0,
      subjectMin: {
        physics: 3.5,
        chemistry: 3.5,
        math: 3.5,
      },
    },
    requiredSubjects: ["C ইউনিটে বিজ্ঞান; A ও B ইউনিটে সকল গ্রুপ"],
    totalSeats: 3930,
    featured: true,
    logoBg: "bg-sky-700",
    logoLetter: "RU",
    examUnits: [
      {
        unit: "B ইউনিট",
        title: "ব্যবসায় শিক্ষা অনুষদ ও ব্যবসায় প্রশাসন ইনস্টিটিউট",
        examDate: "2027-01-08",
        fee: "১১০০ টাকা",
      },
      {
        unit: "C ইউনিট",
        title: "বিজ্ঞান, কৃষি, প্রকৌশল ও জীব ও ভূ-বিজ্ঞান অনুষদ",
        examDate: "2027-01-09",
        fee: "১৩২০ টাকা",
      },
      {
        unit: "A ইউনিট",
        title: "কলা, আইন, সামাজিক বিজ্ঞান ও চারুকলা অনুষদ",
        examDate: "2027-01-16",
        fee: "১৩২০ টাকা",
      },
    ],
  },

  // 5. জগন্নাথ বিশ্ববিদ্যালয় (জবি) - JnU
  {
    id: "jnu",
    name: "জগন্নাথ বিশ্ববিদ্যালয় (জবি)",
    shortName: "জবি",
    englishName: "Jagannath University (JnU)",
    category: "general",
    categoryLabel: "সাধারণ বিশ্ববিদ্যালয়",
    location: "সদরঘাট, ঢাকা",
    applicationLink: "https://admission.jnu.ac.bd/",
    applicationProcess:
      "স্বতন্ত্র ভর্তি প্রক্রিয়ায় ১৫ নভেম্বর থেকে ১০ ডিসেম্বর ২০২৬ আবেদন চলবে। দ্বিতীয় বার পরীক্ষার্থী সুযোগ নেই।",
    startDate: "2026-11-15",
    endDate: "2026-12-10",
    admitCardDate: "",
    secondTimerAllowed: false,
    secondTimerDeduction: "সুযোগ নেই (শুধুমাত্র HSC 2026 ব্যাচ)",
    eligibleHscBatches: "শুধুমাত্র HSC 2026",
    circularStatus: "reported",
    statusNote:
      "আবেদন ১৫ নভেম্বর–১০ ডিসেম্বর ২০২৬। ভর্তি পরীক্ষা ১ জানুয়ারি A, ৮ জানুয়ারি E, ১৫ জানুয়ারি B, ২২ জানুয়ারি C, ২৩ জানুয়ারি ২০২৭ D—পূর্ণাঙ্গ সার্কুলার/সময় আলাদা করে যাচাইযোগ্য হলে পরে বসানো যাবে।",
    minGpa: {
      ssc: 3.5,
      hsc: 3.5,
      combined: 8.0,
      subjectMin: {
        english: 3.0,
      },
    },
    requiredSubjects: ["A ইউনিটে বিজ্ঞান; B ইউনিটে মানবিক; C ইউনিটে ব্যবসায়"],
    totalSeats: 2765,
    featured: true,
    logoBg: "bg-blue-800",
    logoLetter: "JnU",
    examUnits: [
      {
        unit: "A ইউনিট",
        title: "বিজ্ঞান ও লাইফ সায়েন্স অনুষদ",
        examDate: "2027-01-01",
        fee: "১২০০ টাকা",
      },
      {
        unit: "E ইউনিট",
        title: "চারুকলা অনুষদ",
        examDate: "2027-01-08",
        fee: "১২০০ টাকা",
      },
      {
        unit: "B ইউনিট",
        title: "কলা ও আইন অনুষদ",
        examDate: "2027-01-15",
        fee: "১২০০ টাকা",
      },
      {
        unit: "C ইউনিট",
        title: "ব্যবসায় শিক্ষা অনুষদ",
        examDate: "2027-01-22",
        fee: "১২০০ টাকা",
      },
      {
        unit: "D ইউনিট",
        title: "সামাজিক বিজ্ঞান অনুষদ",
        examDate: "2027-01-23",
        fee: "১২০০ টাকা",
      },
    ],
  },

  // 6. চট্টগ্রাম বিশ্ববিদ্যালয় (চবি) - CU
  {
    id: "cu",
    name: "চট্টগ্রাম বিশ্ববিদ্যালয় (চবি)",
    shortName: "চবি",
    englishName: "University of Chittagong (CU)",
    category: "general",
    categoryLabel: "সাধারণ বিশ্ববিদ্যালয়",
    location: "হাটহাজারী, চট্টগ্রাম",
    applicationLink: "https://admission.cu.ac.bd/",
    applicationProcess:
      "১৫ নভেম্বর থেকে ১০ ডিসেম্বর ২০২৬ আবেদন। ২য় বার পরীক্ষার্থীদের মোট অর্জিত স্কোর থেকে ৩ নম্বর কর্তন করা হয়।",
    startDate: "2026-11-15",
    endDate: "2026-12-10",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ ২য়-বার নম্বর কর্তন final circular অনুযায়ী যাচাই করতে হবে",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "আবেদন ১৫ নভেম্বর–১০ ডিসেম্বর ২০২৬। পরীক্ষা ২৯ জানুয়ারি C, ৩০ জানুয়ারি A, ৩ ফেব্রুয়ারি B1, ৪ ফেব্রুয়ারি B2, ৫ ফেব্রুয়ারি B, ৬ ফেব্রুয়ারি D ও ৮ ফেব্রুয়ারি ২০২৭ D1। ২য় বার নম্বর-কর্তনের বর্তমান হার পূর্ণাঙ্গ সার্কুলার সাপেক্ষে।",
    minGpa: {
      ssc: 3.5,
      hsc: 3.5,
      combined: 8.0,
      subjectMin: {
        physics: 3.5,
        chemistry: 3.5,
        math: 3.5,
      },
    },
    requiredSubjects: [
      "বিজ্ঞান বিভাগের জন্য বিজ্ঞান ইউনিট; মানবিক ও বাণিজ্যে গ্রুপভিত্তিক শর্ত",
    ],
    totalSeats: 4926,
    featured: true,
    logoBg: "bg-sky-800",
    logoLetter: "CU",
    examUnits: [
      {
        unit: "C ইউনিট",
        title: "ব্যবসায় প্রশাসন অনুষদ",
        examDate: "2027-01-29",
        fee: "১০০০ টাকা",
      },
      {
        unit: "A ইউনিট",
        title: "বিজ্ঞান, জীববিজ্ঞান, প্রকৌশল ও সমুদ্রবিজ্ঞান অনুষদ",
        examDate: "2027-01-30",
        fee: "১০০০ টাকা",
      },
      {
        unit: "B1 উপ-ইউনিট",
        title: "চারুকলা অনুষদ",
        examDate: "2027-02-03",
        fee: "১০০০ টাকা",
      },
      {
        unit: "B2 উপ-ইউনিট",
        title: "নাট্যকলা ও সংগীত",
        examDate: "2027-02-04",
        fee: "১০০০ টাকা",
      },
      {
        unit: "B ইউনিট",
        title: "কলা ও মানববিদ্যা অনুষদ",
        examDate: "2027-02-05",
        fee: "১০০০ টাকা",
      },
      {
        unit: "D ইউনিট",
        title: "সমাজবিজ্ঞান, আইন ও সমন্বিত অনুষদ",
        examDate: "2027-02-06",
        fee: "১০০০ টাকা",
      },
      {
        unit: "D1 উপ-ইউনিট",
        title: "শারীরিক শিক্ষা ও ক্রীড়া বিজ্ঞান",
        examDate: "2027-02-08",
        fee: "১০০০ টাকা",
      },
    ],
  },

  // 7. বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট) - BUET
  {
    id: "buet",
    name: "বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)",
    shortName: "বুয়েট",
    englishName: "BUET",
    category: "engineering",
    categoryLabel: "প্রকৌশল বিশ্ববিদ্যালয়",
    location: "পলাশী, ঢাকা",
    applicationLink: "https://ugadmission.buet.ac.bd/",
    applicationProcess:
      "ওয়েবসাইটে প্রবেশ করে প্রাথমিক আবেদন করতে হবে। ২য় বারের কোনো সুযোগ নেই (Current batch only)।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: false,
    secondTimerDeduction: "সুযোগ নেই (শুধুমাত্র ১ম বার)",
    eligibleHscBatches: "শুধুমাত্র HSC 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ স্নাতক ভর্তি পরীক্ষা ১৬ জানুয়ারি ২০২৭ নির্ধারিত/রিপোর্টেড। আবেদন ও প্রবেশপত্রের বর্তমান তারিখ এখানে অনুমান করে দেওয়া হয়নি।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 9.5,
      scienceOnly: true,
      subjectMin: {
        physics: 5.0,
        chemistry: 5.0,
        math: 5.0,
        english: 4.0,
      },
    },
    requiredSubjects: ["পদার্থবিজ্ঞান (A+)", "রসায়ন (A+)", "উচ্চতর গণিত (A+)"],
    totalSeats: 1305,
    featured: true,
    logoBg: "bg-emerald-900",
    logoLetter: "BUET",
    examUnits: [
      {
        unit: "প্রকৌশল ও স্থাপত্য মূল পরীক্ষা",
        title: "লিখিত পরীক্ষা (প্রকৌশল ও স্থাপত্য বিভাগসমূহ)",
        examDate: "2027-01-16",
        time: "সকাল ১০:০০ - ১:০০",
        fee: "১৫০০ টাকা",
      },
    ],
  },

  // 8. খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (কুয়েট) - KUET
  {
    id: "kuet",
    name: "খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (কুয়েট)",
    shortName: "কুয়েট",
    englishName: "Khulna University of Engineering & Technology (KUET)",
    category: "engineering",
    categoryLabel: "প্রকৌশল বিশ্ববিদ্যালয়",
    location: "তেরখাদা, ফুলবাড়ীগেট, খুলনা",
    applicationLink: "https://admission.kuet.ac.bd/",
    applicationProcess:
      "অনলাইনে আবেদন ফরম পূরণ। স্বতন্ত্র লিখিত পরীক্ষার মাধ্যমে শিক্ষার্থী নির্বাচন। ২য় বার সুযোগ নেই।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: false,
    secondTimerDeduction: "সুযোগ নেই (শুধুমাত্র ১ম বার)",
    eligibleHscBatches: "শুধুমাত্র HSC 2026",
    circularStatus: "confirmed",
    statusNote:
      "অফিশিয়াল UG Admission 2026–27 তথ্য অনুযায়ী ভর্তি পরীক্ষা ৮ জানুয়ারি ২০২৭; কেন্দ্র KUET, DU ও RUET। MCQ পদ্ধতি। আবেদন/অ্যাডমিট কার্ডের তারিখ আলাদা অফিসিয়াল সার্কুলারের সাপেক্ষে।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 9.0,
      scienceOnly: true,
      subjectMin: {
        physics: 4.5,
        chemistry: 4.5,
        math: 4.5,
        english: 3.5,
      },
    },
    requiredSubjects: ["পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত", "ইংরেজি"],
    totalSeats: 1065,
    featured: false,
    logoBg: "bg-teal-900",
    logoLetter: "KUET",
    examUnits: [
      {
        unit: "ভর্তি পরীক্ষা",
        title: "UG Admission Test (MCQ)",
        examDate: "2027-01-08",
        time: "তারিখ নিশ্চিত; সময় official circular অনুযায়ী",
        fee: "",
      },
    ],
  },

  // 9. রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (রুয়েট) - RUET
  {
    id: "ruet",
    name: "রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (রুয়েট)",
    shortName: "রুয়েট",
    englishName: "Rajshahi University of Engineering & Technology (RUET)",
    category: "engineering",
    categoryLabel: "প্রকৌশল বিশ্ববিদ্যালয়",
    location: "কাজলা, রাজশাহী",
    applicationLink: "https://admission.ruet.ac.bd/",
    applicationProcess:
      "অনলাইনে ফর্ম পূরণ করে ফি জমা দিন। স্টিয়ারিং কমিটির সম্ভাব্য তারিখ অনুযায়ী পরীক্ষা অনুষ্ঠিত হবে।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: false,
    secondTimerDeduction: "সুযোগ নেই (শুধুমাত্র ১ম বার)",
    eligibleHscBatches: "শুধুমাত্র HSC 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ ভর্তি পরীক্ষার ১৪ জানুয়ারি ২০২৭ তারিখ রিপোর্টেড/সম্ভাব্য; চূড়ান্ত অফিসিয়াল সার্কুলার ছাড়া এটিকে চূড়ান্ত ধরা যাবে না।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 9.0,
      scienceOnly: true,
      subjectMin: {
        physics: 4.5,
        chemistry: 4.5,
        math: 4.5,
        english: 3.5,
      },
    },
    requiredSubjects: ["পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত"],
    totalSeats: 1235,
    featured: false,
    logoBg: "bg-orange-800",
    logoLetter: "RUET",
    examUnits: [
      {
        unit: "সম্ভাব্য ভর্তি পরীক্ষা",
        title: "ইঞ্জিনিয়ারিং ও URP",
        examDate: "2027-01-14",
        fee: "১২৫০ টাকা",
      },
    ],
  },

  // 10. চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (চুয়েট) - CUET
  {
    id: "cuet",
    name: "চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (চুয়েট)",
    shortName: "চুয়েট",
    englishName: "Chittagong University of Engineering & Technology (CUET)",
    category: "engineering",
    categoryLabel: "প্রকৌশল বিশ্ববিদ্যালয়",
    location: "রাউজান, চট্টগ্রাম",
    applicationLink: "https://cuet.ac.bd/admission",
    applicationProcess:
      "অনলাইনে আবেদন ফরম পূরণ। শুধুমাত্র বর্তমান ব্যাচের বিজ্ঞান শিক্ষার্থীরা যোগ্য।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: false,
    secondTimerDeduction: "সুযোগ নেই (শুধুমাত্র ১ম বার)",
    eligibleHscBatches: "শুধুমাত্র HSC 2026",
    circularStatus: "awaiting_circular",
    statusNote:
      "বর্তমান অফিসিয়াল admission page-এ এখনো ২০২৬–২৭ undergraduate admission test scheduled দেখানো হয়নি; নতুন official notice এলে আপডেট করতে হবে।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 9.0,
      scienceOnly: true,
      subjectMin: {
        physics: 4.5,
        chemistry: 4.5,
        math: 4.5,
        english: 3.5,
      },
    },
    requiredSubjects: ["পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত"],
    totalSeats: 920,
    featured: false,
    logoBg: "bg-cyan-900",
    logoLetter: "CUET",
    examUnits: [],
  },

  // 11. মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজি (MIST)
  {
    id: "mist",
    name: "মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজি (এমআইএসটি)",
    shortName: "এমআইএসটি",
    englishName: "Military Institute of Science and Technology (MIST)",
    category: "engineering",
    categoryLabel: "প্রকৌশল প্রতিষ্ঠান",
    location: "মিরপুর সেনানিবাস, ঢাকা",
    applicationLink: "https://admission.mist.ac.bd/",
    applicationProcess:
      "অনলাইনে ফরম পূরণ। ২য় বার পরীক্ষার্থীদের ক্ষেত্রে ৫% নম্বর কর্তনের বিধান বিদ্যমান।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction: "২য় বার পরীক্ষার্থীদের ৫% নম্বর কর্তন প্রযোজ্য",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ ভর্তি পরীক্ষা ১৮ ডিসেম্বর C (স্থাপত্য) এবং ১৯ ডিসেম্বর A+B (ইঞ্জিনিয়ারিং) রিপোর্টেড। পূর্ণাঙ্গ বর্তমান circular-এর সব field আলাদা করে না পাওয়া পর্যন্ত আবেদন/অ্যাডমিট তারিখ খালি রাখা হয়েছে।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 9.0,
      scienceOnly: true,
      subjectMin: {
        physics: 4.0,
        chemistry: 4.0,
        math: 4.0,
        english: 3.5,
      },
    },
    requiredSubjects: ["পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত", "ইংরেজি"],
    totalSeats: 900,
    featured: false,
    logoBg: "bg-amber-900",
    logoLetter: "MIST",
    examUnits: [
      {
        unit: "ইউনিট C (স্থাপত্য)",
        title: "আর্কিটেকচার ড্রয়িং ও অ্যাপটিচিউড পরীক্ষা",
        examDate: "2026-12-18",
        fee: "১৫০০ টাকা",
      },
      {
        unit: "ইউনিট A ও B (প্রকৌশল)",
        title: "ইঞ্জিনিয়ারিং বিভাগসমূহ",
        examDate: "2026-12-19",
        fee: "১২০০ টাকা",
      },
    ],
  },

  // 12. এভিয়েশন অ্যান্ড অ্যারোস্পেস বিশ্ববিদ্যালয়, বাংলাদেশ (AAUB)
  {
    id: "aaub",
    name: "এভিয়েশন অ্যান্ড অ্যারোস্পেস বিশ্ববিদ্যালয়, বাংলাদেশ (এএইউবি)",
    shortName: "এভিয়েশন বিশ্ববিদ্যালয় (AAUB)",
    englishName: "Aviation and Aerospace University, Bangladesh (AAUB)",
    category: "specialized",
    categoryLabel: "বিশেষায়িত বিশ্ববিদ্যালয়",
    location: "লালমনিরহাট ক্যাম্পাস ও বিএএফ শাহীন কলেজ ঢাকা",
    applicationLink: "https://www.aaub.edu.bd/public/content/admission-info",
    applicationProcess:
      "অনলাইনে রেজিস্ট্রেশন সম্পন্ন করে ফি প্রদান করুন। ২য় বার সুযোগ প্রযোজ্য।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "confirmed",
    statusNote:
      "অফিশিয়াল admission-info অনুযায়ী ২০২৬–২৭ undergraduate admission test ৫ ডিসেম্বর ২০২৬; পরীক্ষা BAF Shaheen College Dhaka এবং Lalmonirhat campus-এ। আবেদন window-এর তারিখ এখানে অনুমান করা হয়নি।",
    minGpa: {
      ssc: 4.5,
      hsc: 4.5,
      combined: 9.0,
      scienceOnly: true,
      subjectMin: {
        physics: 4.5,
        chemistry: 4.0,
        math: 4.5,
        english: 4.0,
      },
    },
    requiredSubjects: ["পদার্থবিজ্ঞান", "উচ্চতর গণিত", "রসায়ন", "ইংরেজি"],
    totalSeats: 250,
    featured: false,
    logoBg: "bg-sky-900",
    logoLetter: "AAUB",
    examUnits: [
      {
        unit: "স্নাতক ভর্তি পরীক্ষা",
        title: "এয়ারোস্পেস, এভিয়েশন অপারেশনস ও ইঞ্জিনিয়ারিং",
        examDate: "2026-12-05",
        time: "সকাল ১০:০০ - ১২:০০",
        fee: "১২০০ টাকা",
      },
    ],
  },

  // 13. কৃষি গুচ্ছ বিশ্ববিদ্যালয় (৯টি কৃষি বিশ্ববিদ্যালয়)
  {
    id: "agri-cluster",
    name: "কৃষি গুচ্ছ বিশ্ববিদ্যালয় (৯টি পাবলিক কৃষি বিশ্ববিদ্যালয়)",
    shortName: "কৃষি গুচ্ছ",
    englishName:
      "Agricultural University Cluster (9 Universities - BAU, SAU, GAU, PSTU, CVASU, etc.)",
    category: "agricultural",
    categoryLabel: "কৃষি বিশ্ববিদ্যালয়",
    location:
      "শেরেবাংলা কৃষি বিশ্ববিদ্যালয় (সমন্বয়ক) ও দেশব্যাপী ৯টি কেন্দ্র",
    applicationLink: "https://acas.edu.bd/",
    applicationProcess:
      "শেকৃবি-র সমন্বয়ে একক আবেদনে ৯টি কৃষি বিশ্ববিদ্যালয়ে ভর্তি। ২য় বার পরীক্ষার্থীদের পূর্ণ সমসুযোগ।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ কৃষি গুচ্ছ ভর্তি পরীক্ষা ২ জানুয়ারি ২০২৭; ৯টি কৃষি বিশ্ববিদ্যালয়ের সমন্বিত পরীক্ষা। বিস্তারিত আবেদন, যোগ্যতা, আসন ও কেন্দ্রের তথ্য আলাদা official notice-এ এলে sync করতে হবে।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 8.5,
      scienceOnly: true,
      subjectMin: {
        physics: 3.5,
        chemistry: 3.5,
        math: 3.5,
        biology: 4.0,
        english: 3.0,
      },
    },
    requiredSubjects: [
      "৪র্থ বিষয় বাদে জিপিএ গণনা; জীববিজ্ঞান (GP ৪.০+), পদার্থ, রসায়ন, গণিত",
    ],
    totalSeats: 3718,
    featured: true,
    logoBg: "bg-green-800",
    logoLetter: "AGRI",
    examUnits: [
      {
        unit: "একক ভর্তি পরীক্ষা",
        title: "কৃষি গুচ্ছের সমন্বিত ভর্তি পরীক্ষা (৯ বিশ্ববিদ্যালয়)",
        examDate: "2027-01-02",
        time: "সময় official notice অনুযায়ী",
        fee: "১২০০ টাকা",
      },
    ],
  },

  // 14. বাংলাদেশ ইউনিভার্সিটি অব প্রফেশনালস (বিইউপি) - BUP
  {
    id: "bup",
    name: "বাংলাদেশ ইউনিভার্সিটি অব প্রফেশনালস (বিইউপি)",
    shortName: "বিইউপি",
    englishName: "Bangladesh University of Professionals (BUP)",
    category: "specialized",
    categoryLabel: "বিশেষায়িত বিশ্ববিদ্যালয়",
    location: "মিরপুর সেনানিবাস, ঢাকা",
    applicationLink: "https://admission.bup.edu.bd/",
    applicationProcess:
      "অনলাইনে রেজিস্ট্রেশন করে প্রবেশপত্র সংগ্রহ করুন। ২য় বার পরীক্ষার্থীরা সমানভাবে যোগ্য।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "confirmed",
    statusNote:
      "অফিশিয়াল ২০২৬–২৭ notice অনুযায়ী FBS ১ ও ৯ জানুয়ারি ২০২৭; FASS ২ জানুয়ারি; FET, FMS ও FSSS ৮ জানুয়ারি। পূর্ণাঙ্গ application window/admit-card date এখানে অনুমান করা হয়নি।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 8.5,
      subjectMin: {
        english: 4.0,
      },
    },
    requiredSubjects: [
      "অনুষদ অনুসারে নির্দিষ্ট বিষয় আবশ্যক; ইংরেজিতে ভালো দক্ষতা",
    ],
    totalSeats: 1450,
    featured: false,
    logoBg: "bg-blue-900",
    logoLetter: "BUP",
    examUnits: [
      {
        unit: "FBS",
        title: "Faculty of Business Studies",
        examDate: "2027-01-01",
        fee: "১১০০ টাকা",
      },
      {
        unit: "FASS",
        title: "Faculty of Arts & Social Sciences",
        examDate: "2027-01-02",
        fee: "১১০০ টাকা",
      },
      {
        unit: "FET",
        title: "Faculty of Engineering & Technology",
        examDate: "2027-01-08",
        fee: "১১০০ টাকা",
      },
      {
        unit: "FMS",
        title: "Faculty of Medical Studies",
        examDate: "2027-01-08",
        fee: "১১০০ টাকা",
      },
      {
        unit: "FSSS",
        title: "Faculty of Security & Strategic Studies",
        examDate: "2027-01-08",
        fee: "১১০০ টাকা",
      },
      {
        unit: "FBS (২য় সেশন)",
        title: "Faculty of Business Studies",
        examDate: "2027-01-09",
        fee: "১১০০ টাকা",
      },
    ],
  },

  // 15. হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (হাবিপ্রবি) - HSTU
  {
    id: "hstu",
    name: "হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (হাবিপ্রবি)",
    shortName: "হাবিপ্রবি",
    englishName:
      "Hajee Mohammad Danesh Science and Technology University (HSTU)",
    category: "general",
    categoryLabel: "বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়",
    location: "দিনাজপুর",
    applicationLink: "https://hstu.ac.bd/admission",
    applicationProcess:
      "অনলাইনে আবেদন ফরম পূরণ। ২য় বারের পরীক্ষার্থীদের সুযোগ রয়েছে।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "confirmed",
    statusNote:
      "অফিশিয়াল HSTU homepage অনুযায়ী ২০২৭ শিক্ষাবর্ষের ভর্তি পরীক্ষা ২৪–২৮ জানুয়ারি ২০২৭ window-এ। নির্দিষ্ট ইউনিট/দিন/আবেদনের সময়সূচি official circular অনুযায়ী পরে বসানো উচিত।",
    minGpa: {
      ssc: 3.5,
      hsc: 3.5,
      combined: 7.5,
      subjectMin: {
        physics: 3.0,
        chemistry: 3.0,
        biology: 3.0,
      },
    },
    requiredSubjects: [
      "বিজ্ঞান বিভাগের জন্য বিজ্ঞান ইউনিট; সাধারণ অনুষদে সকল গ্রুপ",
    ],
    totalSeats: 2100,
    featured: false,
    logoBg: "bg-teal-800",
    logoLetter: "HSTU",
    examUnits: [],
  },

  // 16. শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (শাবিপ্রবি) - SUST
  {
    id: "sust",
    name: "শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (শাবিপ্রবি)",
    shortName: "শাবিপ্রবি",
    englishName: "Shahjalal University of Science and Technology (SUST)",
    category: "general",
    categoryLabel: "বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়",
    location: "কুমারগাঁও, সিলেট",
    applicationLink: "https://admission.sust.edu.bd/",
    applicationProcess:
      "অনলাইন পোর্টালের মাধ্যমে রেজিস্ট্রেশন সম্পন্ন করে আবেদন করুন। ২য় বার সুযোগ প্রযোজ্য।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ scoring adjustment final circular অনুযায়ী যাচাই করতে হবে",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ ভর্তি পরীক্ষা ২৬ ও ২৭ জানুয়ারি ২০২৭ রিপোর্টেড। পূর্ণাঙ্গ আবেদন, যোগ্যতা ও ২য় বার scoring adjustment final circular সাপেক্ষে।",
    minGpa: {
      ssc: 3.0,
      hsc: 3.0,
      combined: 6.5,
      subjectMin: {
        math: 3.0,
        physics: 3.0,
      },
    },
    requiredSubjects: ["A ইউনিটে বিজ্ঞান; B ইউনিটে মানবিক ও বাণিজ্য"],
    totalSeats: 1640,
    featured: false,
    logoBg: "bg-cyan-900",
    logoLetter: "SUST",
    examUnits: [
      {
        unit: "A ইউনিট (বিজ্ঞান)",
        title: "ফলিত বিজ্ঞান, প্রকৌশল ও জীববিজ্ঞান",
        examDate: "2027-01-26",
        fee: "১২০০ টাকা",
      },
      {
        unit: "B ইউনিট (মানবিক ও বাণিজ্য)",
        title: "সামাজিক বিজ্ঞান ও ব্যবসায় প্রশাসন",
        examDate: "2027-01-27",
        fee: "১২০০ টাকা",
      },
    ],
  },

  // 17. বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয় (বুটেক্স) - BUTEX
  {
    id: "butex",
    name: "বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয় (বুটেক্স)",
    shortName: "বুটেক্স",
    englishName: "Bangladesh University of Textiles (BUTEX)",
    category: "engineering",
    categoryLabel: "প্রকৌশল বিশ্ববিদ্যালয়",
    location: "তেজগাঁও, ঢাকা",
    applicationLink: "https://butex.edu.bd/admissions/",
    applicationProcess:
      "ওয়েবসাইট থেকে আবেদন পূরণ করুন। বুটেক্সের নিজস্ব বিধানে ২য় বার সুযোগ নেই (Current year HSC only)।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: false,
    secondTimerDeduction: "সুযোগ নেই (শুধুমাত্র বর্তমান ব্যাচ)",
    eligibleHscBatches: "শুধুমাত্র HSC 2026",
    circularStatus: "confirmed",
    statusNote:
      "অফিশিয়াল BUTEX notice অনুযায়ী ২০২৬–২৭ BSc in Textile Engineering Level-1 Term-1 admission test ২৯ জানুয়ারি ২০২৭। আবেদন window/admit-card date এখানে অনুমান করা হয়নি।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 9.0,
      scienceOnly: true,
      subjectMin: {
        physics: 4.5,
        chemistry: 4.5,
        math: 4.5,
      },
    },
    requiredSubjects: ["পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত"],
    totalSeats: 600,
    featured: false,
    logoBg: "bg-sky-900",
    logoLetter: "BUTEX",
    examUnits: [
      {
        unit: "লিখিত পরীক্ষা",
        title: "BSc in Textile Engineering Level-1 Term-1 admission test",
        examDate: "2027-01-29",
        time: "সকাল ১০:০০ - ১২:০০",
        fee: "১২০০ টাকা",
      },
    ],
  },

  // 18. কুমিল্লা বিশ্ববিদ্যালয় (কুবি) - CoU
  {
    id: "cou",
    name: "কুমিল্লা বিশ্ববিদ্যালয় (কুবি)",
    shortName: "কুবি",
    englishName: "Comilla University (CoU)",
    category: "general",
    categoryLabel: "সাধারণ বিশ্ববিদ্যালয়",
    location: "কোটবাড়ী, কুমিল্লা",
    applicationLink: "https://cou.ac.bd/admission",
    applicationProcess:
      "স্বতন্ত্র ভর্তি প্রক্রিয়ায় আবেদন। দ্বিতীয় বার পরীক্ষার্থীদের সুযোগ অনুমোদিত।",
    startDate: "2026-11-15",
    endDate: "2026-12-10",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "আবেদন ১৫ নভেম্বর–১০ ডিসেম্বর ২০২৬; ভর্তি পরীক্ষা ৫, ৬ ও ৭ ফেব্রুয়ারি ২০২৭। পরীক্ষাকেন্দ্র হিসেবে কুমিল্লা, চট্টগ্রাম ও রাজশাহী রিপোর্টেড।",
    minGpa: {
      ssc: 3.0,
      hsc: 3.0,
      combined: 7.0,
      subjectMin: {
        physics: 3.0,
        chemistry: 3.0,
      },
    },
    requiredSubjects: [
      "বিজ্ঞান অনুষদের জন্য বিজ্ঞান; কলা ও বাণিজ্যে বিভাগীয় ন্যূনতম শর্ত",
    ],
    totalSeats: 1040,
    featured: false,
    logoBg: "bg-cyan-800",
    logoLetter: "CoU",
    examUnits: [
      {
        unit: "A ইউনিট",
        title: "বিজ্ঞান ও প্রকৌশল অনুষদ",
        examDate: "2027-02-05",
        fee: "১০০০ টাকা",
      },
      {
        unit: "B ইউনিট",
        title: "কলা ও সামাজিক বিজ্ঞান",
        examDate: "2027-02-06",
        time: "বিকাল ৩:০০",
        fee: "১০০০ টাকা",
      },
      {
        unit: "C ইউনিট",
        title: "ব্যবসায় শিক্ষা",
        examDate: "2027-02-07",
        time: "সকাল ১১:০০",
        fee: "১০০০ টাকা",
      },
    ],
  },

  // 19. বাংলাদেশ মেরিটাইম বিশ্ববিদ্যালয় (বিএমইউ) - BMU
  {
    id: "bmu",
    name: "বাংলাদেশ মেরিটাইম বিশ্ববিদ্যালয় (বিএমইউ)",
    shortName: "মেরিটাইম বিশ্ববিদ্যালয় (BMU)",
    englishName: "Bangladesh Maritime University (BMU)",
    category: "specialized",
    categoryLabel: "বিশেষায়িত বিশ্ববিদ্যালয়",
    location: "পল্লবী, মিরপুর, ঢাকা ও চট্টগ্রাম স্থায়ী ক্যাম্পাস",
    applicationLink: "https://applyonline.bmu.edu.bd/",
    applicationProcess:
      "অনলাইনে আবেদন ফরম পূরণ। ২য় বার পরীক্ষার্থীদের সুযোগ রয়েছে (নেগেটিভ মার্কিং ০.২৫)।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২য়-বার eligibility/marking current circular অনুযায়ী যাচাই করতে হবে; negative marking policy-ও final circular সাপেক্ষে",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "awaiting_circular",
    statusNote:
      "বর্তমান official BMU admission pages-এ এখনো ২০২৬–২৭ undergraduate circular পাওয়া যায়নি; সর্বশেষ দৃশ্যমান তথ্য আগের ২০২৫–২৬ cycle-এর। নতুন circular এলে dates/eligibility/fee replace করতে হবে।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 8.5,
      subjectMin: {
        physics: 4.0,
        chemistry: 3.5,
        math: 4.0,
        english: 3.5,
      },
    },
    requiredSubjects: [
      "নেভাল আর্কিটেকচারের জন্য গণিত ও পদার্থবিজ্ঞান বাধ্যতামূলক",
    ],
    totalSeats: 300,
    featured: false,
    logoBg: "bg-blue-950",
    logoLetter: "BMU",
    examUnits: [],
  },

  // 20. গুচ্ছ সাধারণ ও বিজ্ঞান প্রযুক্তি (GST Cluster - ২০ বিশ্ববিদ্যালয়)
  {
    id: "gst",
    name: "গুচ্ছ সাধারণ ও বিজ্ঞান প্রযুক্তি (GST Cluster - ২০টি পাবলিক বিশ্ববিদ্যালয়)",
    shortName: "জিএসটি গুচ্ছ (GST)",
    englishName:
      "GST General, Science & Technology Cluster (20 Universities - IU, MBSTU, PSTU, NSTU, JUST, etc.)",
    category: "cluster",
    categoryLabel: "গুচ্ছ বিশ্ববিদ্যালয়",
    location: "দেশব্যাপী পরীক্ষা কেন্দ্র (২০টি বিশ্ববিদ্যালয়)",
    applicationLink: "https://gstadmission.ac.bd/",
    applicationProcess:
      "এক আবেদনেই ২০টি পাবলিক বিশ্ববিদ্যালয়ে ভর্তির সুযোগ। ২য় বার পরীক্ষার্থীরা স্পষ্টভাবে সুযোগ পাবেন।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ circular অনুযায়ী যাচাইযোগ্য; বর্তমান তথ্য final ধরা যাবে না",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "reported",
    statusNote:
      "২০২৬–২৭ GST পরীক্ষার তারিখ: B ইউনিট ১৯ মার্চ, C ইউনিট ২০ মার্চ এবং A ইউনিট ২৭ মার্চ ২০২৭। প্রাথমিকভাবে ২০টি বিশ্ববিদ্যালয়; final participating list/circular প্রকাশ হলে sync করতে হবে।",
    minGpa: {
      ssc: 3.5,
      hsc: 3.5,
      combined: 7.5,
      subjectMin: {
        physics: 3.0,
        chemistry: 3.0,
      },
    },
    requiredSubjects: ["বিজ্ঞান ইউনিটের জন্য পদার্থ ও রসায়ন বাধ্যতামূলক"],
    totalSeats: 21500,
    featured: true,
    logoBg: "bg-emerald-700",
    logoLetter: "GST",
    examUnits: [
      {
        unit: "B ইউনিট (মানবিক)",
        title: "মানবিক ও সামাজিক বিজ্ঞান শাখা",
        examDate: "2027-03-19",
        fee: "১৫০০ টাকা",
      },
      {
        unit: "C ইউনিট (বাণিজ্য)",
        title: "ব্যবসায় শিক্ষা শাখা",
        examDate: "2027-03-20",
        fee: "১৫০০ টাকা",
      },
      {
        unit: "A ইউনিট (বিজ্ঞান)",
        title: "বিজ্ঞান ও প্রকৌশল শাখা",
        examDate: "2027-03-27",
        fee: "১৫০০ টাকা",
      },
    ],
  },

  // 21. সরকারি মেডিকেল কলেজ (এমবিবিএস ও বিডিএস)
  {
    id: "medical",
    name: "সরকারি মেডিকেল কলেজ (এমবিবিএস ও বিডিএস)",
    shortName: "মেডিকেল ও বিডিএস",
    englishName: "Government Medical Colleges (MBBS/BDS)",
    category: "medical",
    categoryLabel: "মেডিকেল ও ডেন্টাল",
    location: "সারা বাংলাদেশ (৩৭টি সরকারি মেডিকেল কলেজ)",
    applicationLink: "http://dgme.teletalk.com.bd/",
    applicationProcess:
      "টেলিটক ওয়েবসাইটে গিয়ে পছন্দক্রম দিয়ে আবেদন করুন। ২য় বার পরীক্ষার্থীদের ক্ষেত্রে ৫ নম্বর কর্তন করা হয়।",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    secondTimerAllowed: true,
    secondTimerDeduction:
      "২০২৬–২৭ MBBS/BDS ২য়-বার deduction current national circular অনুযায়ী যাচাই করতে হবে",
    eligibleHscBatches: "HSC 2025 ও 2026",
    circularStatus: "awaiting_circular",
    statusNote:
      "২৫ সেপ্টেম্বর ২০২৬ পর্যন্ত ২০২৬–২৭ MBBS/BDS জাতীয় ভর্তি circular-এর বর্তমান official schedule এখানে নিশ্চিতভাবে পাওয়া যায়নি; আগের cycle-এর ২য়-বার deduction বা exam date current rule হিসেবে দেখানো হয়নি।",
    minGpa: {
      ssc: 4.0,
      hsc: 4.0,
      combined: 9.0,
      scienceOnly: true,
      subjectMin: {
        biology: 4.0,
        physics: 3.5,
        chemistry: 3.5,
      },
    },
    requiredSubjects: [
      "জীববিজ্ঞান (ন্যূনতম GP ৪.০ আবশ্যক)",
      "রসায়ন",
      "পদার্থবিজ্ঞান",
    ],
    totalSeats: 5380,
    featured: true,
    logoBg: "bg-teal-700",
    logoLetter: "MED",
    examUnits: [],
  },
];
