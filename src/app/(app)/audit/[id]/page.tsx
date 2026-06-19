import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatMs, safeHostname, truncate } from "@/lib/utils";
import { gradeColor, scoreToGrade, type Grade } from "@/lib/grades";
import { ScoreRing } from "@/components/audit/score-ring";
import { ScoreBreakdown } from "@/components/audit/score-breakdown";
import { IssuesList } from "@/components/audit/issues-list";
import { CATEGORY_LABELS } from "@/audit/scoring/weights";

export const metadata: Metadata = {
  title: "Audit results",
};

export default async function AuditResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const audit = await prisma.audit.findFirst({
    where: { id, userId: user.id },
    include: { issues: true },
  });
  if (!audit) notFound();

  const seoScore = audit.seoScore ?? 0;
  const grade = (audit.grade as Grade | null) ?? scoreToGrade(seoScore);
  const colors = gradeColor(grade);

  const issues = audit.issues.map(
    (i: {
      title: string;
      severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
      category:
        | "TECHNICAL"
        | "ON_PAGE"
        | "PERFORMANCE"
        | "CONTENT"
        | "ACCESSIBILITY"
        | "IMAGES"
        | "LINKS";
      description: string;
      recommendation: string;
      whyItMatters: string;
      fixCode: string | null;
      affectedUrl: string | null;
      metadata: unknown;
    }) => ({
      checkId: i.title,
      severity: i.severity,
      category: i.category,
      title: i.title,
      description: i.description,
      recommendation: i.recommendation,
      whyItMatters: i.whyItMatters,
      fixCode: i.fixCode ?? undefined,
      affectedUrl: i.affectedUrl ?? undefined,
      metadata: (i.metadata as Record<string, unknown> | null) ?? undefined,
    }),
  );

  const categoryScores = {
    TECHNICAL: audit.technicalScore ?? 0,
    ON_PAGE: audit.onPageScore ?? 0,
    PERFORMANCE: audit.performanceScore ?? 0,
    CONTENT: audit.contentScore ?? 0,
    ACCESSIBILITY: audit.accessibilityScore ?? 0,
  };

  const perf =
    (audit.performanceData as {
      score?: number | null;
      lcp?: number | null;
      fcp?: number | null;
      cls?: number | null;
      ttfb?: number | null;
      source?: string;
    } | null) ?? null;

  const pageData =
    (audit.pageData as {
      finalUrl?: string;
      hostname?: string;
      hasHttps?: boolean;
      status?: number;
      contentMetrics?: {
        wordCount?: number;
        flesch?: number;
        readingEaseLabel?: string;
      };
    } | null) ?? null;

  const isRunning = audit.status === "PENDING" || audit.status === "RUNNING";
  const isFailed = audit.status === "FAILED";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" /> Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {safeHostname(audit.normalizedUrl)}
          </h1>
          <p className="break-all text-sm text-[var(--muted-foreground)]">
            {audit.url}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Badge variant="outline">
              {formatDate(audit.createdAt)}
            </Badge>
            {audit.durationMs ? (
              <Badge variant="outline">{formatMs(audit.durationMs)}</Badge>
            ) : null}
            <Badge variant="outline" className={colors.bg + " " + colors.text}>
              {grade}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/api/audit/${audit.id}/export?format=csv`}>
              <Download className="size-4" /> CSV
            </Link>
          </Button>
          <Button variant="outline" size="sm" disabled title="PDF export ships in milestone 10">
            <FileText className="size-4" /> PDF
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">
              Your audit is running. Refresh this page in a minute.
            </p>
          </CardContent>
        </Card>
      )}

      {isFailed && (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">
              Audit failed: {audit.errorMessage ?? "Unknown error"}
            </p>
          </CardContent>
        </Card>
      )}

      {!isRunning && !isFailed && (
        <>
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-6">
                <ScoreRing score={seoScore} grade={grade} />
                <p className="text-center text-xs text-[var(--muted-foreground)]">
                  Overall SEO score
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Score breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreBreakdown scores={categoryScores} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {perf?.score !== null && perf?.score !== undefined ? (
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-baseline justify-between">
                    <span>Performance score</span>
                    <span className="font-semibold tabular-nums">
                      {perf.score} / 100
                    </span>
                  </div>
                  <MetricRow label="LCP" value={formatMs(perf.lcp ?? 0)} />
                  <MetricRow label="FCP" value={formatMs(perf.fcp ?? 0)} />
                  <MetricRow
                    label="CLS"
                    value={(perf.cls ?? 0).toFixed(2)}
                  />
                  <MetricRow
                    label="TTFB"
                    value={formatMs(perf.ttfb ?? 0)}
                  />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Source: {perf.source}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {pageData?.contentMetrics ? (
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <MetricRow
                    label="Word count"
                    value={String(pageData.contentMetrics.wordCount ?? 0)}
                  />
                  <MetricRow
                    label="Flesch reading ease"
                    value={String(pageData.contentMetrics.flesch ?? "—")}
                  />
                  <MetricRow
                    label="Readability"
                    value={pageData.contentMetrics.readingEaseLabel ?? "—"}
                  />
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle>Crawl summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <MetricRow
                  label="Final URL"
                  value={truncate(pageData?.finalUrl ?? audit.url, 50)}
                />
                <MetricRow label="Status" value={String(pageData?.status ?? 200)} />
                <MetricRow
                  label="HTTPS"
                  value={pageData?.hasHttps ? "Yes" : "No"}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {issues.length} issue{issues.length === 1 ? "" : "s"} found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IssuesList issues={issues} />
            </CardContent>
          </Card>

          <div className="text-center text-xs text-[var(--muted-foreground)]">
            Categories:{" "}
            {Object.entries(CATEGORY_LABELS)
              .map(([, v]) => v)
              .join(" · ")}
          </div>
        </>
      )}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-[var(--border)] pb-2 last:border-0 last:pb-0">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}