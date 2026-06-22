import { NextResponse } from "next/server";
import { ensureUser } from "@/lib/auth/apiGuard";
import { parseCardTokens } from "@/lib/tarot/engine";
import { buildChatPrompt } from "@/lib/ai/prompts";
import type { ChatTurn } from "@/lib/ai/types";

type ChatTurnLegacy = { role: "user" | "assistant"; text: string };

const FALLBACK_ANSWER =
  "ขออภัย ตอนนี้ระบบอ่านเชิงลึกหนาแน่น ลองพิมพ์คำถามอีกครั้งในไม่กี่นาที หรือทบทวนภาพรวมไพ่ที่ออกพร้อมคำแนะนำเดิมก่อนก็ได้นะคะ";

export async function POST(req: Request) {
  const guard = await ensureUser();
  if (guard instanceof NextResponse) return guard;
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const body = (await req.json()) as {
      cardsToken?: string;
      count?: number;
      baseQuestion?: string;
      followUpQuestion?: string;
      history?: ChatTurnLegacy[];
    };

    const followUp = body.followUpQuestion?.trim();
    if (!followUp) {
      return NextResponse.json({ error: "missing_followup_question" }, { status: 400 });
    }

    const cards = parseCardTokens(body.cardsToken ?? "");
    if (!cards.length) {
      return NextResponse.json({ error: "invalid_cards" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "missing_gemini_api_key",
        answer: FALLBACK_ANSWER,
      });
    }

    // Convert legacy chat history format to new format
    const history: ChatTurn[] = (body.history ?? []).map(turn => ({
      role: turn.role,
      content: turn.text,
    }));

    // Build prompt using new prompt builder
    const prompt = buildChatPrompt({
      cards,
      baseQuestion: body.baseQuestion,
      followUpQuestion: followUp,
      history,
    });

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.75,
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "gemini_unavailable",
        detail: text,
        answer: FALLBACK_ANSWER,
      });
    }

    const data = await resp.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!answer) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "empty_answer",
        answer: FALLBACK_ANSWER,
      });
    }

    return NextResponse.json({ ok: true, answer });
  } catch (error) {
    return NextResponse.json(
      { error: "unexpected_error", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
