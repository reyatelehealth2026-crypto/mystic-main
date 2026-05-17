/**
 * Apparent geocentric longitudes for the Thai natal chart.
 *
 * All output is in tropical degrees [0, 360); the engine subtracts the
 * selected ayanamsa elsewhere to obtain sidereal positions.
 *
 * Accuracy targets (for the seven classical bodies + outers used by the
 * Thai chart, well within the resolution that traditional readings work at):
 *   - Sun:       ~ 0.01°
 *   - Moon:      ~ 0.1°
 *   - Mercury,
 *     Venus,
 *     Mars,
 *     Jupiter,
 *     Saturn:    ~ 0.1° (heliocentric + Earth correction, low-order series)
 *   - Uranus:    ~ 0.1°
 *   - Rahu/Ketu: mean lunar node, ~ 0.01°
 *
 * Series taken from Meeus, "Astronomical Algorithms" (ch. 25, 32, 47).
 * Higher-order VSOP87 terms are deliberately omitted — Thai chart output
 * is read at the arcminute level, not the arcsecond level.
 */

import { degToRad, julianCenturiesT, norm360 } from "./julian";
import type { PlanetId } from "./types";

function sind(deg: number): number {
  return Math.sin(degToRad(deg));
}
function cosd(deg: number): number {
  return Math.cos(degToRad(deg));
}

/** Apparent geocentric ecliptic longitude of the Sun, in degrees. */
export function sunLongitude(jdUT: number): number {
  const T = julianCenturiesT(jdUT);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sind(M) +
    (0.019993 - 0.000101 * T) * sind(2 * M) +
    0.000289 * sind(3 * M);
  const trueLon = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  return norm360(trueLon - 0.00569 - 0.00478 * sind(omega));
}

/**
 * Geocentric ecliptic longitude of the Moon, in degrees.
 * Eight largest periodic terms of Meeus ch. 47 — accurate to ~0.1°.
 */
export function moonLongitude(jdUT: number): number {
  const T = julianCenturiesT(jdUT);
  const Lp =
    218.3164477 +
    481267.88123421 * T -
    0.0015786 * T * T +
    (T * T * T) / 538841 -
    (T * T * T * T) / 65194000;
  const D =
    297.8501921 +
    445267.1114034 * T -
    0.0018819 * T * T +
    (T * T * T) / 545868 -
    (T * T * T * T) / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mp =
    134.9633964 +
    477198.8675055 * T +
    0.0087414 * T * T +
    (T * T * T) / 69699 -
    (T * T * T * T) / 14712000;
  const F =
    93.272095 +
    483202.0175233 * T -
    0.0036539 * T * T -
    (T * T * T) / 3526000 +
    (T * T * T * T) / 863310000;

  const dl =
    6.288774 * sind(Mp) +
    1.274027 * sind(2 * D - Mp) +
    0.658314 * sind(2 * D) +
    0.213618 * sind(2 * Mp) -
    0.185116 * sind(M) -
    0.114332 * sind(2 * F) +
    0.058793 * sind(2 * D - 2 * Mp) +
    0.057066 * sind(2 * D - M - Mp) +
    0.053322 * sind(2 * D + Mp) +
    0.045758 * sind(2 * D - M) -
    0.040923 * sind(M - Mp) -
    0.03472 * sind(D) -
    0.030383 * sind(M + Mp);

  return norm360(Lp + dl);
}

/** Mean longitude of the ascending lunar node (Rahu), in degrees. Retrograde. */
export function rahuLongitude(jdUT: number): number {
  const T = julianCenturiesT(jdUT);
  return norm360(
    125.0445479 -
      1934.1362891 * T +
      0.0020754 * T * T +
      (T * T * T) / 467441 -
      (T * T * T * T) / 60616000
  );
}

interface OrbitalElements {
  L: [number, number, number, number];
  a: number;
  e: [number, number, number, number];
  i: [number, number, number, number];
  longPeri: [number, number, number, number];
  longNode: [number, number, number, number];
}

function evalPoly(coef: [number, number, number, number], T: number): number {
  return coef[0] + coef[1] * T + coef[2] * T * T + coef[3] * T * T * T;
}

/**
 * Mean orbital elements for heliocentric ecliptic of date.
 * Source: Meeus 2nd ed. tab. 31.A (truncated to cubic term in T).
 */
const ELEMENTS: Record<
  "mercury" | "venus" | "earth" | "mars" | "jupiter" | "saturn" | "uranus",
  OrbitalElements
