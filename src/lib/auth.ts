import "server-only";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hasClerk } from "@/lib/env";

export async function getCurrentUser() {
  if (!hasClerk) return null;
  const user = await clerkCurrentUser();
  return user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function getOrCreateDbUser() {
  const clerkUser = await getCurrentUser();
  if (!clerkUser) return null;
  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const dbUser = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      name: [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ") || null,
      imageUrl: clerkUser.imageUrl || null,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      name:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        null,
      imageUrl: clerkUser.imageUrl || null,
    },
  });
  return dbUser;
}