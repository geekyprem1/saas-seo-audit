import { CATEGORY_WEIGHTS, type ScorableCategory } from "./weights";
import type { IssueDraft } from "@/audit/issues/types";

export type CategoryScores = {
  CONVERSION: number;
  MESSAGING: number;
  TRUST: number;
  TECHNICAL: number;
  PERFORMANCE: number;
  OFFER: number;
  CONTENT: number;
  MEDIA: number;
  LINKS: number;
};

const SEVERITY_DEDUCTION: Record<IssueDraft["severity"], number> = {
  CRITICAL: 18,
  HIGH: 10,
  MEDIUM: 5,
  LOW: 2,
};

export function emptyScores(): CategoryScores {
  return {
    CONVERSION: 100,
    MESSAGING: 100,
    TRUST: 100,
    TECHNICAL: 100,
    PERFORMANCE: 100,
    OFFER: 100,
    CONTENT: 100,
    MEDIA: 100,
    LINKS: 100,
  };
}

export function applyIssue(scores: CategoryScores, issue: IssueDraft): CategoryScores {
  const next = { ...scores };
  let cat = issue.category as string;
  
  // Backwards compatibility mappings for older issue categories
  if (cat === "ON_PAGE") cat = "TECHNICAL";
  if (cat === "ACCESSIBILITY") cat = "TECHNICAL";
  if (cat === "IMAGES") cat = "MEDIA";
  
  if (!(cat in next)) return next;
  const current = next[cat as keyof CategoryScores];
  next[cat as keyof CategoryScores] = Math.max(
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
  const keys = Object.keys(CATEGORY_WEIGHTS) as Array<keyof typeof CATEGORY_WEIGHTS>;
  const weighted = keys.reduce(
    (sum, cat) => sum + CATEGORY_WEIGHTS[cat] * scores[cat],
    0,
  );
  return Math.round(weighted / totalWeight);
}

export function categoryDeductions(issues: IssueDraft[]): {
  counts: Record<ScorableCategory, number>;
  deductions: Record<ScorableCategory, number>;
} {
  const counts = emptyScores() as any;
  const deductions = emptyScores() as any;
  for (const issue of issues) {
    let cat = issue.category as string;
    if (cat === "ON_PAGE") cat = "TECHNICAL";
    if (cat === "ACCESSIBILITY") cat = "TECHNICAL";
    if (cat === "IMAGES") cat = "MEDIA";
    
    if (!(cat in counts)) continue;
    counts[cat as ScorableCategory] += 1;
    deductions[cat as ScorableCategory] += SEVERITY_DEDUCTION[issue.severity];
  }
  return { counts, deductions };
}