"use client";

import React from "react";
import type { ShareableData } from "./types";
import { TarotShareableCard } from "./tarot/TarotShareableCard";
import { SpiritShareableCard } from "./spirit/SpiritShareableCard";
import { NumerologyShareableCard } from "./numerology/NumerologyShareableCard";
import { HoroscopeShareableCard } from "./horoscope/HoroscopeShareableCard";
import { CompatibilityShareableCard } from "./compatibility/CompatibilityShareableCard";
import { ChineseZodiacShareableCard } from "./chinese-zodiac/ChineseZodiacShareableCard";
import { ShareToLineButton } from "./ShareToLineButton";
import { buildDailyCardFlex, buildReadingFlex } from "@/lib/line/flex";
import type { LineMessage } from "@/lib/line/messaging";

interface UniversalShareableCardProps {
  data: ShareableData;
  onShare?: () => void;
  className?: string;
}

/**
 * Build Flex messages for the LINE shareTargetPicker from any ShareableData vertical.
 * Used by UniversalShareableCard and can be called independently.
 */
export function buildFlexForShareable(data: ShareableData): LineMessage[] {
  switch (data.vertical) {
    case "daily": {
      return [
        buildDailyCardFlex({
          cardNameTh: data.cardNameTh ?? data.cardName,
          cardName: data.cardName,
          orientation: "upright",
          meaning: data.meaning,
          keywords: [],
          imageUrl: data.cardImage ?? null,
        }),
      ];
    }
    case "tarot": {
      const first = data.cards[0];
      if (!first) return [];
      return [
        buildDailyCardFlex({
          cardNameTh: first.nameTh ?? first.name,
          cardName: first.name,
          orientation: first.orientation,
          meaning: first.meaning,
          keywords: [],
          imageUrl: first.image ?? null,
        }),
      ];
    }
    case "spirit": {
      return [
        buildReadingFlex(
          [
            { title: "ความหมาย", body: data.meaning, emphasis: "positive" },
            { title: "คำแนะนำ", body: data.guidance },
          ],
          `สปิริตการ์ด: ${data.cardNameTh ?? data.cardName}`,
          "/spirit-card",
        ),
      ];
    }
    case "numerology": {
      return [
        buildReadingFlex(
          [{ title: data.inputType === "phone" ? "เบอร์โทร" : "ชื่อ", body: data.analysis }],
          `ตัวเลขนำโชค: ${data.result}`,
          "/numerology",
        ),
      ];
    }
    case "horoscope": {
      return [
        buildReadingFlex(
          [{ title: "คำทำนาย", body: data.prediction, emphasis: "positive" }],
          `ดวง${data.zodiacTh}`,
          "/horoscope",
        ),
      ];
    }
    case "compatibility": {
      return [
        buildReadingFlex(
          [
            { title: "ผลความเข้ากัน", body: data.result, emphasis: "positive" },
            { title: "คำแนะนำ", body: data.advice },
          ],
          `${data.sign1.nameTh} ❤ ${data.sign2.nameTh} (${data.score}%)`,
          "/compatibility",
        ),
      ];
    }
    case "chinese-zodiac": {
      return [
        buildReadingFlex(
          [{ title: "คำทำนาย", body: data.prediction, emphasis: "positive" }],
          `ราศีจีน: ${data.animalTh}`,
          "/chinese-zodiac",
        ),
      ];
    }
    default:
      return [];
  }
}

export function UniversalShareableCard({ data, onShare, className }: UniversalShareableCardProps) {
  const card = (() => {
    switch (data.vertical) {
      case "tarot":
        return <TarotShareableCard data={data} onShare={onShare} className={className} />;
      case "spirit":
        return <SpiritShareableCard data={data} onShare={onShare} className={className} />;
      case "numerology":
        return <NumerologyShareableCard data={data} onShare={onShare} className={className} />;
      case "horoscope":
        return <HoroscopeShareableCard data={data} onShare={onShare} className={className} />;
      case "compatibility":
        return <CompatibilityShareableCard data={data} onShare={onShare} className={className} />;
      case "chinese-zodiac":
        return <ChineseZodiacShareableCard data={data} onShare={onShare} className={className} />;
      default:
        return null;
    }
  })();

  if (!card) return null;

  return (
    <div>
      {card}
      {/* Native LINE share button — only renders inside the LINE app */}
      <div className="mt-3 flex justify-center">
        <ShareToLineButton
          buildMessages={() => buildFlexForShareable(data)}
          onFallback={onShare}
          labelTh="แชร์เข้า LINE"
        />
      </div>
    </div>
  );
}

// Re-export types
export * from "./types";

