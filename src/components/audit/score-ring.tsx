"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { gradeColor, type Grade } from "@/lib/grades";

export function ScoreRing({
  score,
  grade,
  size = 180,
  className,
}: {
  score: number;
  grade: Grade;
  size?: number;
  className?: string;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - pct / 100);
  const colors = gradeColor(grade);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(colors.ring, "transition-[stroke-dashoffset] duration-700")}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-semibold tabular-nums", colors.text)}>
          {pct}
        </span>
        <span className="text-xs text-[var(--muted-foreground)]">/ 100</span>
        <span
          className={cn(
            "mt-1 rounded-md px-2 py-0.5 text-xs font-semibold",
            colors.bg,
            colors.text,
          )}
        >
          Grade {grade}
        </span>
      </div>
    </div>
  );
}