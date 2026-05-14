'use client';

import { useConfigStore, FeatureToggles, PackageConfig } from '@/store/useConfigStore';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Save, Plus, Trash2, ChevronDown, ChevronUp, Crown, X } from 'lucide-react';

const CIRCLE_COLORS = [
  'bg-gradient-to-br from-red-400 to-red-600',
  'bg-gradient-to-br from-violet-400 to-violet-600',
  'bg-gradient-to-br from-amber-400 to-orange-500',
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-emerald-400 to-emerald-600',
  'bg-gradient-to-br from-pink-400 to-pink-600',
];

function newEmptyPackage(): PackageConfig {
  return {
    id: `pkg-${Date.now()}`,
    name: '',
    subtitle: '',
    price: '',
    priceAlt: '',
    description: '',
    detail: '',
    features: [''],
    popular: false,
    href: '',
  };
}

export default function AdminConfigPanel() {
  const { toggles, packages, setToggle, updatePackage, addPackage, removePackage, reorderPackages } = useConfigStore();
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleToggle = (key: keyof FeatureToggles) => {
    setToggle(key, !toggles[key]);
  };

  const handleField = (id: string, field: keyof PackageConfig, value: string | boolean) => {
    updatePackage(id, { [field]: value });
  };

  const handleFeature = (id: string, idx: number, value: string) => {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    const next = [...pkg.features];
    next[idx] = value;
    updatePackage(id, { features: next });
  };

  const addFeature = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    updatePackage(id, { features: [...pkg.features, ''] });
  };

  const removeFeature = (id: string, idx: number) => {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;
    updatePackage(id, { features: pkg.features.filter((_, i) => i !== idx) });
  };

  const movePackage = (idx: number, dir: -1 | 1) => {
    const next = [...packages];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    reorderPackages(next);
  };

  const handleAdd = () => {
    const pkg = newEmptyPackage();
    addPackage(pkg);
    setExpandedId(pkg.id);
    showToast('เพิ่มแพ็กเกจใหม่แล้ว');
  };

  const handleRemove = (id: string) => {
    if (!confirm('ลบแพ็กเกจนี้?')) return;
    removePackage(id);
    showToast('ลบแพ็กเกจแล้ว');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">REFFORTUNE Admin</h1>
          <p className="text-xs text-gray-400 mt-0.5">จัดการฟีเจอร์และแพ็กเกจ • บันทึกอัตโนมัติ</p>
        </div>
        <Button size="sm" onClick={() => showToast('บันทึกแล้ว ✓')} className="gap-1.5">
          <Save className="w-3.5 h-3.5" /> บันทึก
        </Button>
      </div>

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">

        {/* Feature Toggles */}
        <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800">Feature Toggles</h2>
            <p className="text-xs text-gray-400 mt-0.5">เปิด/ปิดการแสดงผลแต่ละฟีเจอร์บนหน้าแรก</p>
          </div>
          <div className="divide-y">
            {([
              ['enableTarot', 'Tarot Reading', 'ดูไพ่ยิปซี 1, 3, 10 ใบ'],
              ['enableSpiritCard', 'Spirit Card', 'ไพ่จิตวิญญาณ'],
              ['enableNumerology', 'Numerology', 'วิเคราะห์เบอร์มงคล'],
              ['enableLoveTarot', 'Love Tarot', 'ดูดวงความรักโดยเฉพาะ'],
              ['enableDailyAuspicious', 'Daily Card', 'ไพ่ประจำวัน'],
            ] as [keyof FeatureToggles, string, string][]).map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Switch checked={toggles[key]} onCheckedChange={() => handleToggle(key)} />
              </div>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">แพ็กเกจ ({packages.length})</h2>
              <p className="text-xs text-gray-400 mt-0.5">จัดการแพ็กเกจที่แสดงบนหน้าแรก</p>
            </div>
            <Button size="sm" variant="outline" onClick={handleAdd} className="gap-1.5 text-violet-600 border-violet-200 hover:bg-violet-50">
              <Plus className="w-3.5 h-3.5" /> เพิ่มแพ็กเกจ
            </Button>
          </div>

          {/* Package preview list */}
          <div className="divide-y">
            {packages.map((pkg, idx) => {
              const isOpen = expandedId === pkg.id;
              const circleColor = CIRCLE_COLORS[idx % CIRCLE_COLORS.length];
              const badgeLabel = pkg.popular
                ? (pkg.subtitle === 'มาใหม่' ? 'มาใหม่' : 'ลดนิยม')
                : pkg.subtitle || null;

              return (
                <div key={pkg.id} className="group">
                  {/* Collapsed row */}
                  <div
                    className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(isOpen ? null : pkg.id)}
                  >
                    {/* Circle avatar */}
                    <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${circleColor}`}>
                      {pkg.price || 'FREE'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{pkg.name || '(ไม่มีชื่อ)'}</p>
                        {badgeLabel && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 shrink-0">
                            <Crown className="w-2.5 h-2.5" />{badgeLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{pkg.description}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <p className="text-sm font-bold text-violet-600">{pkg.price || '—'}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); movePackage(idx, -1); }}
                        className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                        disabled={idx === 0}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); movePackage(idx, 1); }}
                        className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                        disabled={idx === packages.length - 1}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(pkg.id); }}
                        className="p-1 text-gray-300 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded editor */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 bg-gray-50 border-t space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">ชื่อแพ็กเกจ</Label>
                          <Input value={pkg.name} onChange={e => handleField(pkg.id, 'name', e.target.value)} placeholder="ชื่อ" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Subtitle / Badge</Label>
                          <Input value={pkg.subtitle ?? ''} onChange={e => handleField(pkg.id, 'subtitle', e.target.value)} placeholder="ยอดนิยม / มาใหม่" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">ราคา</Label>
                          <Input value={pkg.price} onChange={e => handleField(pkg.id, 'price', e.target.value)} placeholder="฿389" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">ราคาทางเลือก</Label>
                          <Input value={pkg.priceAlt ?? ''} onChange={e => handleField(pkg.id, 'priceAlt', e.target.value)} placeholder="฿749 (คอล 1 ชม)" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">คำอธิบายสั้น</Label>
                        <Input value={pkg.description} onChange={e => handleField(pkg.id, 'description', e.target.value)} placeholder="PDF 15-20 หน้า" />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">รายละเอียด (ข้อความสีม่วง)</Label>
                        <Textarea value={pkg.detail ?? ''} onChange={e => handleField(pkg.id, 'detail', e.target.value)} rows={2} placeholder="เจาะลึกทุกมิติชีวิต..." />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">ลิงก์ (href) — เว้นว่างใช้ /pricing/{'{id}'}</Label>
                        <Input value={pkg.href ?? ''} onChange={e => handleField(pkg.id, 'href', e.target.value)} placeholder="/esiimsi" />
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          checked={pkg.popular ?? false}
                          onCheckedChange={(v) => handleField(pkg.id, 'popular', v)}
                        />
                        <Label className="text-xs text-gray-600">Popular (แสดง badge ลดนิยม/มาใหม่)</Label>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">ฟีเจอร์ / รายการ (รวม:)</Label>
                          <button
                            onClick={() => addFeature(pkg.id)}
                            className="text-xs text-violet-600 hover:underline flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> เพิ่ม
                          </button>
                        </div>
                        {/* Composite key isolates rows across packages so
                            React can't confuse a row in pkg A with the same
                            index in pkg B. Within a package, removal still
                            shifts indices — `features` is `string[]`, so a
                            truly stable per-row identity would require a
                            schema change (TODO: `{ id, value }[]`). */}
                        {pkg.features.map((f, fi) => (
                          <div key={`${pkg.id}-${fi}`} className="flex gap-2">
                            <Input
                              value={f}
                              onChange={e => handleFeature(pkg.id, fi, e.target.value)}
                              placeholder={`รายการที่ ${fi + 1}`}
                              className="flex-1"
                            />
                            <button
                              onClick={() => removeFeature(pkg.id, fi)}
                              className="p-2 text-gray-300 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
