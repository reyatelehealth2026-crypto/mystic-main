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
  const isRainbow = theme === 'rainbow';

  return (
    <main className={cn("min-h-screen pb-24", isPastel ? "bg-transparent" : isRainbow ? "bg-transparent" : "bg-gray-50")}>
      <header className={cn(
        "px-5 pt-6 pb-4 flex items-center justify-between backdrop-blur sticky top-0 z-10 border-b",
        isPastel ? "bg-white/10 border-white/20" : isRainbow ? "bg-[#0f0f1a]/90 border-[rgba(255,0,255,0.2)]" : "bg-white/50 border-gray-100"
      )}>
        <Link href="/" className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full transition-colors",
          isPastel || isRainbow ? "hover:bg-white/10 text-white" : "hover:bg-black/5"
        )}>
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className={cn("font-serif text-xl font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>
          ประวัติการดูดวง
        </h1>
        <div className="w-10"></div>
      </header>

      <section className="px-5 pt-6 max-w-2xl mx-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-4", isPastel ? "bg-white/20" : isRainbow ? "bg-[rgba(255,0,255,0.1)]" : "bg-gray-100")}>
              <CalendarDays className={cn("w-10 h-10", isPastel || isRainbow ? "text-white/50" : "text-gray-400")} />
            </div>
            <h2 className={cn("text-xl font-semibold mb-2", isPastel || isRainbow ? "text-white" : "text-gray-900")}>ยังไม่มีประวัติ</h2>
            <p className={cn("mb-6", isPastel || isRainbow ? "text-white/60" : "text-gray-500")}>คุณยังไม่ได้ทำการดูดวงใดๆ เริ่มต้นดูดวงเพื่อบันทึกประวัติที่นี่</p>
            <Link href="/">
              <Button className="rounded-full px-8">เริ่มดูดวง</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <p className={cn("text-sm", isPastel || isRainbow ? "text-white/60" : "text-gray-500")}>บันทึกทั้งหมด {history.length} รายการ (Local)</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประวัติทั้งหมด?')) {
                    clearHistory();
                  }
                }}
                className={cn("text-red-500 hover:text-red-600", isPastel || isRainbow ? "hover:bg-red-500/10" : "hover:bg-red-50")}
              >
                ลบทั้งหมด
              </Button>
            </div>

            {history.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "rounded-2xl p-5 border shadow-sm relative group",
                  isPastel ? "bg-white/20 backdrop-blur border-white/30" : isRainbow ? "bg-[#1a1a2e]/80 border-[rgba(255,0,255,0.15)]" : "bg-white border-gray-100"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", isPastel ? "bg-white/15" : isRainbow ? "bg-[rgba(255,0,255,0.1)]" : "bg-gray-50")}>
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={cn("font-semibold", isPastel || isRainbow ? "text-white" : "text-gray-900")}>{getLabelForType(item.type)}</h3>
                      <span className={cn("text-xs", isPastel || isRainbow ? "text-white/50" : "text-gray-400")}>{formatDate(item.date)}</span>
                    </div>
                    <p className={cn("text-sm line-clamp-2", isPastel || isRainbow ? "text-white/70" : "text-gray-600")}>{item.summary}</p>
                    
                    {item.details && Boolean(item.details.question) && (
                      <div className={cn("mt-2 text-xs p-2 rounded-lg border", isPastel ? "bg-white/10 text-white/60 border-white/20" : isRainbow ? "bg-[rgba(255,0,255,0.05)] text-white/60 border-[rgba(255,0,255,0.1)]" : "bg-gray-50 text-gray-500 border-gray-100")}>
                        <span className={cn("font-medium", isPastel || isRainbow ? "text-white/80" : "text-gray-700")}>คำถาม:</span> {String(item.details.question)}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => removeHistoryItem(item.id)}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 md:opacity-100",
                    isPastel || isRainbow ? "text-white/30 hover:text-red-400 hover:bg-red-500/10" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                  )}
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
