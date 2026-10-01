/**
 * NEWS FILTER — undergraduate admission relevance
 * পিএইচডি / এমফিল / মাস্টার্স / স্নাতকোত্তর সংক্রান্ত news undergraduate
 * admission card-এ breaking update হিসেবে দেখানো হবে না (RUET-এ ভুল PG
 * news দেখানোর সমস্যা থেকে)।
 */
const PG_KEYWORDS = [
  "পিএইচডি",
  "এমফিল",
  "মাস্টার্স",
  "স্নাতকোত্তর",
  "phd",
  "mphil",
  "master",
];

/** title না থাকলে relevant ধরা হয়; PG keyword পেলে false */
export const isUndergradRelevant = (title?: string): boolean =>
  !title ||
  !PG_KEYWORDS.some((k) => title.toLowerCase().includes(k.toLowerCase()));
