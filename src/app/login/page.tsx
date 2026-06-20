import * as React from "react";
import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginClient />
    </React.Suspense>
  );
}
