'use client';

import { useConfigStore, FeatureToggles } from '@/store/useConfigStore';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function AdminConfigPanel() {
  const { toggles, packages, setToggle, updatePackage } = useConfigStore();
  const [mounted, setMounted] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggle = (key: keyof FeatureToggles) => {
    setToggle(key, !toggles[key]);
  };

  const handlePackageUpdate = (id: string, field: string, value: string) => {
    updatePackage(id, { [field]: value });
  };

  const handleFeatureUpdate = (id: string, index: number, value: string) => {
    const pkg = packages.find(p => p.id === id);
    if (pkg) {
      const newFeatures = [...pkg.features];
      newFeatures[index] = value;
      updatePackage(id, { features: newFeatures });
    }
  };

  const saveChanges = () => {
    setSavedMessage('บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Config Panel</h1>
          <p className="text-muted-foreground mt-2">จัดการการเปิด/ปิดฟีเจอร์และแพ็กเกจ (Changes auto-save locally)</p>
        </div>
        <Button onClick={saveChanges} className="gap-2">
          <Save className="w-4 h-4" /> บันทึก
        </Button>
      </div>

      {savedMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6 transition-all">
          {savedMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature Toggles Section */}
        <section className="bg-card border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Feature Toggles</h2>
          <div className="space-y-6">
            <ToggleItem 
              label="Tarot Reading (ดูไพ่ยิปซี)" 
              description="เปิด/ปิด โหมดดูไพ่ยิปซี 1, 3, 10 ใบ"
              checked={toggles.enableTarot} 
              onCheckedChange={() => handleToggle('enableTarot')} 
            />
            <ToggleItem 
              label="Spirit Card (ไพ่จิตวิญญาณ)" 
              description="เปิด/ปิด โหมดไพ่จิตวิญญาณ"
              checked={toggles.enableSpiritCard} 
              onCheckedChange={() => handleToggle('enableSpiritCard')} 
            />
            <ToggleItem 
              label="Numerology (วิเคราะห์เบอร์มงคล)" 
              description="เปิด/ปิด โหมดวิเคราะห์เบอร์มงคล"
              checked={toggles.enableNumerology} 
              onCheckedChange={() => handleToggle('enableNumerology')} 
            />
            <ToggleItem 
              label="Love Tarot (ดวงความรัก - New)" 
              description="เปิด/ปิด โหมดดูดวงความรักโดยเฉพาะ"
              checked={toggles.enableLoveTarot} 
              onCheckedChange={() => handleToggle('enableLoveTarot')} 
            />
            <ToggleItem 
              label="Daily Auspicious (ฤกษ์ยามมงคล - New)" 
              description="เปิด/ปิด โหมดดูฤกษ์ยามมงคลประจำวัน"
              checked={toggles.enableDailyAuspicious} 
              onCheckedChange={() => handleToggle('enableDailyAuspicious')} 
            />
          </div>
        </section>

        {/* Package Management Section */}
        <section className="bg-card border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Packages (แพ็กเกจ)</h2>
          <div className="space-y-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="space-y-4 border-b pb-6 last:border-0 last:pb-0">
                <h3 className="font-medium text-lg capitalize">{pkg.id} Package</h3>
                
                <div className="grid gap-2">
                  <Label>ชื่อแพ็กเกจ</Label>
                  <Input 
                    value={pkg.name} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePackageUpdate(pkg.id, 'name', e.target.value)} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>ราคา</Label>
                  <Input 
                    value={pkg.price} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePackageUpdate(pkg.id, 'price', e.target.value)} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>คำอธิบาย</Label>
                  <Textarea 
                    value={pkg.description} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePackageUpdate(pkg.id, 'description', e.target.value)} 
                    rows={2}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Image URL (รูปโปรไฟล์)</Label>
                  <Input 
                    value={pkg.imageUrl} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePackageUpdate(pkg.id, 'imageUrl', e.target.value)} 
                    placeholder="https://..."
                  />
                  {pkg.imageUrl && (
                    <img 
                      src={pkg.imageUrl} 
                      alt="Preview" 
                      className="mt-2 w-16 h-16 object-cover rounded-full border"
                    />
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>ฟีเจอร์เด่น</Label>
                  {pkg.features.map((feature, idx) => (
                    <Input 
                      key={idx}
                      value={feature} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFeatureUpdate(pkg.id, idx, e.target.value)} 
                      className="mb-1"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ToggleItem({ 
  label, 
  description, 
  checked, 
  onCheckedChange 
}: { 
  label: string; 
  description: string;
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex flex-col space-y-1">
        <Label className="text-base">{label}</Label>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
