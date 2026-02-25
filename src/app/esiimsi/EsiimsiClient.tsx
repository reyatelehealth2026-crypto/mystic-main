"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function EsiimsiClient() {
  const [phase, setPhase] = useState<"idle" | "shaking" | "revealed" | "reading">("idle");
  const [result, setResult] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [isReading, setIsReading] = useState(false);

  const startShake = () => {
    if (phase === "shaking") return;
    setPhase("shaking");
    setResult(null);
    setInterpretation(null);

    // Haptic feedback sequence
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([80, 40, 80, 40, 150]);
    }

    // Shaking duration
    setTimeout(() => {
      const num = Math.floor(Math.random() * 28) + 1;
      setResult(num);
      setPhase("revealed");
      if (navigator.vibrate) navigator.vibrate(200);
    }, 2600);
  };

  const fetchReading = async () => {
    if (!result || isReading) return;
    setIsReading(true);
    setPhase("reading");

    try {
      const res = await fetch("/api/ai/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cardsToken: `esiimsi_${result}.upright`, 
          count: 1, 
          question: `ทำนายเซียมซีหมายเลข ${result} ในโหมด Sacred Chance` 
        }),
      });
      const data = await res.json();
      if (data.ok) setInterpretation(data.ai);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* ── Background: Obsidian Void ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#1a0a0a_0%,_#050505_70%)] opacity-80" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      {/* ── Top Bar: Minimal & Clinical ── */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50">
        <Link href="/explore" className="group p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md">
          <ChevronLeft className="w-5 h-5 text-yellow-500/70 group-hover:text-yellow-500 transition-colors" />
        </Link>
        <div className="flex flex-col items-center">
            <span className="text-[10px] tracking-[0.6em] text-yellow-500/40 uppercase font-bold">Protocol</span>
            <h1 className="text-xs font-black tracking-[0.3em] text-yellow-500 uppercase mt-1">Sacred Chance</h1>
        </div>
        <div className="w-11" /> {/* Spacer */}
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-lg h-full">
        
        {/* ── The Altar: Physics Container ── */}
        <div className={cn(
          "relative w-64 h-96 transition-all duration-700 ease-in-out flex items-end justify-center pb-12",
          phase === "revealed" || phase === "reading" ? "-translate-y-24 scale-90" : "translate-y-0"
        )}>
          
          {/* Shaker Perspective Group */}
          <div className={cn(
            "relative transition-all duration-75",
            phase === "shaking" && "animate-sacred-shake"
          )} style={{ perspective: '1200px' }}>
            
            {/* STICKS: Rhythmic Accumulation (Inner) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-64 flex justify-center items-start pt-6 z-10">
               {[...Array(18)].map((_, i) => (
                  <div 
                      key={i} 
                      className={cn(
                          "w-1.5 bg-gradient-to-b from-[#d4a373] to-[#8b4513] rounded-full border-b border-black/30 transition-all duration-700",
                          phase === "shaking" ? "animate-rattle h-56" : "h-44 shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
                      )}
                      style={{ 
                          transform: `rotate(${(i - 9) * 4}deg)`,
                          transformOrigin: 'bottom center',
                          marginLeft: '-3px',
                          opacity: phase === "revealed" ? 0.3 : 1,
                          animationDelay: `${i * 35}ms`
                      }}
                  />
              ))}
            </div>

            {/* CYLINDER: Lacquer Vessel */}
            <div className="relative w-48 h-72 z-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7f1d1d] via-[#dc2626] to-[#450a0a] rounded-b-[60px] border-x-[4px] border-b-[8px] border-yellow-600/30 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none">
                      <div className="text-[#fbbf24] font-serif text-7xl font-bold opacity-90 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">福</div>
                      <div className="mt-4 w-16 h-[1px] bg-yellow-500/20" />
                  </div>
                  {/* Highlight Shine */}
                  <div className="absolute top-0 left-6 w-8 h-full bg-white/5 blur-md -skew-x-12 translate-x-[-50%]" />
              </div>
              {/* Internal Shadow Rim */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 rounded-full border-t border-white/5 shadow-inner" />
            </div>

            {/* THE CHOSEN ONE: High Emergence Animation */}
            {(phase === "revealed" || phase === "reading") && (
              <div className="absolute -top-64 left-1/2 -translate-x-1/2 z-50 animate-sacred-emerge">
                   <div className="w-6 h-80 bg-gradient-to-b from-[#fde68a] via-[#fbbf24] to-[#b45309] rounded-2xl shadow-[0_20px_50px_rgba(251,191,36,0.3)] flex flex-col items-center py-10 border-2 border-white/30 relative">
                      <div className="absolute top-6 w-full text-center">
                           <span className="text-[#450a0a] font-black text-4xl tracking-tighter drop-shadow-sm">{result}</span>
                      </div>
                      <div className="mt-14 flex-1 w-[1.5px] bg-[#450a0a]/15" />
                      <div className="absolute bottom-6 rotate-90 whitespace-nowrap">
                          <span className="text-[10px] text-[#450a0a] font-black tracking-[0.4em] uppercase opacity-40">Sacred Stick</span>
                      </div>
                   </div>
              </div>
            )}
          </div>
        </div>

        {/* ── UI Logic Layer ── */}
        <div className="absolute bottom-24 left-0 right-0 w-full text-center z-40 px-8 min-h-[300px] flex flex-col items-center justify-center">
          
          {phase === "idle" && (
            <div className="space-y-12 animate-in fade-in duration-1000">
                <div className="space-y-3">
                  <h2 className="text-3xl font-serif text-yellow-500/90 italic tracking-wide">สำรวมจิตเป็นหนึ่ง</h2>
                  <p className="text-[10px] text-white/30 tracking-[0.5em] uppercase">The Intersection of Order and Entropy</p>
                </div>
                <button 
                  onClick={startShake}
                  className="group relative w-36 h-36 rounded-full outline-none transition-transform active:scale-95"
                >
                  <div className="absolute inset-0 rounded-full bg-red-600/20 animate-pulse scale-110" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7f1d1d] to-[#dc2626] border-[6px] border-yellow-500/30 shadow-[0_0_50px_rgba(220,38,38,0.3)] flex items-center justify-center group-hover:border-yellow-500/50 transition-all">
                      <span className="text-lg font-black tracking-[0.2em] text-white uppercase drop-shadow-md">เริ่มเขย่า</span>
                  </div>
                </button>
            </div>
          )}

          {phase === "shaking" && (
            <div className="space-y-4 animate-pulse">
                <p className="text-2xl font-serif text-yellow-500 italic">กำลังเคลื่อนย้ายแรงโน้มถ่วง...</p>
                <div className="flex gap-2 justify-center">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                </div>
            </div>
          )}

          {phase === "revealed" && (
            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 w-full flex flex-col items-center">
                <p className="text-[11px] text-yellow-500 uppercase tracking-[0.8em] mb-6 font-bold opacity-60">ชะตาฟ้าลิขิตหมายเลข</p>
                <h2 className="text-[160px] leading-none font-black text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] mb-12 select-none tracking-tighter">
                  {result}
                </h2>
                
                <Button 
                  size="lg" 
                  onClick={fetchReading}
                  className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl h-16 text-xl font-black shadow-[0_20px_50px_rgba(234,179,8,0.4)] border-b-4 border-yellow-700 transition-all active:translate-y-1 active:border-b-0"
                >
                  <Sparkles className="w-5 h-5 mr-3" /> เปิดคำทำนาย
                </Button>
                
                <button onClick={() => setPhase("idle")} className="mt-8 text-[10px] text-white/30 uppercase tracking-[0.3em] hover:text-white transition-colors">
                  เสี่ยงทายใหม่อีกครั้ง
                </button>
            </div>
          )}

          {phase === "reading" && (
            <div className="w-full animate-in fade-in duration-500">
                {isReading ? (
                    <div className="flex flex-col items-center gap-6">
                        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                        <p className="text-lg font-serif italic text-yellow-500/80">กำลังถอดรหัสความลับแห่งโชคชะตา...</p>
                    </div>
                ) : (
                    <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 backdrop-blur-2xl text-left shadow-2xl relative overflow-hidden group animate-in zoom-in-95 duration-700">
                        {/* Glass Decor */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                <span className="text-yellow-500 font-bold text-xl">{result}</span>
                            </div>
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.4em] text-yellow-500/50 font-bold">บันทึกชะตาฟ้า</h3>
                                <p className="text-xl font-bold text-white">ใบที่ {result}</p>
                            </div>
                        </div>

                        <p className="text-xl leading-relaxed text-white/90 mb-10 font-serif italic whitespace-pre-line border-l-2 border-yellow-500/30 pl-6">
                            "{interpretation?.summary}"
                        </p>

                        <div className="grid grid-cols-1 gap-6 mb-10">
                             {interpretation?.opportunities?.slice(0, 2).map((o: string, i: number) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start">
                                    <span className="text-yellow-500 mt-1">✦</span>
                                    <p className="text-sm text-white/70 leading-relaxed">{o}</p>
                                </div>
                             ))}
                        </div>

                        <Button 
                            variant="ghost" 
                            onClick={() => setPhase("idle")} 
                            className="w-full h-14 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs uppercase tracking-[0.3em]"
                        >
                            น้อมรับคำทำนาย
                        </Button>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes sacred-shake {
            0%, 100% { transform: translate3d(0,0,0) rotate(0deg); }
            10% { transform: translate3d(-15px, -20px, 0) rotate(-12deg); }
            20% { transform: translate3d(20px, 15px, 0) rotate(15deg); }
            30% { transform: translate3d(-25px, -10px, 0) rotate(-18deg); }
            40% { transform: translate3d(15px, 25px, 0) rotate(12deg); }
            50% { transform: translate3d(-10px, -15px, 0) rotate(-10deg); }
            60% { transform: translate3d(20px, 10px, 0) rotate(14deg); }
            70% { transform: translate3d(-15px, 20px, 0) rotate(-12deg); }
            80% { transform: translate3d(10px, -10px, 0) rotate(8deg); }
            90% { transform: translate3d(-5px, 5px, 0) rotate(-5deg); }
        }
        .animate-sacred-shake {
            animation: sacred-shake 0.35s infinite cubic-bezier(0.45, 0, 0.55, 1);
        }

        @keyframes rattle {
            0%, 100% { transform: translateY(0) rotate(var(--tw-rotate)); }
            50% { transform: translateY(-50px) rotate(calc(var(--tw-rotate) + 8deg)); }
        }
        .animate-rattle {
            animation: rattle 0.18s infinite ease-in-out;
        }

        @keyframes sacred-emerge {
            0% { transform: translate(-50%, 250px) scaleY(0.4); opacity: 0; }
            45% { transform: translate(-50%, -60px) scaleY(1.15); opacity: 1; }
            75% { transform: translate(-50%, 15px) scaleY(0.9); }
            100% { transform: translate(-50%, 0) scaleY(1); opacity: 1; }
        }
        .animate-sacred-emerge {
            animation: sacred-emerge 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .drop-shadow-glow {
            filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.4));
        }
      `}</style>
    </main>
  );
}