> = {
  mercury: {
    L: [252.250906, 149472.6746358, -0.00000535, 0.000000002],
    a: 0.387098310,
    e: [0.20563175, 0.000020407, -0.0000000283, -0.00000000018],
    i: [7.004986, 0.0018215, -0.0000181, 0.000000056],
    longPeri: [77.456119, 1.5564776, 0.00029544, 0.000000009],
    longNode: [48.330893, 1.1861883, 0.00017542, 0.000000215],
  },
  venus: {
    L: [181.979801, 58517.815676, 0.00000165, -0.000000002],
    a: 0.723329820,
    e: [0.00677192, -0.000047765, 0.0000000981, 0.00000000046],
    i: [3.394662, 0.0010037, -0.00000088, -0.000000007],
    longPeri: [131.563703, 1.4022288, -0.00107618, -0.0000056],
    longNode: [76.679920, 0.9011206, 0.0004061, -0.000000093],
  },
  earth: {
    L: [100.466449, 35999.3728519, -0.00000568, 0.0],
    a: 1.000001018,
    e: [0.01670862, -0.000042037, -0.0000001236, 0.00000000004],
    i: [0, 0, 0, 0],
    longPeri: [102.937348, 1.7195269, 0.00045962, 0.000000499],
    longNode: [0, 0, 0, 0],
  },
  mars: {
    L: [355.433, 19140.299314, 0.00000261, -0.000000003],
    a: 1.523679342,
    e: [0.09340062, 0.000090483, -0.0000000806, -0.00000000035],
    i: [1.849726, -0.0006011, 0.00001276, -0.000000007],
    longPeri: [336.060234, 1.8410449, 0.00013477, 0.000000536],
    longNode: [49.558093, 0.772065, 0.0000017, -0.00000067],
  },
  jupiter: {
    L: [34.351519, 3034.9056606, -0.0000085, 0.000000004],
    a: 5.202603209,
    e: [0.04849485, 0.000163244, -0.0000004719, -0.00000000197],
    i: [1.30327, -0.0019872, 0.0000332, 0.000000097],
    longPeri: [14.331309, 1.6126668, 0.00103127, -0.00000425],
    longNode: [100.464407, 1.0209774, 0.0004036, 0.000000064],
  },
  saturn: {
    L: [50.077444, 1222.1138488, 0.0000021, -0.000000005],
    a: 9.554909192,
    e: [0.05550862, -0.000346818, -0.0000006456, 0.00000000338],
    i: [2.488879, 0.0025514, -0.00004906, 0.000000017],
    longPeri: [93.057237, 1.9637613, 0.00083753, 0.000004928],
    longNode: [113.665503, 0.877088, -0.00012176, -0.000002249],
  },
  uranus: {
    L: [314.055005, 428.4669983, -0.00000486, 0.000000006],
    a: 19.218446062,
    e: [0.04629590, -0.000027337, 0.0000000790, 0.0000000000025],
    i: [0.773196, -0.0016869, 0.000000349, 0.00000000016],
    longPeri: [173.005159, 1.486378, 0.00021406, 0.000000434],
    longNode: [74.005947, 0.5211258, 0.00133982, 0.000018516],
  },
};

interface Cartesian3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Heliocentric ecliptic Cartesian position for a planet, J2000-of-date.
 * Solves Kepler's equation in radians by Newton iteration.
 */
function helioCartesian(
  el: OrbitalElements,
  T: number
): Cartesian3 {
  const L = evalPoly(el.L, T);
  const a = el.a;
  const e = evalPoly(el.e, T);
  const iDeg = evalPoly(el.i, T);
  const piLong = evalPoly(el.longPeri, T);
  const omega = evalPoly(el.longNode, T);

  const omegaArgDeg = piLong - omega;

  let Mdeg = norm360(L - piLong);
  if (Mdeg > 180) Mdeg -= 360;
  const M = degToRad(Mdeg);

  let E = M + e * Math.sin(M);
  for (let k = 0; k < 8; k++) {
    const f = E - e * Math.sin(E) - M;
    const fp = 1 - e * Math.cos(E);
    E -= f / fp;
  }

  const xPrime = a * (Math.cos(E) - e);
  const yPrime = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cw = cosd(omegaArgDeg);
  const sw = sind(omegaArgDeg);
  const co = cosd(omega);
  const so = sind(omega);
  const ci = cosd(iDeg);
  const si = sind(iDeg);

  const x =
    (cw * co - sw * so * ci) * xPrime + (-sw * co - cw * so * ci) * yPrime;
  const y =
    (cw * so + sw * co * ci) * xPrime + (-sw * so + cw * co * ci) * yPrime;
  const z = sw * si * xPrime + cw * si * yPrime;

  return { x, y, z };
}

interface BodyResult {
  longitude: number;
  retrograde: boolean;
}

function geocentricLongitude(
  body: keyof typeof ELEMENTS,
  jdUT: number
): BodyResult {
  const T = julianCenturiesT(jdUT);
  const earth = helioCartesian(ELEMENTS.earth, T);
  const p = helioCartesian(ELEMENTS[body], T);
  const dx = p.x - earth.x;
  const dy = p.y - earth.y;
  const dz = p.z - earth.z;
  const lon = norm360(Math.atan2(dy, dx) * (180 / Math.PI));

  const dT = 0.5 / 36525;
  const earth2 = helioCartesian(ELEMENTS.earth, T + dT);
  const p2 = helioCartesian(ELEMENTS[body], T + dT);
  const lon2 = norm360(
    Math.atan2(p2.y - earth2.y, p2.x - earth2.x) * (180 / Math.PI)
  );
  let dlon = lon2 - lon;
  if (dlon > 180) dlon -= 360;
  if (dlon < -180) dlon += 360;
  void dz;
  return { longitude: lon, retrograde: dlon < 0 };
}

export function planetTropical(id: PlanetId, jdUT: number): BodyResult {
  switch (id) {
    case "sun":
      return { longitude: sunLongitude(jdUT), retrograde: false };
    case "moon":
      return { longitude: moonLongitude(jdUT), retrograde: false };
    case "rahu":
      return { longitude: rahuLongitude(jdUT), retrograde: true };
    case "ketu":
      return { longitude: norm360(rahuLongitude(jdUT) + 180), retrograde: true };
    case "mercury":
    case "venus":
    case "mars":
    case "jupiter":
    case "saturn":
    case "uranus":
      return geocentricLongitude(id, jdUT);
    case "lagna":
      throw new Error("lagna is computed from sidereal time, not planetTropical()");
  }
}
