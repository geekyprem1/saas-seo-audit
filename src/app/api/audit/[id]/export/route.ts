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
        "Content-Disposition": `attachment; filename="landing-page-audit-${audit.id}.csv"`,
      },
    });
  }

  if (format === "pdf") {
    try {
      const requestUrl = new URL(request.url);
      const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
      const secret = process.env.CRON_SECRET || "dev-cron-secret";
      const targetUrl = `${baseUrl}/audit/${id}?secret=${secret}`;

      console.log(`[pdf-export] Launching browser to print: ${targetUrl}`);
      
      let puppeteer;
      try {
        puppeteer = await import("puppeteer");
      } catch (err) {
        throw new Error("Puppeteer is not installed in the server environment.");
      }

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      
      // Navigate to the target local audit page and wait until quiet
      await page.goto(targetUrl, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "12mm",
          right: "12mm",
          bottom: "12mm",
          left: "12mm",
        },
      });

      await browser.close();

      return new NextResponse(pdfBuffer as any, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="landing-page-audit-${audit.id}.pdf"`,
        },
      });
    } catch (err) {
      console.error("[pdf-export] failed to generate PDF:", err);
      return NextResponse.json(
        {
          error: "PDF generation failed. Ensure your local server is running and database is connected.",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { error: "Unsupported format. Use ?format=csv or ?format=pdf." },
    { status: 400 },
  );
}