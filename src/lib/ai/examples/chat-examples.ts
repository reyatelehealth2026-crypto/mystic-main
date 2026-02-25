import { FewShotExample } from "../types";

/**
 * Few-shot examples for Tarot Chat follow-up conversations
 * 
 * These examples demonstrate expert-level chat responses that:
 * - Reference specific cards from the original reading
 * - Provide empathetic and insightful responses
 * - Keep responses concise (1-3 paragraphs) for chat format
 * - Acknowledge user feelings while providing grounded perspective
 * - Focus on what the user can control
 * - Provide realistic timeframes when asked about timing
 * - Maintain conversation history context
 * - Use warm, conversational Thai language
 */

/**
 * Example 1: Follow-up about timing - Realistic timeframe guidance
 * Demonstrates: Card-based timing, realistic expectations, actionable steps
 */
export const CHAT_TIMING_QUESTION: FewShotExample = {
  scenario: "User asks about timing after career reading",
  input: `ข้อมูลอ่านไพ่:
คำถามตั้งต้น: ควรเปลี่ยนงานหรือไม่
จำนวนไพ่: 3
ไพ่ที่เปิดได้:
1. The Sun (ตั้งตรง) => ความสำเร็จ ความสุข พลังงานบวก
2. Two of Pentacles (ตั้งตรง) => การจัดการหลายเรื่อง ความยืดหยุ่น
3. Ace of Wands (ตั้งตรง) => จุดเริ่มต้นใหม่ แรงบันดาลใจ

บริบทบทสนทนาก่อนหน้า:
(ยังไม่มี)

คำถามล่าสุดจากผู้ใช้:
ถ้าจะเปลี่ยนงาน ควรทำเมื่อไหร่ดีคะ`,
  output: `จากไพ่ที่เปิด Ace of Wands บอกว่าโอกาสนี้มีกรอบเวลา ไม่ควรรอนานเกินไป แนะนำให้ตัดสินใจภายใน 1-2 เดือนนี้ เพราะพลังงานของ Ace of Wands เป็นพลังแห่งจุดเริ่มต้นที่สดใหม่ ถ้ารอนานเกินไปโอกาสอาจเลื่อนลอยหรือมีคนอื่นคว้าไปก่อน

Two of Pentacles เตือนว่าช่วงนี้คุณอาจต้องจัดการหลายเรื่องพร้อมกัน ดังนั้นก่อนตัดสินใจควรเตรียมตัวให้พร้อม เช่น เก็บเงินสำรองไว้ 3-6 เดือน รวบรวมข้อมูลงานใหม่ให้ครบ และจัดการเรื่องส่วนตัวให้เรียบร้อย แล้วค่อยก้าวไปข้างหน้าด้วยความมั่นใจ

The Sun บอกว่าคุณมีพื้นฐานที่ดีอยู่แล้ว เชื่อมั่นในตัวเองและลงมือทำเมื่อพร้อม อย่ากลัวการเปลี่ยนแปลง เพราะไพ่บอกว่านี่คือทางที่ถูกต้องสำหรับคุณ`,
  notes: "Shows timing question with card-based timeframe, practical preparation steps, and encouragement"
};

/**
 * Example 2: Follow-up about other people - Focus on user's control
 * Demonstrates: Empathetic acknowledgment, refocus on user's agency, constructive guidance
 */
export const CHAT_OTHER_PEOPLE_QUESTION: FewShotExample = {
  scenario: "User asks about another person's feelings after relationship reading",
  input: `ข้อมูลอ่านไพ่:
คำถามตั้งต้น: ความสัมพันธ์จะไปต่อได้ไหม
จำนวนไพ่: 3
ไพ่ที่เปิดได้:
1. Five of Cups (ตั้งตรง) => ความผิดหวัง การสูญเสีย
2. The Tower (ตั้งตรง) => การพังทลาย การเปลี่ยนแปลงกะทันหัน
3. Six of Swords (ตั้งตรง) => การเดินทางออกจากความยากลำบาก

บริบทบทสนทนาก่อนหน้า:
ผู้ใช้: ความสัมพันธ์จะไปต่อได้ไหม
ผู้ช่วย: ไพ่สะท้อนว่าความสัมพันธ์นี้ผ่านความผิดหวังมาแล้ว และตอนนี้กำลังเผชิญจุดเปลี่ยนครั้งใหญ่...

คำถามล่าสุดจากผู้ใช้:
แล้วอีกฝ่ายยังรักเราอยู่ไหมคะ`,
  output: `เข้าใจความรู้สึกที่อยากรู้ว่าอีกฝ่ายคิดอย่างไร แต่ไพ่ที่เปิดมาบอกเรื่องของคุณมากกว่า ไม่ใช่เรื่องของเขา Five of Cups และ The Tower บอกว่าความสัมพันธ์นี้มีรอยร้าวและกำลังเปลี่ยนแปลง ไม่ว่าอีกฝ่ายจะรู้สึกอย่างไร สิ่งสำคัญคือคุณรู้สึกอย่างไรและต้องการอะไร

Six of Swords บอกว่าคุณกำลังเดินทางไปสู่ที่ที่สงบกว่า คำถามที่ควรถามตัวเองคือ "ความสัมพันธ์นี้ยังทำให้ฉันมีความสุขไหม" และ "ฉันยังต้องการต่อสู้เพื่อมันอีกไหม" แทนที่จะรอคำตอบจากอีกฝ่าย ลองคุยกันตรงๆ ว่าทั้งคู่ยังต้องการอะไรจากความสัมพันธ์นี้ การสื่อสารที่ชัดเจนจะช่วยให้คุณเห็นภาพที่แท้จริง`,
  notes: "Shows question about others with empathetic acknowledgment, refocus on user's agency, and communication guidance"
};

/**
 * All chat examples grouped by question type
 */
export const CHAT_EXAMPLES_BY_TYPE = {
  timing: [CHAT_TIMING_QUESTION],
  otherPeople: [CHAT_OTHER_PEOPLE_QUESTION]
};

/**
 * All chat examples in a flat array
 */
export const CHAT_EXAMPLES: FewShotExample[] = [
  CHAT_TIMING_QUESTION,
  CHAT_OTHER_PEOPLE_QUESTION
];
