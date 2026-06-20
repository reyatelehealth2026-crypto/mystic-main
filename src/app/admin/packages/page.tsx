import { redirect } from "next/navigation";
import { requireAdmin, ForbiddenError } from "@/lib/auth/admin";
import { UnauthorizedError } from "@/lib/auth/getCurrentUser";
import { PackagesAdminClient } from "./PackagesAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) redirect("/login?returnTo=/admin/packages");
    if (err instanceof ForbiddenError) redirect("/");
    throw err;
  }
  return <PackagesAdminClient />;
}
