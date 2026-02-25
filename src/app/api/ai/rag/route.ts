import { NextResponse } from "next/server";
import { retrieveRag, formatRagContext } from "@/lib/rag/retriever";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      query?: string;
      systemId?: string;
      intent?: string;
      limit?: number;
    };

    const query = body?.query?.trim();
    if (!query) {
      return NextResponse.json({ ok: false, error: "Missing query" }, { status: 400 });
    }

    const result = retrieveRag({
      query,
      systemId: body.systemId,
      intent: body.intent,
      limit: body.limit ?? 6,
    });

    return NextResponse.json({
      ok: true,
      chunks: result.chunks,
      context: formatRagContext(result.chunks),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
