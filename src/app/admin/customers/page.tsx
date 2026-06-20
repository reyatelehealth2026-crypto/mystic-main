import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { CustomerListClient } from "./CustomerListClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ลูกค้า (CRM)",
  robots: { index: false, follow: false },
};

export default async function AdminCustomersPage() {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) redirect("/login?returnTo=/admin/customers");
    if (err instanceof ForbiddenError) redirect("/");
    throw err;
  }
  return <CustomerListClient />;
}
