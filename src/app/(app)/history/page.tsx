import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, safeHostname } from "@/lib/utils";
import { gradeColor, scoreToGrade } from "@/lib/grades";

export const metadata: Metadata = {
  title: "Audit history",
};

export default async function HistoryPage() {
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  const audits = await prisma.audit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      url: true,
      normalizedUrl: true,
      seoScore: true,
      grade: true,
      status: true,
      createdAt: true,
      technicalScore: true,
      onPageScore: true,
      performanceScore: true,
      contentScore: true,
      accessibilityScore: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit history</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Every audit you&apos;ve run, with score deltas to spot what changed.
          </p>
        </div>
        <Button asChild>
          <Link href="/audit/new">
            New audit <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {audits.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">
              No audits yet. Run your first one to see it here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                  <th className="px-4 py-3 font-medium">Site</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Tech
                  </th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    On-page
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Perf
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Content
                  </th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">
                    A11y
                  </th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit: (typeof audits)[number]) => {
                  const score = audit.seoScore ?? 0;
                  const grade = (audit.grade ??
                    scoreToGrade(score)) as keyof typeof gradeColor;
                  const colors = gradeColor(grade);
                  return (
                    <tr
                      key={audit.id}
                      className="border-b border-[var(--border)]/60 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/audit/${audit.id}`}
                          className="font-medium hover:underline"
                        >
                          {safeHostname(audit.normalizedUrl)}
                        </Link>
                        <p className="truncate text-xs text-[var(--muted-foreground)]">
                          {audit.url}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {audit.status === "COMPLETED" ? (
                          <span
                            className={`inline-flex h-7 items-center rounded-md px-2 text-xs font-semibold tabular-nums ${colors.bg} ${colors.text}`}
                          >
                            {score} · {grade}
                          </span>
                        ) : (
                          <Badge variant="secondary">{audit.status}</Badge>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 tabular-nums sm:table-cell">
                        {audit.technicalScore ?? "—"}
                      </td>
                      <td className="hidden px-4 py-3 tabular-nums sm:table-cell">
                        {audit.onPageScore ?? "—"}
                      </td>
                      <td className="hidden px-4 py-3 tabular-nums md:table-cell">
                        {audit.performanceScore ?? "—"}
                      </td>
                      <td className="hidden px-4 py-3 tabular-nums md:table-cell">
                        {audit.contentScore ?? "—"}
                      </td>
                      <td className="hidden px-4 py-3 tabular-nums lg:table-cell">
                        {audit.accessibilityScore ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                        {formatDate(audit.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}