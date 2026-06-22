import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { getNotificationPrefs, setNotificationPrefs } from "@/lib/supabase/notifications";

export const dynamic = "force-dynamic";

/** GET /api/me/notifications — return current opt-in + hour for the session user */
export async function GET() {
  try {
    const user = await requireUser();
    const prefs = await getNotificationPrefs(user.id);
    return NextResponse.json(prefs);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

/** POST /api/me/notifications — update opt-in and/or hour */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as { optIn?: boolean; hour?: number };

    if (body.hour !== undefined) {
      const h = Number(body.hour);
      if (!Number.isInteger(h) || h < 0 || h > 23) {
        return NextResponse.json({ error: "hour must be 0–23" }, { status: 400 });
      }
    }

    await setNotificationPrefs(user.id, {
      optIn: typeof body.optIn === "boolean" ? body.optIn : undefined,
      hour: body.hour !== undefined ? Number(body.hour) : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
