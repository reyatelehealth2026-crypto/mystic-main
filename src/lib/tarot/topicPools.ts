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

export interface TopicSymbols {
  topic: WallpaperTopic;
  symbols: string; // สัญลักษณ์มงคลสำหรับสร้างภาพ
  symbolsTh: string; // คำอธิบายภาษาไทย
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
// ดึงสัญลักษณ์มงคลจากไพ่ที่เหมาะสมสำหรับการเสริมดวง
// ──────────────────────────────────────────────

// สัญลักษณ์มงคลเฉพาะของแต่ละไพ่
const CARD_AUSPICIOUS_SYMBOLS: Record<string, { en: string; th: string }> = {
  // Pentacles - เหรียญทอง
  "pen10": { en: "golden coins raining down, family prosperity, abundant wealth, treasure chest", th: "เหรียญทองโปรยปราย ความมั่งคั่งของครอบครัว ขุมทรัพย์" },
  "pen09": { en: "golden pentacles garden, luxury vineyard, financial independence, prosperity", th: "สวนเหรียญทอง ความอุดมสมบูรณ์ ความมั่งคั่งส่วนตัว" },
  "penA": { en: "giant golden pentacle, new opportunity gate, prosperity seed, wealth manifestation", th: "เหรียญทองยักษ์ ประตูโอกาสใหม่ เมล็ดพันธุ์ความมั่งคั่ง" },
  
  // Wands - ไม้เท้าและพลังไฟ
  "wan03": { en: "three wands on mountain peak, ships sailing to success, expansion vision", th: "ไม้เท้าสามอันบนยอดเขา เรือแล่นสู่ความสำเร็จ วิสัยทัศน์กว้างไกล" },
  "wan06": { en: "victory laurel wreath, champion on horseback, triumph celebration, success parade", th: "พวงมาลัยชัยชนะ แชมป์บนหลังม้า ขบวนแห่ความสำเร็จ" },
  "wanA": { en: "blazing wand from clouds, divine opportunity, creative spark, new beginning flame", th: "ไม้เท้าลุกเป็นไฟจากเมฆ โอกาสจากสวรรค์ ประกายความคิดสร้างสรรค์" },
  
  // Cups - ถ้วยและน้ำ
  "cup02": { en: "two golden chalices united, caduceus of harmony, love bond, partnership blessing", th: "ถ้วยทองสองใบหลอมรวม สายสัมพันธ์แห่งรัก พรแห่งคู่ครอง" },
  "cup10": { en: "rainbow of ten cups, family joy, eternal happiness, blessed home", th: "รุ้งกะรัตแห่งความสุข สิบถ้วยแห่งความสุขครอบครัว บ้านที่ได้รับพร" },
  "cupA": { en: "overflowing golden chalice, dove of love, lotus bloom, emotional abundance", th: "ถ้วยทองล้นพ้น นกพิราบแห่งความรัก ดอกบัวบาน" },
  
  // Major Arcana
  "maj01": { en: "infinity symbol, magic wand, all elements mastery, manifestation power", th: "สัญลักษณ์อนันต์ ไม้กายสิทธิ์ พลังสร้างสรรค์" },
  "maj03": { en: "empress crown, abundant harvest, fertile garden, mother nature blessing", th: "มงกุฎจักรพรรดินี สวนอุดมสมบูรณ์ พรจากธรรมชาติ" },
  "maj04": { en: "throne of authority, ram symbols, leadership crown, solid foundation", th: "บัลลังก์แห่งอำนาจ มงกุฎผู้นำ รากฐานมั่นคง" },
  "maj06": { en: "angel of love blessing, twin flames, sacred union, divine partnership", th: "เทวดาแห่งความรักอวยพร เปลวไฟคู่ สหภาพศักดิ์สิทธิ์" },
  "maj07": { en: "victory chariot, star crown, sphinxes power, triumph journey", th: "รถรบชัยชนะ มงกุฎดาว พลังสฟิงซ์" },
  "maj08": { en: "gentle strength, lion tamed with love, infinite courage, inner power", th: "พลังอ่อนโยน สิงโตที่ถูกทำให้เชื่อง ความกล้าหาญไร้ขีดจำกัด" },
  "maj10": { en: "wheel of fortune spinning, sphinx guardian, ascending cycle, divine timing", th: "วงล้อแห่งโชคชะตาหมุน ผู้พิทักษ์สฟิงซ์ รอบแห่งความรุ่งเรือง" },
  "maj14": { en: "angel of balance, mixing golden cups, harmony flow, perfect equilibrium", th: "เทวดาแห่งสมดุล ถ้วยทองผสมผสาน กระแสแห่งความกลมกลืน" },
  "maj17": { en: "bright star of hope, eternal spring, healing waters, divine guidance", th: "ดาวแห่งความหวัง น้ำพุแห่งการเยียวยา แสงนำทางจากสวรรค์" },
  "maj19": { en: "radiant sun, sunflowers blooming, child of joy, infinite vitality", th: "ดวงอาทิตย์เปล่งรัศมี ทานตะวันบาน เด็กแห่งความสุข" },
  "maj21": { en: "world completion, victory wreath, four elements harmony, cosmic dance", th: "ความสมบูรณ์แห่งโลก พวงมาลัยชัยชนะ สี่ธาตุกลมกลืน" },
};

export function getTopicSymbols(topic: WallpaperTopic): TopicSymbols {
  const bestCardIds = BEST_CARDS_FOR_TOPIC[topic];
  const topicInfo = TOPIC_INFO[topic];

  // หาไพ่มงคลที่เหมาะสมที่สุด
  let cardSymbols = { en: topicInfo.symbolDescEn, th: topicInfo.symbolDescTh };
  
  for (const cardId of bestCardIds) {
    if (CARD_AUSPICIOUS_SYMBOLS[cardId]) {
      cardSymbols = CARD_AUSPICIOUS_SYMBOLS[cardId];
      break; // ใช้สัญลักษณ์จากไพ่มงคลแรกที่เจอ
    }
  }

  // รวมสัญลักษณ์จากหมวดหมู่ + ไพ่มงคล
  const combinedSymbols = `${cardSymbols.en}, ${topicInfo.symbolDescEn}`;
  const combinedSymbolsTh = `${cardSymbols.th} ${topicInfo.symbolDescTh}`;

  return {
    topic,
    symbols: combinedSymbols,
    symbolsTh: combinedSymbolsTh,
  };
}

export function getTopicPool(topic: WallpaperTopic): TarotCard[] {
  return getCardPool(topic);
}
