import { NextResponse } from "next/server";
import { cardMeaning, parseCardTokens } from "@/lib/tarot/engine";
import { buildChatPrompt } from "@/lib/ai/prompts";
import type { ChatTurn } from "@/lib/ai/types";

type ChatTurnLegacy = { role: "user" | "assistant"; text: string };

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

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
      return NextResponse.json({ error: "gemini_request_failed", detail: text }, { status: 502 });
    }

    const data = await resp.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!answer) {
      return NextResponse.json({ error: "empty_answer" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, answer });
  } catch (error) {
    return NextResponse.json(
      { error: "unexpected_error", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
