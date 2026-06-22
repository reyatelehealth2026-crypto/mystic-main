/**
 * POST /api/cron/daily-push
 *
 * Called by an external scheduler once per hour (e.g. Supabase pg_cron + pg_net,
 * cron-job.org, or GitHub Actions). Auth'd with a CRON_SECRET bearer token.
 *
 * Design notes:
 * - UTC+7 = Asia/Bangkok; Thailand has no DST, so offset arithmetic is stable.
 * - Only calls the deterministic tarot engine — never Gemini — to keep Worker
 *   CPU and subrequest budgets within Cloudflare limits.
 * - `daily_push_last_sent_on` provides idempotency: re-running the same hour
 *   is safe.
 * - Processes ≤500 users per run; the index on (daily_push_hour) WHERE
 *   daily_push_opt_in ensures the query is fast even at scale.
 */

import { NextResponse } from "next/server";
import { drawCards, cardMeaning } from "@/lib/tarot/engine";
import { buildDailyCardFlex } from "@/lib/line/flex";
import { sendLinePush } from "@/lib/line/messaging";
import { listUsersDueForDailyPush, markDailyPushSent } from "@/lib/supabase/notifications";

export const dynamic = "force-dynamic";

/** Constant-time string comparison to guard against timing attacks on the secret. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Run through chars anyway to keep timing consistent (no early exit)
    let sink = 0;
    for (let i = 0; i < a.length; i++) sink ^= a.charCodeAt(i);
    void sink;
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "cron_not_configured" }, { status: 503 });
  }
  const authHeader = req.headers.get("authorization") ?? "";
  const provided = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!timingSafeEqual(provided, cronSecret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // ── Bangkok time (UTC+7, no DST) ─────────────────────────────────────────
  const nowUtc = Date.now();
  const bkkMs = nowUtc + 7 * 3_600_000;
  const bkkDate = new Date(bkkMs);
  const bangkokHour = bkkDate.getUTCHours(); // 0–23
  const todayBkk = bkkDate.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // ── Fetch users due ───────────────────────────────────────────────────────
  let users: Array<{ id: string; line_user_id: string }>;
  try {
    users = await listUsersDueForDailyPush(bangkokHour, todayBkk);
  } catch (err) {
    return NextResponse.json(
      { error: "db_error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }

  // ── Send pushes ───────────────────────────────────────────────────────────
  let sent = 0;
  let failed = 0;

  for (const u of users) {
    try {
      // Deterministic draw (no Gemini) — fast and budget-safe in Workers
      const [drawn] = drawCards(1);
      if (!drawn) continue;

      const flex = buildDailyCardFlex({
        cardNameTh: drawn.card.nameTh ?? drawn.card.name,
        cardName: drawn.card.name,
        orientation: drawn.orientation,
        meaning: cardMeaning(drawn),
        keywords:
          drawn.orientation === "upright"
            ? drawn.card.keywordsUpright
            : drawn.card.keywordsReversed,
        imageUrl: drawn.card.image ? `/card/${drawn.card.image}` : null,
      });

      const result = await sendLinePush(u.line_user_id, [flex], {
        messageType: "daily_push",
        userId: u.id,
      });

      if (result.ok) {
        await markDailyPushSent(u.id, todayBkk);
        sent++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return NextResponse.json({
    ok: true,
    bangkokHour,
    todayBkk,
    processed: users.length,
    sent,
    failed,
  });
}
