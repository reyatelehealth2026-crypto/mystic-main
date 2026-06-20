import * as React from "react";
import type { Metadata } from "next";
import { PackagesClient } from "./PackagesClient";

export const metadata: Metadata = { title: "แพ็กรายเดือน — REFFORTUNE" };

export default function PackagesPage() {
  return (
    <React.Suspense fallback={null}>
      <PackagesClient />
    </React.Suspense>
  );
}
