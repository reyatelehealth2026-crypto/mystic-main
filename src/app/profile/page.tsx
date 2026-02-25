import { AppBar } from "@/components/nav/AppBar";
import { ProfileClient } from "@/app/profile/ProfileClient";

// Server component: keep localStorage + DOM mutations inside the client component.
export default async function ProfilePage() {
  let version: string | undefined;
  try {
    const pkg = (await import("../../../package.json")).default as { version?: string };
    version = pkg.version;
  } catch {
    version = undefined;
  }

  return (
    <main className="mx-auto w-full max-w-lg">
      <AppBar title="Profile" largeTitle />
      <ProfileClient version={version} />
    </main>
  );
}
