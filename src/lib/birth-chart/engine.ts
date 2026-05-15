import {
  BirthChart,
  BirthChartInput,
  BirthChartReading,
  HousePlacement,
  InterpretationSection,
  ThaiDay,
  ThaiZodiacSign,
} from "./types";
import { getThaiYearAnimal, getElementFromAnimal } from "@/lib/thai-astrology/engine";
import {
  getSunSiderealLongitude,
  getSiderealAscendant,
  longitudeToSignIndex,
} from "./astronomy";
import { DEFAULT_PROVINCE_ID, findProvince } from "./data/provinces";
import { LAKKANA_TABLE } from "./data/lakkana";
import { DAY_PLANET_TABLE, DAY_TO_PLANET } from "./data/dayPlanet";
import { THAI_HOUSES, SIGN_RULERS, getHouseSign, signFromIndex } from "./data/houses";

const THAI_TZ_OFFSET_MS = 7 * 60 * 60 * 1000;

function getThaiLocalDayOfWeek(date: Date): ThaiDay {
  const shifted = new Date(date.getTime() + THAI_TZ_OFFSET_MS);
  const dow = shifted.getUTCDay();
  const map: ThaiDay[] = [
    ThaiDay.ARWAN,
    ThaiDay.JAN,
    ThaiDay.ANGKAN,
    ThaiDay.PHUT,
    ThaiDay.PHAHAT,
    ThaiDay.SUK,
    ThaiDay.SAO,
  ];
  return map[dow];
}

const DISCLAIMER =
  "ดวงพิชัยสงครามนี้คำนวณจากตำราโหราศาสตร์ไทยสายสิทธาญา (ลาหิรี อายนางศะ) ใช้เพื่อสะท้อนแนวโน้มและการตัดสินใจของคุณ ไม่ใช่คำพยากรณ์ที่แน่นอนตายตัว";

export function computeBirthChart(input: BirthChartInput): BirthChart {
  const province = findProvince(input.province ?? DEFAULT_PROVINCE_ID);
  const timeKnown = !!input.birthTime;

  const thaiLocal = new Date(input.birthDate.getTime() + THAI_TZ_OFFSET_MS);
  const y = thaiLocal.getUTCFullYear();
  const m = thaiLocal.getUTCMonth();
  const d = thaiLocal.getUTCDate();
  const hour = input.birthTime ? input.birthTime.hour : 12;
  const minute = input.birthTime ? input.birthTime.minute : 0;
  const utc = new Date(Date.UTC(y, m, d, hour - 7, minute, 0));

  const sunLongitude = getSunSiderealLongitude(utc);
  const sunSign = signFromIndex(longitudeToSignIndex(sunLongitude));

  let ascendant: ThaiZodiacSign | undefined;
  let houses: HousePlacement[] | undefined;
  if (timeKnown) {
    const ascLongitude = getSiderealAscendant(utc, province.lat, province.lng);
    ascendant = signFromIndex(longitudeToSignIndex(ascLongitude));
    houses = THAI_HOUSES.map((h) => {
      const sign = getHouseSign(ascendant!, h.index);
      return {
        house: h.index,
        sign,
        ruler: SIGN_RULERS[sign],
        meaning: h.description,
      };
    });
  }

  const day = getThaiLocalDayOfWeek(input.birthDate);
  const dayPlanet = DAY_TO_PLANET[day];
  const yearAnimal = getThaiYearAnimal(new Date(Date.UTC(y, m, d)));
  const element = getElementFromAnimal(yearAnimal);

  return {
    input: {
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      timeKnown,
      province: province.name,
      lat: province.lat,
      lng: province.lng,
    },
    ascendant,
    sunSign,
    day,
    dayPlanet,
    yearAnimal,
    element,
    houses,
  };
}

export function interpretBirthChart(chart: BirthChart): BirthChartReading {
  const sections: InterpretationSection[] = [];

  if (chart.ascendant) {
    const l = LAKKANA_TABLE[chart.ascendant];
    sections.push({
      title: `ลัคนาราศี ${l.nameTh} ${l.symbol} (เจ้าเรือนคือ${planetTh(l.ruler)})`,
      paragraphs: [
        l.personality,
        `จุดแข็ง: ${l.strength}`,
        `ข้อควรระวัง: ${l.warning}`,
        `ความรัก: ${l.love}`,
        `การงาน: ${l.career}`,
      ],
    });
  } else {
    sections.push({
      title: "ลัคนาราศี",
      paragraphs: [
        "ยังไม่ทราบเวลาเกิดที่แน่นอน จึงยังไม่สามารถผูกลัคนาให้แม่นยำได้ หากต้องการอ่านลัคนาและภพทั้ง ๑๒ ครบ กรุณาระบุเวลาเกิดให้ใกล้เคียงที่สุด อย่างน้อยระดับชั่วโมง",
      ],
    });
  }

  const sun = LAKKANA_TABLE[chart.sunSign];
  sections.push({
    title: `ราศีอาทิตย์: ${sun.nameTh} ${sun.symbol}`,
    paragraphs: [
      `ราศีอาทิตย์สะท้อนตัวตนภายในและบทบาทที่คุณเล่นต่อโลก คุณมีพลังของชาว${sun.nameTh}: ${sun.personality}`,
    ],
  });

  const dp = DAY_PLANET_TABLE[chart.day];
  sections.push({
    title: `ดาวประจำวันเกิด: ${dp.planetNameTh} ${dp.symbol}`,
    paragraphs: [
      dp.trait,
      `ของขวัญจากดาว: ${dp.blessing}`,
      `สิ่งที่ต้องระวัง: ${dp.caution}`,
      `สีมงคลประจำตัว: ${dp.color}`,
    ],
  });

  if (chart.houses) {
    const housesIntro = "ภพทั้ง ๑๒ บ่งบอกพื้นที่ในชีวิตที่ดาวเข้ามามีอิทธิพล โดยมีราศีและดาวเจ้าเรือนกำกับแต่ละภพ";
    const houseLines = chart.houses.map((h) => {
      const sign = LAKKANA_TABLE[h.sign];
      const sub = THAI_HOUSES[h.house - 1];
      return `• ภพที่ ${h.house} ${sub.thaiName} (${sub.domain}) — ราศี${sign.nameTh} ${sign.symbol} เจ้าเรือนคือ${planetTh(h.ruler)}`;
    });
    sections.push({
      title: "ภพทั้ง ๑๒",
      paragraphs: [housesIntro, ...houseLines],
    });
  }

  return {
    chart,
    sections,
    disclaimer: DISCLAIMER,
  };
}

export function buildBirthChartReading(input: BirthChartInput): BirthChartReading {
  return interpretBirthChart(computeBirthChart(input));
}

function planetTh(planet: BirthChart["dayPlanet"]): string {
  const map: Record<string, string> = {
    athit: "พระอาทิตย์",
    chan: "พระจันทร์",
    angkan: "พระอังคาร",
    phut: "พระพุธ",
    phahat: "พระพฤหัสบดี",
    suk: "พระศุกร์",
    sao: "พระเสาร์",
  };
  return map[planet] ?? planet;
}
