import { describe, it, expect } from "vitest";
import { computeBirthChart, buildBirthChartReading } from "./engine";
import { THAI_PROVINCES } from "./data/provinces";
import { ThaiZodiacSign, ThaiPlanet, ThaiDay } from "./types";

describe("birth chart engine", () => {
  it("returns sun sign deterministically (same input → same baseline)", () => {
    const input = {
      birthDate: new Date("1994-04-15T00:00:00+07:00"),
      birthTime: { hour: 8, minute: 30 },
      province: "bangkok",
    };
    const a = computeBirthChart(input);
    const b = computeBirthChart(input);
    expect(a.sunSign).toBe(b.sunSign);
    expect(a.ascendant).toBe(b.ascendant);
    expect(a.dayPlanet).toBe(b.dayPlanet);
  });

  it("computes ลัคนา only when birth time is known", () => {
    const noTime = computeBirthChart({
      birthDate: new Date("1990-06-20T00:00:00+07:00"),
      province: "bangkok",
    });
    expect(noTime.ascendant).toBeUndefined();
    expect(noTime.houses).toBeUndefined();

    const withTime = computeBirthChart({
      birthDate: new Date("1990-06-20T00:00:00+07:00"),
      birthTime: { hour: 10, minute: 15 },
      province: "bangkok",
    });
    expect(withTime.ascendant).toBeDefined();
    expect(withTime.houses).toHaveLength(12);
  });

  it("produces 12 distinct house signs that walk around the zodiac", () => {
    const chart = computeBirthChart({
      birthDate: new Date("1995-12-01T00:00:00+07:00"),
      birthTime: { hour: 14, minute: 0 },
      province: "chiang-mai",
    });
    expect(chart.houses).toBeDefined();
    const signs = chart.houses!.map((h) => h.sign);
    expect(new Set(signs).size).toBe(12);
  });

  it("falls back to default province when id is unknown", () => {
    const chart = computeBirthChart({
      birthDate: new Date("2000-01-01T00:00:00+07:00"),
      birthTime: { hour: 6, minute: 0 },
      province: "atlantis-not-real",
    });
    expect(chart.input.province).toBe("กรุงเทพมหานคร");
  });

  it("day → planet mapping is consistent with วัน", () => {
    const sunday = computeBirthChart({
      birthDate: new Date("2024-01-07T00:00:00+07:00"),
      province: "bangkok",
    });
    expect(sunday.day).toBe(ThaiDay.ARWAN);
    expect(sunday.dayPlanet).toBe(ThaiPlanet.ATHIT);

    const wednesday = computeBirthChart({
      birthDate: new Date("2024-01-10T00:00:00+07:00"),
      province: "bangkok",
    });
    expect(wednesday.day).toBe(ThaiDay.PHUT);
    expect(wednesday.dayPlanet).toBe(ThaiPlanet.PHUT);
  });

  it("buildBirthChartReading composes deterministic sections", () => {
    const reading = buildBirthChartReading({
      birthDate: new Date("1998-09-22T00:00:00+07:00"),
      birthTime: { hour: 9, minute: 45 },
      province: "phuket",
    });
    expect(reading.sections.length).toBeGreaterThanOrEqual(4);
    expect(reading.disclaimer).toMatch(/โหราศาสตร์ไทย/);
    expect(reading.sections.some((s) => s.title.includes("ลัคนาราศี"))).toBe(true);
    expect(reading.sections.some((s) => s.title.includes("ภพทั้ง"))).toBe(true);
  });

  it("ascendant changes meaningfully when birth time spans morning vs evening", () => {
    const base = {
      birthDate: new Date("1992-03-15T00:00:00+07:00"),
      province: "bangkok",
    } as const;
    const dawn = computeBirthChart({ ...base, birthTime: { hour: 6, minute: 0 } });
    const dusk = computeBirthChart({ ...base, birthTime: { hour: 18, minute: 0 } });
    expect(dawn.ascendant).not.toBe(dusk.ascendant);
  });

  it("ships 77 provinces with valid coordinates", () => {
    expect(THAI_PROVINCES.length).toBe(77);
    for (const p of THAI_PROVINCES) {
      expect(p.lat).toBeGreaterThan(5);
      expect(p.lat).toBeLessThan(21);
      expect(p.lng).toBeGreaterThan(97);
      expect(p.lng).toBeLessThan(106);
    }
  });

  it("sun sign output is one of the 12 valid signs", () => {
    const chart = computeBirthChart({
      birthDate: new Date("2003-07-04T00:00:00+07:00"),
      province: "bangkok",
    });
    expect(Object.values(ThaiZodiacSign)).toContain(chart.sunSign);
  });
});
