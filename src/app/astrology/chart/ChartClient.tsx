"use client";

import * as React from "react";
import { ChartForm } from "@/components/astrology/ChartForm";
import { ChartResult } from "@/components/astrology/ChartResult";
import { computeNatalChart } from "@/lib/astrology/engine";
import type { BirthInput, ChartSystem, NatalChart } from "@/lib/astrology/types";
import { Card } from "@/components/ui/Card";

export function ChartClient() {
  const [chart, setChart] = React.useState<NatalChart | null>(null);

  function handleSubmit(input: BirthInput, system: ChartSystem) {
    setChart(computeNatalChart(input, system));
  }

  function handleSwitch(system: ChartSystem) {
    if (!chart) return;
    setChart(computeNatalChart(chart.input, system));
  }

  if (!chart) {
    return (
      <Card className="p-5 bg-bg">
        <ChartForm onSubmit={handleSubmit} />
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 bg-bg">
        <ChartResult chart={chart} />
      </Card>

      <Card className="p-4 bg-bg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-fg-muted">
            สลับระบบคำนวณ
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSwitch("suriyayatra")}
              className={
                chart.system === "suriyayatra"
                  ? "rounded-lg bg-violet-600 text-white text-xs font-semibold px-3 py-1.5"
                  : "rounded-lg border border-border text-xs font-medium px-3 py-1.5 hover:bg-surface"
              }
            >
              สุริยยาตร์
            </button>
            <button
              type="button"
              onClick={() => handleSwitch("lahiri")}
              className={
                chart.system === "lahiri"
                  ? "rounded-lg bg-violet-600 text-white text-xs font-semibold px-3 py-1.5"
                  : "rounded-lg border border-border text-xs font-medium px-3 py-1.5 hover:bg-surface"
              }
            >
              นิรายนะ (Lahiri)
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-bg">
        <button
          type="button"
          onClick={() => setChart(null)}
          className="w-full rounded-xl border border-border bg-bg text-fg-muted font-medium py-2.5 hover:bg-surface transition-colors text-sm"
        >
          แก้ไขข้อมูลวันเดือนปีเกิด
        </button>
      </Card>
    </div>
  );
}
