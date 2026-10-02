import { describe, expect, it } from "vitest";
import { initialUniversitiesData } from "../src/data/mockUniversities";
import { VENUE_POLICY_2026_27 } from "../src/data/venuePolicy2026";
import {
  resolveCalculator,
  resolveRegions,
  resolveSession,
  resolveVenuePolicy,
} from "../src/lib/dataResolver";
import { isUndergradRelevant } from "../src/lib/newsFilter";
import { University } from "../src/types/admission";

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

const byId = (id: string) => {
  const u = initialUniversitiesData.find((x) => x.id === id);
  if (!u) throw new Error(`university not found: ${id}`);
  return u;
};

const allDates = (id: string) => {
  const u = byId(id);
  return [u.startDate, u.endDate, ...(u.examUnits || []).map((e) => e.examDate)]
    .filter(Boolean)
    .join(" ");
};

/* resolveSession-এর expired logic time-independent ভাবে test করতে fake uni */
const fakeUni = (over: Partial<University>): University =>
  ({
    id: "x",
    name: "x",
    shortName: "x",
    englishName: "x",
    category: "general",
    categoryLabel: "",
    location: "",
    applicationLink: "",
    applicationProcess: "",
    startDate: "",
    endDate: "",
    admitCardDate: "",
    examUnits: [],
    secondTimerAllowed: false,
    minGpa: { ssc: 0, hsc: 0, combined: 0 },
    requiredSubjects: [],
    ...over,
  }) as University;

describe("2026-27 dataset — DU / JU stale 2025 data নেই", () => {
  it("DU: আবেদন ১১-২৫ নভেম্বর ২০২৬, session 2026-27", () => {
    const du = byId("du");
    expect(du.startDate).toBe("2026-11-11");
    expect(du.endDate).toBe("2026-11-25");
    expect(du.sessionYear).toBe("2026-27");
  });

  it("DU: IBA ৫ ডিসেম্বর ২০২৬, ক ইউনিট ১২ ডিসেম্বর ২০২৬ (units rebuilt)", () => {
    const units = byId("du").examUnits;
    expect(units[0]).toMatchObject({ unit: "আইবিএ", examDate: "2026-12-05" });
    expect(
      units.some((u) => u.unit === "ক ইউনিট" && u.examDate === "2026-12-12"),
    ).toBe(true);
  });

  it("JU: আবেদনের তারিখ ঘোষিত হয়নি + পরীক্ষা ১৭ জানুয়ারি ২০২৭ (প্রস্তাবিত)", () => {
    const ju = byId("ju");
    expect(ju.startDate).toBe("");
    expect(ju.endDate).toBe("");
    expect(ju.circularStatus).toBe("reported");
    expect(ju.sessionYear).toBe("2026-27");
    expect(ju.examUnits).toHaveLength(1);
    expect(ju.examUnits[0].examDate).toBe("2027-01-17");
  });

  it("পুরো dataset-এ 2025 বা তার আগের কোনো date নেই", () => {
    const stale = initialUniversitiesData
      .filter((u) => /\b202[0-5]-\d{2}-\d{2}/.test(allDates(u.id)))
      .map((u) => u.id);
    expect(stale).toEqual([]);
  });
});

describe("hybrid resolver + KB venue policy wiring", () => {
  it("প্রতিটি uni-র জন্য KB venue policy entry আছে", () => {
    const missing = initialUniversitiesData
      .filter((u) => !VENUE_POLICY_2026_27[u.id])
      .map((u) => u.id);
    expect(missing).toEqual([]);
  });

  it("DU/JU static session 2026-27 ধরে (2025 নয়)", () => {
    expect(resolveSession(byId("du")).year).toBe("2026-27");
    expect(resolveSession(byId("ju")).year).toBe("2026-27");
    expect(resolveSession(byId("du")).source).toBe("static_fallback");
  });

  it("expired logic: সব date অতীতে → expired, ভবিষ্যতে → নয়", () => {
    const future = fakeUni({
      sessionYear: "2026-27",
      endDate: dateFromToday(30),
      examUnits: [{ unit: "ক", title: "", examDate: dateFromToday(40) }],
    });
    const past = fakeUni({
      sessionYear: "2025-26",
      endDate: dateFromToday(-40),
      examUnits: [{ unit: "ক", title: "", examDate: dateFromToday(-30) }],
    });
    expect(resolveSession(future).isExpired).toBe(false);
    expect(resolveSession(past).isExpired).toBe(true);
  });

  it("live update ছাড়াও regions static fallback থেকে আসে", () => {
    const venue = resolveRegions(byId("du"));
    expect(venue.source).toBe("static_fallback");
    expect(venue.regions.length).toBeGreaterThan(0);
  });

  it("JU policy note-এ 'বিভাগীয় শহরে কেন্দ্র বাদ' আছে", () => {
    expect(resolveVenuePolicy(byId("ju"))?.venueNote).toContain(
      "বিভাগীয় শহরে কেন্দ্র বাদ",
    );
  });

  it("4-state calculator: eng=allowed(fx-100MS) / DU-JU=banned / CU=conditional+breakdown / unknown", () => {
    expect(resolveCalculator(byId("buet"))).toMatchObject({
      allowed: true,
      source: "static_fallback",
    });
    expect(resolveCalculator(byId("du"))).toMatchObject({
      allowed: false,
      source: "static_fallback",
    });
    expect(resolveCalculator(byId("ju"))).toMatchObject({
      allowed: false,
      source: "static_fallback",
    });
    const cu = resolveCalculator(byId("cu"));
    expect(cu.allowed).toBe("conditional");
    expect(cu.unitBreakdown?.length).toBe(7);
    expect(
      cu.unitBreakdown?.find((u) => u.unit.startsWith("A ইউনিট"))?.allowed,
    ).toBe(true);
  });

  it("calculator notes-এ fx-100MS explicit mention আছে", () => {
    const eng = resolveVenuePolicy(byId("buet"))?.calculatorNote || "";
    expect(eng).toContain("fx-100MS");
    expect(resolveVenuePolicy(byId("cu"))?.calculatorNote).toContain(
      "fx-100MS",
    );
    expect(resolveVenuePolicy(byId("du"))?.calculatorNote).toContain(
      "fx-100MS",
    );
  });
});

describe("isUndergradRelevant — PG news filter", () => {
  it("পিএইচডি/এমফিল/মাস্টার্স news বাদ পড়ে (RUET ভুল banner case)", () => {
    expect(
      isUndergradRelevant("পিএইচডি, এমফিল ও মাস্টার্স কোর্সে ভর্তি চালুর সুযোগ"),
    ).toBe(false);
  });

  it("undergraduate admission news বাদ পড়ে না", () => {
    expect(isUndergradRelevant("ভর্তি পরীক্ষার তারিখ পরিবর্তন")).toBe(true);
    expect(isUndergradRelevant("Honours first year admission circular")).toBe(
      true,
    );
  });

  it("title খালি/undefined → relevant ধরা হয়", () => {
    expect(isUndergradRelevant("")).toBe(true);
    expect(isUndergradRelevant(undefined)).toBe(true);
  });

  it("English keyword (PhD / MPhil / Master)ও filter হয়", () => {
    expect(isUndergradRelevant("PhD admission open")).toBe(false);
    expect(isUndergradRelevant("MPhil program circular")).toBe(false);
  });
});
