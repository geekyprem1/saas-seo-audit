"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Target, ArrowRight } from "lucide-react";
import type { IssueDraft } from "@/audit/issues/types";
import { cn } from "@/lib/utils";

export function PriorityActionPlan({ issues }: { issues: IssueDraft[] }) {
  // Sort issues by severity
  const sortedIssues = [...issues].sort((a, b) => {
    const sevScore = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
    return sevScore[b.severity] - sevScore[a.severity];
  });

  // Categorize into action buckets based on simple heuristics
  const quickWins = sortedIssues.filter(i => 
    i.severity !== "CRITICAL" && 
    (i.category === "ON_PAGE" || i.category === "IMAGES" || i.category === "LINKS")
  ).slice(0, 5);

  const mediumEffort = sortedIssues.filter(i => 
    i.category === "CONTENT" || 
    (i.category === "ON_PAGE" && i.severity === "CRITICAL")
  ).slice(0, 4);

  const highImpact = sortedIssues.filter(i => 
    i.category === "PERFORMANCE" || 
    i.category === "TECHNICAL" || 
    i.severity === "CRITICAL"
  ).filter(i => !mediumEffort.includes(i) && !quickWins.includes(i)).slice(0, 4);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Quick Wins */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Quick Wins
          </CardTitle>
          <CardDescription>Under 30 minutes to fix</CardDescription>
        </CardHeader>
        <CardContent>
          {quickWins.length > 0 ? (
            <ul className="space-y-4">
              {quickWins.map((issue, i) => (
                <ActionItem key={i} issue={issue} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No quick wins found.</p>
          )}
        </CardContent>
      </Card>

      {/* Medium Effort */}
      <Card className="border-t-4 border-t-amber-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Target className="mr-2 h-5 w-5 text-amber-500" />
            Medium Effort
          </CardTitle>
          <CardDescription>Requires content updates or minor code changes</CardDescription>
        </CardHeader>
        <CardContent>
          {mediumEffort.length > 0 ? (
            <ul className="space-y-4">
              {mediumEffort.map((issue, i) => (
                <ActionItem key={i} issue={issue} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No medium effort tasks.</p>
          )}
        </CardContent>
      </Card>

      {/* High Impact Projects */}
      <Card className="border-t-4 border-t-red-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Zap className="mr-2 h-5 w-5 text-red-500" />
            High Impact
          </CardTitle>
          <CardDescription>Requires developer time but yields highest ROI</CardDescription>
        </CardHeader>
        <CardContent>
          {highImpact.length > 0 ? (
            <ul className="space-y-4">
              {highImpact.map((issue, i) => (
                <ActionItem key={i} issue={issue} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No high impact projects found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ActionItem({ issue }: { issue: IssueDraft }) {
  return (
    <li className="flex items-start gap-3 group cursor-default">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
          {issue.title}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-muted-foreground/20">
            {issue.category}
          </Badge>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {issue.severity}
          </span>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
    </li>
  );
}
