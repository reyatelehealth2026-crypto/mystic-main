import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { CustomerDetailClient } from "./CustomerDetailClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "รายละเอียดลูกค้า",
  robots: { index: false, follow: false },
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) redirect("/login?returnTo=/admin/customers");
    if (err instanceof ForbiddenError) redirect("/");
    throw err;
  }
  const { id } = await params;
  return <CustomerDetailClient id={id} />;
}
