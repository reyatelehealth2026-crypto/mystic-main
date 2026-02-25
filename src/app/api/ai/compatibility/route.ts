import { NextResponse } from "next/server";
import type { ZodiacSign } from "@/lib/horoscope/types";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

interface CompatibilityAIRequest {
  person1: {
    birthDate: string; // ISO date string
    zodiacSign: ZodiacSign;
  };
  person2: {
    birthDate: string; // ISO date string
    zodiacSign: ZodiacSign;
  };
  baseline: {
    overallScore: number;
    scores: {
      overall: number;
      communication: number;
      emotional: number;
      longTerm: number;
    };
    strengths: string[];
    challenges: string[];
    advice: string;
    elementCompatibility: string;
  };
}

function buildCompatibilityPrompt(request: CompatibilityAIRequest): string {
  const zodiacThai: Record<ZodiacSign, string> = {
    aries: "เมษ", taurus: "พฤษภ", gemini: "เมถุน", cancer: "กรกฎ",
    leo: "สิงห์", virgo: "กันย์", libra: "ตุลย์", scorpio: "พิจิก",
    sagittarius: "ธนู", capricorn: "มกร", aquarius: "กุมภ์", pisces: "มีน",
  };

  const person1Thai = zodiacThai[request.person1.zodiacSign];
  const person2Thai = zodiacThai[request.person2.zodiacSign];

  return `คุณเป็นนักโหราศาสตร์ไทยที่เชี่ยวชาญด้านความสัมพันธ์

## ข้อมูลพื้นฐาน
คนที่ 1: ราศี${person1Thai}
คนที่ 2: ราศี${person2Thai}

## รูปแบบการตอบกลับ (JSON Schema-First)
คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "สรุปภาพรวมความเข้ากันได้ (2-4 บรรทัด)",
  "opportunities": ["จุดแข็ง/เคมีที่เข้ากัน 1", "จุดแข็ง 2"],
  "risks": ["จุดเสี่ยง/เรื่องที่อาจทะเลาะ 1", "จุดเสี่ยง 2"],
  "actions": ["วิธีปรับจูน/รักษาความสัมพันธ์ 1", "วิธีปรับจูน 2"],
  "timeframe": "กรอบเวลาที่ควรระวังหรือควรเปิดใจ",
  "confidence": "low|med|high",
  "disclaimer": "คำเตือนมาตรฐาน (ความเชื่อส่วนบุคคล)"
}

### หลักการทำนาย
1. **คุณภาพคำตอบ**: อ้างอิงข้อมูลจาก Knowledge Base ที่แนบมาให้มากที่สุด
2. **ความเฉพาะเจาะจง**: เน้นการนำไปปรับใช้จริงในชีวิตคู่/ความสัมพันธ์`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as CompatibilityAIRequest;

    if (!body.person1 || !body.person2 || !body.baseline) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const rag = retrieveRag({
      query: `ความเข้ากันราศี${body.person1.zodiacSign} และราศี${body.person2.zodiacSign}`,
      systemId: "tarot_th",
      intent: "matching",
      limit: 6,
    });

    const prompt = buildCompatibilityPrompt(body) + formatRagContext(rag.chunks);
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
          detailedAnalysis: {
            communication: "ปกติ",
            emotional: "ปกติ",
            longTerm: "ปกติ",
          },
          personalizedAdvice: body.baseline.advice,
          strengthsInsight: body.baseline.strengths.join(". "),
          challengesGuidance: body.baseline.challenges.join(". "),
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
          detailedAnalysis: {
            communication: parsed.opportunities?.[0] || "ปกติ",
            emotional: parsed.opportunities?.[1] || "ปกติ",
            longTerm: parsed.risks?.[0] || "ปกติ",
          },
          personalizedAdvice: parsed.actions?.join(". ") || parsed.summary,
          strengthsInsight: parsed.opportunities?.join(". "),
          challengesGuidance: parsed.risks?.join(". "),
        },
      });
    } catch {
      return NextResponse.json({
        ok: true,
        fallback: true,
        ai: {
          summary: body.baseline.advice,
          detailedAnalysis: {
            communication: "ปกติ",
            emotional: "ปกติ",
            longTerm: "ปกติ",
          },
          personalizedAdvice: body.baseline.advice,
          strengthsInsight: body.baseline.strengths.join(". "),
          challengesGuidance: body.baseline.challenges.join(". "),
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
