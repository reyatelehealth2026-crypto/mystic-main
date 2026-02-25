import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <AppBar title="Terms" backHref="/profile" />
      <div className="px-5 pb-8">
        <Card className="p-5">
          <p className="text-sm font-semibold text-fg">Coming soon</p>
          <p className="mt-2 text-sm text-fg-muted">
            Terms of service will be published here.
          </p>
        </Card>
      </div>
    </main>
  );
}
