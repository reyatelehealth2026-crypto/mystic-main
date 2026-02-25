import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FeatureToggles = {
  enableTarot: boolean;
  enableSpiritCard: boolean;
  enableNumerology: boolean;
  enableLoveTarot: boolean;
  enableDailyAuspicious: boolean;
};

export type PackageConfig = {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  priceAlt?: string;
  description: string;
  detail?: string;
  features: string[];
  popular?: boolean;
  href?: string;
};

interface ConfigState {
  toggles: FeatureToggles;
  packages: PackageConfig[];
  setToggle: (key: keyof FeatureToggles, value: boolean) => void;
  updatePackage: (id: string, updates: Partial<PackageConfig>) => void;
  addPackage: (pkg: PackageConfig) => void;
  removePackage: (id: string) => void;
  reorderPackages: (packages: PackageConfig[]) => void;
}

const defaultPackages: PackageConfig[] = [
  {
    id: 'esiimsi-promo',
    name: 'เซียมซีเสี่ยงทาย',
    subtitle: 'มาใหม่',
    price: '',
    description: 'เขย่าติ้วรับคำทำนายโบราณ',
    detail: 'ศาสตร์การเสี่ยงทายจากวัดดังทั่วไทย',
    features: ['ระบบเขย่าแบบ Physical 3D', 'AI ถอดรหัสคำทำนายเชิงลึก', 'แนะนำแนวทางแก้ไขและโอกาส', 'น้อมรับคำทำนายได้ไม่จำกัด'],
    popular: true,
    href: '/esiimsi',
  },
  {
    id: 'horoscope-full',
    name: 'เปิดดวงชะตาฉบับเต็ม',
    subtitle: 'Personal Horoscope Report',
    price: '฿929',
    description: 'PDF 15-20 หน้า',
    detail: 'เจาะลึกทุกมิติชีวิตด้วยโหราศาสตร์ไทย ทำ 3-7 วัน',
    features: ['พื้นดวงเดิม + Inner Self', 'การเงิน & ความมั่งคั่ง', 'อาชีพ & ความสำเร็จ', 'ความรัก & คู่ครอง', 'ดวงรายปี 2026 ครบทุกด้าน', 'เคล็ดลับเสริมดวงเฉพาะบุคคล', 'การ์ดฮีลใจประจำปี'],
    popular: true,
  },
  {
    id: 'tarot-10',
    name: 'แพ็ก B | ไพ่ 10 ใบ + โหราศาสตร์',
    subtitle: 'ยอดนิยม',
    price: '฿389',
    description: 'คอล 20-30 นาที',
    detail: 'ดูทิศทางชีวิต 1-3 เดือน ชี้ชัดเรื่องไหนเด่น',
    features: ['ไพ่ 10 ใบ ดูภาพรวมชีวิต', 'การงาน การเงิน ความรัก', 'โชคลาภ คนรอบข้าง สุขภาพ', 'อ่านคู่โหราศาสตร์', 'พิมพ์ + อัดเสียง'],
    popular: false,
  },
  {
    id: 'yearly',
    name: 'ดูดวงรายปี',
    subtitle: 'รู้จังหวะชีวิตล่วงหน้า',
    price: '฿489',
    priceAlt: '฿749 (คอล 1 ชม)',
    description: 'PDF หรือ คอล',
    detail: 'วางแผนให้แม่นยำ รู้ก่อนล่วงหน้า',
    features: ['ดวงปีนี้โฟกัสอะไร', 'เงิน งาน รัก โชค', 'ไฮไลท์ครบ พร้อมระวัง', 'ทริคเสริมโชค'],
    popular: false,
  },
  {
    id: 'hora-report',
    name: 'ดวงรายปี Hora-Report',
    subtitle: 'เลข 7 ตัว',
    price: '฿489',
    description: 'ไม่ต้องใช้เวลาเกิด',
    detail: 'ศาสตร์เลข 7 ตัว ไม่ต้องใช้เวลาเกิด',
    features: ['เลข 7 ตัว แม่นยำ', 'ดวงช่วงอายุนั้นๆ', 'อะไรดี อะไรปัง อะไรระวัง', 'เงิน งาน รัก สุขภาพ', 'ทริคเสริมดวง'],
    popular: false,
  },
  {
    id: 'qa-3',
    name: 'โปรเปิดไพ่ 3 คำถาม',
    subtitle: 'พิเศษ',
    price: '฿99',
    description: 'ถึง 31 ม.ค.',
    detail: 'เคลียร์ข้อสงสัยเร็วๆ',
    features: ['ไพ่ถามตอบ 3 คำถาม', 'เช็คดวง ดูแนวทาง', 'พิมพ์ตอบกลับ', 'เร็วสุด 1-2 ชั่วโมง'],
    popular: false,
  },
  {
    id: 'qa-1',
    name: 'โปร 1 คำถาม',
    subtitle: 'เหมาๆ',
    price: '฿39',
    description: 'ถึง 31 ม.ค.',
    detail: 'มีข้อสงสัย เปิดไพ่ Q/A',
    features: ['ไพ่ถามตอบ 1 คำถาม', 'การงาน ความรัก', 'พิมพ์ตอบกลับ'],
    popular: false,
  },
];

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      toggles: {
        enableTarot: true,
        enableSpiritCard: true,
        enableNumerology: true,
        enableLoveTarot: true,
        enableDailyAuspicious: true,
      },
      packages: defaultPackages,
      setToggle: (key, value) =>
        set((state) => ({
          toggles: { ...state.toggles, [key]: value },
        })),
      updatePackage: (id, updates) =>
        set((state) => ({
          packages: state.packages.map((pkg) =>
            pkg.id === id ? { ...pkg, ...updates } : pkg
          ),
        })),
      addPackage: (pkg) =>
        set((state) => ({ packages: [...state.packages, pkg] })),
      removePackage: (id) =>
        set((state) => ({ packages: state.packages.filter((p) => p.id !== id) })),
      reorderPackages: (packages) => set({ packages }),
    }),
    {
      name: 'app-config-storage',
    }
  )
);
