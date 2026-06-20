import { describe, it, expect } from "vitest";
import { subscriptionRemaining } from "./quota";

const NOW = "2026-06-21T00:00:00.000Z";
const FUTURE = "2026-07-21T00:00:00.000Z";
const PAST = "2026-06-01T00:00:00.000Z";

describe("subscriptionRemaining", () => {
  it("returns 0 when there is no subscription", () => {
    expect(subscriptionRemaining(null, NOW)).toBe(0);
  });

  it("returns quota minus used for an active, in-period subscription", () => {
    expect(
      subscriptionRemaining({ monthly_quota: 10, used_count: 3, period_end: FUTURE, status: "active" }, NOW),
    ).toBe(7);
  });

  it("returns 0 once the period has lapsed", () => {
    expect(
      subscriptionRemaining({ monthly_quota: 10, used_count: 0, period_end: PAST, status: "active" }, NOW),
    ).toBe(0);
  });

  it("returns 0 when status is not active", () => {
    expect(
      subscriptionRemaining({ monthly_quota: 10, used_count: 0, period_end: FUTURE, status: "expired" }, NOW),
    ).toBe(0);
  });

  it("never goes negative", () => {
    expect(
      subscriptionRemaining({ monthly_quota: 10, used_count: 15, period_end: FUTURE, status: "active" }, NOW),
    ).toBe(0);
  });
});
