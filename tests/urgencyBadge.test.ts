import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { UrgencyBadge } from "../src/components/UrgencyBadge";

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

/* badge → শুধু text (icon/span tag বাদ) */
const badgeText = (startDate?: string, endDate?: string) =>
  renderToStaticMarkup(createElement(UrgencyBadge, { startDate, endDate }))
    .replace(/<[^>]*>/g, "")
    .trim();

describe("UrgencyBadge — ৪টা স্পষ্ট state", () => {
  it("দুটো তারিখই খালি → 'তারিখ ঘোষণার অপেক্ষায়' (ongoing দাবি করে না)", () => {
    expect(badgeText("", "")).toBe("তারিখ ঘোষণার অপেক্ষায়");
  });

  it("শুরু ভবিষ্যতে → 'শুরু হবে X দিন পর' (exact দিন, বাংলা digit)", () => {
    expect(badgeText(dateFromToday(40), dateFromToday(54))).toBe(
      "শুরু হবে ৪০ দিন পর",
    );
    /* ASCII digit leak করা যাবে না */
    expect(badgeText(dateFromToday(40), dateFromToday(54))).not.toMatch(/[0-9]/);
  });

  it("চলমান → 'আবেদন চলমান · শেষ হবে X দিনে'", () => {
    expect(badgeText(dateFromToday(-2), dateFromToday(5))).toBe(
      "আবেদন চলমান · শেষ হবে ৫ দিনে",
    );
  });

  it("শেষ তারিখ পেরিয়ে গেলে → 'আবেদন সময়সীমা শেষ' (ambiguous নয়)", () => {
    expect(badgeText(dateFromToday(-30), dateFromToday(-10))).toBe(
      "আবেদন সময়সীমা শেষ",
    );
  });

  it("শুরু হয়েছে কিন্তু শেষ তারিখ নেই → 'শেষ' বলে না", () => {
    const text = badgeText(dateFromToday(-3), "");
    expect(text).toBe("আবেদন চলমান · শেষ তারিখ ঘোষণা হয়নি");
    expect(text).not.toContain("সময়সীমা শেষ");
  });

  it("শুরু তারিখ নেই কিন্তু deadline ভবিষ্যতে → 'শেষ' বলে না", () => {
    const text = badgeText("", dateFromToday(10));
    expect(text).toBe("আবেদন চলমান · শেষ হবে ১০ দিনে");
  });

  it("unparseable/invalid তারিখ → crash না করে 'তারিখ ঘোষণার অপেক্ষায়'", () => {
    expect(badgeText("চলতি মাসে", "")).toBe("তারিখ ঘোষণার অপেক্ষায়");
  });
});
