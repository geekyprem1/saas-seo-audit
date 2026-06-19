import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrCreateDbUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Stripe checkout ships in milestone 10. Today you can preview the plans.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold capitalize">{user.plan.toLowerCase()}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {user.plan === "FREE"
              ? "You're on the free plan. Upgrade for unlimited audits and competitor analysis."
              : `You're on the ${user.plan} plan.`}
          </p>
          <Button asChild className="mt-4">
            <Link href="/pricing">See plans</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}