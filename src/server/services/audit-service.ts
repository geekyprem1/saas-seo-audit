import { prisma } from "@/lib/db";
import { normalizeUrl } from "@/audit/normalize-url";
import { runAudit, type AuditRunResult } from "@/audit/pipeline";
import type { Plan } from "@/generated/prisma";

export const FREE_MONTHLY_LIMIT = 5;

function shouldResetMonthly(resetAt: Date): boolean {
  const now = new Date();
  return (
    resetAt.getUTCFullYear() !== now.getUTCFullYear() ||
    resetAt.getUTCMonth() !== now.getUTCMonth()
  );
}

export async function canRunAudit(
  userId: string,
): Promise<{ ok: boolean; plan: Plan; remaining: number | null }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, plan: "FREE", remaining: 0 };
  if (user.plan !== "FREE") {
    return { ok: true, plan: user.plan, remaining: null };
  }
  const reset = shouldResetMonthly(user.auditsResetAt);
  const used = reset ? 0 : user.monthlyAudits;
  const remaining = Math.max(0, FREE_MONTHLY_LIMIT - used);
  return {
    ok: remaining > 0,
    plan: "FREE",
    remaining,
  };
}

export async function incrementUsage(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.plan !== "FREE") return;
  const reset = shouldResetMonthly(user.auditsResetAt);
  await prisma.user.update({
    where: { id: userId },
    data: {
      monthlyAudits: reset ? 1 : user.monthlyAudits + 1,
      auditsResetAt: reset ? new Date() : user.auditsResetAt,
    },
  });
}

export async function startAudit(input: {
  userId: string;
  url: string;
  enhanceWithAi?: boolean;
}): Promise<{ auditId: string }> {
  const normalized = normalizeUrl(input.url);

  const audit = await prisma.audit.create({
    data: {
      userId: input.userId,
      url: input.url,
      normalizedUrl: normalized.normalizedUrl,
      status: "RUNNING",
    },
    select: { id: true },
  });

  await incrementUsage(input.userId);

  void finalizeAudit({
    auditId: audit.id,
    url: input.url,
    enhanceWithAi: input.enhanceWithAi,
  }).catch(async (err) => {
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
  });

  return { auditId: audit.id };
}

export async function finalizeAudit(input: {
  auditId: string;
  url: string;
  enhanceWithAi?: boolean;
}): Promise<AuditRunResult> {
  const audit = await prisma.audit.findUnique({
    where: { id: input.auditId },
  });
  if (!audit) throw new Error("Audit not found");

  const result = await runAudit({
    userId: audit.userId,
    url: input.url,
    enhanceWithAi: input.enhanceWithAi,
  });

  await prisma.audit.update({
    where: { id: input.auditId },
    data: {
      status: "COMPLETED",
      seoScore: result.seoScore,
      technicalScore: result.scores.TECHNICAL,
      onPageScore: result.scores.MESSAGING, // map for legacy safety
      performanceScore: result.scores.PERFORMANCE,
      contentScore: result.scores.CONTENT,
      accessibilityScore: result.scores.TRUST, // map for legacy safety
      growthScore: result.growthScore,
      conversionScore: result.scores.CONVERSION,
      messagingScore: result.scores.MESSAGING,
      trustScore: result.scores.TRUST,
      offerScore: result.scores.OFFER,
      mediaScore: result.scores.MEDIA,
      grade: result.grade,
      rawHtml: result.rawHtml,
      aiSummary: result.aiSummary ?? null,
      pageData: {
        finalUrl: result.finalUrl,
        hostname: result.hostname,
        hasHttps: result.hasHttps,
        status: result.status,
        metrics: result.metrics,
        keywords: result.keywords ?? [],
        competitors: result.competitors ?? [],
        copyAnalysis: result.copyAnalysis ?? null,
        aiDataExtra: result.aiDataExtra ?? null,
      },
      performanceData: {
        ...result.performance,
      },
      durationMs: result.durationMs,
      completedAt: new Date(),
      issues: {
        deleteMany: {},
        create: result.issues.map((issue) => ({
          severity: issue.severity,
          category: issue.category,
          title: issue.title,
          description: issue.description,
          recommendation: issue.recommendation,
          whyItMatters: issue.whyItMatters,
          businessImpact: issue.businessImpact ?? null,
          seoImpact: issue.seoImpact ?? null,
          difficulty: issue.difficulty ?? null,
          fixCode: issue.fixCode ?? null,
          affectedUrl: issue.affectedUrl ?? null,
          metadata:
            issue.metadata !== undefined
              ? (JSON.parse(JSON.stringify(issue.metadata)) as object)
              : undefined,
        })),
      },
    },
  });

  return result;
}