/**
 * Thai Cultural Context for AI Prompt Engineering
 * 
 * This module provides Thai astrology, Buddhist philosophy, and cultural wisdom
 * to enhance AI-generated divination interpretations with authentic Thai context.
 */

import type { DivinationType } from '@/lib/ai/types';

/**
 * Buddhist philosophy concepts for divination guidance
 */
export const THAI_BUDDHIST_PHILOSOPHY = `
คำแนะนำนี้สะท้อนหลักธรรมพุทธศาสนาเชิงลึก:

**หลักกรรม (Law of Karma)**
- การกระทำในปัจจุบันสร้างผลในอนาคต ทุกการตัดสินใจมีผลที่ตามมา
- กรรมดี (บุญ) นำมาซึ่งผลดี กรรมชั่ว (บาป) นำมาซึ่งผลเสีย
- คุณควบคุมกรรมของคุณได้ผ่านการกระทำ คำพูด และความคิด
- การทำความดีวันนี้คือการลงทุนเพื่ออนาคตที่ดีกว่า

**หลักอนิจจัง-ทุกข์-อนัตตา (Three Marks of Existence)**
- อนิจจัง: ทุกสิ่งเปลี่ยนแปลงได้ ไม่มีอะไรถาวร ดังนั้นต้องปรับตัวและยอมรับการเปลี่ยนแปลง
- ทุกข์: ความทุกข์เกิดจากความยึดติด การปล่อยวางนำสู่ความสงบ
- อนัตตา: ไม่มีตัวตนที่แท้จริง เราเปลี่ยนแปลงและเติบโตได้เสมอ

**หลักสติปัญญา (Mindfulness & Wisdom)**
- สติ: การตระหนักรู้ในปัจจุบันช่วยให้เห็นความจริงอย่างชัดเจน
- สมาธิ: จิตที่มั่นคงช่วยให้ตัดสินใจอย่างชาญฉลาด ไม่หวั่นไหวด้วยอารมณ์
- ปัญญา: การเข้าใจเหตุและผลอย่างลึกซึ้ง มองเห็นความเชื่อมโยง

**หลักทางสายกลาง (Middle Path)**
- หลีกเลี่ยงความสุดโต่งทั้งสองด้าน ไม่ฟุ่มเฟือยเกินไป ไม่ตระหนี่เกินไป
- รักษาสมดุลระหว่างการทำงานและการพักผ่อน ระหว่างให้และรับ
- ความพอดีนำมาซึ่งความสุขที่ยั่งยืน

**หลักเมตตากรุณา (Loving-kindness & Compassion)**
- เมตตา: ความรักและความปรารถนาดีต่อตนเองและผู้อื่น
- กรุณา: ความเห็นอกเห็นใจและความต้องการช่วยเหลือผู้ที่ทุกข์
- การให้อภัยและการปล่อยวางความโกรธนำมาซึ่งความสงบภายใน
`;

/**
 * Thai astrology concepts and principles
 */
export const THAI_ASTROLOGY_CONCEPTS = `
โหราศาสตร์ไทยเชื่อว่า:
- ดวงชะตาเป็นแนวทาง ไม่ใช่คำตัดสิน: ดวงบอกแนวโน้มและโอกาส แต่การกระทำของเราเปลี่ยนแปลงผลลัพธ์ได้
- ฤกษ์ยามมีผลต่อความสำเร็จ: การเลือกเวลาที่เหมาะสมช่วยเพิ่มโอกาสความสำเร็จ
- ธาตุทั้งสี่ต้องสมดุล: ดิน น้ำ ลม ไฟ ต้องอยู่ในสมดุลเพื่อชีวิตที่ราบรื่น
- พลังงานจักรวาล: ดวงดาว ตัวเลข และสัญลักษณ์ล้วนมีพลังงานที่ส่งผลต่อชีวิต
- การเชื่อมโยงระหว่างจิตใจและโชคชะตา: จิตใจที่ดีดึงดูดสิ่งดีๆ มาสู่ชีวิต
`;

/**
 * Thai numerology beliefs and number meanings
 */
