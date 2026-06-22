import { describe, it, expect } from "vitest";
import { computeTier } from "./tier";

describe("computeTier", () => {
  it("starts at Member and tracks progress toward Silver", () => {
    const t = computeTier(10);
    expect(t.tier).toBe("Member");
    expect(t.nextTier).toBe("Silver");
    expect(t.toNext).toBe(490);
    expect(t.progressPct).toBe(2); // 10 / 500 ≈ 2%
  });

  it("promotes exactly at a threshold", () => {
    expect(computeTier(500).tier).toBe("Silver");
    expect(computeTier(2000).tier).toBe("Gold");
  });

  it("caps at the top tier with no next", () => {
    const t = computeTier(9999);
    expect(t.tier).toBe("Platinum");
    expect(t.nextTier).toBeNull();
    expect(t.toNext).toBe(0);
    expect(t.progressPct).toBe(100);
  });
});
