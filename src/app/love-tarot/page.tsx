'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronLeft, Heart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { useConfigStore } from '@/store/useConfigStore';
import { useTheme } from '@/lib/theme/ThemeProvider';

export default function LoveTarotPage() {
  const [question, setQuestion] = useState('');
  const router = useRouter();
  const { toggles } = useConfigStore();
  const { theme } = useTheme();
  const isPastel = theme === 'pastel';

  if (!toggles.enableLoveTarot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">ปิดปรับปรุงชั่วคราว</h1>
        <p className="text-gray-500 mb-6">ฟีเจอร์ดูดวงความรักกำลังอยู่ในช่วงอัปเดต โปรดกลับมาใหม่ภายหลัง</p>
        <Link href="/">
          <Button variant="outline">กลับหน้าหลัก</Button>
        </Link>
      </div>
    );
  }

  const handleStart = () => {
    const params = new URLSearchParams({ count: '3' });
    if (question.trim()) params.set('question', question.trim() + ' (เน้นเรื่องความรัก)');
    params.set('mode', 'love');
    router.push(`/tarot/pick?${params.toString()}`);
  };

  return (
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-pink-50" : "bg-white")}>
      <header className="px-5 pt-6 pb-4 flex items-center">
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 text-center font-serif text-xl font-semibold pr-10">
          ดวงความรัก
        </h1>
      </header>

      <section className="px-5 pt-8 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Heart className="w-12 h-12 text-pink-500" fill="currentColor" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-gray-900">เปิดไพ่ถามเรื่องหัวใจ</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          ให้ไพ่ทาโรต์นำทางความรักของคุณ ไม่ว่าจะเป็นคนโสด คนมีคู่ หรือคนคุย พิมพ์สิ่งที่อยู่ในใจคุณลงไปได้เลย
        </p>

        <div className="w-full space-y-4">
          <div className="text-left">
            <label className="text-sm font-medium text-gray-700 mb-1 block">คำถามของคุณ (ไม่บังคับ)</label>
            <Input 
              value={question}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
              placeholder="เช่น เค้าคิดยังไงกับเรา?, จะมีแฟนเมื่อไหร่?"
              className="w-full text-lg py-6 rounded-xl border-pink-200 focus-visible:ring-pink-500"
            />
          </div>

          <Button 
            onClick={handleStart}
            className="w-full h-14 rounded-xl text-lg font-semibold bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/30"
          >
            เริ่มสับไพ่
          </Button>
        </div>
      </section>
    </main>
  );
}
