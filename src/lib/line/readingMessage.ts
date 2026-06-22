/**
 * Pure builder for the LINE **Flex** message that shows the drawn tarot cards
 * (image + name + orientation). No prediction text — the fortune teller types
 * the คำทำนาย themselves in chat. No IO so it is unit-testable and shared by the
 * LIFF path and the server-push path.
 */
export interface FlexCard {
  name: string; // display name (Thai preferred)
  imageUrl: string; // absolute https URL
  reversed: boolean;
}

export interface LineFlexMessage {
  type: "flex";
  altText: string;
  contents: unknown;
}

function bubble(card: FlexCard): unknown {
  return {
    type: "bubble",
    size: "kilo",
    hero: {
      type: "image",
      url: card.imageUrl,
      size: "full",
      aspectRatio: "20:30",
      aspectMode: "cover",
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        { type: "text", text: card.name, weight: "bold", size: "md", wrap: true, align: "center" },
        {
          type: "text",
          text: card.reversed ? "ไพ่กลับหัว (Reversed)" : "ไพ่ตั้ง (Upright)",
          size: "xs",
          color: "#9aa0a6",
          align: "center",
        },
      ],
    },
  };
}

export function buildReadingFlexMessage(cards: FlexCard[]): LineFlexMessage {
  const bubbles = cards.map(bubble);
  const altText = `🔮 ไพ่ที่คุณเปิดได้: ${cards.map((c) => c.name).join(", ")}`;
  return {
    type: "flex",
    altText,
    contents: bubbles.length === 1 ? bubbles[0] : { type: "carousel", contents: bubbles },
  };
}
