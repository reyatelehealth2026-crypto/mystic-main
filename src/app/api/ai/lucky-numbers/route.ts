import { NextResponse } from "next/server";
import { analyseLuckyDigits, type LuckyDigit } from "@/lib/lucky-numbers/engine";
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

function isLuckyDigit(value: unknown): value is LuckyDigit {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 9;
}

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
    const body = (await req.json()) as { digits?: unknown };

    if (!Array.isArray(body.digits) || !body.digits.every(isLuckyDigit)) {
      return NextResponse.json({ error: "invalid_digits" }, { status: 400 });
    }
    if (![2, 3, 4].includes(body.digits.length)) {
      return NextResponse.json({ error: "invalid_count" }, { status: 400 });
    }

    const analysis = analyseLuckyDigits(body.digits);
    if (!analysis) return NextResponse.json({ error: "invalid_digits" }, { status: 400 });

    const fallbackSummary = `ชุดเลขมงคล ${analysis.combined} • ผลรวม ${analysis.sum} • เลขราก ${analysis.root}`;
    const fallbackStructure = analysis.reading;

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "missing_gemini_api_key",
        baseline: analysis,
        ai: { summary: fallbackSummary, cardStructure: fallbackStructure },
      });
    }

    const rag = retrieveRag({
      query: `เลขมงคล ${analysis.combined} ผลรวม ${analysis.sum} เลขราก ${analysis.root}`,
      systemId: "numerology_th",
      limit: 6,
    });

    const basePrompt = buildLuckyNumbersPrompt({
      digits: analysis.digits,
      combined: analysis.combined,
      sum: analysis.sum,
      root: analysis.root,
      meanings: analysis.meanings,
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
        baseline: analysis,
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

    return NextResponse.json({ ok: true, baseline: analysis, ai });
  } catch (e) {
    return NextResponse.json(
      { error: "unexpected_error", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
