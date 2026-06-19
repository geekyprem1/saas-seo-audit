"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { IssueDraft } from "@/audit/issues/types";
import { CATEGORY_LABELS, type ScorableCategory } from "@/audit/scoring/weights";

const SEVERITY_LABEL: Record<IssueDraft["severity"], string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const SEVERITY_VARIANT: Record<
  IssueDraft["severity"],
  "destructive" | "warning" | "info" | "secondary"
> = {
  CRITICAL: "destructive",
  HIGH: "warning",
  MEDIUM: "info",
  LOW: "secondary",
};

export function IssuesList({ issues }: { issues: IssueDraft[] }) {
  const [category, setCategory] = React.useState<ScorableCategory | "ALL">(
    "ALL",
  );

  const filtered =
    category === "ALL"
      ? issues
      : issues.filter((i) => i.category === category);

  const counts = issues.reduce<Record<string, number>>((acc, i) => {
    acc[i.severity] = (acc[i.severity] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryChip
          label="All"
          active={category === "ALL"}
          onClick={() => setCategory("ALL")}
        />
        {(Object.keys(CATEGORY_LABELS) as ScorableCategory[]).map((key) => (
          <CategoryChip
            key={key}
            label={CATEGORY_LABELS[key]}
            active={category === key}
            onClick={() => setCategory(key)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
        <span>{issues.length} total</span>
        {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((sev) =>
          counts[sev] ? (
            <span key={sev} className="flex items-center gap-1">
              <Badge variant={SEVERITY_VARIANT[sev]}>{SEVERITY_LABEL[sev]}</Badge>
              <span>{counts[sev]}</span>
            </span>
          ) : null,
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        {filtered.map((issue, idx) => (
          <AccordionItem
            key={`${issue.checkId}-${idx}`}
            value={`${issue.checkId}-${idx}`}
            className="rounded-lg border border-[var(--border)] px-4 mb-2"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-1 items-center gap-3 text-left">
                <Badge variant={SEVERITY_VARIANT[issue.severity]}>
                  {SEVERITY_LABEL[issue.severity]}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{issue.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {CATEGORY_LABELS[issue.category as ScorableCategory] ??
                      issue.category}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pb-2 pt-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                    What we found
                  </p>
                  <p className="text-sm">{issue.description}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                    Why it matters
                  </p>
                  <p className="text-sm">{issue.whyItMatters}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                    How to fix it
                  </p>
                  <p className="text-sm">{issue.recommendation}</p>
                </div>
                {issue.fixCode && (
                  <pre className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--muted)] p-3 text-xs">
                    <code>{issue.fixCode}</code>
                  </pre>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted-foreground)]">
          No issues in this category. Nice work.
        </p>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
          : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)]"
      }`}
    >
      {label}
    </button>
  );
}