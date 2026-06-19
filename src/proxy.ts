import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasClerk } from "@/lib/env";

function noopProxy(_request: NextRequest) {
  return NextResponse.next();
}

export const proxy = hasClerk ? clerkMiddleware() : noopProxy;

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};