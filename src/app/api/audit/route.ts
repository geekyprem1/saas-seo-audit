import { NextResponse } from "next/server";
import { after } from "next/server";
import { getOrCreateDbUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/ratelimit";
import { RunAuditSchema } from "@/server/validators/audit";
import { canRunAudit, finalizeAudit } from "@/server/services/audit-service";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const user = await getOrCreateDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await checkRateLimit("audit", user.id, 5, "1 m");
  if (!limit.success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        reset: limit.reset,
      },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = RunAuditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const quota = await canRunAudit(user.id);
  if (!quota.ok) {
    return NextResponse.json(
      {
        error: "Monthly audit limit reached on the Free plan",
        remaining: quota.remaining,
      },
      { status: 402 },
    );
  }

  const audit = await prisma.audit.create({
    data: {
      userId: user.id,
      url: parsed.data.url,
      normalizedUrl: parsed.data.url,
      status: "RUNNING",
    },
    select: { id: true },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      monthlyAudits:
        user.plan === "FREE"
          ? (user.plan === "FREE" && user.monthlyAudits >= 5
              ? user.monthlyAudits
              : user.monthlyAudits + 1)
          : user.monthlyAudits,
      auditsResetAt:
        user.plan === "FREE" && user.monthlyAudits === 0
          ? new Date()
          : user.auditsResetAt,
    },
  });

  after(async () => {
    try {
      await finalizeAudit({
        auditId: audit.id,
        url: parsed.data.url,
        enhanceWithAi: parsed.data.options?.enhanceWithAi,
      });
    } catch (err) {
      console.error("[audit] finalize failed", err);
      await prisma.audit
        .update({
          where: { id: audit.id },
          data: {
            status: "FAILED",
            errorMessage: err instanceof Error ? err.message : String(err),
            completedAt: new Date(),
          },
        })
        .catch(() => {});
    }
  });

  return NextResponse.json({ auditId: audit.id }, { status: 202 });
}

export async function GET() {
  return NextResponse.json({ status: "ready" });
}