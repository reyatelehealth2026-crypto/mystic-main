'use client';

import { useHistoryStore } from '@/store/useHistoryStore';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Trash2, CalendarDays, Sparkles, Heart, Hash } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme/ThemeProvider';

function getIconForType(type: string) {
  switch (type) {
    case 'tarot': return <Sparkles className="w-5 h-5 text-violet-500" />;
    case 'love-tarot': return <Heart className="w-5 h-5 text-pink-500" />;
    case 'spirit-card': return <Sparkles className="w-5 h-5 text-blue-500" />;
    case 'numerology': return <Hash className="w-5 h-5 text-amber-500" />;
    case 'daily-card': return <CalendarDays className="w-5 h-5 text-green-500" />;
    default: return <Sparkles className="w-5 h-5 text-gray-500" />;
  }
}

function getLabelForType(type: string) {
  switch (type) {
    case 'tarot': return 'ไพ่ยิปซี';
    case 'love-tarot': return 'ดวงความรัก';
    case 'spirit-card': return 'ไพ่จิตวิญญาณ';
    case 'numerology': return 'เบอร์มงคล';
    case 'daily-card': return 'ไพ่ประจำวัน';
    default: return 'ดูดวง';
  }
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function HistoryPage() {
  const { history, removeHistoryItem, clearHistory } = useHistoryStore();
  const { theme } = useTheme();
  const isPastel = theme === 'pastel';

  return (
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-transparent" : "bg-gray-50")}>
      <header className="px-5 pt-6 pb-4 flex items-center justify-between bg-white/50 backdrop-blur sticky top-0 z-10 border-b border-gray-100">
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-serif text-xl font-semibold">
          ประวัติการดูดวง
        </h1>
        <div className="w-10"></div>
      </header>

      <section className="px-5 pt-6 max-w-2xl mx-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">ยังไม่มีประวัติ</h2>
            <p className="text-gray-500 mb-6">คุณยังไม่ได้ทำการดูดวงใดๆ เริ่มต้นดูดวงเพื่อบันทึกประวัติที่นี่</p>
            <Link href="/">
              <Button className="rounded-full px-8">เริ่มดูดวง</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">บันทึกทั้งหมด {history.length} รายการ (Local)</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประวัติทั้งหมด?')) {
                    clearHistory();
                  }
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                ลบทั้งหมด
              </Button>
            </div>

            {history.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">{getLabelForType(item.type)}</h3>
                      <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.summary}</p>
                    
                    {item.details && item.details.question && (
                      <div className="mt-2 text-xs bg-gray-50 p-2 rounded-lg text-gray-500 border border-gray-100">
                        <span className="font-medium text-gray-700">คำถาม:</span> {item.details.question}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => removeHistoryItem(item.id)}
                  className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
