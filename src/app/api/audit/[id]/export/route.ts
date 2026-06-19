import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { issuesToCsv } from "@/audit/export/csv";
import type { IssueDraft } from "@/audit/issues/types";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getOrCreateDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get("format") ?? "csv").toLowerCase();

  const audit = await prisma.audit.findFirst({
    where: { id, userId: user.id },
    include: { issues: true },
  });
  if (!audit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (format === "csv") {
    const drafts: IssueDraft[] = audit.issues.map((i) => ({
      checkId: `csv-${i.id}`,
      severity: i.severity,
      category: i.category,
      title: i.title,
      description: i.description,
      recommendation: i.recommendation,
      whyItMatters: i.whyItMatters,
      fixCode: i.fixCode ?? undefined,
      affectedUrl: i.affectedUrl ?? undefined,
      metadata:
        (i.metadata as Record<string, unknown> | null) ?? undefined,
    }));
    const csv = issuesToCsv(drafts);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="seo-audit-${audit.id}.csv"`,
      },
    });
  }

  return NextResponse.json(
    { error: "Unsupported format. Use ?format=csv. PDF export ships in milestone 10." },
    { status: 400 },
  );
}