import { NextResponse } from "next/server";
import { spiritCardFromDob } from "@/lib/tarot/spirit";
import { cardMeaning } from "@/lib/tarot/engine";
import { buildSpiritPrompt } from "@/lib/ai/prompts";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

type GeminiSpiritResponse = {
  summary: string;
  opportunities?: string[];
  risks?: string[];
  actions?: string[];
  timeframe?: string;
  confidence?: string;
  disclaimer?: string;
};

function formatAsCardStructure(parsed: GeminiSpiritResponse): string {
  const parts = [];
  if (parsed.opportunities?.length) {
    parts.push(`✨ จุดแข็งตามธรรมชาติ:\n${parsed.opportunities.map(o => `• ${o}`).join('\n')}`);
  }
  if (parsed.risks?.length) {
    parts.push(`⚠️ ความท้าทายที่ต้องพัฒนา:\n${parsed.risks.map(r => `• ${r}`).join('\n')}`);
  }
  if (parsed.actions?.length) {
    parts.push(`📋 แนวทางการพัฒนาตนเอง:\n${parsed.actions.map(a => `• ${a}`).join('\n')}`);
  }
  if (parsed.timeframe) {
    parts.push(`⏳ ภาพรวมระยะยาว: ${parsed.timeframe}`);
  }
  return parts.join('\n\n');
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });

    const body = (await req.json()) as { dob?: string };
    const result = spiritCardFromDob(body.dob ?? "");
    if (!result) return NextResponse.json({ error: "invalid_dob" }, { status: 400 });

    // --- RAG (local-file prototype) ---
    const rag = retrieveRag({
      query: `ไพ่ประจำตัว ${result.card.nameTh ?? result.card.name} วันเกิด ${body.dob}`,
      systemId: "tarot_th",
      limit: 6,
    });

    // Build prompt using new prompt builder + RAG context
    const basePrompt = buildSpiritPrompt({
      card: result.card,
      orientation: result.orientation,
      lifePathNumber: result.lifePathNumber,
      dob: body.dob ?? "",
    });
    
    const prompt = basePrompt + formatRagContext(rag.chunks);

    const fallbackStructure = `ไพ่: ${result.card.name} • ทิศทาง: ${result.orientation === "upright" ? "ตั้งตรง" : "กลับหัว"} • เลขเส้นทางชีวิต: ${result.lifePathNumber} • ใจความ: ${cardMeaning(result)}`;

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    // If API is unavailable, don't keep users stuck on loading (match ResultClient pattern)
    // Note: server-side timeout is different from client, but we add try-catch

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
          summary: cardMeaning(result), 
          cardStructure: fallbackStructure 
        } 
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let ai: { summary: string; cardStructure: string };
    try {
      const parsed = JSON.parse(raw) as GeminiSpiritResponse;
      ai = {
        summary: parsed.summary || "สรุปคำทำนายยังไม่สมบูรณ์",
        cardStructure: formatAsCardStructure(parsed) || fallbackStructure,
      };
    } catch {
      ai = { summary: "สรุปคำทำนายยังไม่สมบูรณ์ (Parse Error)", cardStructure: fallbackStructure };
    }

    return NextResponse.json({ ok: true, ai });
  } catch (e) {
    return NextResponse.json({ error: "unexpected_error", detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
