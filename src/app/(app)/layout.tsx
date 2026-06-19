import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { hasClerk } from "@/lib/env";
import { AppShell } from "@/components/dashboard/app-shell";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <AppShell isSignedIn={Boolean(user)} clerkEnabled={hasClerk}>
      {children}
    </AppShell>
  );
}