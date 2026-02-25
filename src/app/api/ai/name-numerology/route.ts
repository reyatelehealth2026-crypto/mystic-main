import { NextResponse } from "next/server";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

interface NameNumerologyAIRequest {
  firstName: string;
  lastName: string;
  scores: {
    firstName: number;
    lastName: number;
    fullName: number;
    destiny: number;
  };
  baseline: {
    interpretation: {
      personality: string;
      strengths: string[];
      weaknesses: string[];
      lifePath: string;
      career: string;
      relationships: string;
    };
    luckyNumbers: number[];
    advice: string;
  };
}

function buildNameNumerologyPrompt(request: NameNumerologyAIRequest): string {
  return `คุณเป็นนักเลขศาสตร์ไทยที่เชี่ยวชาญในการวิเคราะห์ชื่อ

## ข้อมูลพื้นฐาน
ชื่อ: ${request.firstName} ${request.lastName}
เลขชื่อ: ${request.scores.firstName}
เลขนามสกุล: ${request.scores.lastName}
เลขชื่อเต็ม: ${request.scores.fullName}
เลขชะตา: ${request.scores.destiny}

## รูปแบบการตอบกลับ (JSON Schema-First)
คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "สรุปภาพรวมพลังของชื่อ (2-4 บรรทัด)",
  "opportunities": ["จุดแข็ง/โอกาสของชื่อ 1", "จุดแข็ง 2"],
  "risks": ["จุดอ่อน/ข้อควรระวัง 1", "จุดควรระวัง 2"],
  "actions": ["แนวทางปฏิบัติ/การเสริมบุญ 1", "แนวทาง 2"],
  "timeframe": "ภาพรวมระยะยาวของพลังชื่อ",
  "confidence": "low|med|high",
  "disclaimer": "คำเตือนมาตรฐาน (ความเชื่อส่วนบุคคล)"
}

### หลักการทำนาย
1. **คุณภาพคำตอบ**: อ้างอิงข้อมูลจาก Knowledge Base ที่แนบมาให้มากที่สุด
2. **ความเฉพาะเจาะจง**: เน้นสถานการณ์จริงที่เจ้าของชื่อจะได้เจอ`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as NameNumerologyAIRequest;

    if (!body.firstName || !body.lastName || !body.scores || !body.baseline) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const rag = retrieveRag({
      query: `วิเคราะห์ชื่อ ${body.firstName} ${body.lastName} เลขชะตา ${body.scores.destiny}`,
      systemId: "numerology",
      limit: 6,
    });

    const prompt = buildNameNumerologyPrompt(body) + formatRagContext(rag.chunks);
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
          enhancedInterpretation: {
            personality: body.baseline.interpretation.personality,
            lifePath: body.baseline.interpretation.lifePath,
            career: body.baseline.interpretation.career,
            relationships: body.baseline.interpretation.relationships,
          },
          personalizedAdvice: body.baseline.advice,
          strengthsInsight: body.baseline.interpretation.strengths.join(" "),
          growthGuidance: body.baseline.interpretation.weaknesses.join(" "),
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
          enhancedInterpretation: {
            personality: parsed.summary,
            lifePath: parsed.timeframe || "ปกติ",
            career: parsed.opportunities?.[0] || "ปกติ",
            relationships: parsed.opportunities?.[1] || "ปกติ",
          },
          personalizedAdvice: parsed.actions?.join(". ") || parsed.summary,
          strengthsInsight: parsed.opportunities?.join(". "),
          growthGuidance: parsed.risks?.join(". "),
        },
      });
    } catch {
      return NextResponse.json({
        ok: true,
        fallback: true,
        ai: {
          summary: body.baseline.advice,
          enhancedInterpretation: {
            personality: body.baseline.interpretation.personality,
            lifePath: body.baseline.interpretation.lifePath,
            career: body.baseline.interpretation.career,
            relationships: body.baseline.interpretation.relationships,
          },
          personalizedAdvice: body.baseline.advice,
          strengthsInsight: body.baseline.interpretation.strengths.join(" "),
          growthGuidance: body.baseline.interpretation.weaknesses.join(" "),
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
