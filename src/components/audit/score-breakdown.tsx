import { Progress } from "@/components/ui/progress";
import {
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  type ScorableCategory,
} from "@/audit/scoring/weights";
import { gradeColor, scoreToGrade, type Grade } from "@/lib/grades";

const ORDER: ScorableCategory[] = [
  "TECHNICAL",
  "ON_PAGE",
  "PERFORMANCE",
  "CONTENT",
  "ACCESSIBILITY",
];

export function ScoreBreakdown({
  scores,
}: {
  scores: Record<ScorableCategory, number>;
}) {
  return (
    <div className="space-y-5">
      {ORDER.map((key) => {
        const value = scores[key] ?? 0;
        const grade = scoreToGrade(value);
        const colors = gradeColor(grade);
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{CATEGORY_LABELS[key]}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {CATEGORY_DESCRIPTIONS[key]}
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-sm font-semibold tabular-nums ${colors.text}`}
                >
                  {value}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  / 100
                </span>
                <GradePill grade={grade} />
              </div>
            </div>
            <Progress value={value} indicatorClassName={indicatorColor(value)} />
          </div>
        );
      })}
    </div>
  );
}

function GradePill({ grade }: { grade: Grade }) {
  const colors = gradeColor(grade);
  return (
    <span
      className={`inline-flex h-5 items-center rounded px-1.5 text-[10px] font-bold ${colors.bg} ${colors.text}`}
    >
      {grade}
    </span>
  );
}

function indicatorColor(value: number): string {
  if (value >= 90) return "bg-emerald-500";
  if (value >= 80) return "bg-lime-500";
  if (value >= 70) return "bg-amber-500";
  return "bg-red-500";
}