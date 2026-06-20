"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export function LoginClient() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  const returnTo = params.get("returnTo") || "/profile";

  React.useEffect(() => {
    if (!loading && user) router.replace(returnTo);
  }, [loading, user, returnTo, router]);

  return (
    <div className="mx-auto max-w-md px-5 py-10">
      <Card className="p-6 text-center">
        <CardTitle className="text-lg">เข้าสู่ระบบด้วย LINE</CardTitle>
        <CardDesc className="mt-2">
          เข้าสู่ระบบเพื่อบันทึกประวัติการดูดวง เครดิต และรับสิทธิพิเศษผ่าน LINE
        </CardDesc>

        {error ? (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            เข้าสู่ระบบไม่สำเร็จ ลองอีกครั้งนะคะ/ครับ
          </p>
        ) : null}

        <div className="mt-6">
          <Button
            onClick={login}
            disabled={loading}
            className="w-full bg-[#06C755] text-white hover:bg-[#05b34c]"
            size="lg"
          >
            {loading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบด้วย LINE"}
          </Button>
        </div>

        <p className="mt-4 text-xs text-fg-muted">
          เมื่อเข้าสู่ระบบ ถือว่าคุณยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัวของเรา
        </p>
      </Card>
    </div>
  );
}
