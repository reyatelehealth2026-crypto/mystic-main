import { NextResponse } from "next/server";
import type { ChineseZodiacAnimal, ChineseElement } from "@/lib/chinese-zodiac/types";
import type { TimePeriod } from "@/lib/horoscope/types";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

interface ChineseZodiacAIRequest {
  animal: ChineseZodiacAnimal;
  element: ChineseElement;
  period: TimePeriod;
  baseline: {
    fortune: {
      overall: string;
      career: string;
      wealth: string;
      health: string;
      relationships: string;
    };
    luckyColors: string[];
    luckyNumbers: number[];
    luckyDirections: string[];
    advice: string;
  };
}

function buildChineseZodiacPrompt(request: ChineseZodiacAIRequest): string {
  const periodThai = {
    daily: "รายวัน",
    weekly: "รายสัปดาห์",
    monthly: "รายเดือน",
  }[request.period];

  const animalThai: Record<ChineseZodiacAnimal, string> = {
    rat: "ปีชวด (หนู)", ox: "ปีฉลู (วัว)", tiger: "ปีขาล (เสือ)",
    rabbit: "ปีเถาะ (กระต่าย)", dragon: "ปีมะโรง (มังกร)", snake: "ปีมะเส็ง (งู)",
    horse: "ปีมะเมีย (ม้า)", goat: "ปีมะแม (แพะ)", monkey: "ปีวอก (ลิง)",
    rooster: "ปีระกา (ไก่)", dog: "ปีจอ (สุนัข)", pig: "ปีกุน (หมู)",
  };

  const elementThai: Record<ChineseElement, string> = {
    wood: "ไม้", fire: "ไฟ", earth: "ดิน", metal: "เหล็ก", water: "น้ำ",
  };

  return `คุณเป็นนักโหราศาสตร์จีนที่เชี่ยวชาญในการทำนายดวงชะตาตามปีนักษัตรจีน

## ข้อมูลพื้นฐาน
ปีนักษัตร: ${animalThai[request.animal]}
ธาตุ: ${elementThai[request.element]}
ช่วงเวลา: ${periodThai}

## รูปแบบการตอบกลับ (JSON Schema-First)
คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "สรุปภาพรวมดวงจีน (2-4 บรรทัด)",
  "opportunities": ["จุดเด่น/จังหวะที่ดี 1", "จุดเด่น 2"],
  "risks": ["สิ่งที่ต้องระวัง/เคราะห์ 1", "จุดระวัง 2"],
  "actions": ["แนวทางแก้เคล็ด/เสริมดวง 1", "แนวทาง 2"],
  "timeframe": "กรอบเวลาที่เด่นชัด",
  "confidence": "low|med|high",
  "disclaimer": "คำเตือนมาตรฐาน (ความเชื่อส่วนบุคคล)"
}

### หลักการทำนาย
1. **คุณภาพคำตอบ**: อ้างอิงข้อมูลจาก Knowledge Base ที่แนบมาให้มากที่สุด
2. **ความเฉพาะเจาะจง**: เชื่อมโยงธาตุและนักษัตรเข้ากับสถานการณ์จริง`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as ChineseZodiacAIRequest;

    if (!body.animal || !body.element || !body.period || !body.baseline) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const rag = retrieveRag({
      query: `ดวงจีนปี${body.animal} ธาตุ${body.element} ช่วง${body.period}`,
      systemId: "chinese_zodiac",
      limit: 6,
    });

    const prompt = buildChineseZodiacPrompt(body) + formatRagContext(rag.chunks);
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!resp.ok) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        ai: {
          summary: body.baseline.advice,
          enhancedFortune: body.baseline.fortune,
          advice: body.baseline.advice,
          culturalInsight: "ขออภัย ระบบขัดข้องชั่วคราว",
        },
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json({
        ok: true,
        ai: {
          summary: parsed.summary,
          enhancedFortune: {
            overall: parsed.summary,
            career: parsed.opportunities?.[0] || "ปกติ",
            wealth: parsed.opportunities?.[1] || "ปกติ",
            health: parsed.risks?.[0] || "ปกติ",
            relationships: parsed.opportunities?.[2] || "ปกติ",
          },
          advice: parsed.actions?.join(". ") || parsed.summary,
          culturalInsight: parsed.disclaimer,
        },
      });
    } catch {
      return NextResponse.json({
        ok: true,
        fallback: true,
        ai: {
          summary: body.baseline.advice,
          enhancedFortune: body.baseline.fortune,
          advice: body.baseline.advice,
          culturalInsight: "ขออภัย ระบบขัดข้องชั่วคราว",
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
