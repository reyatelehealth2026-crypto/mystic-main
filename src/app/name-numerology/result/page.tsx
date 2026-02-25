import { Suspense } from "react";
import ResultClient from "./resultClient";

export default function NameNumerologyResultPage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-lg px-5 py-10 text-sm text-fg-muted">กำลังโหลด...</div>}>
      <ResultClient />
    </Suspense>
  );
}
