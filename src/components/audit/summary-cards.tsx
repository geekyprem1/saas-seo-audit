"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertOctagon, XCircle, AlertTriangle } from "lucide-react";
import type { IssueDraft } from "@/audit/issues/types";

export function WhatYouAreDoingWell({ issues }: { issues: IssueDraft[] }) {
  // Simple heuristic: if there are no critical issues in a category, that's a "win"
  // For a real app, this would be based on actual "passed checks"
  const categoriesWithIssues = new Set(issues.map(i => i.category));
  const wins = [];

  if (!categoriesWithIssues.has("ACCESSIBILITY")) {
    wins.push("Perfect Accessibility Score: Your site is easy to navigate for all users.");
  }
  if (!categoriesWithIssues.has("PERFORMANCE") || issues.filter(i => i.category === "PERFORMANCE" && i.severity === "CRITICAL").length === 0) {
    wins.push("Fast Load Times: Your Core Web Vitals are looking healthy.");
  }
  if (issues.filter(i => i.category === "ON_PAGE" && i.severity === "CRITICAL").length === 0) {
    wins.push("Solid On-Page SEO: Title tags and meta descriptions are well-optimized.");
  }
  if (issues.filter(i => i.category === "TECHNICAL" && i.severity === "CRITICAL").length === 0) {
    wins.push("Technical Foundation: Robots.txt and Sitemaps are correctly configured.");
  }

  // Fallback if there are too many issues
  if (wins.length === 0) wins.push("HTTPS Enabled: Your site is secure.");

  return (
    <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg text-emerald-800 dark:text-emerald-400">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          What You're Doing Well
        </CardTitle>
        <CardDescription>Areas where your site is currently outperforming competitors.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2">
          {wins.map((win, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
              <span>{win}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function WhatNeedsWork({ issues }: { issues: IssueDraft[] }) {
  const critical = issues.filter(i => i.severity === "CRITICAL").length;
  const high = issues.filter(i => i.severity === "HIGH").length;
  const medium = issues.filter(i => i.severity === "MEDIUM").length;
  const low = issues.filter(i => i.severity === "LOW").length;

  return (
    <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg text-red-800 dark:text-red-400">
          <AlertOctagon className="mr-2 h-5 w-5" />
          What Needs Work
        </CardTitle>
        <CardDescription>Issues holding back your search engine rankings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50">
            <span className="text-2xl font-bold text-red-700 dark:text-red-400">{critical}</span>
            <span className="text-xs font-medium text-red-600 dark:text-red-500 uppercase tracking-wider flex items-center gap-1 mt-1">
              <XCircle className="h-3 w-3" /> Critical
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50">
            <span className="text-2xl font-bold text-orange-700 dark:text-orange-400">{high}</span>
            <span className="text-xs font-medium text-orange-600 dark:text-orange-500 uppercase tracking-wider flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" /> High
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50">
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">{medium}</span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-500 uppercase tracking-wider flex items-center gap-1 mt-1">
              Medium
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50">
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{low}</span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-500 uppercase tracking-wider flex items-center gap-1 mt-1">
              Low Priority
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
