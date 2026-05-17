import { describe, expect, it } from "vitest";
import { computeNatalChart } from "./engine";
import { buildDashaSequence, findActiveDasha, taksaForWeekday } from "./dasha";
import { computeTriwai } from "./triwai";
import { poisonAt } from "./poison";
import { decanateSign } from "./divisional";

const INPUT = {
  year: 1990, month: 5, day: 15,
  hour: 10, minute: 30,
  timezoneHours: 7,
  latitude: 13.7563, longitude: 100.5018,
};

describe("Thai astrology extensions", () => {
  it("computes house, decanate, navamsha, ฤกษ์, dignities for every planet", () => {
    const c = computeNatalChart(INPUT, "suriyayatra");
    for (const p of c.planets) {
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
      expect(p.decanateSign).toBeGreaterThanOrEqual(0);
      expect(p.decanateSign).toBeLessThanOrEqual(11);
      expect(p.navamshaSign).toBeGreaterThanOrEqual(0);
      expect(p.navamshaSign).toBeLessThanOrEqual(11);
      expect(p.roekGroupId).toBeGreaterThanOrEqual(1);
      expect(p.roekGroupId).toBeLessThanOrEqual(9);
      expect(Array.isArray(p.dignities)).toBe(true);
    }
  });

  it("lagna sits in house 1", () => {
    const c = computeNatalChart(INPUT, "lahiri");
    const lagna = c.planets.find(p => p.id === "lagna")!;
    expect(lagna.house).toBe(1);
  });

  it("sunrise header populated for Bangkok", () => {
    const c = computeNatalChart(INPUT, "suriyayatra");
    expect(c.sunrise).not.toBeNull();
    expect(c.sunrise!.hourLocal).toBeGreaterThanOrEqual(5);
    expect(c.sunrise!.hourLocal).toBeLessThanOrEqual(7);
  });

  it("ตรียางค์พิษ at 0°-3° เมษ flags พิษนาค", () => {
    const p = poisonAt(2);
    expect(p.kind).toBe("naga");
    expect(p.severity).toBe("light");
  });

  it("decanate of 5° เมษ → sub-sign เมษ ruled by Mars", () => {
    const d = decanateSign(5);
    expect(d.index).toBe(0);
    expect(d.ruler).toBe("mars");
    expect(d.sign).toBe(0);
  });

  it("ทักษา for Sun-born → บริวาร=Sun, กาลกิณี=Venus", () => {
    const slots = taksaForWeekday("sun");
    expect(slots[0].name).toBe("บริวาร");
    expect(slots[0].planet).toBe("sun");
    expect(slots[7].name).toBe("กาลกิณี");
    expect(slots[7].planet).toBe("venus");
  });

  it("Ashtottari sequence totals 108 years across 8 planets", () => {
    const seq = buildDashaSequence("sun", "ashtottari", 108);
    const total = seq.reduce((s, p) => s + p.durationYears, 0);
    expect(total).toBe(108);
    expect(findActiveDasha(seq, 0)?.planet).toBe("sun");
  });

  it("ตรีวัย returns three stages, each with a lord", () => {
    const c = computeNatalChart(INPUT, "suriyayatra");
    const t = computeTriwai(c);
    expect(t).toHaveLength(3);
    for (const stage of t) {
      expect(stage.lord).toBeDefined();
      expect(stage.lordHouse).toBeGreaterThanOrEqual(1);
      expect(stage.lordHouse).toBeLessThanOrEqual(12);
    }
  });
});
