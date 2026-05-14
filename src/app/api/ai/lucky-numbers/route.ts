import { NextResponse } from "next/server";
import { computeLuckyNumbers, type LuckyTopic } from "@/lib/lucky-numbers/engine";
import { buildLuckyNumbersPrompt } from "@/lib/ai/prompts";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

type GeminiLuckyNumbersResponse = {
  summary?: string;
  cardNotes?: string[];
  opportunities?: string[];
  risks?: string[];
  actions?: string[];
  luckyMoment?: string;
  disclaimer?: string;
};

const VALID_TOPICS: LuckyTopic[] = ["finance", "career", "love", "luck", "health"];

function formatAsStructure(parsed: GeminiLuckyNumbersResponse): string {
  const parts: string[] = [];
  if (parsed.cardNotes?.length) {
    parts.push(`🔢 ความหมายของแต่ละไพ่:\n${parsed.cardNotes.map((n) => `• ${n}`).join("\n")}`);
  }
  if (parsed.opportunities?.length) {
    parts.push(`✨ โอกาสที่ชุดเลขนี้เปิดให้:\n${parsed.opportunities.map((o) => `• ${o}`).join("\n")}`);
  }
  if (parsed.risks?.length) {
    parts.push(`⚠️ จุดที่ควรระวัง:\n${parsed.risks.map((r) => `• ${r}`).join("\n")}`);
  }
  if (parsed.actions?.length) {
    parts.push(`📋 วิธีใช้พลังเลขในชีวิตจริง:\n${parsed.actions.map((a) => `• ${a}`).join("\n")}`);
  }
  if (parsed.luckyMoment) {
    parts.push(`⏳ ช่วงเวลาที่พลังเด่น: ${parsed.luckyMoment}`);
  }
  return parts.join("\n\n");
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const body = (await req.json()) as {
      dob?: string;
      topic?: string;
      intent?: string;
      dayKey?: string;
    };

    if (!body.dob || !body.topic || !VALID_TOPICS.includes(body.topic as LuckyTopic)) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const result = computeLuckyNumbers({
      dob: body.dob,
      topic: body.topic as LuckyTopic,
      intent: body.intent,
      dayKey: body.dayKey,
    });
    if (!result) return NextResponse.json({ error: "invalid_dob" }, { status: 400 });

    const fallbackSummary = `ชุดเลขมงคล ${result.set} สำหรับ${result.topicLabelTh} • เลขเส้นทางชีวิต ${result.lifePathNumber}`;
    const fallbackStructure = result.cards
      .map((c, i) => `ไพ่ที่ ${i + 1} (${c.role}) เลข ${c.digit}: ${c.reasonTh}`)
      .join("\n");

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "missing_gemini_api_key",
        baseline: result,
        ai: { summary: fallbackSummary, cardStructure: fallbackStructure },
      });
    }

    const rag = retrieveRag({
      query: `เลขมงคล ${result.set} หมวด ${result.topicLabelTh} เลขเส้นทางชีวิต ${result.lifePathNumber}`,
      systemId: "numerology_th",
      limit: 6,
    });

    const basePrompt = buildLuckyNumbersPrompt({
      dob: result.dob,
      topic: result.topic,
      topicLabelTh: result.topicLabelTh,
      lifePathNumber: result.lifePathNumber,
      dayKey: result.dayKey,
      cards: result.cards,
      pair: result.pair,
      triple: result.triple,
      intent: result.intent,
    });

    const prompt = basePrompt + formatRagContext(rag.chunks);

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!resp.ok) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        baseline: result,
        ai: { summary: fallbackSummary, cardStructure: fallbackStructure },
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let ai: { summary: string; cardStructure: string };
    try {
      const parsed = JSON.parse(raw) as GeminiLuckyNumbersResponse;
      ai = {
        summary: parsed.summary?.trim() || fallbackSummary,
        cardStructure: formatAsStructure(parsed) || fallbackStructure,
      };
    } catch {
      ai = { summary: fallbackSummary, cardStructure: fallbackStructure };
    }

    return NextResponse.json({ ok: true, baseline: result, ai });
  } catch (e) {
    return NextResponse.json(
      { error: "unexpected_error", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
