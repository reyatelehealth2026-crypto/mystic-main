// Tarot Topic Pools — จัดหมวดไพ่ทาโรต์ตามเรื่องที่ต้องการเสริมดวง
// ใช้สำหรับวอลเปเปอร์เสริมดวง

import { TAROT_DECK } from "./deck";
import { TarotCard } from "./types";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type WallpaperTopic = "finance" | "career" | "love" | "luck" | "health";

export interface TopicInfo {
  id: WallpaperTopic;
  labelTh: string;
  emoji: string;
  suitFocus: string; // suit หลักที่เกี่ยวข้อง
  symbolDescEn: string; // สำหรับ prompt สร้างภาพ
  symbolDescTh: string;
}

export interface DrawnTopicCard {
  card: TarotCard;
  topic: WallpaperTopic;
  promptSymbols: string; // สัญลักษณ์สำหรับใส่ใน image prompt
}

// ──────────────────────────────────────────────
// Topic Metadata
// ──────────────────────────────────────────────

export const TOPIC_INFO: Record<WallpaperTopic, TopicInfo> = {
  finance: {
    id: "finance",
    labelTh: "การเงิน",
    emoji: "💰",
    suitFocus: "pentacles",
    symbolDescEn: "golden coins, pentacle symbols, treasure, abundance",
    symbolDescTh: "เหรียญทอง สัญลักษณ์เพนตาเคิล ขุมทรัพย์",
  },
  career: {
    id: "career",
    labelTh: "การงาน",
    emoji: "💼",
    suitFocus: "wands",
    symbolDescEn: "wand staffs, fire energy, rising flames, achievement torch",
    symbolDescTh: "ไม้เท้า พลังไฟ คบเพลิงแห่งความสำเร็จ",
  },
  love: {
    id: "love",
    labelTh: "ความรัก",
    emoji: "💕",
    suitFocus: "cups",
    symbolDescEn: "golden chalice cups, flowing water, hearts, roses, soft glow",
    symbolDescTh: "ถ้วยทองคำ สายน้ำ หัวใจ ดอกกุหลาบ",
  },
  luck: {
    id: "luck",
    labelTh: "โชคลาภ",
    emoji: "🍀",
    suitFocus: "pentacles",
    symbolDescEn: "wheel of fortune, lucky stars, four-leaf clover, shining coins",
    symbolDescTh: "วงล้อแห่งโชคชะตา ดาวมงคล ใบโคลเวอร์",
  },
  health: {
    id: "health",
    labelTh: "สุขภาพ",
    emoji: "🌿",
    suitFocus: "cups",
    symbolDescEn: "healing light, zen garden, lotus flower, serene water, life energy",
    symbolDescTh: "แสงเยียวยา สวนเซน ดอกบัว สายน้ำสงบ",
  },
};

// ──────────────────────────────────────────────
// Card Pools per Topic
// ──────────────────────────────────────────────

// Major Arcana IDs ที่เกี่ยวข้องกับแต่ละหัวข้อ
const TOPIC_MAJOR_IDS: Record<WallpaperTopic, string[]> = {
  finance: ["maj10", "maj19", "maj21", "maj03", "maj01"], // Wheel, Sun, World, Empress, Magician
  career: ["maj01", "maj04", "maj07", "maj08", "maj11"],  // Magician, Emperor, Chariot, Strength, Justice
  love: ["maj03", "maj06", "maj14", "maj02", "maj17"],    // Empress, Lovers, Temperance, High Priestess, Star
  luck: ["maj10", "maj17", "maj19", "maj21", "maj00"],    // Wheel, Star, Sun, World, Fool
  health: ["maj08", "maj14", "maj17", "maj19", "maj20"],  // Strength, Temperance, Star, Sun, Judgement
};

function getCardPool(topic: WallpaperTopic): TarotCard[] {
  const info = TOPIC_INFO[topic];
  const majorIds = new Set(TOPIC_MAJOR_IDS[topic]);

  const pool: TarotCard[] = [];

  for (const card of TAROT_DECK) {
    // Minor arcana ตาม suit หลัก
    if (card.suit === info.suitFocus) {
      pool.push(card);
      continue;
    }
    // Major arcana ที่เกี่ยวข้อง
    if (card.arcana === "major" && majorIds.has(card.id)) {
      pool.push(card);
    }
  }

  return pool;
}

// ──────────────────────────────────────────────
// Draw a random card from the topic pool
// ──────────────────────────────────────────────

export function drawTopicCard(topic: WallpaperTopic): DrawnTopicCard {
  const pool = getCardPool(topic);
  const card = pool[Math.floor(Math.random() * pool.length)];
  const topicInfo = TOPIC_INFO[topic];

  // สร้าง prompt สัญลักษณ์ที่เฉพาะเจาะจงสำหรับไพ่ใบนี้
  const promptSymbols = `${card.name} tarot card symbolism, ${topicInfo.symbolDescEn}`;

  return {
    card,
    topic,
    promptSymbols,
  };
}

export function getTopicPool(topic: WallpaperTopic): TarotCard[] {
  return getCardPool(topic);
}