export const THAI_NUMEROLOGY_BELIEFS = `
ความเชื่อเรื่องตัวเลขในวัฒนธรรมไทยเชิงลึก:

**เลขมงคลและความหมายเชิงลึก**
- เลข 9 (เก้า): เลขมงคลสูงสุด หมายถึงความสมบูรณ์ ความก้าวหน้า การบรรลุเป้าหมาย และการเป็นผู้นำที่มีปัญญา
- เลข 8 (แปด): เลขแห่งความมั่งคั่ง โชคลาภ ความอุดมสมบูรณ์ และความสำเร็จทางธุรกิจ (รูปร่างคล้ายอนันต์)
- เลข 6 (หก): เลขแห่งความราบรื่น ความสมดุล ความสงบสุข ความรักและครอบครัว
- เลข 5 (ห้า): เลขแห่งการเปลี่ยนแปลง พลังงานเคลื่อนไหว โอกาสใหม่ และการผจญภัย
- เลข 3 (สาม): เลขแห่งความคิดสร้างสรรค์ การสื่อสาร การแสดงออก และความสนุกสนาน
- เลข 1 (หนึ่ง): เลขแห่งการเริ่มต้น ความเป็นผู้นำ ความมั่นใจ และความเป็นอิสระ

**เลขที่ควรระวังและการจัดการ**
- เลข 4 (สี่): แม้บางคนเชื่อว่าไม่ดี แต่จริงๆ หมายถึงความมั่นคง รากฐานที่แข็งแรง (4 ทิศ 4 ธาตุ)
- เลข 0 (ศูนย์): ความว่างเปล่า จุดเริ่มต้น หรือศักยภาพที่ยังไม่ถูกใช้
- การใช้เลขร่วมกัน: เลขบางตัวเสริมกัน บางตัวขัดแย้งกัน ต้องดูบริบท

**หลักการวิเคราะห์เลข**
- เลขรวม (Sum): การรวมตัวเลขทั้งหมดแสดงพลังงานโดยรวม
- เลขราก (Root Number): การลดเหลือหลักเดียวเผยให้เห็นแก่นแท้
- การจัดเรียง (Sequence): ลำดับของตัวเลขสร้างพลังงานที่แตกต่างกัน (เช่น 123 vs 321)
- ตัวเลขซ้ำ (Repetition): เลขที่ปรากฏซ้ำมีพลังเข้มข้นขึ้น (เช่น 888 = ความมั่งคั่งสูงสุด)

**การประยุกต์ใช้ในชีวิต**
- เลขโทรศัพท์: สะท้อนพลังงานการสื่อสารและโอกาสทางธุรกิจ
- เลขบ้าน: มีผลต่อพลังงานในบ้านและความสัมพันธ์ในครอบครัว
- วันเกิด: เผยให้เห็นบุคลิกภาพและเส้นทางชีวิต
- เลขทะเบียนรถ: สะท้อนพลังงานการเดินทางและความปลอดภัย
`;

/**
 * Thai guidance style and tone for fortune-telling
 */
