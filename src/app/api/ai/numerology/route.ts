import { NextResponse } from "next/server";
import { analyzeThaiPhone } from "@/lib/numerology/engine";
import { buildNumerologyPrompt } from "@/lib/ai/prompts";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

type GeminiNumerologyResponse = {
  summary: string;
  opportunities?: string[];
  risks?: string[];
  actions?: string[];
  timeframe?: string;
  confidence?: string;
  disclaimer?: string;
};

function formatAsCardStructure(parsed: GeminiNumerologyResponse): string {
  const parts = [];
  if (parsed.opportunities?.length) {
    parts.push(`✨ จุดเด่นและโอกาส:\n${parsed.opportunities.map(o => `• ${o}`).join('\n')}`);
  }
  if (parsed.risks?.length) {
    parts.push(`⚠️ ข้อควรระวัง:\n${parsed.risks.map(r => `• ${r}`).join('\n')}`);
  }
  if (parsed.actions?.length) {
    parts.push(`📋 แนวทางปฏิบัติ:\n${parsed.actions.map(a => `• ${a}`).join('\n')}`);
  }
  if (parsed.timeframe) {
    parts.push(`⏳ ช่วงเวลาพลังงาน: ${parsed.timeframe}`);
  }
  return parts.join('\n\n');
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const body = (await req.json()) as { phone?: string };
    const result = analyzeThaiPhone(body.phone ?? "");
    if (!result) return NextResponse.json({ error: "invalid_phone" }, { status: 400 });

    const fallbackStructure = `คะแนน ${result.score}/99 (${result.tier}) • เลขรวม ${result.total} • เลขราก ${result.root}`;

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "missing_gemini_api_key",
        ai: { summary: result.themes.work, cardStructure: fallbackStructure },
      });
    }

    // --- RAG (local-file prototype) ---
    const rag = retrieveRag({
      query: `เบอร์โทรศัพท์ ${result.normalizedPhone} เลขรวม ${result.total} เลขราก ${result.root}`,
      systemId: "numerology_th",
      limit: 6,
    });

    // Build prompt using new prompt builder + RAG context
    const basePrompt = buildNumerologyPrompt({
      normalizedPhone: result.normalizedPhone,
      score: result.score,
      tier: result.tier,
      total: result.total,
      root: result.root,
      themes: result.themes,
    });
    
    const prompt = basePrompt + formatRagContext(rag.chunks);

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
          summary: result.themes.work, 
          cardStructure: fallbackStructure 
        } 
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let ai: { summary: string; cardStructure: string };
    try {
      const parsed = JSON.parse(raw) as GeminiNumerologyResponse;
      ai = {
        summary: parsed.summary || "สรุปการวิเคราะห์ยังไม่สมบูรณ์",
        cardStructure: formatAsCardStructure(parsed) || fallbackStructure,
      };
    } catch {
      ai = { summary: "สรุปการวิเคราะห์ยังไม่สมบูรณ์ (Parse Error)", cardStructure: fallbackStructure };
    }
    return NextResponse.json({ ok: true, ai });
  } catch (e) {
    return NextResponse.json({ error: "unexpected_error", detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
