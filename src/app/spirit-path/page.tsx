"use client";

import Image from "next/image";
import * as React from "react";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HeartSave } from "@/components/ui/HeartSave";
import { ShareButton } from "@/components/ui/ShareButton";
import { HelperText, Input, Label } from "@/components/ui/Input";
import { Markdown } from "@/components/ui/Markdown";
import { trackEvent } from "@/lib/analytics/tracking";
import { useLibrary } from "@/lib/library/useLibrary";
import { buildSavedSpiritPathReading } from "@/lib/library/storage";
import { getCardById } from "@/lib/tarot/deck";
import { spiritPathFromDateParts } from "@/lib/tarot/spiritPath";

function toInt(value: string): number | null {
  const x = Number(value);
  if (!Number.isFinite(x)) return null;
  const i = Math.trunc(x);
  if (String(i) !== value.trim() && value.trim() !== String(x)) return i; // tolerate
  return i;
}

export default function SpiritPathPage() {
  const lib = useLibrary();
  const [savedId, setSavedId] = React.useState<string | null>(null);

  const [day, setDay] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");

  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const [submitted, setSubmitted] = React.useState<null | { day: number; month: number; year: number }>(null);
  const [markdown, setMarkdown] = React.useState<string>("");

  React.useEffect(() => {
    trackEvent("reading_start", { vertical: "spirit-card", step: "spirit_path_form_view" });
  }, []);

  const result = React.useMemo(() => {
    if (!submitted) return null;
    return spiritPathFromDateParts(submitted);
  }, [submitted]);

  const zodiacCard = React.useMemo(() => {
    if (!result) return null;
    return getCardById(result.zodiacCardId);
  }, [result]);

  const soulCard = React.useMemo(() => {
    if (!result) return null;
    return getCardById(result.soulCardId);
  }, [result]);

  React.useEffect(() => {
    if (!submitted) {
      setSavedId(null);
      return;
    }

    const existing = lib.items.find((item) => {
      if (!item || typeof item !== "object") return false;
      if (!("kind" in item) || (item as any).kind !== "spirit_path") return false;
      return (
        (item as any).day === submitted.day &&
        (item as any).month === submitted.month &&
        (item as any).year === submitted.year
      );
    });

    setSavedId((existing as any)?.id ?? null);
  }, [lib.items, submitted]);

  React.useEffect(() => {
    if (!result || !submitted || !zodiacCard || !soulCard) return;

    const controller = new AbortController();
    setMarkdown("");
    setLoading(true);

    fetch("/api/ai/spirit-path", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day: submitted.day,
        month: submitted.month,
        year: submitted.year,
        zodiacCardId: result.zodiacCardId,
        soulCardId: result.soulCardId,
        zodiacCardName: zodiacCard.nameTh ?? zodiacCard.name,
        soulCardName: soulCard.nameTh ?? soulCard.name,
      }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return (data?.markdown as string) || "";
      })
      .then((md) => {
        if (!md) return;
        setMarkdown(md);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [result, soulCard, submitted, zodiacCard]);

  const toggleSaved = React.useCallback(() => {
    if (!submitted || !result || !zodiacCard || !soulCard) return;

    if (savedId) {
      lib.remove(savedId);
      setSavedId(null);
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

    const title = `เส้นทางจิตวิญญาณ — ${(zodiacCard.nameTh ?? zodiacCard.name) || ""} + ${(soulCard.nameTh ?? soulCard.name) || ""}`;

    lib.upsert(
      buildSavedSpiritPathReading({
        id,
        day: submitted.day,
        month: submitted.month,
        year: submitted.year,
        zodiacCardId: result.zodiacCardId,
        soulCardId: result.soulCardId,
        title,
        interpretationMarkdown: markdown,
        tags: [zodiacCard.name, soulCard.name],
        snapshot: {
          input: submitted,
          cards: {
            zodiacCardId: result.zodiacCardId,
            soulCardId: result.soulCardId,
          },
          output: {
            interpretationMarkdown: markdown,
          },
        },
      })
    );

    setSavedId(id);
  }, [lib, markdown, result, savedId, soulCard, submitted, zodiacCard]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const d = toInt(day);
    const m = toInt(month);
    const y = toInt(year);

    if (d == null || m == null || y == null) {
      setError("กรุณากรอกวัน/เดือน/ปีเป็นตัวเลข");
      return;
    }

    const next = spiritPathFromDateParts({ day: d, month: m, year: y });
    if (!next) {
      setError("วัน/เดือน/ปีไม่ถูกต้อง (ตรวจสอบจำนวนวันของเดือนและปีอธิกสุรทิน)");
      return;
    }

    trackEvent("reading_submitted", { vertical: "spirit-card", step: "spirit_path_form_submit" });
    setError("");
    setSubmitted({ day: d, month: m, year: y });
  }

  return (
    <main className="mx-auto w-full max-w-lg">
      <AppBar title="เส้นทางจิตวิญญาณ" />

      <div className="px-5 pb-8">
        <p className="mt-2 text-sm text-fg-muted">
          อ่านไพ่ 2 ใบจากวันเกิด: ไพ่ราศี (Zodiac Card) + ไพ่จิตวิญญาณ (Soul Card)
        </p>

        <form onSubmit={handleSubmit} className="mt-5">
          <Card className="p-5">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>วัน</Label>
                <Input value={day} onChange={(e) => setDay(e.target.value)} inputMode="numeric" placeholder="DD" />
              </div>
              <div>
                <Label>เดือน</Label>
                <Input value={month} onChange={(e) => setMonth(e.target.value)} inputMode="numeric" placeholder="MM" />
              </div>
              <div>
                <Label>ปี (ค.ศ.)</Label>
                <Input value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" placeholder="YYYY" />
              </div>
            </div>

            <HelperText className="mt-3">ตัวอย่าง: 14 / 2 / 1994</HelperText>

            <Button type="submit" className="mt-4 w-full" disabled={loading}>
              {loading ? "กำลังตีความ…" : "เปิดไพ่ 2 ใบ"}
            </Button>
          </Card>
        </form>

        {error ? (
          <div
            className="mt-4 rounded-xl border p-4 text-sm"
            style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "var(--danger)" }}
          >
            {error}
          </div>
        ) : null}

        {result && zodiacCard && soulCard ? (
          <section className="mt-5 space-y-3">
            <Card className="p-5">
              <p className="text-sm font-semibold text-fg">ไพ่ของคุณ</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-bg-elevated p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-subtle">Zodiac Card</p>
                  <div className="mt-2 relative h-[240px] w-full overflow-hidden rounded-xl border border-border bg-surface">
                    {zodiacCard.image ? (
                      <Image
                        src={zodiacCard.image}
                        alt={zodiacCard.nameTh ?? zodiacCard.name}
                        fill
                        sizes="(max-width: 480px) 45vw, 210px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-fg">{zodiacCard.nameTh ?? zodiacCard.name}</p>
                </div>

                <div className="rounded-2xl border border-border bg-bg-elevated p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-subtle">Soul Card</p>
                  <div className="mt-2 relative h-[240px] w-full overflow-hidden rounded-xl border border-border bg-surface">
                    {soulCard.image ? (
                      <Image
                        src={soulCard.image}
                        alt={soulCard.nameTh ?? soulCard.name}
                        fill
                        sizes="(max-width: 480px) 45vw, 210px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-fg">{soulCard.nameTh ?? soulCard.name}</p>
                </div>
              </div>
            </Card>

            {markdown ? (
              <Card className="p-5">
                <p className="text-sm font-semibold text-fg">คำตีความ</p>
                <div className="mt-3">
                  <Markdown>{markdown}</Markdown>
                </div>
              </Card>
            ) : (
              <Card className="p-5">
                <p className="text-sm font-semibold text-fg">คำตีความ</p>
                <p className="mt-2 text-sm text-fg-muted">{loading ? "กำลังสร้างคำตีความ…" : "ยังไม่มีคำตีความ"}</p>
              </Card>
            )}

            <Card className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-fg">บันทึกไว้ในคลัง</p>
                    <p className="mt-1 text-xs text-fg-muted">แตะหัวใจเพื่อบันทึก/ยกเลิกบันทึก</p>
                  </div>
                  <HeartSave saved={!!savedId} onToggle={toggleSaved} label="Save spirit path" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <Button variant={savedId ? "secondary" : "primary"} onClick={toggleSaved}>
                     {savedId ? "Saved" : "Save"}
                   </Button>
                   <ShareButton 
                     variant="secondary"
                     shareData={{
                       title: "เส้นทางจิตวิญญาณของฉัน",
                       text: `ไพ่ราศี ${zodiacCard.nameTh} + ไพ่จิตวิญญาณ ${soulCard.nameTh}`,
                       url: typeof window !== "undefined" ? window.location.href : "",
                     }}
                   />
                </div>
              </div>
            </Card>
          </section>
        ) : null}
      </div>
    </main>
  );
}
