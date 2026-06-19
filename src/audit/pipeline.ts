import { normalizeUrl } from "@/audit/normalize-url";
import { fetchHtml } from "@/audit/crawler";
import { parseHtml } from "@/audit/parse";
import { runAllChecks, type CheckOutputs } from "@/audit/checks";
import {
  gatherTechnicalContext,
  type TechnicalContext,
} from "@/audit/checks/technical";
import { fetchPerformance } from "@/audit/checks/performance";
import {
  applyIssue,
  computeOverall,
  emptyScores,
  type CategoryScores,
} from "@/audit/scoring/score";
import { scoreToGrade } from "@/lib/grades";
import { enhanceIssues } from "@/audit/ai/recommend";
import { hasOpenRouter } from "@/lib/env";
import type { IssueDraft } from "@/audit/issues/types";

export type AuditRunInput = {
  userId: string;
  url: string;
  enhanceWithAi?: boolean;
};

export type AuditRunResult = {
  normalizedUrl: string;
  hostname: string;
  hasHttps: boolean;
  status: number;
  finalUrl: string;
  durationMs: number;
  scores: CategoryScores;
  seoScore: number;
  grade: ReturnType<typeof scoreToGrade>;
  issues: IssueDraft[];
  performance: {
    score: number | null;
    lcp: number | null;
    fcp: number | null;
    cls: number | null;
    ttfb: number | null;
    source: "psi" | "skipped" | "error";
  };
  contentMetrics: CheckOutputs["metrics"]["content"];
  rawHtml?: string;
};

export async function runAudit(input: AuditRunInput): Promise<AuditRunResult> {
  const startedAt = Date.now();
  const normalized = normalizeUrl(input.url);

  const fetchResult = await fetchHtml(normalized.normalizedUrl);
  if (!fetchResult.ok || !fetchResult.html) {
    throw new Error(
      `Failed to fetch site: ${fetchResult.status} ${fetchResult.statusText || ""} ${fetchResult.error ?? ""}`.trim(),
    );
  }

  const page = parseHtml(fetchResult.html, fetchResult.finalUrl);
  page.status = fetchResult.status;
  page.headers = fetchResult.headers;
  page.hasHttps = fetchResult.finalUrl.startsWith("https://");

  const technicalContext: TechnicalContext = await gatherTechnicalContext(
    normalized.normalizedUrl,
    fetchResult.html,
    fetchResult.status,
    fetchResult.finalUrl,
  );

  const performance = await fetchPerformance(fetchResult.finalUrl, "mobile");

  const checks = runAllChecks({
    page,
    technical: technicalContext,
    performance,
  });

  let issues = checks.issues;
  if (input.enhanceWithAi !== false && hasOpenRouter) {
    issues = await enhanceIssues(
      checks.issues,
      { url: fetchResult.finalUrl, title: page.title },
      25,
    );
  }

  let scores = emptyScores();
  for (const issue of issues) {
    scores = applyIssue(scores, issue);
  }
  const seoScore = computeOverall(scores);
  const grade = scoreToGrade(seoScore);

  return {
    normalizedUrl: normalized.normalizedUrl,
    hostname: normalized.hostname,
    hasHttps: page.hasHttps,
    status: fetchResult.status,
    finalUrl: fetchResult.finalUrl,
    durationMs: Date.now() - startedAt,
    scores,
    seoScore,
    grade,
    issues,
    performance,
    contentMetrics: checks.metrics.content,
    rawHtml: fetchResult.html,
  };
}