"use client";

import * as React from "react";
import { useConfirmStore } from "@/lib/ui/confirm";

/** Global confirmation dialog. Mount once near the app root. */
export function ConfirmHost() {
  const { open, opts, resolve } = useConfirmStore();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") resolve(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, resolve]);

  if (!open || !opts) return null;

  const confirmTone =
    opts.tone === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : opts.tone === "spend"
        ? "bg-violet-600 hover:bg-violet-700"
        : "bg-emerald-600 hover:bg-emerald-700";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={() => resolve(false)}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          {opts.icon ? <div className="mx-auto mb-2 text-4xl">{opts.icon}</div> : null}
          <h2 className="text-lg font-bold text-gray-900">{opts.title}</h2>
          {opts.message ? <p className="mt-1 text-sm text-gray-500">{opts.message}</p> : null}
        </div>

        {opts.details && opts.details.length > 0 ? (
          <div className="mt-4 space-y-2 rounded-2xl bg-gray-50 p-4">
            {opts.details.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-500">{d.label}</span>
                <span className={d.highlight ? "font-bold text-violet-700" : "font-medium text-gray-900"}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => resolve(false)}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            {opts.cancelText ?? "ยกเลิก"}
          </button>
          <button
            onClick={() => resolve(true)}
            disabled={opts.disabled}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${confirmTone}`}
          >
            {opts.confirmText ?? "ยืนยัน"}
          </button>
        </div>
      </div>
    </div>
  );
}
