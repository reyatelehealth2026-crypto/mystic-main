"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ensureLiff, loginWithLiff } from "@/lib/auth/liff";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * LIFF endpoint page. Configure this URL (e.g. https://<host>/liff) as the LIFF
 * app endpoint in the LINE console. It initializes LIFF, completes login, then
 * forwards the user into the app.
 */
export function LiffClient() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [status, setStatus] = React.useState("กำลังเชื่อมต่อกับ LINE…");

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await ensureLiff();
      if (!ok) {
        if (!cancelled) setStatus("ไม่พบการตั้งค่า LIFF");
        return;
      }
      const loggedIn = await loginWithLiff();
      if (cancelled) return;
      if (loggedIn) {
        await refresh();
        router.replace("/profile");
      }
      // If not logged in, loginWithLiff() has triggered a redirect.
    })();
    return () => {
      cancelled = true;
    };
  }, [router, refresh]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-5 text-center">
      <p className="text-sm text-fg-muted">{status}</p>
    </div>
  );
}
