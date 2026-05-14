// Lucky Numbers Engine — เลขมงคลจากวันเกิด + หมวด + วันที่ปัจจุบัน
// Same input (dob + topic + dayKey) → same baseline result.

import { LUCKY_NUMBERS, type LuckyNumberOption } from "@/lib/tarot/luckyNumbers";
import type { WallpaperTopic } from "@/lib/tarot/topicPools";

export type LuckyTopic = WallpaperTopic;

export interface LuckyCard {
  index: number;
  digit: number;
  score: number;
  reasonTh: string;
  role: "พลังหลัก" | "พลังเสริม" | "พลังโชค";
}

export interface LuckyNumbersResult {
  dob: string;
  topic: LuckyTopic;
  dayKey: string;
  lifePathNumber: number;
  cards: LuckyCard[];
  pair: string;
  triple: string;
  set: string;
  topicLabelTh: string;
  intent?: string;
}

const TOPIC_LABEL: Record<LuckyTopic, string> = {
  finance: "การเงิน",
  career: "การงาน",
  love: "ความรัก",
  luck: "โชคลาภ",
  health: "สุขภาพ",
};

const ROLE_BY_INDEX: LuckyCard["role"][] = [
  "พลังหลัก",
  "พลังหลัก",
  "พลังเสริม",
  "พลังเสริม",
  "พลังโชค",
  "พลังโชค",
];

function sumDigits(value: string): number {
  return value
    .split("")
    .map((d) => Number(d))
    .filter((n) => !Number.isNaN(n))
    .reduce((acc, n) => acc + n, 0);
}

function reduceToRoot(total: number): number {
  let current = Math.abs(total);
  while (current > 9) {
    current = sumDigits(String(current));
  }
  return current;
}

// Mulberry32 — small deterministic PRNG seeded by integer
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromInputs(dob: string, topic: LuckyTopic, dayKey: string): number {
  const raw = `${dob}|${topic}|${dayKey}`;
  let h = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function lifePathFromDob(dob: string): number {
  const digits = dob.replace(/\D/g, "");
  if (!digits) return 0;
  return reduceToRoot(sumDigits(digits));
}

export function parseDayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface LuckyNumbersInput {
  dob: string;
  topic: LuckyTopic;
  dayKey?: string;
  intent?: string;
}

export function computeLuckyNumbers(input: LuckyNumbersInput): LuckyNumbersResult | null {
  const { dob, topic, intent } = input;
  if (!dob || !TOPIC_LABEL[topic]) return null;

  const lifePath = lifePathFromDob(dob);
  if (lifePath === 0) return null;

  const dayKey = input.dayKey ?? parseDayKey();
  const pool: LuckyNumberOption[] = LUCKY_NUMBERS[topic];

  const seed = seedFromInputs(dob, topic, dayKey);
  const rand = mulberry32(seed);

  // Weighted selection from the topic pool (scores act as weights),
  // then fill remaining slots with digits derived from DOB + lifePath
  // so every result is anchored to the user.
  const weighted: number[] = [];
  pool.forEach((opt) => {
    const weight = Math.max(1, opt.score);
    for (let i = 0; i < weight; i += 1) weighted.push(opt.num);
  });

  const chosen: LuckyCard[] = [];
  const used = new Set<number>();

  for (let attempt = 0; attempt < 200 && chosen.length < 4; attempt += 1) {
    const pick = weighted[Math.floor(rand() * weighted.length)];
    if (used.has(pick)) continue;
    used.add(pick);
    const meta = pool.find((p) => p.num === pick);
    if (!meta) continue;
    chosen.push({
      index: chosen.length,
      digit: pick,
      score: meta.score,
      reasonTh: meta.reasonTh,
      role: ROLE_BY_INDEX[chosen.length],
    });
  }

  // Anchor: ensure life-path number appears once (luck/connection to user)
  if (!used.has(lifePath)) {
    chosen.push({
      index: chosen.length,
      digit: lifePath,
      score: 7,
      reasonTh: `เลขเส้นทางชีวิตของคุณ (${lifePath}) ดึงพลังเฉพาะตัว`,
      role: ROLE_BY_INDEX[chosen.length] ?? "พลังโชค",
    });
    used.add(lifePath);
  }

  // Fill any remaining slot with day-seed digit so we always have 6 cards.
  while (chosen.length < 6) {
    const guess = Math.floor(rand() * 10);
    if (used.has(guess)) continue;
    used.add(guess);
    chosen.push({
      index: chosen.length,
      digit: guess,
      score: 5,
      reasonTh: "ตัวเลขเสริมจากพลังวันนี้",
      role: ROLE_BY_INDEX[chosen.length] ?? "พลังโชค",
    });
  }

  const set = chosen.map((c) => c.digit).join(" · ");
  const pair = `${chosen[0].digit}${chosen[1].digit}`;
  const triple = `${chosen[2].digit}${chosen[3].digit}${chosen[4].digit}`;

  return {
    dob,
    topic,
    dayKey,
    lifePathNumber: lifePath,
    cards: chosen.slice(0, 6),
    pair,
    triple,
    set,
    topicLabelTh: TOPIC_LABEL[topic],
    intent: intent?.trim() || undefined,
  };
}

export function topicLabel(topic: LuckyTopic): string {
  return TOPIC_LABEL[topic];
}
