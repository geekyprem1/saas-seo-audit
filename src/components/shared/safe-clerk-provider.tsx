"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { hasClerk } from "@/lib/env";

export function SafeClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  if (!hasClerk) {
    return (
      <>
        <DevModeBanner />
        {children}
      </>
    );
  }
  const variables =
    resolvedTheme === "dark"
      ? {
          colorBackground: "#0a0a0a",
          colorText: "#ededed",
          colorPrimary: "#818cf8",
        }
      : {
          colorBackground: "#ffffff",
          colorText: "#171717",
          colorPrimary: "#4f46e5",
        };
  return (
    <ClerkProvider
      appearance={{
        variables,
        elements: {
          card: "shadow-xl",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

function DevModeBanner() {
  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-700 dark:text-amber-300">
      Running without Clerk auth. Set{" "}
      <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{" "}
      <code>CLERK_SECRET_KEY</code> in <code>.env</code> to enable sign-in.
    </div>
  );
}