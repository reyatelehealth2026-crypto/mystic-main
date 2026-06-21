'use client';

import { useHistoryStore } from '@/store/useHistoryStore';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/nav/AppBar';
import { Card } from '@/components/ui/Card';
import { FAB } from '@/components/ui/FAB';
import { Trash2, CalendarDays, Sparkles, Heart, Hash } from 'lucide-react';
import Link from 'next/link';

function getIconForType(type: string) {
  switch (type) {
    case 'tarot': return <Sparkles className="w-5 h-5 text-accent" />;
    case 'love-tarot': return <Heart className="w-5 h-5 text-pink-500" />;
    case 'spirit-card': return <Sparkles className="w-5 h-5 text-blue-500" />;
    case 'numerology': return <Hash className="w-5 h-5 text-amber-500" />;
    case 'daily-card': return <CalendarDays className="w-5 h-5 text-green-500" />;
    default: return <Sparkles className="w-5 h-5 text-fg-muted" />;
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

  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ประวัติการดูดวง" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ประวัติ</h1>
        <p className="mt-1 text-sm text-fg-muted">บันทึกการดูดวงของคุณ</p>
      </header>

      <div className="px-5 pb-24">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-surface">
              <CalendarDays className="w-10 h-10 text-fg-muted" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-fg">ยังไม่มีประวัติ</h2>
            <p className="mb-6 text-fg-muted">คุณยังไม่ได้ทำการดูดวงใดๆ เริ่มต้นดูดวงเพื่อบันทึกประวัติที่นี่</p>
            <Link href="/">
              <Button className="rounded-full px-8">เริ่มดูดวง</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-fg-muted">บันทึกทั้งหมด {history.length} รายการ (Local)</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประวัติทั้งหมด?')) {
                    clearHistory();
                  }
                }}
                className="text-danger hover:text-danger"
              >
                ลบทั้งหมด
              </Button>
            </div>

            {history.map((item) => (
              <Card key={item.id} className="p-5 relative group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-surface">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-fg">{getLabelForType(item.type)}</h3>
                      <span className="text-xs text-fg-subtle">{formatDate(item.date)}</span>
                    </div>
                    <p className="text-sm line-clamp-2 text-fg-muted">{item.summary}</p>

                    {item.details && Boolean(item.details.question) && (
                      <div className="mt-2 text-xs p-2 rounded-lg border border-border bg-surface text-fg-muted">
                        <span className="font-medium text-fg">คำถาม:</span> {String(item.details.question)}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeHistoryItem(item.id)}
                  className="absolute top-4 right-4 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 md:opacity-100 text-fg-subtle hover:text-danger hover:bg-danger/10"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FAB />
    </main>
  );
}
