import { CATEGORY_WEIGHTS, type ScorableCategory } from "./weights";
import type { IssueDraft } from "@/audit/issues/types";

export type CategoryScores = Record<ScorableCategory, number>;

const SEVERITY_DEDUCTION: Record<IssueDraft["severity"], number> = {
  CRITICAL: 18,
  HIGH: 10,
  MEDIUM: 5,
  LOW: 2,
};

export function emptyScores(): CategoryScores {
  return {
    TECHNICAL: 100,
    ON_PAGE: 100,
    PERFORMANCE: 100,
    CONTENT: 100,
    ACCESSIBILITY: 100,
  };
}

export function applyIssue(scores: CategoryScores, issue: IssueDraft): CategoryScores {
  const next = { ...scores };
  const cat = issue.category;
  if (!(cat in next)) return next;
  const current = next[cat as ScorableCategory];
  next[cat as ScorableCategory] = Math.max(
    0,
    current - SEVERITY_DEDUCTION[issue.severity],
  );
  return next;
}

export function computeOverall(scores: CategoryScores): number {
  const totalWeight = Object.values(CATEGORY_WEIGHTS).reduce(
    (a, b) => a + b,
    0,
  );
  const weighted = (Object.keys(CATEGORY_WEIGHTS) as ScorableCategory[]).reduce(
    (sum, cat) => sum + CATEGORY_WEIGHTS[cat] * scores[cat],
    0,
  );
  return Math.round(weighted / totalWeight);
}

export function categoryDeductions(issues: IssueDraft[]): {
  counts: Record<ScorableCategory, number>;
  deductions: Record<ScorableCategory, number>;
} {
  const counts = emptyScores();
  const deductions = emptyScores();
  for (const issue of issues) {
    const cat = issue.category;
    if (!(cat in counts)) continue;
    counts[cat as ScorableCategory] += 1;
    deductions[cat as ScorableCategory] += SEVERITY_DEDUCTION[issue.severity];
  }
  return { counts, deductions };
}