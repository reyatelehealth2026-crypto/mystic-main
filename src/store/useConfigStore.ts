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
  price: string;
  imageUrl: string;
  description: string;
  features: string[];
};

interface ConfigState {
  toggles: FeatureToggles;
  packages: PackageConfig[];
  setToggle: (key: keyof FeatureToggles, value: boolean) => void;
  updatePackage: (id: string, updates: Partial<PackageConfig>) => void;
}

const defaultPackages: PackageConfig[] = [
  { 
    id: 'starter', 
    name: 'Starter', 
    price: '฿99', 
    imageUrl: 'https://images.unsplash.com/photo-1615828456041-94efd7350cb1?auto=format&fit=crop&q=80&w=200&h=200', 
    description: 'เหมาะสำหรับผู้เริ่มต้น',
    features: ['ดูไพ่ 3 ใบ', 'ถามคำถามได้ 1 ข้อ']
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    price: '฿299', 
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=200&h=200', 
    description: 'ดูดวงเจาะลึก',
    features: ['ดูไพ่ 10 ใบ (Celtic Cross)', 'ถามคำถามได้ไม่จำกัด', 'ดูเบอร์มงคล']
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
    }),
    {
      name: 'app-config-storage',
    }
  )
);
