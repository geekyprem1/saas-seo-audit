import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrCreateDbUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Manage your account and plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Name" value={user.name ?? "—"} />
          <Row label="Email" value={user.email} />
          <Row label="Plan" value={user.plan} />
          <Row label="Member since" value={formatDate(user.createdAt)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row
            label="Audits this month"
            value={
              user.plan === "FREE"
                ? `${user.monthlyAudits} / 5`
                : `${user.monthlyAudits} (unlimited on ${user.plan})`
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-[var(--border)] pb-2 last:border-0 last:pb-0">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}