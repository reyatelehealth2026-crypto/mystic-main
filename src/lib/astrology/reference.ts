/**
 * Reference tables from /tmp/thai-astro-spec.md.
 * Every entry has a citation pointer (§N) tied back to that document so future
 * edits can be reconciled with the source.
 */

import type { PlanetId } from "./types";

export const SIGN_COUNT = 12;
export const NAKSHATRA_COUNT = 27;
export const NAKSHATRA_SPAN = 360 / NAKSHATRA_COUNT;

/** §1 — Decanate (D-3) ruler table; rows indexed by sign 0..11, columns by 0..2. */
export const DECANATE_RULERS: PlanetId[][] = [
  ["mars", "sun", "jupiter"],
  ["venus", "mercury", "saturn"],
  ["mercury", "venus", "saturn"],
  ["moon", "mars", "jupiter"],
  ["sun", "jupiter", "mars"],
  ["mercury", "saturn", "venus"],
  ["venus", "saturn", "mercury"],
  ["mars", "jupiter", "moon"],
  ["jupiter", "mars", "sun"],
  ["saturn", "venus", "mercury"],
  ["saturn", "mercury", "venus"],
  ["jupiter", "moon", "mars"],
];

/** §2 — ตรียางค์พิษ assignment (sign, decanate index 0..2) → poison kind. */
export type PoisonKind = "naga" | "garuda" | "dog";

export const POISON_TABLE: Record<number, { decanate: number; kind: PoisonKind }> = {
  0: { decanate: 0, kind: "naga" },
  1: { decanate: 1, kind: "garuda" },
  2: { decanate: 2, kind: "dog" },
  3: { decanate: 2, kind: "dog" },
  4: { decanate: 1, kind: "garuda" },
  5: { decanate: 0, kind: "naga" },
  6: { decanate: 1, kind: "garuda" },
  7: { decanate: 2, kind: "dog" },
  8: { decanate: 0, kind: "naga" },
  9: { decanate: 2, kind: "dog" },
  10: { decanate: 1, kind: "garuda" },
  11: { decanate: 0, kind: "naga" },
};

export const POISON_NAMES: Record<PoisonKind, string> = {
  naga: "พิษนาค",
  garuda: "พิษครุฑ",
  dog: "พิษสุนัข",
};

/** §3 — Nine ฤกษ์ groups (Vimshottari order per myhora). */
export interface RoekGroup {
  id: number;
  thaiName: string;
  fullName: string;
  lord: PlanetId;
  members: number[];
  auspicious: boolean;
  domain: string;
}

export const ROEK_GROUPS: RoekGroup[] = [
  { id: 1, thaiName: "ทลิทโท", fullName: "ทลิทโทฤกษ์", lord: "ketu", members: [1, 10, 19], auspicious: false, domain: "การขอ การกู้ยืม การกุศล" },
  { id: 2, thaiName: "มหัทธโน", fullName: "มหัทธโนฤกษ์", lord: "venus", members: [2, 11, 20], auspicious: true, domain: "เปิดกิจการ สมรส ขึ้นบ้านใหม่" },
  { id: 3, thaiName: "โจโร", fullName: "โจโรฤกษ์", lord: "sun", members: [3, 12, 21], auspicious: false, domain: "ปราบปราม จับกุม (อวมงคล)" },
  { id: 4, thaiName: "ภูมิปาโล", fullName: "ภูมิปาโลฤกษ์", lord: "moon", members: [4, 13, 22], auspicious: true, domain: "ที่ดิน อสังหาฯ ขึ้นบ้านใหม่" },
  { id: 5, thaiName: "เทศาตรี", fullName: "เทศาตรีฤกษ์", lord: "mars", members: [5, 14, 23], auspicious: false, domain: "โรงแรม ร้านอาหาร กิจการสาธารณะ" },
  { id: 6, thaiName: "เทวี", fullName: "เทวีฤกษ์", lord: "rahu", members: [6, 15, 24], auspicious: true, domain: "เสน่ห์ ความงาม เครื่องประดับ ศิลปะ" },
  { id: 7, thaiName: "เพชฌฆาต", fullName: "เพชฌฆาตฤกษ์", lord: "jupiter", members: [7, 16, 25], auspicious: false, domain: "พิธีกรรม คดี (อวมงคลสำหรับงานทั่วไป)" },
  { id: 8, thaiName: "ราชา", fullName: "ราชาฤกษ์", lord: "saturn", members: [8, 17, 26], auspicious: true, domain: "ราชการ เลื่อนตำแหน่ง สมรส (มงคลสูงสุด)" },
  { id: 9, thaiName: "สมโณ", fullName: "สมโณฤกษ์", lord: "mercury", members: [9, 18, 27], auspicious: false, domain: "บวช เรียน ศาสนกิจ" },
];

