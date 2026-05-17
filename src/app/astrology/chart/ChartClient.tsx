"use client";

import * as React from "react";
import { ChartForm } from "@/components/astrology/ChartForm";
import { ChartResult } from "@/components/astrology/ChartResult";
import { DateStepper, type DateValue } from "@/components/astrology/DateStepper";
import { computeNatalChart } from "@/lib/astrology/engine";
import type { BirthInput, ChartSystem, NatalChart } from "@/lib/astrology/types";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type View = "natal" | "transit" | "overlay";

function todayDate(): DateValue {
  const d = new Date();
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

export function ChartClient() {
  const [birth, setBirth] = React.useState<BirthInput | null>(null);
  const [system, setSystem] = React.useState<ChartSystem>("suriyayatra");
  const [transitDate, setTransitDate] = React.useState<DateValue>(todayDate);
  const [view, setView] = React.useState<View>("overlay");

  function handleSubmit(input: BirthInput, sys: ChartSystem) {
    setBirth(input);
    setSystem(sys);
  }

  const charts = React.useMemo(() => {
    if (!birth) return null;
    const natal = computeNatalChart(birth, system);
    const transit = computeNatalChart(
      {
        ...transitDate,
        timezoneHours: birth.timezoneHours,
        latitude: birth.latitude,
        longitude: birth.longitude,
      },
      system
    );
    return { natal, transit };
  }, [birth, system, transitDate]);

  if (!charts || !birth) {
    return (
      <Card className="p-5 bg-bg">
        <ChartForm onSubmit={handleSubmit} initialSystem={system} />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-3 bg-bg">
        <Tabs view={view} onChange={setView} />
      </Card>

      <Card className="p-4 bg-bg space-y-4">
        <DateStepper value={transitDate} onChange={setTransitDate} />
        <ResultDisplay charts={charts} view={view} />
      </Card>

      <Card className="p-4 bg-bg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-fg-muted">สลับระบบคำนวณ</div>
          <div className="flex gap-2">
            {(["suriyayatra", "lahiri"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSystem(s)}
                className={
                  system === s
                    ? "rounded-lg bg-violet-600 text-white text-xs font-semibold px-3 py-1.5"
                    : "rounded-lg border border-border text-xs font-medium px-3 py-1.5 hover:bg-surface"
                }
              >
                {s === "suriyayatra" ? "สุริยยาตร์" : "นิรายนะ (Lahiri)"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-bg">
        <button
          type="button"
          onClick={() => setBirth(null)}
          className="w-full rounded-xl border border-border bg-bg text-fg-muted font-medium py-2.5 hover:bg-surface transition-colors text-sm"
        >
          แก้ไขข้อมูลวันเดือนปีเกิด
        </button>
      </Card>
    </div>
  );
}

function Tabs({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const tabs: { id: View; label: string }[] = [
    { id: "natal", label: "ดวงกำเนิด" },
    { id: "transit", label: "ดวงจร" },
    { id: "overlay", label: "ราศีจร (ซ้อน)" },
  ];
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-surface p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "rounded-md py-2 text-xs font-medium transition-colors",
            view === t.id
              ? "bg-bg text-violet-700 shadow-sm"
              : "text-fg-muted hover:text-fg"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ResultDisplay({
  charts,
  view,
}: {
  charts: { natal: NatalChart; transit: NatalChart };
  view: View;
}) {
  return <ChartResult natal={charts.natal} transit={charts.transit} view={view} />;
}
