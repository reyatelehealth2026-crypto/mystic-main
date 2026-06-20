import * as React from "react";
import type { Metadata } from "next";
import { MembershipCard } from "./MembershipCard";

export const metadata: Metadata = { title: "บัตรสมาชิก — REFFORTUNE" };

export default function MembershipPage() {
  return (
    <React.Suspense fallback={null}>
      <MembershipCard />
    </React.Suspense>
  );
}
