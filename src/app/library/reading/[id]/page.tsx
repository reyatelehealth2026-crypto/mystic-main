"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";
import { HeartSave } from "@/components/ui/HeartSave";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { ShareButton } from "@/components/ui/ShareButton";
import { useLibrary } from "@/lib/library/useLibrary";
import type {
  SavedTarotReading,
  SavedDailyCardReading,
  SavedSpiritCardReading,
  SavedSpiritPathReading,
  HoroscopeData,
  CompatibilityData,
  ChineseZodiacData,
  NameNumerologyData,
  SpecializedData,
} from "@/lib/library/types";
import { ReadingType } from "@/lib/reading/types";
import { parseCardTokens } from "@/lib/tarot/engine";
import { getCardById } from "@/lib/tarot/deck";

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

function Block({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-semibold text-fg">{title}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{body}</p>
    </Card>
  );
}

export default function SavedReadingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lib = useLibrary();

  const id = params?.id;

  const entry = React.useMemo(() => lib.entries.find((e) => e.id === id), [id, lib.entries]);

  // Loading state for library persistence
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    setIsReady(true);
  }, []);

  if (!id) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-8">
        <Card className="p-5 text-center">
          <p className="text-sm font-semibold text-fg">ไม่พบรายการ</p>
        </Card>
      </main>
    );
  }

  if (!isReady) {
    return (
      <main className="mx-auto w-full max-w-lg">
        <AppBar title="รายละเอียด" />
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-fg-muted">กำลังโหลดข้อมูล...</p>
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="mx-auto w-full max-w-lg">
        <AppBar title="รายละเอียด" />
        <div className="px-5 pb-8">
          <Card className="mt-5 p-5 text-center">
            <p className="text-sm font-semibold text-fg">ไม่พบรายการนี้ในคลัง</p>
            <p className="mt-2 text-sm text-fg-muted">อาจถูกลบไปแล้ว หรือข้อมูลในเครื่องถูกล้าง</p>
            <div className="mt-4">
              <Link href="/library/saved" className="block">
                <Button className="w-full" variant="secondary">
                  กลับไปหน้าบันทึก
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const remove = () => {
    lib.remove(entry.id);
    // If removed, go back to list for good UX.
    router.push("/library/saved");
  };

  return (
    <main className="mx-auto w-full max-w-lg">
      <AppBar
        title="รายละเอียด"
        right={
          <HeartSave
            saved={true}
            onToggle={remove}
            label="ลบออกจากบันทึก"
            className="h-10 w-10"
          />
        }
      />

      <div className="px-5 pb-8">
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-fg-subtle">
          Saved • {formatDate(entry.createdAt)}
        </p>

        {entry.type === ReadingType.TAROT ? (
          <TarotDetail reading={entry.data as SavedTarotReading} />
        ) : entry.type === ReadingType.DAILY_CARD ? (
          <DailyCardDetail reading={entry.data as SavedDailyCardReading} />
        ) : entry.type === ReadingType.SPIRIT_CARD ? (
          "kind" in (entry.data as any) && (entry.data as any).kind === "spirit_path" ? (
            <SpiritPathDetail reading={entry.data as SavedSpiritPathReading} />
          ) : (
            <SpiritCardDetail reading={entry.data as SavedSpiritCardReading} />
          )
        ) : entry.type === ReadingType.HOROSCOPE ? (
          <HoroscopeDetail reading={entry.data as HoroscopeData} />
        ) : entry.type === ReadingType.COMPATIBILITY ? (
          <CompatibilityDetail reading={entry.data as CompatibilityData} />
        ) : entry.type === ReadingType.CHINESE_ZODIAC ? (
          <ChineseZodiacDetail reading={entry.data as ChineseZodiacData} />
        ) : entry.type === ReadingType.NAME_NUMEROLOGY ? (
          <NameNumerologyDetail reading={entry.data as NameNumerologyData} />
        ) : entry.type === ReadingType.SPECIALIZED ? (
          <SpecializedDetail reading={entry.data as SpecializedData} />
        ) : (
          <Card className="mt-4 p-4">
            <p className="text-sm text-fg-muted">รูปแบบนี้ยังไม่รองรับ</p>
          </Card>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <ShareButton
            className="w-full"
            shareData={{
              title: "คำทำนายจาก REFFORTUNE",
              text: `ลองมาดูคำทำนายนี้สิ!`,
              url: typeof window !== "undefined" ? window.location.href : "",
            }}
          />
          <Link href="/library/saved" className="block">
            <Button className="w-full" variant="secondary">
              กลับไปหน้าบันทึก
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

function TarotDetail({ reading }: { reading: SavedTarotReading }) {
  const snap = reading.snapshot;
  const cardsToken = snap?.input.cardsToken ?? reading.cardsToken;
  const count = snap?.input.count ?? reading.count;
  const question = snap?.input.question ?? reading.question;
  const session = snap?.session;
  const aiSummary = snap?.ai?.summary ?? reading.aiSummary;
  const aiCardStructure = snap?.ai?.cardStructure ?? reading.aiCardStructure;

  const drawnCards = React.useMemo(() => parseCardTokens(cardsToken), [cardsToken]);
  const cardWidth = count <= 3 ? "w-[100px]" : count <= 5 ? "w-[80px]" : "w-16";

  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">ทาโรต์ • {count} ใบ</p>
        {question ? <p className="mt-2 text-sm text-fg-muted">คำถาม: {question}</p> : null}
      </Card>

      {drawnCards.length > 0 ? (
        <Card className="p-4">
          <p className="text-sm font-semibold text-fg">ไพ่ที่ได้</p>
          <div className="mt-3 flex justify-center gap-3 overflow-x-auto pb-2">
            {drawnCards.map((drawn, index) => (
              <div
                key={`${drawn.card.id}-${index}`}
                className={`flex-shrink-0 overflow-hidden rounded-xl border border-border bg-bg-elevated text-center ${cardWidth}`}
              >
                {drawn.card.image ? (
                  <Image
                    src={drawn.card.image}
                    alt={drawn.card.name}
                    width={180}
                    height={270}
                    className={drawn.orientation === "reversed" ? "h-auto w-full object-cover rotate-180" : "h-auto w-full object-cover"}
                  />
                ) : (
                  <div className="flex h-24 items-center justify-center bg-surface">
                    <span className="text-2xl">🔮</span>
                  </div>
                )}
                <p className="truncate px-1 py-1 text-[10px] font-medium text-fg-muted">
                  {drawn.card.nameTh ?? drawn.card.name}
                </p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {session ? (
        <>
          <Block title={session.headline || "ภาพรวม"} body={session.summary} />
          {session.blocks?.map((b) => (
            <Block key={b.id} title={b.title} body={b.body} />
          ))}
          {session.tags?.length ? (
            <Card className="p-4">
              <p className="text-sm font-semibold text-fg">แท็ก</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {session.tags.map((t) => (
                  <span key={t} className="rounded-xl bg-surface px-2.5 py-1 text-xs text-fg-muted">
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          ) : null}
        </>
      ) : (
        <Card className="p-4">
          <p className="text-sm text-fg-muted">รายการนี้ไม่มี snapshot (อาจเป็นบันทึกเก่า)</p>
        </Card>
      )}

      {aiSummary ? <Block title="สรุป (AI)" body={aiSummary} /> : null}
      {aiCardStructure ? <Block title="รายละเอียด (AI)" body={aiCardStructure} /> : null}
    </div>
  );
}

function DailyCardDetail({ reading }: { reading: SavedDailyCardReading }) {
  const snap = reading.snapshot;
  const cardId = snap?.cardId ?? reading.cardId;
  const orientation = snap?.orientation ?? reading.orientation;
  const dayKey = snap?.dayKey ?? reading.dayKey;

  const card = getCardById(cardId);
  const title = reading.title?.trim() ? reading.title : `ไพ่รายวัน — ${card?.nameTh ?? card?.name ?? ""}`;

  const message = snap?.output.message ?? reading.summary;
  const focus = snap?.output.focus ?? [];
  const action = snap?.output.advice.action;
  const avoid = snap?.output.advice.avoid;

  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">{title}</p>
        <p className="mt-1 text-sm text-fg-muted">{dayKey} • {orientation === "upright" ? "ตั้งตรง" : "กลับหัว"}</p>
      </Card>

      {card?.image ? (
        <Card className="p-4">
          <div className="mx-auto relative h-[320px] w-[210px] overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            <Image
              src={card.image}
              alt={card.nameTh ?? card.name}
              fill
              sizes="210px"
              className={orientation === "reversed" ? "object-cover rotate-180" : "object-cover"}
            />
          </div>
        </Card>
      ) : null}

      {focus.length ? (
        <Card className="p-4">
          <p className="text-sm font-semibold text-fg">โฟกัสวันนี้</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {focus.map((kw) => (
              <span key={kw} className="rounded-xl bg-surface px-2.5 py-1 text-xs text-fg-muted">
                {kw}
              </span>
            ))}
          </div>
        </Card>
      ) : null}

      {message ? <Block title="คำแนะนำ" body={message} /> : null}
      {action ? <Block title="สิ่งที่ควรทำ" body={action} /> : null}
      {avoid ? <Block title="สิ่งที่ควรเลี่ยง" body={avoid} /> : null}

      {!snap ? (
        <Card className="p-4">
          <p className="text-sm text-fg-muted">รายการนี้ไม่มี snapshot (อาจเป็นบันทึกเก่า)</p>
        </Card>
      ) : null}
    </div>
  );
}

function SpiritCardDetail({ reading }: { reading: SavedSpiritCardReading }) {
  const snap = reading.snapshot;
  const dob = snap?.input.dob ?? reading.dob;
  const cardId = snap?.card.cardId ?? reading.cardId;
  const orientation = snap?.card.orientation ?? reading.orientation;
  const lifePathNumber = snap?.card.lifePathNumber ?? reading.lifePathNumber;

  const card = getCardById(cardId);
  const title = reading.title?.trim() ? reading.title : `ไพ่จิตวิญญาณ — ${card?.nameTh ?? card?.name ?? ""}`;

  const message = snap?.output?.message ?? reading.aiSummary;
  const practice = snap?.output?.practice ?? reading.aiCardStructure;

  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">{title}</p>
        <p className="mt-1 text-sm text-fg-muted">วันเกิด: {dob}</p>
        {lifePathNumber != null ? (
          <p className="mt-1 text-sm text-fg-muted">เลขเส้นทางชีวิต: {lifePathNumber}</p>
        ) : null}
      </Card>

      {card?.image ? (
        <Card className="p-4">
          <div className="mx-auto relative h-[320px] w-[210px] overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            <Image
              src={card.image}
              alt={card.nameTh ?? card.name}
              fill
              sizes="210px"
              className={orientation === "reversed" ? "object-cover rotate-180" : "object-cover"}
            />
          </div>
          <p className="mt-3 text-center text-xs text-fg-subtle">
            {card.nameTh ?? card.name} • {orientation === "upright" ? "ตั้งตรง" : "กลับหัว"}
          </p>
        </Card>
      ) : null}

      {snap?.session ? (
        <>
          <Block title={snap.session.headline || "ภาพรวม"} body={snap.session.summary} />
          {snap.session.blocks?.map((b) => (
            <Block key={b.id} title={b.title} body={b.body} />
          ))}
        </>
      ) : (
        <Card className="p-4">
          <p className="text-sm text-fg-muted">รายการนี้ไม่มี snapshot (อาจเป็นบันทึกเก่า)</p>
        </Card>
      )}

      {message ? <Block title="สารจากจักรวาล" body={message} /> : null}
      {practice ? <Block title="แนวทางปฏิบัติ" body={practice} /> : null}
    </div>
  );
}

function SpiritPathDetail({ reading }: { reading: SavedSpiritPathReading }) {
  const snap = reading.snapshot;

  const day = snap?.input.day ?? reading.day;
  const month = snap?.input.month ?? reading.month;
  const year = snap?.input.year ?? reading.year;

  const zodiacCardId = snap?.cards.zodiacCardId ?? reading.zodiacCardId;
  const soulCardId = snap?.cards.soulCardId ?? reading.soulCardId;

  const zodiac = getCardById(zodiacCardId);
  const soul = getCardById(soulCardId);

  const title = reading.title?.trim()
    ? reading.title
    : `เส้นทางจิตวิญญาณ (2 ใบ) — ${(zodiac?.nameTh ?? zodiac?.name) || ""} + ${(soul?.nameTh ?? soul?.name) || ""}`;

  const md = snap?.output?.interpretationMarkdown ?? reading.interpretationMarkdown;

  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">{title}</p>
        <p className="mt-1 text-sm text-fg-muted">วันเกิด: {day}/{month}/{year}</p>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">ไพ่ของคุณ</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-bg-elevated p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-subtle">Zodiac Card</p>
            <div className="mt-2 relative h-[220px] w-full overflow-hidden rounded-xl border border-border bg-surface">
              {zodiac?.image ? (
                <Image src={zodiac.image} alt={zodiac.nameTh ?? zodiac.name} fill sizes="(max-width: 480px) 45vw, 210px" className="object-cover" />
              ) : null}
            </div>
            <p className="mt-2 text-sm font-semibold text-fg">{zodiac?.nameTh ?? zodiac?.name ?? ""}</p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-elevated p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-subtle">Soul Card</p>
            <div className="mt-2 relative h-[220px] w-full overflow-hidden rounded-xl border border-border bg-surface">
              {soul?.image ? (
                <Image src={soul.image} alt={soul.nameTh ?? soul.name} fill sizes="(max-width: 480px) 45vw, 210px" className="object-cover" />
              ) : null}
            </div>
            <p className="mt-2 text-sm font-semibold text-fg">{soul?.nameTh ?? soul?.name ?? ""}</p>
          </div>
        </div>
      </Card>

      {md ? (
        <Card className="p-4">
          <p className="text-sm font-semibold text-fg">คำตีความ</p>
          <div className="mt-3">
            <Markdown>{md}</Markdown>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <p className="text-sm text-fg-muted">รายการนี้ไม่มีคำตีความ (อาจเป็นบันทึกเก่า)</p>
        </Card>
      )}
    </div>
  );
}

function HoroscopeDetail({ reading }: { reading: HoroscopeData }) {
  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">ดวงชะตา • {reading.zodiacSign} • {reading.period}</p>
        <p className="mt-1 text-sm text-fg-muted">{formatDate(reading.createdAt)}</p>
      </Card>
      <Block title="ความรัก" body={reading.aspects.love} />
      <Block title="การงาน" body={reading.aspects.career} />
      <Block title="การเงิน" body={reading.aspects.finance} />
      <Block title="สุขภาพ" body={reading.aspects.health} />
      <Block title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}

function CompatibilityDetail({ reading }: { reading: CompatibilityData }) {
  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">ความเข้ากัน • {reading.person1.zodiacSign} + {reading.person2.zodiacSign}</p>
        <p className="mt-2 text-sm text-fg-muted">Overall: {reading.scores.overall}%</p>
      </Card>
      <Block title="จุดแข็ง" body={(reading.strengths ?? []).join("\n")} />
      <Block title="จุดท้าทาย" body={(reading.challenges ?? []).join("\n")} />
      <Block title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}

function ChineseZodiacDetail({ reading }: { reading: ChineseZodiacData }) {
  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">จีน • {reading.animal} • {reading.element} • {reading.period}</p>
      </Card>
      <Block title="ภาพรวม" body={reading.fortune.overall} />
      <Block title="การงาน" body={reading.fortune.career} />
      <Block title="การเงิน" body={reading.fortune.wealth} />
      <Block title="สุขภาพ" body={reading.fortune.health} />
      <Block title="ความสัมพันธ์" body={reading.fortune.relationships} />
      <Block title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}

function NameNumerologyDetail({ reading }: { reading: NameNumerologyData }) {
  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">เลขศาสตร์ชื่อ</p>
        <p className="mt-1 text-sm text-fg-muted">{reading.firstName} {reading.lastName}</p>
      </Card>
      <Block title="บุคลิกภาพ" body={reading.interpretation.personality} />
      <Block title="จุดแข็ง" body={(reading.interpretation.strengths ?? []).join("\n")} />
      <Block title="จุดอ่อน" body={(reading.interpretation.weaknesses ?? []).join("\n")} />
      <Block title="เส้นทางชีวิต" body={reading.interpretation.lifePath} />
      <Block title="การงาน" body={reading.interpretation.career} />
      <Block title="ความสัมพันธ์" body={reading.interpretation.relationships} />
      <Block title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}

function SpecializedDetail({ reading }: { reading: SpecializedData }) {
  return (
    <div className="mt-4 space-y-3">
      <Card className="p-4">
        <p className="text-sm font-semibold text-fg">เฉพาะทาง • {reading.domain} • {reading.zodiacSign} • {reading.period}</p>
      </Card>
      <Block title="คำทำนาย" body={reading.prediction} />
      <Block title="โอกาส" body={(reading.opportunities ?? []).join("\n")} />
      <Block title="ความท้าทาย" body={(reading.challenges ?? []).join("\n")} />
      <Block title="สิ่งที่ควรทำ" body={(reading.actionItems ?? []).join("\n")} />
      <Block title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}
