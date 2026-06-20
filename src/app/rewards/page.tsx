import * as React from "react";
import type { Metadata } from "next";
import { RewardsClient } from "./RewardsClient";

export const metadata: Metadata = { title: "แลกของรางวัล — REFFORTUNE" };

export default function RewardsPage() {
  return (
    <React.Suspense fallback={null}>
      <RewardsClient />
    </React.Suspense>
  );
}
