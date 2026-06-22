"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { sendLiffMessages, shareReadingToFriends } from "@/lib/auth/liff";
import { buildReadingFlexMessage, type FlexCard } from "@/lib/line/readingMessage";
import { trackEvent } from "@/lib/analytics/tracking";

export interface CardItem {
  name: string;
  image: string; // public path like /card/00.png (or absolute)
  reversed: boolean;
}

export function SendToLine({ cards }: { cards: CardItem[] }) {
  const [status, setStatus] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  function toFlexCards(): FlexCard[] {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return cards
      .filter((c) => c.name && c.image)
      .map((c) => ({
        name: c.name,
        imageUrl: c.image.startsWith("http") ? c.image : origin + c.image,
        reversed: c.reversed,
      }));
  }

  async function sendToLine() {
    setBusy(true);
    setStatus("");
    try {
      const flex = buildReadingFlexMessage(toFlexCards());

      if (await sendLiffMessages([flex])) {
        setStatus("ส่งไพ่เข้าแชท LINE แล้ว ✅ รอหมอดูทำนายนะคะ");
        trackEvent("reading_sent_to_line", { via: "liff" });
        return;
      }

      const res = await fetch("/api/line/push-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards }),
      });
      if (res.ok) {
        setStatus("ส่งไพ่เข้า LINE แล้ว ✅ รอหมอดูทำนายนะคะ");
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
    const flex = buildReadingFlexMessage(toFlexCards());
    if (await shareReadingToFriends([flex])) {
      trackEvent("reading_shared_to_friends", {});
    } else {
      setStatus("แชร์ให้เพื่อนได้เฉพาะในแอป LINE นะคะ");
    }
  }

  return (
    <>
      <Button className="w-full" size="lg" variant="secondary" onClick={() => void sendToLine()} disabled={busy}>
        {busy ? "กำลังส่ง…" : "ส่งไพ่ให้หมอดูทาง LINE 💬"}
      </Button>
      <Button className="w-full" size="lg" variant="ghost" onClick={() => void share()}>
        แชร์ไพ่ให้เพื่อนใน LINE 🔗
      </Button>
      {status ? <p className="text-center text-sm text-fg-muted">{status}</p> : null}
    </>
  );
}
