/**
 * Thai zodiac (จักรราศี), nakshatra (นักษัตร), and planet (เคราะห์) reference data.
 *
 * Order matters: indexes are used directly by the engine.
 *  - ZODIAC_SIGNS[0] = เมษ … ZODIAC_SIGNS[11] = มีน
 *  - NAKSHATRAS[0]   = อัศวินี … NAKSHATRAS[26] = เรวดี
 */

import type { PlanetId } from "./types";

export interface ZodiacSign {
  index: number;
  thaiName: string;
  thaiShort: string;
  ruler: PlanetId;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { index: 0, thaiName: "เมษ", thaiShort: "มษ", ruler: "mars" },
  { index: 1, thaiName: "พฤษภ", thaiShort: "พษ", ruler: "venus" },
  { index: 2, thaiName: "มิถุน", thaiShort: "มน", ruler: "mercury" },
  { index: 3, thaiName: "กรกฎ", thaiShort: "กฎ", ruler: "moon" },
  { index: 4, thaiName: "สิงห์", thaiShort: "สห", ruler: "sun" },
  { index: 5, thaiName: "กันย์", thaiShort: "กย", ruler: "mercury" },
  { index: 6, thaiName: "ตุล", thaiShort: "ตล", ruler: "venus" },
  { index: 7, thaiName: "พิจิก", thaiShort: "พจ", ruler: "mars" },
  { index: 8, thaiName: "ธนู", thaiShort: "ธน", ruler: "jupiter" },
  { index: 9, thaiName: "มกร", thaiShort: "มก", ruler: "saturn" },
  { index: 10, thaiName: "กุมภ์", thaiShort: "กภ", ruler: "saturn" },
  { index: 11, thaiName: "มีน", thaiShort: "มน", ruler: "jupiter" },
];

export interface Nakshatra {
  index: number;
  thaiName: string;
}

export const NAKSHATRAS: Nakshatra[] = [
  { index: 0, thaiName: "อัศวินี" },
  { index: 1, thaiName: "ภรณี" },
  { index: 2, thaiName: "กฤติกา" },
  { index: 3, thaiName: "โรหิณี" },
  { index: 4, thaiName: "มฤคศิระ" },
  { index: 5, thaiName: "อารทรา" },
  { index: 6, thaiName: "ปุนัพสุ" },
  { index: 7, thaiName: "ปุษยะ" },
  { index: 8, thaiName: "อาเสลษะ" },
  { index: 9, thaiName: "มฆะ" },
  { index: 10, thaiName: "บุรพผลคุนี" },
  { index: 11, thaiName: "อุตรผลคุนี" },
  { index: 12, thaiName: "หัสตะ" },
  { index: 13, thaiName: "จิตรา" },
  { index: 14, thaiName: "สวาตี" },
  { index: 15, thaiName: "วิสาขะ" },
  { index: 16, thaiName: "อนุราธา" },
  { index: 17, thaiName: "เชษฐา" },
  { index: 18, thaiName: "มูล" },
  { index: 19, thaiName: "บุรพษาฒ" },
  { index: 20, thaiName: "อุตรษาฒ" },
  { index: 21, thaiName: "ศรวณะ" },
  { index: 22, thaiName: "ธนิษฐา" },
  { index: 23, thaiName: "ศตภิษัช" },
  { index: 24, thaiName: "บุรพภัทร" },
  { index: 25, thaiName: "อุตรภัทร" },
  { index: 26, thaiName: "เรวดี" },
];

export interface PlanetInfo {
  id: PlanetId;
  thaiName: string;
  thaiNumeral: string;
}

export const PLANET_INFO: PlanetInfo[] = [
  { id: "lagna", thaiName: "ลัคนา", thaiNumeral: "ล." },
  { id: "sun", thaiName: "อาทิตย์", thaiNumeral: "๑" },
  { id: "moon", thaiName: "จันทร์", thaiNumeral: "๒" },
  { id: "mars", thaiName: "อังคาร", thaiNumeral: "๓" },
  { id: "mercury", thaiName: "พุธ", thaiNumeral: "๔" },
  { id: "jupiter", thaiName: "พฤหัสบดี", thaiNumeral: "๕" },
  { id: "venus", thaiName: "ศุกร์", thaiNumeral: "๖" },
  { id: "saturn", thaiName: "เสาร์", thaiNumeral: "๗" },
  { id: "rahu", thaiName: "ราหู", thaiNumeral: "๘" },
  { id: "ketu", thaiName: "เกตุ", thaiNumeral: "๙" },
  { id: "uranus", thaiName: "มฤตยู", thaiNumeral: "๐" },
];

export function getPlanetInfo(id: PlanetId): PlanetInfo {
  const info = PLANET_INFO.find((p) => p.id === id);
  if (!info) throw new Error(`Unknown planet: ${id}`);
  return info;
}
