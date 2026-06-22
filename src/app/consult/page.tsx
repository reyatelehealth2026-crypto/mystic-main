import * as React from "react";
import type { Metadata } from "next";
import { ConsultClient } from "./ConsultClient";

export const metadata: Metadata = { title: "ปรึกษาหมอดูสด" };

export default function ConsultPage() {
  return (
    <React.Suspense fallback={null}>
      <ConsultClient />
    </React.Suspense>
  );
}
