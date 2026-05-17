import { describe, expect, it } from "vitest";
import { computeNatalChart } from "./engine";
import { ayanamsaFor, lahiriAyanamsa } from "./ayanamsa";
import { sunLongitude, moonLongitude } from "./positions";
import { gregorianToJDN } from "./julian";

describe("astrology engine", () => {
  it("JDN of J2000 noon UT == 2451545.0", () => {
    expect(gregorianToJDN(2000, 1, 1) + 12 / 24).toBeCloseTo(2451545.0, 5);
  });

  it("Lahiri ayanamsa at J2000 ≈ 23.85°", () => {
    expect(lahiriAyanamsa(2451545.0)).toBeGreaterThan(23.7);
    expect(lahiriAyanamsa(2451545.0)).toBeLessThan(24.0);
  });

  it("สุริยยาตร์ ayanamsa is slightly larger than Lahiri", () => {
    const jd = 2460000.0;
    expect(ayanamsaFor("suriyayatra", jd)).toBeGreaterThan(
      ayanamsaFor("lahiri", jd)
    );
  });

  it("Sun longitude on 2000-03-20 ~near 0° tropical (vernal equinox)", () => {
    const jd = gregorianToJDN(2000, 3, 20) + 7.5 / 24;
    const lon = sunLongitude(jd);
    expect(lon < 1 || lon > 359).toBe(true);
  });

  it("Moon longitude is finite and bounded", () => {
    const jd = gregorianToJDN(2024, 6, 15);
    const lon = moonLongitude(jd);
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it("computeNatalChart returns 11 planet positions, all in range", () => {
    const chart = computeNatalChart(
      {
        year: 1990,
        month: 5,
        day: 15,
        hour: 10,
        minute: 30,
        timezoneHours: 7,
        latitude: 13.7563,
        longitude: 100.5018,
      },
      "suriyayatra"
    );
    expect(chart.planets).toHaveLength(11);
    for (const p of chart.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.zodiac.sign).toBeGreaterThanOrEqual(0);
      expect(p.zodiac.sign).toBeLessThanOrEqual(11);
      expect(p.nakshatra.index).toBeGreaterThanOrEqual(0);
      expect(p.nakshatra.index).toBeLessThanOrEqual(26);
      expect(p.nakshatra.pada).toBeGreaterThanOrEqual(1);
      expect(p.nakshatra.pada).toBeLessThanOrEqual(4);
    }
  });

  it("Lagna shifts when latitude changes", () => {
    const base = {
      year: 1990,
      month: 5,
      day: 15,
      hour: 10,
      minute: 30,
      timezoneHours: 7,
      longitude: 100.5018,
    };
    const a = computeNatalChart(
      { ...base, latitude: 13.75 },
      "lahiri"
    ).planets[0].longitude;
    const b = computeNatalChart(
      { ...base, latitude: 18.79 },
      "lahiri"
    ).planets[0].longitude;
    expect(Math.abs(a - b)).toBeGreaterThan(0.1);
  });

  it("ketu = rahu + 180°", () => {
    const chart = computeNatalChart(
      {
        year: 2000,
        month: 1,
        day: 1,
        hour: 12,
        minute: 0,
        timezoneHours: 0,
        latitude: 0,
        longitude: 0,
      },
      "lahiri"
    );
    const rahu = chart.planets.find((p) => p.id === "rahu")!.longitude;
    const ketu = chart.planets.find((p) => p.id === "ketu")!.longitude;
    const diff = ((ketu - rahu) % 360 + 360) % 360;
    expect(Math.abs(diff - 180)).toBeLessThan(0.001);
  });
});
