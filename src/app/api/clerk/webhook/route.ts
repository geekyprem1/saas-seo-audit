import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { syncClerkUserToDb, deleteClerkUserFromDb } from "@/server/services/user-service";
import { env, hasClerk } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasClerk || !env.CLERK_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Clerk not configured" },
      { status: 503 },
    );
  }

  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  let event: { type: string; data: unknown };
  try {
    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
    event = wh.verify(payload, headers) as { type: string; data: unknown };
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const u = event.data as {
        id: string;
        email_addresses: Array<{ id: string; email_address: string }>;
        primary_email_address_id: string | null;
        first_name: string | null;
        last_name: string | null;
        image_url: string;
      };
      await syncClerkUserToDb({
        id: u.id,
        emailAddresses: u.email_addresses.map((e) => ({
          id: e.id,
          emailAddress: e.email_address,
        })),
        primaryEmailAddressId: u.primary_email_address_id,
        firstName: u.first_name,
        lastName: u.last_name,
        imageUrl: u.image_url,
      });
      break;
    }
    case "user.deleted": {
      const u = event.data as { id: string };
      await deleteClerkUserFromDb(u.id);
      break;
    }
    default:
      // ignore other events
      break;
  }

  return NextResponse.json({ received: true });
}