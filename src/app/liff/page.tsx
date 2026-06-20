import type { Metadata } from "next";
import { LiffClient } from "./LiffClient";

export const metadata: Metadata = {
  title: "LINE",
  robots: { index: false, follow: false },
};

export default function LiffPage() {
  return <LiffClient />;
}
