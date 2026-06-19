"use client";

import * as React from "react";
import Link from "next/link";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function UserMenu({
  signedIn,
  dashboardHref = "/dashboard",
}: {
  signedIn: boolean;
  dashboardHref?: string;
}) {
  if (!signedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">
          Sign in
        </Button>
      </SignInButton>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href={dashboardHref}>Dashboard</Link>
      </Button>
      <UserButton
        appearance={{
          elements: { avatarBox: "h-8 w-8" },
        }}
      />
    </div>
  );
}