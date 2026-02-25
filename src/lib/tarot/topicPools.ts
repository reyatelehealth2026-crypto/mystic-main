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

// ไพ่ที่เหมาะสมที่สุดสำหรับการเสริมมงคลในแต่ละหมวด (เรียงตามลำดับความเหมาะสม)
const BEST_CARDS_FOR_TOPIC: Record<WallpaperTopic, string[]> = {
  // การเงิน: ไพ่เหรียญ (Pentacles) ที่มีความหมายดี + Major Arcana ที่เกี่ยวกับความมั่งคั่ง
  finance: [
    "pen10", // Ten of Pentacles - ความมั่งคั่งของครอบครัว
    "pen09", // Nine of Pentacles - ความสำเร็จทางการเงิน
    "penA", // Ace of Pentacles - โอกาสทางการเงินใหม่
    "maj19", // The Sun - ความสำเร็จ
    "maj21", // The World - ความสมบูรณ์
    "maj10", // Wheel of Fortune - โชคลาภ
  ],
  // การงาน: ไพ่ไม้เท้า (Wands) ที่มีพลังและความก้าวหน้า
  career: [
    "wan03", // Three of Wands - การขยายธุรกิจ
    "wan06", // Six of Wands - ชัยชนะ
    "wanA", // Ace of Wands - โอกาสใหม่
    "maj01", // The Magician - ความสามารถ
    "maj07", // The Chariot - ความมุ่งมั่น
    "maj04", // The Emperor - ความเป็นผู้นำ
  ],
  // ความรัก: ไพ่ถ้วย (Cups) ที่เกี่ยวกับความรักและอารมณ์
  love: [
    "cup02", // Two of Cups - ความรักที่สมดุล
    "cup10", // Ten of Cups - ความสุขในครอบครัว
    "cupA", // Ace of Cups - ความรักใหม่
    "maj06", // The Lovers - ความรัก
    "maj03", // The Empress - ความอุดมสมบูรณ์
    "maj17", // The Star - ความหวัง
  ],
  // โชคลาภ: ไพ่เหรียญ + Major Arcana ที่เกี่ยวกับโชคดี
  luck: [
    "maj10", // Wheel of Fortune - โชคลาภ
    "maj19", // The Sun - ความสำเร็จ
    "maj17", // The Star - ความหวังและโชคดี
    "pen09", // Nine of Pentacles - ความสำเร็จ
    "maj21", // The World - ความสมบูรณ์
  ],
  // สุขภาพ: ไพ่ถ้วย (Cups) ที่เกี่ยวกับการเยียวยา + Major Arcana
  health: [
    "maj17", // The Star - การเยียวยา
    "maj14", // Temperance - สมดุล
    "maj19", // The Sun - พลังชีวิต
    "cupA", // Ace of Cups - พลังงานใหม่
    "maj08", // Strength - พลังและความแข็งแกร่ง
  ],
};

// Major Arcana IDs ที่เกี่ยวข้องกับแต่ละหัวข้อ (สำหรับ fallback)
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
// เลือกไพ่ที่เหมาะสมที่สุดสำหรับการเสริมมงคล
// ──────────────────────────────────────────────

export function drawTopicCard(topic: WallpaperTopic): DrawnTopicCard {
  const bestCardIds = BEST_CARDS_FOR_TOPIC[topic];
  const topicInfo = TOPIC_INFO[topic];

  // หาไพ่ที่เหมาะสมที่สุดจากรายการที่กำหนด
  let selectedCard: TarotCard | undefined;
  
  for (const cardId of bestCardIds) {
    const card = TAROT_DECK.find(c => c.id === cardId);
    if (card) {
      selectedCard = card;
      break; // เลือกไพ่แรกที่เจอ (ซึ่งเป็นไพ่ที่เหมาะสมที่สุด)
    }
  }

  // Fallback: ถ้าไม่เจอไพ่ที่กำหนด ให้ใช้ไพ่จาก pool
  if (!selectedCard) {
    const pool = getCardPool(topic);
    selectedCard = pool[0] || TAROT_DECK[0];
  }

  // สร้าง prompt สัญลักษณ์ที่เฉพาะเจาะจงสำหรับไพ่ใบนี้
  const promptSymbols = `${selectedCard.name} tarot card symbolism, ${topicInfo.symbolDescEn}`;

  return {
    card: selectedCard,
    topic,
    promptSymbols,
  };
}

export function getTopicPool(topic: WallpaperTopic): TarotCard[] {
  return getCardPool(topic);
}