export function roekGroupFor(nakshatraIndex0Based: number): RoekGroup {
  const n1 = nakshatraIndex0Based + 1;
  const id = ((n1 - 1) % 9) + 1;
  return ROEK_GROUPS[id - 1];
}

/** §4 — ทักษา 8-slot rotation. */
export const TAKSA_SLOT_NAMES = [
  "บริวาร",
  "อายุ",
  "เดช",
  "ศรี",
  "มูละ",
  "อุตสาหะ",
  "มนตรี",
  "กาลกิณี",
] as const;

export type TaksaSlotName = (typeof TAKSA_SLOT_NAMES)[number];

/** Eight-planet cycle (no Ketu, no Mrityu). Standard Thai textbook order. */
export const TAKSA_CYCLE: PlanetId[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "saturn",
  "jupiter",
  "rahu",
  "venus",
];

/** Vimshottari + Ashtottari period lengths (years). */
export const ASHTOTTARI_YEARS: Partial<Record<PlanetId, number>> = {
  sun: 6,
  moon: 15,
  mars: 8,
  mercury: 17,
  saturn: 10,
  jupiter: 19,
  rahu: 12,
  venus: 21,
};

export const VIMSHOTTARI_YEARS: Partial<Record<PlanetId, number>> = {
  sun: 6,
  moon: 10,
  mars: 7,
  mercury: 17,
  saturn: 19,
  jupiter: 16,
  rahu: 18,
  venus: 20,
  ketu: 7,
};

