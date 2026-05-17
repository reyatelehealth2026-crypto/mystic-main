/**
 * Thai provinces (จังหวัด) with the geographic coordinates of each
 * provincial capital (อำเภอเมือง). All 77 provinces, plus Bangkok.
 *
 * Coordinates are from Wikipedia TH "จังหวัด<...>" infobox and
 * OpenStreetMap; rounded to 4 decimal places (~11 m precision, which is
 * far below the natal-chart resolution we need).
 *
 * Regions follow the 6-region classification published by the Royal
 * Society of Thailand (ราชบัณฑิตยสภา): กลาง / ตะวันออก / เหนือ /
 * ตะวันออกเฉียงเหนือ / ใต้ / ตะวันตก. ภาคกลาง here includes Bangkok
 * and its five neighbouring provinces (ปริมณฑล), matching official usage.
 */

export type ThaiRegion =
  | "central"
  | "east"
  | "north"
  | "northeast"
  | "south"
  | "west";

export const REGION_NAMES: Record<ThaiRegion, string> = {
  central: "ภาคกลาง",
  east: "ภาคตะวันออก",
  north: "ภาคเหนือ",
  northeast: "ภาคตะวันออกเฉียงเหนือ",
  south: "ภาคใต้",
  west: "ภาคตะวันตก",
};

export interface ThaiProvince {
  id: string;
  name: string;
  region: ThaiRegion;
  latitude: number;
  longitude: number;
}

