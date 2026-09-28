import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchAdmissionData } from "../src/lib/sheetFetcher";

afterEach(() => vi.unstubAllGlobals());

describe("fetchAdmissionData resilience", () => {
  it("falls back to local-verified data when network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const res = await fetchAdmissionData("invalid-sheet-id");
    expect(res.isLive).toBe(false);
    expect(res.source).toBe("local-verified");
    expect(res.universities.length).toBeGreaterThan(0);
  });

  it("falls back gracefully on gviz error payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ status: "error", errors: [{ message: "boom" }] }),
          { status: 200 },
        ),
      ),
    );
    const res = await fetchAdmissionData("invalid-sheet-id");
    expect(res.isLive).toBe(false);
    expect(res.universities.length).toBeGreaterThan(0);
  });
});