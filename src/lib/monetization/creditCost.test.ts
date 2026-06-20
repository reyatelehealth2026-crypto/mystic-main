import { describe, it, expect } from "vitest";
import { getCreditCost } from "./creditCost";
import { ReadingType } from "@/lib/reading/types";

describe("getCreditCost", () => {
  it("charges by horoscope period", () => {
    expect(getCreditCost(ReadingType.HOROSCOPE, { period: "daily" })).toBe(1);
    expect(getCreditCost(ReadingType.HOROSCOPE, { period: "weekly" })).toBe(2);
    expect(getCreditCost(ReadingType.HOROSCOPE, { period: "monthly" })).toBe(3);
    expect(getCreditCost(ReadingType.HOROSCOPE)).toBe(1);
  });

  it("charges fixed costs for the other verticals", () => {
    expect(getCreditCost(ReadingType.COMPATIBILITY)).toBe(2);
    expect(getCreditCost(ReadingType.NAME_NUMEROLOGY)).toBe(2);
    expect(getCreditCost(ReadingType.CHINESE_ZODIAC)).toBe(1);
    expect(getCreditCost(ReadingType.TAROT)).toBe(1);
    expect(getCreditCost(ReadingType.DAILY_CARD)).toBe(1);
  });
});
