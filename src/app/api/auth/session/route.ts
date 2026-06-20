import { NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/auth/getCurrentUser";
import { isAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

/** "me" — returns the current user (or null), used by the client AuthProvider. */
export async function GET() {
  try {
    const user = await getOptionalUser();
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: {
        id: user.id,
        displayName: user.display_name,
        pictureUrl: user.picture_url,
        statusMessage: user.status_message,
        credits: user.credits,
        membershipTier: user.membership_tier,
        isAdmin: isAdmin(user),
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
