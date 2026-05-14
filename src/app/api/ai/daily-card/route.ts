import { NextResponse } from "next/server";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { cardMeaning } from "@/lib/tarot/engine";
import { buildDailyCardPrompt } from "@/lib/ai/prompts";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

type GeminiDailyResponse = {
  summary: string;
  opportunities?: string[];
  risks?: string[];
  actions?: string[];
  timeframe?: string;
  confidence?: string;
  disclaimer?: string;
};

function formatAsCardStructure(parsed: GeminiDailyResponse): string {
  const parts = [];
  if (parsed.opportunities?.length) {
    parts.push(`✨ โอกาสวันนี้:\n${parsed.opportunities.map(o => `• ${o}`).join('\n')}`);
  }
  if (parsed.risks?.length) {
    parts.push(`⚠️ สิ่งที่ต้องระวัง:\n${parsed.risks.map(r => `• ${r}`).join('\n')}`);
  }
  if (parsed.actions?.length) {
    parts.push(`📋 แนวทางปฏิบัติ:\n${parsed.actions.map(a => `• ${a}`).join('\n')}`);
  }
  return parts.join('\n\n');
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const body = (await req.json()) as { cardId?: string; orientation?: "upright" | "reversed"; dayKey?: string };
    const card = TAROT_DECK.find(c => c.id === body.cardId);
    if (!card || !body.orientation) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

    const orientation = body.orientation;
    const dayKey = body.dayKey || new Date().toISOString().split('T')[0];

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "missing_gemini_api_key",
        ai: {
          summary: cardMeaning({ card, orientation }),
          cardStructure: "ขออภัย ระบบยังไม่พร้อม สรุปจากความหมายไพ่พื้นฐานให้ก่อน",
        },
      });
    }

    // RAG
    const rag = retrieveRag({
      query: `ไพ่รายวัน ${card.nameTh ?? card.name} ${orientation === "upright" ? "ตั้งตรง" : "กลับหัว"}`,
      systemId: "tarot_th",
      limit: 6,
    });

    const prompt = buildDailyCardPrompt({ card, orientation, dayKey }) + formatRagContext(rag.chunks);
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    if (!resp.ok) {
      return NextResponse.json({ 
        ok: true, 
        fallback: true,
        ai: { 
          summary: cardMeaning({ card, orientation }), 
          cardStructure: "ขออภัย ระบบขัดข้องชั่วคราว" 
        } 
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    try {
      const parsed = JSON.parse(raw) as GeminiDailyResponse;
      return NextResponse.json({
        ok: true,
        ai: {
          summary: parsed.summary,
          cardStructure: formatAsCardStructure(parsed),
        },
      });
    } catch {
      return NextResponse.json({
        ok: true,
        fallback: true,
        ai: { 
          summary: cardMeaning({ card, orientation }), 
          cardStructure: "สรุปคำทำนายยังไม่สมบูรณ์" 
        }
      });
    }
  } catch (e) {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
