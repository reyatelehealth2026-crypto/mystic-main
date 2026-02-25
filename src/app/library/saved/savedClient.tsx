"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { HeartSave } from "@/components/ui/HeartSave";
import { Input } from "@/components/ui/Input";
import { useLibrary } from "@/lib/library/useLibrary";
import type {
  LibraryEntry,
  SavedDailyCardReading,
  SavedSpiritCardReading,
  SavedSpiritPathReading,
  SavedTarotReading,
  HoroscopeData,
  CompatibilityData,
  ChineseZodiacData,
  NameNumerologyData,
  SpecializedData,
} from "@/lib/library/types";
import { ReadingType } from "@/lib/reading/types";
import { parseCardTokens } from "@/lib/tarot/engine";
import { getCardById } from "@/lib/tarot/deck";

function normalizeForSearch(input: unknown): string {
  if (input == null) return "";
  const value = typeof input === "string" ? input : String(input);
  // Basic Thai-safe normalization (no aggressive diacritic stripping)
  return value.normalize("NFKC").toLowerCase();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type ChipKey = "all" | ReadingType.TAROT | ReadingType.DAILY_CARD | ReadingType.SPIRIT_CARD | ReadingType.HOROSCOPE | ReadingType.COMPATIBILITY | ReadingType.CHINESE_ZODIAC | ReadingType.SPECIALIZED | ReadingType.NAME_NUMEROLOGY;

const chips: Array<{ key: ChipKey; label: string }> = [
  { key: "all", label: "ทั้งหมด" },
  { key: ReadingType.TAROT, label: "ทาโรต์" },
  { key: ReadingType.DAILY_CARD, label: "รายวัน" },
  { key: ReadingType.SPIRIT_CARD, label: "จิตวิญญาณ" },
  { key: ReadingType.HOROSCOPE, label: "ดวงชะตา" },
  { key: ReadingType.COMPATIBILITY, label: "ความรัก" },
  { key: ReadingType.CHINESE_ZODIAC, label: "จีน" },
  { key: ReadingType.SPECIALIZED, label: "เฉพาะทาง" },
  { key: ReadingType.NAME_NUMEROLOGY, label: "ชื่อ" },
];

function buildSearchText(entry: LibraryEntry): string {
  const parts: string[] = [];

  if (entry.type === ReadingType.TAROT) {
    const r = entry.data as SavedTarotReading;
    parts.push("tarot", String(r.count), r.question ?? "", r.aiSummary ?? "");
  } else if (entry.type === ReadingType.DAILY_CARD) {
    const r = entry.data as SavedDailyCardReading;
    parts.push("daily", "daily card", r.dayKey, r.title ?? "", r.summary ?? "", ...(r.tags ?? []));
  } else if (entry.type === ReadingType.SPIRIT_CARD) {
    const r = entry.data as SavedSpiritCardReading | SavedSpiritPathReading;

    if ("kind" in r && r.kind === "spirit_path") {
      parts.push(
        "spirit",
        "spirit path",
        "2 card",
        `${r.day}/${r.month}/${r.year}`,
        r.title ?? "",
        r.interpretationMarkdown ?? "",
        ...(r.tags ?? [])
      );
    } else {
      const s = r as SavedSpiritCardReading;
      parts.push(
        "spirit",
        "spirit card",
        s.dob,
        s.title ?? "",
        s.aiSummary ?? "",
        s.aiCardStructure ?? "",
        ...(s.tags ?? [])
      );
    }
  } else if (entry.type === ReadingType.HOROSCOPE) {
    const r = entry.data as HoroscopeData;
    parts.push("horoscope", "ดวงชะตา", r.zodiacSign, r.period, r.advice);
  } else if (entry.type === ReadingType.COMPATIBILITY) {
    const r = entry.data as CompatibilityData;
    parts.push("compatibility", "ความรัก", r.person1.zodiacSign, r.person2.zodiacSign, r.advice);
  } else if (entry.type === ReadingType.CHINESE_ZODIAC) {
    const r = entry.data as ChineseZodiacData;
    parts.push("chinese zodiac", "จีน", r.animal, r.element, r.advice);
  } else if (entry.type === ReadingType.NAME_NUMEROLOGY) {
    const r = entry.data as NameNumerologyData;
    parts.push("name numerology", "ชื่อ", r.firstName, r.lastName, r.advice);
  } else if (entry.type === ReadingType.SPECIALIZED) {
    const r = entry.data as SpecializedData;
    parts.push("specialized", "เฉพาะทาง", r.zodiacSign, r.domain, r.advice);
  }

  // Always include generic preview
  parts.push(entry.preview);

  return normalizeForSearch(parts.join("\n"));
}

function getThumbnail(entry: LibraryEntry):
  | { kind: "image"; src: string; alt: string; rotate180?: boolean }
  | { kind: "emoji"; value: string } {
  if (entry.type === ReadingType.TAROT) {
    const r = entry.data as SavedTarotReading;
    const cards = parseCardTokens(r.cardsToken);
    const first = cards[0];
    if (first?.card?.image) {
      return {
        kind: "image",
        src: first.card.image,
        alt: first.card.nameTh ?? first.card.name,
        rotate180: first.orientation === "reversed",
      };
    }
    return { kind: "emoji", value: "🔮" };
  }

  if (entry.type === ReadingType.DAILY_CARD) {
    const r = entry.data as SavedDailyCardReading;
    const card = getCardById(r.cardId);
    if (card?.image) {
      return {
        kind: "image",
        src: card.image,
        alt: card.nameTh ?? card.name,
        rotate180: r.orientation === "reversed",
      };
    }
    return { kind: "emoji", value: "🌞" };
  }

  if (entry.type === ReadingType.SPIRIT_CARD) {
    const r = entry.data as SavedSpiritCardReading | SavedSpiritPathReading;

    if ("kind" in r && r.kind === "spirit_path") {
      const card = getCardById(r.zodiacCardId);
      if (card?.image) {
        return {
          kind: "image",
          src: card.image,
          alt: card.nameTh ?? card.name,
        };
      }
      return { kind: "emoji", value: "✨" };
    }

    const s = r as SavedSpiritCardReading;
    const card = getCardById(s.cardId);
    if (card?.image) {
      return {
        kind: "image",
        src: card.image,
        alt: card.nameTh ?? card.name,
        rotate180: s.orientation === "reversed",
      };
    }
    return { kind: "emoji", value: "✨" };
  }

  if (entry.type === ReadingType.HOROSCOPE) {
    return { kind: "emoji", value: "♈" };
  }

  if (entry.type === ReadingType.COMPATIBILITY) {
    return { kind: "emoji", value: "💕" };
  }

  if (entry.type === ReadingType.CHINESE_ZODIAC) {
    return { kind: "emoji", value: "🐉" };
  }

  if (entry.type === ReadingType.NAME_NUMEROLOGY) {
    return { kind: "emoji", value: "🔢" };
  }

  if (entry.type === ReadingType.SPECIALIZED) {
    return { kind: "emoji", value: "⭐" };
  }

  return { kind: "emoji", value: "📖" };
}

function getTitleMetaSnippet(entry: LibraryEntry): { title: string; meta: string; snippet: string; href?: string } {
  const href = `/library/reading/${entry.id}`;

  if (entry.type === ReadingType.TAROT) {
    const r = entry.data as SavedTarotReading;
    const meta = `ทาโรต์ • ${r.count} ใบ • ${formatDate(r.createdAt)}`;
    const title = r.question?.trim() ? r.question : `ทาโรต์ (${r.count} ใบ)`;
    const snippet = r.aiSummary ?? entry.preview;

    return { title, meta, snippet, href };
  }

  if (entry.type === ReadingType.DAILY_CARD) {
    const r = entry.data as SavedDailyCardReading;
    const card = getCardById(r.cardId);
    const cardLabel = card?.nameTh ?? card?.name ?? "ไพ่รายวัน";
    const meta = `ไพ่รายวัน • ${r.dayKey} • ${formatDate(r.createdAt)}`;
    const title = r.title?.trim() ? r.title : `ไพ่รายวัน — ${cardLabel}`;
    const snippet = r.summary ?? entry.preview;
    return { title, meta, snippet, href };
  }

  if (entry.type === ReadingType.SPIRIT_CARD) {
    const r = entry.data as SavedSpiritCardReading | SavedSpiritPathReading;

    if ("kind" in r && r.kind === "spirit_path") {
      const zodiac = getCardById(r.zodiacCardId);
      const soul = getCardById(r.soulCardId);
      const zLabel = zodiac?.nameTh ?? zodiac?.name ?? "Zodiac";
      const sLabel = soul?.nameTh ?? soul?.name ?? "Soul";
      const meta = `เส้นทางจิตวิญญาณ • ${r.day}/${r.month}/${r.year} • ${formatDate(r.createdAt)}`;
      const title = r.title?.trim() ? r.title : `2 ใบ — ${zLabel} + ${sLabel}`;
      const snippet = r.interpretationMarkdown ?? entry.preview;
      return { title, meta, snippet, href };
    }

    const s = r as SavedSpiritCardReading;
    const card = getCardById(s.cardId);
    const cardLabel = card?.nameTh ?? card?.name ?? "ไพ่จิตวิญญาณ";
    const meta = `ไพ่จิตวิญญาณ • ${s.dob} • ${formatDate(s.createdAt)}`;
    const title = s.title?.trim() ? s.title : `ไพ่จิตวิญญาณ — ${cardLabel}`;
    const snippet = s.aiSummary ?? entry.preview;
    return { title, meta, snippet, href };
  }

  if (entry.type === ReadingType.HOROSCOPE) {
    const r = entry.data as HoroscopeData;
    const zodiacThai: Record<string, string> = {
      aries: "เมษ", taurus: "พฤษภ", gemini: "มิถุน", cancer: "กรกฎ",
      leo: "สิงห์", virgo: "กันย์", libra: "ตุล", scorpio: "พิจิก",
      sagittarius: "ธนู", capricorn: "มกร", aquarius: "กุมภ", pisces: "มีน"
    };
    const periodThai: Record<string, string> = {
      daily: "รายวัน", weekly: "รายสัปดาห์", monthly: "รายเดือน"
    };
    const meta = `ดวงชะตา • ${zodiacThai[r.zodiacSign] || r.zodiacSign} • ${periodThai[r.period] || r.period} • ${formatDate(r.createdAt)}`;
    const title = `ดวงชะตา${zodiacThai[r.zodiacSign] || r.zodiacSign}`;
    const snippet = r.advice ?? entry.preview;
    return { title, meta, snippet, href };
  }

  if (entry.type === ReadingType.COMPATIBILITY) {
    const r = entry.data as CompatibilityData;
    const zodiacThai: Record<string, string> = {
      aries: "เมษ", taurus: "พฤษภ", gemini: "มิถุน", cancer: "กรกฎ",
      leo: "สิงห์", virgo: "กันย์", libra: "ตุล", scorpio: "พิจิก",
      sagittarius: "ธนู", capricorn: "มกร", aquarius: "กุมภ", pisces: "มีน"
    };
    const meta = `ความเข้ากัน • ${zodiacThai[r.person1.zodiacSign]} & ${zodiacThai[r.person2.zodiacSign]} • ${formatDate(r.createdAt)}`;
    const title = `ความเข้ากัน: ${r.scores.overall}%`;
    const snippet = r.advice ?? entry.preview;
    return { title, meta, snippet, href };
  }

  if (entry.type === ReadingType.CHINESE_ZODIAC) {
    const r = entry.data as ChineseZodiacData;
    const animalThai: Record<string, string> = {
      rat: "ชวด", ox: "ฉลู", tiger: "ขาล", rabbit: "เถาะ",
      dragon: "มะโรง", snake: "มะเส็ง", horse: "มะเมีย", goat: "มะแม",
      monkey: "วอก", rooster: "ระกา", dog: "จอ", pig: "กุน"
    };
    const periodThai: Record<string, string> = {
      daily: "รายวัน", weekly: "รายสัปดาห์", monthly: "รายเดือน"
    };
    const meta = `ปี${animalThai[r.animal] || r.animal} • ${periodThai[r.period] || r.period} • ${formatDate(r.createdAt)}`;
    const title = `ดวงปี${animalThai[r.animal] || r.animal}`;
    const snippet = r.advice ?? entry.preview;
    return { title, meta, snippet, href };
  }

  if (entry.type === ReadingType.NAME_NUMEROLOGY) {
    const r = entry.data as NameNumerologyData;
    const meta = `เลขศาสตร์ชื่อ • ${formatDate(r.createdAt)}`;
    const title = `${r.firstName} ${r.lastName}`;
    const snippet = r.advice ?? entry.preview;
    return { title, meta, snippet, href };
  }

  if (entry.type === ReadingType.SPECIALIZED) {
    const r = entry.data as SpecializedData;
    const zodiacThai: Record<string, string> = {
      aries: "เมษ", taurus: "พฤษภ", gemini: "มิถุน", cancer: "กรกฎ",
      leo: "สิงห์", virgo: "กันย์", libra: "ตุล", scorpio: "พิจิก",
      sagittarius: "ธนู", capricorn: "มกร", aquarius: "กุมภ", pisces: "มีน"
    };
    const domainThai: Record<string, string> = {
      finance_career: "การเงิน/การงาน",
      love_relationships: "ความรัก/ความสัมพันธ์"
    };
    const periodThai: Record<string, string> = {
      daily: "รายวัน", weekly: "รายสัปดาห์", monthly: "รายเดือน"
    };
    const meta = `${domainThai[r.domain] || r.domain} • ${zodiacThai[r.zodiacSign]} • ${periodThai[r.period]} • ${formatDate(r.createdAt)}`;
    const title = `${domainThai[r.domain] || r.domain}`;
    const snippet = r.advice ?? entry.preview;
    return { title, meta, snippet, href };
  }

  return { title: "บันทึกการดูดวง", meta: formatDate(entry.createdAt), snippet: entry.preview };
}

export default function SavedClient() {
  const lib = useLibrary();
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<ChipKey>("all");

  const filtered = React.useMemo(() => {
    const q = normalizeForSearch(query.trim());

    const byType =
      typeFilter === "all" ? lib.entries : lib.entries.filter((e) => e.type === typeFilter);

    if (!q) return byType;

    return byType.filter((entry) => buildSearchText(entry).includes(q));
  }, [lib.entries, query, typeFilter]);

  const hasAnySaved = lib.entries.length > 0;
  const hasResults = filtered.length > 0;

  return (
    <main className="mx-auto w-full max-w-lg">
      <AppBar
        title="บันทึก"
        right={
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-lg)] border border-border bg-[var(--glass-bg)] px-3 text-xs font-medium text-fg-muted backdrop-blur-xl"
          >
            ใหม่
          </Link>
        }
      />

      <div className="px-5 pb-6">
        <div className="mt-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาบันทึกของคุณ…"
            aria-label="ค้นหาบันทึกการดูดวง"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {chips.map((c) => (
            <button key={c.key} type="button" onClick={() => setTypeFilter(c.key)} className="shrink-0">
              <Chip selected={typeFilter === c.key}>{c.label}</Chip>
            </button>
          ))}
        </div>

        {!hasAnySaved ? (
          <Card className="mt-5 p-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-2xl">
              📚
            </div>
            <p className="mt-3 text-sm font-semibold text-fg">ยังไม่มีรายการที่บันทึกไว้</p>
            <p className="mt-2 text-sm text-fg-muted">
              เริ่มดูดวงแล้วแตะรูปหัวใจ เพื่อบันทึกไว้ในคลังนี้
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/tarot" className="block">
                <Button className="w-full">ทาโรต์</Button>
              </Link>
              <Link href="/daily-card" className="block">
                <Button className="w-full" variant="secondary">
                  รายวัน
                </Button>
              </Link>
              <Link href="/horoscope" className="block">
                <Button className="w-full" variant="secondary">
                  ดวงชะตา
                </Button>
              </Link>
              <Link href="/compatibility" className="block">
                <Button className="w-full" variant="secondary">
                  ความรัก
                </Button>
              </Link>
            </div>
          </Card>
        ) : !hasResults ? (
          <Card className="mt-5 p-5 text-center">
            <p className="text-sm font-semibold text-fg">ไม่พบผลลัพธ์</p>
            <p className="mt-2 text-sm text-fg-muted">ลองใช้คำค้นหาอื่น หรือล้างการค้นหา</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                }}
              >
                ล้างการค้นหา
              </Button>
            </div>
          </Card>
        ) : (
          <div className="mt-5 grid gap-3">
            {filtered.map((entry) => {
              const thumb = getThumbnail(entry);
              const { title, meta, snippet, href } = getTitleMetaSnippet(entry);
              const RowWrapper = href ? Link : ("div" as any);
              const rowWrapperProps = href ? { href, className: "block" } : { className: "block" };

              return (
                <Card key={entry.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <RowWrapper {...rowWrapperProps}>
                      <div className="flex items-start gap-3">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-bg-elevated">
                          {thumb.kind === "image" ? (
                            <Image
                              src={thumb.src}
                              alt={thumb.alt}
                              fill
                              sizes="56px"
                              className={thumb.rotate180 ? "object-cover rotate-180" : "object-cover"}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl">{thumb.value}</div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-fg-subtle">
                            {meta}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm font-semibold text-fg">{title}</p>
                          {snippet ? (
                            <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{snippet}</p>
                          ) : null}
                        </div>
                      </div>
                    </RowWrapper>

                    <HeartSave
                      saved={true}
                      onToggle={() => lib.remove(entry.id)}
                      label="ลบออกจากบันทึก"
                      className="h-9 w-9"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {hasAnySaved ? (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                if (confirm("ล้างบันทึกทั้งหมด?")) lib.clear();
              }}
              className="text-xs underline underline-offset-4 transition text-fg-subtle"
            >
              ล้างทั้งหมด
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