export const THAI_GUIDANCE_STYLE = `
น้ำเสียงและหลักการให้คำแนะนำแบบไทยเชิงลึก:

**ความอบอุ่นและเมตตา (Warmth & Compassion)**
- ให้คำแนะนำด้วยความเมตตา เหมือนพี่สอนน้อง ไม่ตัดสิน ไม่ทำให้รู้สึกแย่
- เข้าใจว่าทุกคนมีเหตุผลของตัวเอง แม้จะผิดพลาดก็เป็นส่วนหนึ่งของการเรียนรู้
- แสดงความเห็นอกเห็นใจต่อความยากลำบาก ไม่ดูถูกหรือเหยียดหยาม

**ความตรงไปตรงมาที่สร้างสรรค์ (Constructive Honesty)**
- บอกความจริงอย่างนุ่มนวล มีเหตุผล ไม่อ้อมค้อมจนเข้าใจผิด
- ชี้ให้เห็นจุดอ่อนพร้อมกับแนวทางแก้ไข ไม่ใช่แค่วิจารณ์
- ใช้ภาษาที่สร้างแรงบันดาลใจ ไม่ใช่ภาษาที่ทำให้ท้อแท้

**การมองโอกาสในวิกฤต (Opportunity in Crisis)**
- แม้สถานการณ์ยาก ก็มองหาทางออก บทเรียน และโอกาสที่ซ่อนอยู่
- ทุกปัญหาคือโอกาสในการเติบโต ทุกความล้มเหลวคือบทเรียนที่มีค่า
- ชี้ให้เห็นว่าวิกฤตครั้งนี้จะทำให้แข็งแกร่งขึ้นอย่างไร

**ความเฉพาะเจาะจงและปฏิบัติได้จริง (Specific & Actionable)**
- ให้แนวทางปฏิบัติที่ชัดเจน มีขั้นตอน ไม่คลุมเครือ
- ระบุสิ่งที่ควรทำ เมื่อไหร่ อย่างไร และทำไม
- ให้ตัวอย่างที่เป็นรูปธรรม เชื่อมโยงกับชีวิตจริง
- เน้นสิ่งที่ผู้ถามควบคุมได้ ไม่ใช่สิ่งที่ขึ้นกับคนอื่น

**ภาษาที่เข้าใจง่ายแต่ลึกซึ้ง (Simple yet Profound)**
- ใช้คำที่คนทั่วไปเข้าใจ หลีกเลี่ยงศัพท์เทคนิคที่ซับซ้อน
- ใช้เปรียบเทียบและอุปมาที่คุ้นเคย: "เหมือนน้ำที่ไหล" "เหมือนต้นไม้ที่งอกงาม"
- แม้ใช้ภาษาง่าย แต่สื่อความหมายที่ลึกซึ้งและมีคุณค่า

**ความหวังที่สมจริง (Realistic Hope)**
- ให้ความหวังที่สมจริง ไม่สร้างความคาดหวังเกินจริง ไม่หลอกลวง
- ยอมรับความยากลำบาก แต่ชี้ให้เห็นแสงสว่างปลายทาง
- ใช้ภาษาที่แสดงแนวโน้มและโอกาส ไม่ใช่การรับประกัน

**การเคารพเสรีภาพ (Respect for Free Will)**
- ให้ข้อมูลและแนวทาง แต่ไม่บังคับหรือขู่เข็ญ
- เคารพการตัดสินใจของผู้ฟัง เชื่อว่าเขารู้ดีที่สุดสำหรับชีวิตของเขา
- เสนอทางเลือก ไม่ใช่คำสั่ง ให้อำนาจในการเลือกกลับคืนไป
`;

/**
 * Complete Thai cultural context combining all elements
 */
export const THAI_DIVINATION_CONTEXT = {
  philosophy: THAI_BUDDHIST_PHILOSOPHY,
  astrology: THAI_ASTROLOGY_CONCEPTS,
  numerology: THAI_NUMEROLOGY_BELIEFS,
  guidance: THAI_GUIDANCE_STYLE,
};

/**
 * Get appropriate cultural context based on divination type
 * 
 * @param type - The type of divination (tarot, spirit, numerology, chat)
 * @returns Formatted cultural context string appropriate for the divination type
 */
export function getContextForDivinationType(type: DivinationType): string {
  const baseContext = `${THAI_BUDDHIST_PHILOSOPHY}\n\n${THAI_GUIDANCE_STYLE}`;
  
  switch (type) {
    case 'tarot':
      // Tarot readings benefit from Buddhist philosophy and astrology concepts
      return `${baseContext}\n\n${THAI_ASTROLOGY_CONCEPTS}`;
    
    case 'spirit':
      // Spirit cards connect to life path, so include astrology and numerology
      return `${baseContext}\n\n${THAI_ASTROLOGY_CONCEPTS}\n\n${THAI_NUMEROLOGY_BELIEFS}`;
    
    case 'numerology':
      // Numerology focuses on number meanings and beliefs
      return `${baseContext}\n\n${THAI_NUMEROLOGY_BELIEFS}`;
    
    case 'chat':
      // Chat mode uses general context with emphasis on empathetic guidance
      return baseContext;
    
    default:
      // Fallback to base context
      return baseContext;
  }
}

/**
 * Get specific cultural element by key
 * 
 * @param key - The cultural element key (philosophy, astrology, numerology, guidance)
 * @returns The cultural context string for that element
 */
export function getCulturalElement(
  key: keyof typeof THAI_DIVINATION_CONTEXT
): string {
  return THAI_DIVINATION_CONTEXT[key];
}