/** Weekday 0=Sun ... 6=Sat. Returns planet for that weekday. */
export const WEEKDAY_PLANET: PlanetId[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

/** §5 — ภพ 12 names + meanings. Houses indexed 0..11 (house # = idx + 1). */
export interface HouseInfo {
  number: number;
  thai: string;
  sanskrit: string;
  meaning: string;
  classification: HouseClassification[];
}

export type HouseClassification = "kendra" | "trikona" | "upachaya" | "dushthana" | "maraka";

export const HOUSE_INFO: HouseInfo[] = [
  { number: 1, thai: "ตนุ", sanskrit: "Tanu", meaning: "ตัวตน ร่างกาย ชีวิต", classification: ["kendra", "trikona"] },
  { number: 2, thai: "กฎุมพะ", sanskrit: "Kutumba", meaning: "ทรัพย์ ครอบครัว วาจา", classification: ["maraka"] },
  { number: 3, thai: "สหัชชะ", sanskrit: "Sahaja", meaning: "พี่น้อง ความกล้า การสื่อสาร", classification: ["upachaya"] },
  { number: 4, thai: "พันธุ", sanskrit: "Bandhu", meaning: "มารดา บ้าน ที่ดิน", classification: ["kendra"] },
  { number: 5, thai: "ปุตตะ", sanskrit: "Putra", meaning: "บุตร ปัญญา ความรัก", classification: ["trikona"] },
  { number: 6, thai: "อริ", sanskrit: "Ari", meaning: "ศัตรู หนี้สิน โรคภัย", classification: ["upachaya", "dushthana"] },
  { number: 7, thai: "ปัตนิ", sanskrit: "Patni", meaning: "คู่ครอง พันธมิตร", classification: ["kendra", "maraka"] },
  { number: 8, thai: "มรณะ", sanskrit: "Marana", meaning: "ความตาย การเปลี่ยนแปลง มรดก", classification: ["dushthana"] },
  { number: 9, thai: "ศุภะ", sanskrit: "Shubha", meaning: "โชค ธรรม การเดินทางไกล", classification: ["trikona"] },
  { number: 10, thai: "กัมมะ", sanskrit: "Karma", meaning: "การงาน เกียรติยศ", classification: ["kendra", "upachaya"] },
  { number: 11, thai: "ลาภะ", sanskrit: "Labha", meaning: "ลาภ มิตร ความสำเร็จ", classification: ["upachaya"] },
  { number: 12, thai: "วินาศ", sanskrit: "Vinasa", meaning: "การสูญเสีย รายจ่าย โมกษะ", classification: ["dushthana"] },
];

/** §6 — สิ่งของเกษตร / มาตรฐานดาว tables. */
export const SIGN_RULERS: Record<number, PlanetId> = {
  0: "mars",
  1: "venus",
  2: "mercury",
  3: "moon",
  4: "sun",
  5: "mercury",
  6: "venus",
  7: "mars",
  8: "jupiter",
  9: "saturn",
  10: "saturn",
  11: "jupiter",
};

export interface ExaltationInfo {
  exaltSign: number;
  exaltPeakDeg: number;
  debilSign: number;
  debilPeakDeg: number;
}

export const EXALTATION: Partial<Record<PlanetId, ExaltationInfo>> = {
  sun:     { exaltSign: 0,  exaltPeakDeg: 10, debilSign: 6,  debilPeakDeg: 10 },
  moon:    { exaltSign: 1,  exaltPeakDeg: 3,  debilSign: 7,  debilPeakDeg: 3 },
  mars:    { exaltSign: 9,  exaltPeakDeg: 28, debilSign: 3,  debilPeakDeg: 28 },
  mercury: { exaltSign: 5,  exaltPeakDeg: 15, debilSign: 11, debilPeakDeg: 15 },
  jupiter: { exaltSign: 3,  exaltPeakDeg: 5,  debilSign: 9,  debilPeakDeg: 5 },
  venus:   { exaltSign: 11, exaltPeakDeg: 27, debilSign: 5,  debilPeakDeg: 27 },
  saturn:  { exaltSign: 6,  exaltPeakDeg: 20, debilSign: 0,  debilPeakDeg: 20 },
  rahu:    { exaltSign: 2,  exaltPeakDeg: 0,  debilSign: 8,  debilPeakDeg: 0 },
  ketu:    { exaltSign: 8,  exaltPeakDeg: 0,  debilSign: 2,  debilPeakDeg: 0 },
};

export interface MoolTrikonaInfo {
  sign: number;
  startDeg: number;
  endDeg: number;
}

export const MOOL_TRIKONA: Partial<Record<PlanetId, MoolTrikonaInfo>> = {
  sun:     { sign: 4,  startDeg: 0, endDeg: 20 },
  moon:    { sign: 1,  startDeg: 4, endDeg: 30 },
  mars:    { sign: 0,  startDeg: 0, endDeg: 12 },
  mercury: { sign: 5,  startDeg: 16, endDeg: 20 },
  jupiter: { sign: 8,  startDeg: 0, endDeg: 10 },
  venus:   { sign: 6,  startDeg: 0, endDeg: 15 },
  saturn:  { sign: 10, startDeg: 0, endDeg: 20 },
};

/** §6.4 มหาจักร. */
export const MAHACHAK: Partial<Record<PlanetId, number>> = {
  sun: 3,
  moon: 5,
  mars: 5,
  mercury: 4,
  jupiter: 7,
  venus: 8,
  saturn: 1,
  rahu: 9,
};

/** §6.5 ราชาโชค. */
export const RAJA_LUCK: Partial<Record<PlanetId, number>> = {
  sun: 2,
  moon: 10,
  mars: 3,
  mercury: 4,
  jupiter: 5,
  venus: 6,
  saturn: 7,
  rahu: 8,
};

/** §6.5 เทวีโชค — common-textbook table. */
export const DEVI_LUCK: Partial<Record<PlanetId, number>> = {
  sun: 11,
  moon: 0,
  mars: 1,
  mercury: 2,
  jupiter: 3,
  venus: 4,
  saturn: 5,
  rahu: 6,
};

/** §10 — ตรีวัย stage definitions. */
export interface TriwaiStage {
  id: 1 | 2 | 3;
  thai: string;
  sanskrit: string;
  startAge: number;
  endAge: number;
  houses: number[];
}

export const TRIWAI_STAGES: TriwaiStage[] = [
  { id: 1, thai: "ปฐมวัย", sanskrit: "Prathama-vaya", startAge: 0, endAge: 25, houses: [1, 2, 10] },
  { id: 2, thai: "มัชฌิมวัย", sanskrit: "Madhyama-vaya", startAge: 25, endAge: 50, houses: [3, 9, 11] },
  { id: 3, thai: "ปัจฉิมวัย", sanskrit: "Pacchima-vaya", startAge: 50, endAge: 75, houses: [4, 5, 7] },
];

/** §9.3 อันโตนาทีสามัญ — rising-time per ราศี (minutes), central Thailand. */
export const ANTONATHI_MIN_PER_SIGN: number[] = [
  93, 106, 121, 134, 147, 158, 147, 134, 119, 106, 93, 82,
];
