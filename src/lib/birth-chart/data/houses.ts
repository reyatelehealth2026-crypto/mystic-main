import { ThaiZodiacSign, ThaiPlanet } from "../types";

export interface HouseMeaning {
  index: number;
  thaiName: string;
  shortName: string;
  domain: string;
  description: string;
}

export const THAI_HOUSES: HouseMeaning[] = [
  {
    index: 1,
    thaiName: "ตนุ",
    shortName: "ภพตนุ",
    domain: "ตัวตน บุคลิก",
    description: "ภพแรกบ่งบอกตัวตนภายนอกของคุณ บุคลิก การปรากฏตัวต่อคนรอบข้าง รวมถึงสุขภาพร่างกายและพลังชีวิตโดยรวม",
  },
  {
    index: 2,
    thaiName: "กดุมพะ",
    shortName: "ภพกดุมพะ",
    domain: "ทรัพย์ คำพูด",
    description: "ภพนี้ปกครองทรัพย์สินที่หามาด้วยตนเอง คำพูด อาหาร การเงินส่วนตัว และคุณค่าที่คุณยึดถือ",
  },
  {
    index: 3,
    thaiName: "สหัชชะ",
    shortName: "ภพสหัชชะ",
    domain: "พี่น้อง การเดินทาง",
    description: "ภพแห่งพี่น้อง ญาติใกล้ตัว การสื่อสารและการเดินทางระยะใกล้ ทักษะการเรียนรู้และความกล้า",
  },
  {
    index: 4,
    thaiName: "พันธุ",
    shortName: "ภพพันธุ",
    domain: "ครอบครัว ที่อยู่",
    description: "ภพของครอบครัวต้นกำเนิด บ้านที่อยู่ ที่ดิน ความสุขภายในและรากเหง้าทางจิตใจ",
  },
  {
    index: 5,
    thaiName: "ปุตตะ",
    shortName: "ภพปุตตะ",
    domain: "บุตร ความคิดสร้างสรรค์",
    description: "ภพของบุตรหรือลูกศิษย์ ความคิดสร้างสรรค์ ความรักที่สนุก การลงทุนที่เสี่ยง ความบันเทิง",
  },
  {
    index: 6,
    thaiName: "อริ",
    shortName: "ภพอริ",
    domain: "ศัตรู โรคภัย",
    description: "ภพแห่งอุปสรรค คู่แข่ง โรคภัย หนี้สิน และการรับมือกับความท้าทาย รวมถึงการรับใช้ผู้อื่น",
  },
  {
    index: 7,
    thaiName: "ปัตนิ",
    shortName: "ภพปัตนิ",
    domain: "คู่ครอง หุ้นส่วน",
    description: "ภพของคู่ครอง หุ้นส่วนทางธุรกิจ การสมรส ความสัมพันธ์ระยะยาว และคู่ตรงข้าม",
  },
  {
    index: 8,
    thaiName: "มรณะ",
    shortName: "ภพมรณะ",
    domain: "ความตาย มรดก",
    description: "ภพแห่งการเปลี่ยนแปลงครั้งใหญ่ มรดก เรื่องลึกลับ ความตาย และพลังจิตที่ถ่ายทอด",
  },
  {
    index: 9,
    thaiName: "ศุภะ",
    shortName: "ภพศุภะ",
    domain: "ครูบาอาจารย์ บุญ",
    description: "ภพแห่งโชควาสนา การเดินทางไกล ศาสนา ปรัชญา การศึกษาขั้นสูง ครูบาอาจารย์และบุญเก่า",
  },
  {
    index: 10,
    thaiName: "กรรมะ",
    shortName: "ภพกรรมะ",
    domain: "การงาน เกียรติยศ",
    description: "ภพของอาชีพ ตำแหน่ง เกียรติยศ ชื่อเสียงต่อสังคม และเป้าหมายระยะยาวในชีวิต",
  },
  {
    index: 11,
    thaiName: "ลาภะ",
    shortName: "ภพลาภะ",
    domain: "ลาภลอย มิตร",
    description: "ภพแห่งลาภที่ไม่คาดคิด รายได้พิเศษ มิตรสหาย กลุ่มสังคม และความหวังที่คุณยึดเหนี่ยว",
  },
  {
    index: 12,
    thaiName: "วินาศนะ",
    shortName: "ภพวินาศนะ",
    domain: "ค่าใช้จ่าย สงบ",
    description: "ภพของรายจ่ายและการสูญเสีย ความสันโดษ การปฏิบัติธรรม โรงพยาบาล และความฝัน",
  },
];

const SIGN_ORDER: ThaiZodiacSign[] = [
  ThaiZodiacSign.MES,
  ThaiZodiacSign.PHRUET,
  ThaiZodiacSign.MITHUN,
  ThaiZodiacSign.KRAKAT,
  ThaiZodiacSign.SING,
  ThaiZodiacSign.KUN,
  ThaiZodiacSign.TUN,
  ThaiZodiacSign.PHIK,
  ThaiZodiacSign.THANU,
  ThaiZodiacSign.MAKOK,
  ThaiZodiacSign.KUM,
  ThaiZodiacSign.MIN,
];

export const SIGN_RULERS: Record<ThaiZodiacSign, ThaiPlanet> = {
  [ThaiZodiacSign.MES]: ThaiPlanet.ANGKAN,
  [ThaiZodiacSign.PHRUET]: ThaiPlanet.SUK,
  [ThaiZodiacSign.MITHUN]: ThaiPlanet.PHUT,
  [ThaiZodiacSign.KRAKAT]: ThaiPlanet.CHAN,
  [ThaiZodiacSign.SING]: ThaiPlanet.ATHIT,
  [ThaiZodiacSign.KUN]: ThaiPlanet.PHUT,
  [ThaiZodiacSign.TUN]: ThaiPlanet.SUK,
  [ThaiZodiacSign.PHIK]: ThaiPlanet.ANGKAN,
  [ThaiZodiacSign.THANU]: ThaiPlanet.PHAHAT,
  [ThaiZodiacSign.MAKOK]: ThaiPlanet.SAO,
  [ThaiZodiacSign.KUM]: ThaiPlanet.SAO,
  [ThaiZodiacSign.MIN]: ThaiPlanet.PHAHAT,
};

export function signFromIndex(index: number): ThaiZodiacSign {
  const i = ((index % 12) + 12) % 12;
  return SIGN_ORDER[i];
}

export function signIndex(sign: ThaiZodiacSign): number {
  return SIGN_ORDER.indexOf(sign);
}

export function getHouseSign(ascendant: ThaiZodiacSign, houseIndex: number): ThaiZodiacSign {
  const ascIdx = signIndex(ascendant);
  return signFromIndex(ascIdx + houseIndex - 1);
}
