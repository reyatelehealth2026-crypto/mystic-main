'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useConfigStore } from '@/store/useConfigStore';
import { AppBar } from '@/components/nav/AppBar';
import { Card } from '@/components/ui/Card';
import { FeatureMenu } from '@/components/nav/FeatureMenu';
import { FAB } from '@/components/ui/FAB';

export default function LoveTarotPage() {
  const [question, setQuestion] = useState('');
  const router = useRouter();
  const { toggles } = useConfigStore();

  if (!toggles.enableLoveTarot) {
    return (
      <main className="mx-auto w-full max-w-lg">
        <header className="px-5 pt-7 pb-3">
          <AppBar title="ดวงความรัก" backHref="/" className="px-0 pt-0 pb-0" />
        </header>
        <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
          <Heart className="w-16 h-16 text-fg-subtle mb-4" />
          <h1 className="text-2xl font-bold text-fg mb-2">ปิดปรับปรุงชั่วคราว</h1>
          <p className="text-fg-muted mb-6">ฟีเจอร์ดูดวงความรักกำลังอยู่ในช่วงอัปเดต โปรดกลับมาใหม่ภายหลัง</p>
          <Link href="/">
            <Button variant="outline">กลับหน้าหลัก</Button>
          </Link>
        </div>
      </main>
    );
  }

  const handleStart = () => {
    const params = new URLSearchParams({ count: '3' });
    if (question.trim()) params.set('question', question.trim() + ' (เน้นเรื่องความรัก)');
    params.set('mode', 'love');
    router.push(`/tarot/pick?${params.toString()}`);
  };

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดวงความรัก" backHref="/" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">เปิดไพ่ถามเรื่องหัวใจ</h1>
        <p className="mt-1 text-sm text-fg-muted">ให้ไพ่ทาโรต์นำทางความรักของคุณ</p>
      </header>

      <div className="px-5 pb-6">
        <Card className="p-5">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-accent/10">
              <Heart className="w-10 h-10 text-accent" fill="currentColor" />
            </div>
            <p className="text-sm text-fg-muted leading-relaxed">
              ไม่ว่าจะเป็นคนโสด คนมีคู่ หรือคนคุย พิมพ์สิ่งที่อยู่ในใจคุณลงไปได้เลย
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-fg-muted mb-1 block">คำถามของคุณ (ไม่บังคับ)</label>
              <Input
                value={question}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
                placeholder="เช่น เค้าคิดยังไงกับเรา?, จะมีแฟนเมื่อไหร่?"
                className="w-full"
              />
            </div>
          </div>
        </Card>

        <div className="sticky bottom-20 z-30 mt-6">
          <Button onClick={handleStart} className="w-full" size="lg">
            เริ่มสับไพ่
          </Button>
        </div>

        <div className="mt-8">
          <FeatureMenu />
        </div>
      </div>

      <FAB />
    </main>
  );
}
