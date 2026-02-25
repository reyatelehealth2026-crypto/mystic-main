// Tarot Topic Pools — จัดหมวดไพ่ทาโรต์ตามเรื่องที่ต้องการเสริมดวง
// ใช้สำหรับวอลเปเปอร์เสริมดวง
// Concept: ไพ่หลัก 1 ใบ + ไพ่ขยายความ 2-3 ใบ ต่อ 1 หมวด

import { TAROT_DECK } from "./deck";
import { TarotCard } from "./types";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type WallpaperTopic = "finance" | "career" | "love" | "luck" | "health";

export interface TopicInfo {
  id: WallpaperTopic;
  labelTh: string;
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
    symbolDescEn: "golden pentacle coins, treasure, material abundance, financial prosperity",
    symbolDescTh: "เหรียญทอง ขุมทรัพย์ ความอุดมสมบูรณ์ทางการเงิน",
  },
  career: {
    id: "career",
    labelTh: "การงาน",
    symbolDescEn: "blazing wands, fire of ambition, victory laurels, rising achievement",
    symbolDescTh: "ไม้เท้าลุกไฟ เปลวเพลิงแห่งความมุ่งมั่น พวงมาลัยชัยชนะ",
  },
  love: {
    id: "love",
    labelTh: "ความรัก",
    symbolDescEn: "abundant garden, chalices of love, harmonious union, sacred feminine energy",
    symbolDescTh: "สวนอุดมสมบูรณ์ ถ้วยแห่งความรัก สหภาพที่กลมกลืน พลังหญิงศักดิ์สิทธิ์",
  },
  luck: {
    id: "luck",
    labelTh: "โชคลาภ",
    symbolDescEn: "spinning wheel of fortune, radiant sun, shining stars, golden coins, auspicious blessings",
    symbolDescTh: "วงล้อโชคชะตา ดวงอาทิตย์เปล่งรัศมี ดาวมงคล เหรียญทอง",
  },
  health: {
    id: "health",
    labelTh: "สุขภาพ",
    symbolDescEn: "healing star light, temperance balance, strength vitality, life force energy, renewal",
    symbolDescTh: "แสงดาวเยียวยา ความสมดุล พลังและความแข็งแกร่ง พลังชีวิต การฟื้นคืน",
  },
};

// ──────────────────────────────────────────────
// Card Sets per Topic
// แต่ละหมวดมี: ไพ่หลัก (main) 1 ใบ + ไพ่ขยายความ (supporting) 2-3 ใบ
// ──────────────────────────────────────────────

interface CardSet {
  main: string;         // ไพ่หลักที่เป็นตัวแทนหมวด
  supporting: string[]; // ไพ่ขยายความเสริมพลัง
}

const TOPIC_CARD_SETS: Record<WallpaperTopic, CardSet> = {
  // การเงิน: ไพ่เหรียญ (Pentacles) เน้นความมั่งคั่งและโอกาส
  finance: {
    main: "pen10",        // Ten of Pentacles — ความมั่งคั่งยั่งยืน รากฐานครอบครัว
    supporting: [
      "pen09",            // Nine of Pentacles — ความสำเร็จส่วนตัว ความอุดมสมบูรณ์
      "penA",             // Ace of Pentacles — โอกาสทางการเงินใหม่
      "maj10",            // Wheel of Fortune — จังหวะโชคที่หมุนมา
    ],
  },
  // การงาน: ไพ่ไม้เท้า (Wands) เน้นพลังงาน ความก้าวหน้า และชัยชนะ
  career: {
    main: "wan06",        // Six of Wands — ชัยชนะ การได้รับการยอมรับ
    supporting: [
      "wan03",            // Three of Wands — วิสัยทัศน์กว้างไกล การขยายธุรกิจ
      "wanA",             // Ace of Wands — ประกายโอกาสใหม่
      "maj07",            // The Chariot — ความมุ่งมั่น ความสำเร็จจากความพยายาม
    ],
  },
  // ความรัก: The Empress เป็นไพ่หลัก + ไพ่ถ้วยและ 4 of Wands
  love: {
    main: "maj03",        // The Empress — พลังความรักที่ยิ่งใหญ่ ความอุดมสมบูรณ์
    supporting: [
      "cup02",            // Two of Cups — สายสัมพันธ์ที่สมดุล รักแท้
      "wan04",            // Four of Wands — ความสุขในบ้าน การเฉลิมฉลองความรัก
      "cup10",            // Ten of Cups — ความสุขสมบูรณ์ในครอบครัว
    ],
  },
  // โชคลาภ: Wheel of Fortune เป็นหลัก + ดาว + ดวงอาทิตย์ + เหรียญ
  luck: {
    main: "maj10",        // Wheel of Fortune — วงล้อโชคชะตา จังหวะดวงดี
    supporting: [
      "maj19",            // The Sun — ความสำเร็จ พลังงานบวก
      "maj17",            // The Star — ความหวัง พรจากจักรวาล
      "pen09",            // Nine of Pentacles — ผลของโชคที่เป็นรูปธรรม
    ],
  },
  // สุขภาพ: ใช้ Major Arcana ที่เกี่ยวกับการเยียวยาและพลังชีวิต
  // (ไม่มี suit เฉพาะ — ทุก suit พูดถึงสุขภาพได้)
  health: {
    main: "maj17",        // The Star — แสงเยียวยา ความหวัง การฟื้นฟู
    supporting: [
      "maj14",            // Temperance — สมดุล ความกลมกลืน สุขภาพที่ดี
      "maj08",            // Strength — พลังกายใจ ความแข็งแกร่งจากภายใน
      "maj19",            // The Sun — พลังชีวิต ความมีชีวิตชีวา
    ],
  },
};

function getCardPool(topic: WallpaperTopic): TarotCard[] {
  const set = TOPIC_CARD_SETS[topic];
  const allIds = new Set([set.main, ...set.supporting]);
  return TAROT_DECK.filter((c) => allIds.has(c.id));
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
  const cardSet = TOPIC_CARD_SETS[topic];
  const topicInfo = TOPIC_INFO[topic];

  // ดึงสัญลักษณ์จากไพ่หลัก + ไพ่ขยายความทั้งหมดในเซ็ต
  const allCardIds = [cardSet.main, ...cardSet.supporting];
  const symbolParts: string[] = [];
  const symbolPartsTh: string[] = [];

  for (const cardId of allCardIds) {
    if (CARD_AUSPICIOUS_SYMBOLS[cardId]) {
      symbolParts.push(CARD_AUSPICIOUS_SYMBOLS[cardId].en);
      symbolPartsTh.push(CARD_AUSPICIOUS_SYMBOLS[cardId].th);
    }
  }

  // รวมสัญลักษณ์จากทุกไพ่ในเซ็ต
  const combinedSymbols = symbolParts.length > 0
    ? `${symbolParts.join("; ")}, ${topicInfo.symbolDescEn}`
    : topicInfo.symbolDescEn;

  const combinedSymbolsTh = symbolPartsTh.length > 0
    ? `${symbolPartsTh.join(" ")} ${topicInfo.symbolDescTh}`
    : topicInfo.symbolDescTh;

  return {
    topic,
    symbols: combinedSymbols,
    symbolsTh: combinedSymbolsTh,
  };
}

export function getTopicPool(topic: WallpaperTopic): TarotCard[] {
  return getCardPool(topic);
}
