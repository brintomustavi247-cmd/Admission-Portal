import { describe, expect, it } from "vitest";
import {
  calculateUrgency,
  formatBanglaDate,
  formatBanglaGpa,
  toBanglaNum,
} from "../src/lib/banglaUtils";

/* local-date helper — timezone-independent YYYY-MM-DD */
const dateFromToday = (offsetDays: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

describe("toBanglaNum", () => {
  it("ইংরেজি digit → বাংলা digit", () => {
    expect(toBanglaNum(2026)).toBe("২০২৬");
    expect(toBanglaNum("12.50")).toBe("১২.৫০");
  });

  it("খালি/অনির্ধারিত value → ০", () => {
    expect(toBanglaNum(null)).toBe("০");
    expect(toBanglaNum(undefined)).toBe("০");
    expect(toBanglaNum("")).toBe("০");
  });
});

describe("formatBanglaGpa", () => {
  it("২ decimal-এ বাংলা GPA", () => {
    expect(formatBanglaGpa(4)).toBe("৪.০০");
    expect(formatBanglaGpa("3.5")).toBe("৩.৫০");
  });

  it("invalid value হলে original ফেরত", () => {
    expect(formatBanglaGpa("N/A")).toBe("N/A");
  });
});

describe("formatBanglaDate", () => {
  it("YYYY-MM-DD → বাংলা তারিখ", () => {
    expect(formatBanglaDate("2026-11-11")).toBe("১১ নভেম্বর ২০২৬");
    expect(formatBanglaDate("2026-01-05")).toBe("৫ জানুয়ারি ২০২৬");
  });

  it("খালি তারিখ + বাংলা string অপরিবর্তিত", () => {
    expect(formatBanglaDate("")).toBe("তারিখ ঘোষণা হয়নি");
    expect(formatBanglaDate("চলতি মাসে")).toBe("চলতি মাসে");
  });
});

describe("calculateUrgency", () => {
  it("দুটো তারিখই খালি → কখনো ongoing নয়", () => {
    const u = calculateUrgency("", "");
    expect(u.status).toBe("upcoming");
    expect(u.badgeText).toBe("তারিখ ঘোষণার অপেক্ষায়");
    expect(u.isUrgent).toBe(false);
  });

  it("শেষ তারিখ পেরিয়ে গেলে → ended", () => {
    const u = calculateUrgency(dateFromToday(-20), dateFromToday(-5));
    expect(u.status).toBe("ended");
    expect(u.badgeText).toBe("আবেদন সমাপ্ত");
  });

  it("শুরু ভবিষ্যতে → upcoming", () => {
    const u = calculateUrgency(dateFromToday(10), dateFromToday(30));
    expect(u.status).toBe("upcoming");
    expect(u.badgeText).toContain("দিন পর শুরু");
  });

  it("শুরু হয়েছে কিন্তু শেষ তারিখ নেই → ongoing", () => {
    const u = calculateUrgency(dateFromToday(-3), "");
    expect(u.status).toBe("ongoing");
    expect(u.badgeText).toContain("শেষ তারিখ ঘোষণা হয়নি");
  });

  it("শেষ হতে ৩ দিন বা কম → urgent", () => {
    const u = calculateUrgency(dateFromToday(-2), dateFromToday(2));
    expect(u.status).toBe("ongoing");
    expect(u.isUrgent).toBe(true);
    expect(u.daysRemaining).toBeLessThanOrEqual(3);
  });

  it("৭ দিনের বেশি বাকি → not urgent", () => {
    const u = calculateUrgency(dateFromToday(-2), dateFromToday(20));
    expect(u.status).toBe("ongoing");
    expect(u.isUrgent).toBe(false);
    expect(u.daysRemaining).toBeGreaterThan(7);
  });
});