export const THAI_PROVINCES: ThaiProvince[] = [
  { id: "bangkok",          name: "กรุงเทพมหานคร",      region: "central",   latitude: 13.7563, longitude: 100.5018 },
  { id: "samut-prakan",     name: "สมุทรปราการ",        region: "central",   latitude: 13.5990, longitude: 100.5998 },
  { id: "nonthaburi",       name: "นนทบุรี",            region: "central",   latitude: 13.8622, longitude: 100.5134 },
  { id: "pathum-thani",     name: "ปทุมธานี",           region: "central",   latitude: 14.0208, longitude: 100.5253 },
  { id: "ayutthaya",        name: "พระนครศรีอยุธยา",   region: "central",   latitude: 14.3692, longitude: 100.5876 },
  { id: "ang-thong",        name: "อ่างทอง",            region: "central",   latitude: 14.5896, longitude: 100.4549 },
  { id: "lopburi",          name: "ลพบุรี",             region: "central",   latitude: 14.7995, longitude: 100.6534 },
  { id: "sing-buri",        name: "สิงห์บุรี",          region: "central",   latitude: 14.8909, longitude: 100.4046 },
  { id: "chai-nat",         name: "ชัยนาท",             region: "central",   latitude: 15.1851, longitude: 100.1251 },
  { id: "saraburi",         name: "สระบุรี",            region: "central",   latitude: 14.5289, longitude: 100.9101 },
  { id: "nakhon-pathom",    name: "นครปฐม",             region: "central",   latitude: 13.8196, longitude: 100.0444 },
  { id: "samut-sakhon",     name: "สมุทรสาคร",          region: "central",   latitude: 13.5475, longitude: 100.2745 },
  { id: "samut-songkhram",  name: "สมุทรสงคราม",        region: "central",   latitude: 13.4098, longitude: 100.0021 },
  { id: "suphan-buri",      name: "สุพรรณบุรี",         region: "central",   latitude: 14.4744, longitude: 100.1177 },
  { id: "phichit",          name: "พิจิตร",             region: "central",   latitude: 16.4429, longitude: 100.3487 },
  { id: "phitsanulok",      name: "พิษณุโลก",           region: "central",   latitude: 16.8211, longitude: 100.2659 },
  { id: "phetchabun",       name: "เพชรบูรณ์",          region: "central",   latitude: 16.4189, longitude: 101.1591 },
  { id: "sukhothai",        name: "สุโขทัย",            region: "central",   latitude: 17.0066, longitude: 99.8265  },
  { id: "uttaradit",        name: "อุตรดิตถ์",          region: "north",     latitude: 17.6203, longitude: 100.0935 },
  { id: "kamphaeng-phet",   name: "กำแพงเพชร",          region: "central",   latitude: 16.4827, longitude: 99.5226  },
  { id: "nakhon-sawan",     name: "นครสวรรค์",          region: "central",   latitude: 15.7047, longitude: 100.1372 },
  { id: "uthai-thani",      name: "อุทัยธานี",          region: "central",   latitude: 15.3835, longitude: 100.0247 },

  { id: "chonburi",         name: "ชลบุรี",             region: "east",      latitude: 13.3611, longitude: 100.9847 },
  { id: "rayong",           name: "ระยอง",              region: "east",      latitude: 12.6802, longitude: 101.2516 },
  { id: "chanthaburi",      name: "จันทบุรี",           region: "east",      latitude: 12.6113, longitude: 102.1035 },
  { id: "trat",             name: "ตราด",               region: "east",      latitude: 12.2428, longitude: 102.5174 },
  { id: "chachoengsao",     name: "ฉะเชิงเทรา",         region: "east",      latitude: 13.6904, longitude: 101.0779 },
  { id: "prachinburi",      name: "ปราจีนบุรี",         region: "east",      latitude: 14.0579, longitude: 101.3722 },
  { id: "nakhon-nayok",     name: "นครนายก",            region: "central",   latitude: 14.2069, longitude: 101.2131 },
  { id: "sa-kaeo",          name: "สระแก้ว",            region: "east",      latitude: 13.8244, longitude: 102.0645 },

  { id: "chiangmai",        name: "เชียงใหม่",          region: "north",     latitude: 18.7883, longitude: 98.9853  },
  { id: "lamphun",          name: "ลำพูน",              region: "north",     latitude: 18.5747, longitude: 99.0087  },
  { id: "lampang",          name: "ลำปาง",              region: "north",     latitude: 18.2888, longitude: 99.4908  },
  { id: "chiangrai",        name: "เชียงราย",           region: "north",     latitude: 19.9105, longitude: 99.8406  },
  { id: "phayao",           name: "พะเยา",              region: "north",     latitude: 19.1664, longitude: 99.9018  },
  { id: "phrae",            name: "แพร่",               region: "north",     latitude: 18.1444, longitude: 100.1404 },
  { id: "nan",              name: "น่าน",               region: "north",     latitude: 18.7756, longitude: 100.7730 },
  { id: "mae-hong-son",     name: "แม่ฮ่องสอน",         region: "north",     latitude: 19.3017, longitude: 97.9657  },
  { id: "tak",              name: "ตาก",                region: "west",      latitude: 16.8835, longitude: 99.1259  },

  { id: "nakhon-ratchasima", name: "นครราชสีมา",        region: "northeast", latitude: 14.9799, longitude: 102.0978 },
  { id: "buriram",          name: "บุรีรัมย์",          region: "northeast", latitude: 14.9930, longitude: 103.1029 },
  { id: "surin",            name: "สุรินทร์",           region: "northeast", latitude: 14.8820, longitude: 103.4960 },
  { id: "si-sa-ket",        name: "ศรีสะเกษ",           region: "northeast", latitude: 15.1186, longitude: 104.3220 },
  { id: "ubon-ratchathani", name: "อุบลราชธานี",        region: "northeast", latitude: 15.2287, longitude: 104.8597 },
  { id: "yasothon",         name: "ยโสธร",              region: "northeast", latitude: 15.7926, longitude: 104.1452 },
  { id: "chaiyaphum",       name: "ชัยภูมิ",            region: "northeast", latitude: 15.8068, longitude: 102.0316 },
  { id: "amnat-charoen",    name: "อำนาจเจริญ",         region: "northeast", latitude: 15.8657, longitude: 104.6266 },
  { id: "bueng-kan",        name: "บึงกาฬ",             region: "northeast", latitude: 18.3609, longitude: 103.6466 },
  { id: "nong-bua-lamphu",  name: "หนองบัวลำภู",        region: "northeast", latitude: 17.2046, longitude: 102.4264 },
  { id: "khonkaen",         name: "ขอนแก่น",            region: "northeast", latitude: 16.4419, longitude: 102.8359 },
  { id: "udonthani",        name: "อุดรธานี",           region: "northeast", latitude: 17.4138, longitude: 102.7872 },
  { id: "loei",             name: "เลย",                region: "northeast", latitude: 17.4860, longitude: 101.7223 },
  { id: "nong-khai",        name: "หนองคาย",            region: "northeast", latitude: 17.8783, longitude: 102.7470 },
  { id: "maha-sarakham",    name: "มหาสารคาม",          region: "northeast", latitude: 16.1851, longitude: 103.3026 },
  { id: "roi-et",           name: "ร้อยเอ็ด",           region: "northeast", latitude: 16.0539, longitude: 103.6520 },
  { id: "kalasin",          name: "กาฬสินธุ์",          region: "northeast", latitude: 16.4322, longitude: 103.5066 },
  { id: "sakon-nakhon",     name: "สกลนคร",             region: "northeast", latitude: 17.1556, longitude: 104.1349 },
  { id: "nakhon-phanom",    name: "นครพนม",             region: "northeast", latitude: 17.4108, longitude: 104.7693 },
  { id: "mukdahan",         name: "มุกดาหาร",           region: "northeast", latitude: 16.5420, longitude: 104.7208 },

  { id: "nakhon-si-thammarat", name: "นครศรีธรรมราช",  region: "south",     latitude: 8.4304,  longitude: 99.9631  },
  { id: "krabi",            name: "กระบี่",             region: "south",     latitude: 8.0863,  longitude: 98.9063  },
  { id: "phang-nga",        name: "พังงา",              region: "south",     latitude: 8.4500,  longitude: 98.5167  },
  { id: "phuket",           name: "ภูเก็ต",             region: "south",     latitude: 7.8804,  longitude: 98.3923  },
  { id: "surat-thani",      name: "สุราษฎร์ธานี",       region: "south",     latitude: 9.1382,  longitude: 99.3216  },
  { id: "ranong",           name: "ระนอง",              region: "south",     latitude: 9.9529,  longitude: 98.6085  },
  { id: "chumphon",         name: "ชุมพร",              region: "south",     latitude: 10.4930, longitude: 99.1800  },
  { id: "songkhla",         name: "สงขลา",              region: "south",     latitude: 7.1899,  longitude: 100.5953 },
  { id: "satun",            name: "สตูล",               region: "south",     latitude: 6.6238,  longitude: 100.0673 },
  { id: "trang",            name: "ตรัง",               region: "south",     latitude: 7.5594,  longitude: 99.6110  },
  { id: "phatthalung",      name: "พัทลุง",             region: "south",     latitude: 7.6166,  longitude: 100.0742 },
  { id: "pattani",          name: "ปัตตานี",            region: "south",     latitude: 6.8694,  longitude: 101.2502 },
  { id: "yala",             name: "ยะลา",               region: "south",     latitude: 6.5413,  longitude: 101.2803 },
  { id: "narathiwat",       name: "นราธิวาส",           region: "south",     latitude: 6.4254,  longitude: 101.8253 },

  { id: "kanchanaburi",     name: "กาญจนบุรี",          region: "west",      latitude: 14.0227, longitude: 99.5328  },
  { id: "ratchaburi",       name: "ราชบุรี",            region: "west",      latitude: 13.5283, longitude: 99.8129  },
  { id: "phetchaburi",      name: "เพชรบุรี",           region: "west",      latitude: 13.1119, longitude: 99.9399  },
  { id: "prachuap",         name: "ประจวบคีรีขันธ์",    region: "west",      latitude: 11.8126, longitude: 99.7958  },
];

export const PROVINCES_BY_REGION: Record<ThaiRegion, ThaiProvince[]> = (() => {
  const map = {
    central: [],
    east: [],
    north: [],
    northeast: [],
    south: [],
    west: [],
  } as Record<ThaiRegion, ThaiProvince[]>;
  for (const p of THAI_PROVINCES) map[p.region].push(p);
  return map;
})();

export function findProvince(id: string): ThaiProvince | undefined {
  return THAI_PROVINCES.find((p) => p.id === id);
}
