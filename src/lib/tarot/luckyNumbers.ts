// Lucky Numbers by Topic — เลขมงคลตามเรื่องที่ต้องการเสริมดวง
// ใช้สำหรับวอลเปเปอร์เสริมดวง

import type { WallpaperTopic } from "./topicPools";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface LuckyNumberOption {
  num: number;
  score: number; // 1-10 คะแนนเสริมดวง
  reasonTh: string;
}

// ──────────────────────────────────────────────
// เลขมงคลตามเรื่อง
// อิงหลักเลขศาสตร์ไทย + ความหมายตัวเลข
// ──────────────────────────────────────────────

export const LUCKY_NUMBERS: Record<WallpaperTopic, LuckyNumberOption[]> = {
  finance: [
    { num: 8, score: 9, reasonTh: "เลข 8 = ความมั่งคั่ง ร่ำรวย ไม่มีที่สิ้นสุด" },
    { num: 1, score: 7, reasonTh: "เลข 1 = จุดเริ่มต้นแห่งความสำเร็จ ผู้นำ" },
    { num: 9, score: 8, reasonTh: "เลข 9 = ก้าวหน้า ยิ่งใหญ่ เลขพระราชา" },
    { num: 6, score: 6, reasonTh: "เลข 6 = ความมั่นคง หยั่งรากลึก" },
    { num: 3, score: 5, reasonTh: "เลข 3 = การเติบโต ขยายกิจการ" },
  ],
  career: [
    { num: 1, score: 9, reasonTh: "เลข 1 = ผู้นำ เริ่มต้นใหม่ ก้าวขึ้นสูง" },
    { num: 6, score: 8, reasonTh: "เลข 6 = ความรับผิดชอบ ความมั่นคงในงาน" },
    { num: 8, score: 7, reasonTh: "เลข 8 = อำนาจ ความสำเร็จ ความก้าวหน้า" },
    { num: 9, score: 6, reasonTh: "เลข 9 = ผู้ยิ่งใหญ่ เป็นที่ยอมรับ" },
    { num: 4, score: 5, reasonTh: "เลข 4 = ความมุ่งมั่น ทำงานหนัก เห็นผล" },
  ],
  love: [
    { num: 2, score: 9, reasonTh: "เลข 2 = คู่รัก ความสัมพันธ์ กลมเกลียว" },
    { num: 6, score: 8, reasonTh: "เลข 6 = ครอบครัว ความรักอบอุ่น" },
    { num: 9, score: 7, reasonTh: "เลข 9 = ความรักยิ่งใหญ่ นิรันดร์" },
    { num: 3, score: 6, reasonTh: "เลข 3 = ความสุข สดใส มีเสน่ห์" },
    { num: 7, score: 5, reasonTh: "เลข 7 = ลึกซึ้ง เข้าใจกัน ผูกพัน" },
  ],
  luck: [
    { num: 9, score: 9, reasonTh: "เลข 9 = โชคใหญ่ เลขมหามงคล พระราชา" },
    { num: 3, score: 8, reasonTh: "เลข 3 = โชคลาภ มีแรงดึงดูดสิ่งดี" },
    { num: 7, score: 7, reasonTh: "เลข 7 = โชคชะตา จังหวะดี ดวงเปิด" },
    { num: 1, score: 6, reasonTh: "เลข 1 = เริ่มต้นใหม่ด้วยพลังบวก" },
    { num: 5, score: 5, reasonTh: "เลข 5 = การเปลี่ยนแปลง โอกาสใหม่" },
  ],
  health: [
    { num: 5, score: 9, reasonTh: "เลข 5 = สมดุล สุขภาพดี ห่างไกลโรค" },
    { num: 3, score: 7, reasonTh: "เลข 3 = พลังชีวิต ร่าเริง สดใส" },
    { num: 7, score: 8, reasonTh: "เลข 7 = จิตใจสงบ สมาธิ เยียวยา" },
    { num: 9, score: 6, reasonTh: "เลข 9 = อายุยืนยาว แข็งแรง" },
    { num: 2, score: 5, reasonTh: "เลข 2 = สมดุลกาย-ใจ หยินหยาง" },
  ],
};

export function getLuckyNumbers(topic: WallpaperTopic): LuckyNumberOption[] {
  return LUCKY_NUMBERS[topic];
}
