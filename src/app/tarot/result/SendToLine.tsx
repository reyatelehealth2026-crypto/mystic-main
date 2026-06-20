"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { sendLiffMessages, shareReadingToFriends } from "@/lib/auth/liff";
import { buildReadingMessageText } from "@/lib/line/readingMessage";
import { trackEvent } from "@/lib/analytics/tracking";

export function SendToLine({ cards, summary }: { cards: string; summary: string }) {
  const [status, setStatus] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  function currentUrl(): string {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  async function sendToLine() {
    setBusy(true);
    setStatus("");
    try {
      const url = currentUrl();
      const text = buildReadingMessageText({ cards, summary, url });

      if (await sendLiffMessages([{ type: "text", text }])) {
        setStatus("ส่งผลไพ่เข้าแชท LINE แล้ว ✅");
        trackEvent("reading_sent_to_line", { via: "liff" });
        return;
      }

      const res = await fetch("/api/line/push-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards, summary, url }),
      });
      if (res.ok) {
        setStatus("ส่งผลไพ่เข้า LINE แล้ว ✅");
        trackEvent("reading_sent_to_line", { via: "push" });
      } else if (res.status === 401) {
        setStatus("กรุณาเข้าสู่ระบบด้วย LINE ก่อนนะคะ");
      } else {
        setStatus("ส่งไม่สำเร็จ ลองใหม่อีกครั้งนะคะ");
      }
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    const text = buildReadingMessageText({ cards, summary, url: currentUrl() });
    if (await shareReadingToFriends([{ type: "text", text }])) {
      trackEvent("reading_shared_to_friends", {});
    } else {
      setStatus("แชร์ให้เพื่อนได้เฉพาะในแอป LINE นะคะ");
    }
  }

  return (
    <>
      <Button className="w-full" size="lg" variant="secondary" onClick={() => void sendToLine()} disabled={busy}>
        {busy ? "กำลังส่ง…" : "ส่งผลไพ่เข้า LINE 💬"}
      </Button>
      <Button className="w-full" size="lg" variant="ghost" onClick={() => void share()}>
        แชร์ให้เพื่อนใน LINE 🔗
      </Button>
      {status ? <p className="text-center text-sm text-fg-muted">{status}</p> : null}
    </>
  );
}
