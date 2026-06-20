"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReadingGate } from "@/lib/ui/readingGate";

/**
 * Full-screen blur lock shown over a reading until the user confirms the credit
 * spend. Insufficient balance → no "view" button (only top-up / back), so the
 * reading can't be read without paying.
 */
export function ReadingGateHost() {
  const router = useRouter();
  const { open, cost, balance, resolve } = useReadingGate();

  if (!open) return null;
  const enough = balance >= cost;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xl">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
        <div className="text-4xl">🔮</div>
        <h2 className="mt-2 text-lg font-bold text-gray-900">ยืนยันการดูดวง</h2>

        <div className="mt-4 space-y-2 rounded-2xl bg-gray-50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">ใช้แต้ม</span>
            <span className="font-bold text-violet-700">{cost} แต้ม</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">แต้มคงเหลือ</span>
            <span className={enough ? "font-medium text-gray-900" : "font-bold text-red-600"}>{balance} แต้ม</span>
          </div>
        </div>

        {!enough ? <p className="mt-3 text-sm text-red-600">แต้มไม่พอ — เติมแต้มก่อนนะคะ</p> : null}

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              resolve(false);
              router.back();
            }}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            ย้อนกลับ
          </button>
          {enough ? (
            <button
              onClick={() => resolve(true)}
              className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              ดูเลย
            </button>
          ) : (
            <Link href="/pricing" className="flex-1" onClick={() => resolve(false)}>
              <span className="block rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700">
                เติมแต้ม
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
