"use client";

import * as React from "react";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AppUserMenu({ signedIn }: { signedIn: boolean }) {
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
    <UserButton
      appearance={{
        elements: { avatarBox: "h-8 w-8" },
      }}
    />
  );
}