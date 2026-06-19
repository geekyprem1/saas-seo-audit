import { prisma } from "@/lib/db";
import { hasClerk } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import type { Plan } from "@/generated/prisma";

export type ClerkUserLike = {
  id: string;
  emailAddresses: Array<{ id: string; emailAddress: string }>;
  primaryEmailAddressId: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
};

export async function syncClerkUserToDb(user: ClerkUserLike): Promise<{
  id: string;
  email: string;
  plan: Plan;
}> {
  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("Clerk user has no email");

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: { email, name, imageUrl: user.imageUrl || null },
    create: {
      clerkId: user.id,
      email,
      name,
      imageUrl: user.imageUrl || null,
    },
  });
  return {
    id: dbUser.id,
    email: dbUser.email,
    plan: dbUser.plan,
  };
}

export async function deleteClerkUserFromDb(clerkId: string): Promise<void> {
  await prisma.user.deleteMany({ where: { clerkId } });
}

export async function getCurrentDbUser() {
  if (!hasClerk) return null;
  const clerkUser = await getCurrentUser();
  if (!clerkUser) return null;
  return prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
}