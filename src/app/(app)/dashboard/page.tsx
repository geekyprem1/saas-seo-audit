import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, safeHostname } from "@/lib/utils";
import { gradeColor, scoreToGrade } from "@/lib/grades";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  const audits = await prisma.audit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      url: true,
      normalizedUrl: true,
      seoScore: true,
      grade: true,
      status: true,
      createdAt: true,
    },
  });

  type AuditRow = (typeof audits)[number];
  const completed = audits.filter((a: AuditRow) => a.status === "COMPLETED");
  const avgScore = completed.length
    ? Math.round(
        completed.reduce(
          (s: number, a: AuditRow) => s + (a.seoScore ?? 0),
          0,
        ) / completed.length,
      )
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Run a new audit or pick up where you left off.
          </p>
        </div>
        <Button asChild>
          <Link href="/audit/new">
            New audit <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              Audits
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums">
              {audits.length}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {user.plan === "FREE"
                ? `${user.monthlyAudits} / 5 this month`
                : `${user.plan} plan`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              Average score
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{avgScore}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Across {completed.length} completed audit
              {completed.length === 1 ? "" : "s"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              Plan
            </p>
            <p className="mt-2 text-3xl font-bold capitalize">{user.plan.toLowerCase()}</p>
            <Button asChild variant="link" size="sm" className="mt-1 h-auto p-0">
              <Link href="/pricing">Manage plan →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Recent audits</h2>
        <div className="mt-3 space-y-2">
          {audits.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-sm text-[var(--muted-foreground)]">
                  You haven&apos;t run any audits yet.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/audit/new">Run your first audit</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            audits.map((audit: AuditRow) => {
              const score = audit.seoScore ?? 0;
              const grade = audit.grade
                ? (audit.grade as keyof typeof gradeColor)
                : scoreToGrade(score);
              const colors = gradeColor(grade);
              return (
                <Link
                  key={audit.id}
                  href={`/audit/${audit.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:bg-[var(--accent)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {safeHostname(audit.normalizedUrl)}
                    </p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {audit.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {formatDate(audit.createdAt)}
                    </span>
                    {audit.status === "COMPLETED" ? (
                      <span
                        className={`inline-flex h-8 min-w-[3rem] items-center justify-center rounded-md px-2 text-sm font-semibold tabular-nums ${colors.bg} ${colors.text}`}
                      >
                        {score}
                      </span>
                    ) : (
                      <Badge variant="secondary">{audit.status}</Badge>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}