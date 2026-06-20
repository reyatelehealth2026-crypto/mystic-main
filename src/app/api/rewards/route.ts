import { NextResponse } from "next/server";
import { listRewards } from "@/lib/supabase/rewards";

export const dynamic = "force-dynamic";

/** Public reward catalog. */
export async function GET() {
  try {
    const rewards = await listRewards();
    return NextResponse.json({ ok: true, rewards });
  } catch (err) {
    return NextResponse.json(
      { error: "list_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
