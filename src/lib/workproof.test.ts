import { describe, expect, it } from "vitest";
import { summarize } from "./workproof";
describe("summarize", () => {
  it("totals only entries inside the date range", () => {
    const r = summarize([
      { id: "1", date: "2026-01-01", amount: 500, source: "", note: "" },
      { id: "2", date: "2026-01-01", amount: 300, source: "", note: "" },
      { id: "3", date: "2026-02-10", amount: 900, source: "", note: "" },
    ], "2026-01-01", "2026-01-31");
    expect(r.total).toBe(800);
    expect(r.days).toBe(1);
  });
});
