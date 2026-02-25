import { NextResponse } from "next/server";
import type { ZodiacSign, TimePeriod } from "@/lib/horoscope/types";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

interface HoroscopeAIRequest {
  zodiacSign: ZodiacSign;
  period: TimePeriod;
  baseline: {
    aspects: {
      love: string;
      career: string;
      finance: string;
      health: string;
    };
    luckyNumbers: number[];
    luckyColors: string[];
    advice: string;
  };
}

interface HoroscopeAIResponse {
  summary: string;
  enhancedAspects: {
    love: string;
    career: string;
    finance: string;
    health: string;
  };
  advice: string;
}

function toReadable(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => toReadable(v)).join("\n");
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return Object.entries(obj)
      .map(([k, v]) => `${k}: ${toReadable(v)}`)
      .join("\n");
  }
  return "";
}

function buildHoroscopePrompt(request: HoroscopeAIRequest): string {
  const periodThai = {
    daily: "รายวัน",
    weekly: "รายสัปดาห์",
    monthly: "รายเดือน",
  }[request.period];

  const zodiacThai = {
    aries: "เมษ",
    taurus: "พฤษภ",
    gemini: "เมถุน",
    cancer: "กรกฎ",
    leo: "สิงห์",
    virgo: "กันย์",
    libra: "ตุลย์",
    scorpio: "พิจิก",
    sagittarius: "ธนู",
    capricorn: "มกร",
    aquarius: "กุมภ์",
    pisces: "มีน",
  }[request.zodiacSign];

  return `คุณเป็นนักโหราศาสตร์ไทยที่มีความเชี่ยวชาญในการทำนายดวงชะตา

## บริบททางวัฒนธรรมไทย
ในการทำนายดวงชะตาแบบไทย เราเชื่อในหลักพุทธศาสนาเรื่องกรรม บุญ และการใช้ชีวิตแบบทางสายกลาง การทำนายควรให้คำแนะนำที่เป็นประโยชน์และสร้างสรรค์

## ข้อมูลพื้นฐาน
ราศี: ${zodiacThai}
ช่วงเวลา: ${periodThai}
พื้นฐาน:
- ความรัก: ${request.baseline.aspects.love}
- การงาน: ${request.baseline.aspects.career}
- การเงิน: ${request.baseline.aspects.finance}
- สุขภาพ: ${request.baseline.aspects.health}

## รูปแบบการตอบกลับ (JSON Schema-First)
คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "สรุปภาพรวมดวงชะตา (2-4 บรรทัด)",
  "opportunities": ["จุดเด่น/โอกาสด้านต่างๆ 1", "จุดเด่น 2"],
  "risks": ["สิ่งที่ต้องระวัง/อุปสรรค 1", "จุดระวัง 2"],
  "actions": ["แนวทางปฏิบัติ/วิธีแก้เคล็ด 1", "แนวทาง 2"],
  "timeframe": "ช่วงเวลาที่คาดหวังในรอบนี้",
  "confidence": "low|med|high",
  "disclaimer": "คำเตือนมาตรฐาน (ความเชื่อส่วนบุคคล)"
}

### หลักการทำนาย
1. **คุณภาพคำตอบ**: อ้างอิงข้อมูลจาก Knowledge Base ที่แนบมาให้มากที่สุด
2. **ความเฉพาะเจาะจง**: เน้นสถานการณ์ที่เป็นรูปธรรมและเข้ากับวัฒนธรรมไทย`;
}

function validateResponse(parsed: unknown): parsed is HoroscopeAIResponse {
  if (!parsed || typeof parsed !== "object") return false;
  
  const obj = parsed as Record<string, unknown>;
  
  // Check summary
  if (typeof obj.summary !== "string" || obj.summary.length < 100) return false;
  
  // Check enhancedAspects
  if (!obj.enhancedAspects || typeof obj.enhancedAspects !== "object") return false;
  const aspects = obj.enhancedAspects as Record<string, unknown>;
  if (
    typeof aspects.love !== "string" || aspects.love.length < 50 ||
    typeof aspects.career !== "string" || aspects.career.length < 50 ||
    typeof aspects.finance !== "string" || aspects.finance.length < 50 ||
    typeof aspects.health !== "string" || aspects.health.length < 50
  ) return false;
  
  // Check advice
  if (typeof obj.advice !== "string" || obj.advice.length < 100) return false;
  
  return true;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as HoroscopeAIRequest;

    // Validate input
    if (!body.zodiacSign || !body.period || !body.baseline) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    // --- RAG (local-file prototype) ---
    const rag = retrieveRag({
      query: `ดวงราศี${body.zodiacSign} ช่วง${body.period}`,
      systemId: "thai_astrology",
      limit: 6,
    });

    const prompt = buildHoroscopePrompt(body) + formatRagContext(rag.chunks);

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
          enhancedAspects: body.baseline.aspects,
          advice: body.baseline.advice,
        },
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    try {
      const parsed = JSON.parse(raw);
      // Transform new schema back to UI expectation or update UI?
      // To keep compatibility with existing Horoscope UI, we transform it:
      return NextResponse.json({
        ok: true,
        ai: {
          summary: parsed.summary,
          enhancedAspects: {
            love: parsed.opportunities?.[0] || "ปกติ",
            career: parsed.opportunities?.[1] || "ปกติ",
            finance: parsed.opportunities?.[2] || "ปกติ",
            health: parsed.risks?.[0] || "ปกติ",
          },
          advice: parsed.actions?.join(". ") || parsed.summary,
        }
      });
    } catch {
      return NextResponse.json({
        ok: true,
        fallback: true,
        ai: {
          summary: body.baseline.advice,
          enhancedAspects: body.baseline.aspects,
          advice: body.baseline.advice,
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
