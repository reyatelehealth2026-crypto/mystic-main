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
  const isRainbow = theme === 'rainbow';

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
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-white")}>
      <header className="px-5 pt-6 pb-4 flex items-center">
        <Link href="/" className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full transition-colors",
          isPastel || isRainbow ? "hover:bg-white/10 text-white" : "hover:bg-black/5"
        )}>
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className={cn("flex-1 text-center font-serif text-xl font-semibold pr-10", isPastel || isRainbow ? "text-white" : "text-gray-900")}>
          ดวงความรัก
        </h1>
      </header>

      <section className="px-5 pt-8 flex flex-col items-center text-center max-w-md mx-auto">
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner",
          isPastel ? "bg-white/20" : isRainbow ? "bg-[rgba(255,0,255,0.15)]" : "bg-pink-100"
        )}>
          <Heart className={cn("w-12 h-12", isPastel || isRainbow ? "text-white" : "text-pink-500")} fill="currentColor" />
        </div>
        
        <h2 className={cn("text-2xl font-bold mb-3", isPastel || isRainbow ? "text-white" : "text-gray-900")}>เปิดไพ่ถามเรื่องหัวใจ</h2>
        <p className={cn("mb-8 leading-relaxed", isPastel || isRainbow ? "text-white/70" : "text-gray-600")}>
          ให้ไพ่ทาโรต์นำทางความรักของคุณ ไม่ว่าจะเป็นคนโสด คนมีคู่ หรือคนคุย พิมพ์สิ่งที่อยู่ในใจคุณลงไปได้เลย
        </p>

        <div className="w-full space-y-4">
          <div className="text-left">
            <label className={cn("text-sm font-medium mb-1 block", isPastel || isRainbow ? "text-white/80" : "text-gray-700")}>คำถามของคุณ (ไม่บังคับ)</label>
            <Input 
              value={question}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
              placeholder="เช่น เค้าคิดยังไงกับเรา?, จะมีแฟนเมื่อไหร่?"
              className={cn(
                "w-full text-lg py-6 rounded-xl",
                isPastel ? "border-white/30 bg-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/50" :
                isRainbow ? "border-[rgba(255,0,255,0.3)] bg-[#1a1a2e]/80 text-white placeholder:text-white/40 focus-visible:ring-[rgba(255,0,255,0.5)]" :
                "border-pink-200 focus-visible:ring-pink-500"
              )}
            />
          </div>

          <Button 
            onClick={handleStart}
            className={cn(
              "w-full h-14 rounded-xl text-lg font-semibold shadow-lg",
              isPastel ? "bg-white/30 backdrop-blur text-white border border-white/50 hover:bg-white/50" :
              isRainbow ? "bg-gradient-to-r from-[#ff00ff] to-[#ff69b4] text-white shadow-[rgba(255,0,255,0.3)]" :
              "bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/30"
            )}
          >
            เริ่มสับไพ่
          </Button>
        </div>
      </section>
    </main>
  );
}
