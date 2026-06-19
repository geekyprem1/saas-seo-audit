"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertTriangle, CheckCircle2, Info, ChevronRight, TrendingUp } from "lucide-react";
import type { IssueDraft } from "@/audit/issues/types";
import { CATEGORY_LABELS, type ScorableCategory } from "@/audit/scoring/weights";
import { cn } from "@/lib/utils";

const SEVERITY_LABEL: Record<IssueDraft["severity"], string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const SEVERITY_VARIANT: Record<IssueDraft["severity"], "destructive" | "warning" | "info" | "secondary"> = {
  CRITICAL: "destructive",
  HIGH: "warning",
  MEDIUM: "warning", // "warning" used for both High and Medium, or we can use custom classes
  LOW: "secondary",
};

const SEVERITY_COLOR: Record<IssueDraft["severity"], string> = {
  CRITICAL: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
  HIGH: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30",
  MEDIUM: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30",
  LOW: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
};

// Generate a deterministic mock traffic impact based on issue title length and severity
function getMockTrafficImpact(issue: IssueDraft) {
  let base = 1;
  if (issue.severity === "CRITICAL") base = 8;
  if (issue.severity === "HIGH") base = 4;
  if (issue.severity === "MEDIUM") base = 2;
  
  // deterministic random-ish modifier
  const modifier = (issue.title.length % 5) * 0.5;
  return (base + modifier).toFixed(1);
}

export function IssueExplorer({ issues }: { issues: IssueDraft[] }) {
  // Sort issues by severity: Critical > High > Medium > Low
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const sortedIssues = [...issues].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
          <CardTitle>No Issues Found</CardTitle>
          <CardDescription>Your site passed all checks with flying colors!</CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detailed Issue Explorer</CardTitle>
            <CardDescription>Comprehensive list of all discovered SEO issues and fixes.</CardDescription>
          </div>
          <Badge variant="outline" className="font-mono bg-background">
            Total: {issues.length}
          </Badge>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Traffic Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedIssues.map((issue, idx) => (
              <IssueRow key={`${issue.checkId}-${idx}`} issue={issue} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function IssueRow({ issue }: { issue: IssueDraft }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const trafficImpact = getMockTrafficImpact(issue);

  const diffLabel = (issue.difficulty || "LOW").toUpperCase();
  const diffColor = 
    diffLabel === "HIGH" ? "text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200" :
    diffLabel === "MEDIUM" ? "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200" :
    "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200";

  return (
    <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
      <>
        <TableRow className={cn("cursor-pointer hover:bg-muted/50 transition-colors", isOpen && "bg-muted/30")}>
          <TableCell className="p-4">
            <CollapsibleTrigger asChild>
              <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted">
                <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-90")} />
              </button>
            </CollapsibleTrigger>
          </TableCell>
          <TableCell className="font-medium max-w-[280px] truncate" title={issue.title}>
            {issue.title}
          </TableCell>
          <TableCell className="text-muted-foreground text-xs">
            {CATEGORY_LABELS[issue.category as ScorableCategory] ?? issue.category}
          </TableCell>
          <TableCell>
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", SEVERITY_COLOR[issue.severity])}>
              {SEVERITY_LABEL[issue.severity]}
            </span>
          </TableCell>
          <TableCell>
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold", diffColor)}>
              {diffLabel}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-xs">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{trafficImpact}%
            </span>
          </TableCell>
        </TableRow>
        <CollapsibleContent asChild>
          <TableRow className="border-b-0 hover:bg-transparent">
            <TableCell colSpan={6} className="p-0 border-b">
              <div className="bg-muted/10 p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <h4 className="flex items-center text-xs font-bold text-foreground mb-1">
                        <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        What we found
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                    {issue.businessImpact && (
                      <div>
                        <h4 className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                          <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                          Business & Conversion Impact
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {issue.businessImpact}
                        </p>
                      </div>
                    )}
                    {issue.seoImpact && (
                      <div>
                        <h4 className="flex items-center text-xs font-bold text-blue-500 mb-1">
                          <Info className="mr-1.5 h-3.5 w-3.5" />
                          SEO & Visibility Impact
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {issue.seoImpact}
                        </p>
                      </div>
                    )}
                    {!issue.businessImpact && (
                      <div>
                        <h4 className="flex items-center text-xs font-bold text-foreground mb-1">
                          <Info className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                          Why it matters
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {issue.whyItMatters}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Fix */}
                  <div className="space-y-4 rounded-lg bg-background p-4 border shadow-sm text-xs">
                    <h4 className="flex items-center text-xs font-bold text-indigo-500">
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      How to fix it
                    </h4>
                    <p className="text-foreground leading-relaxed">
                      {issue.recommendation}
                    </p>
                    {issue.fixCode && (
                      <pre className="mt-3 overflow-x-auto rounded-md border bg-muted p-3 text-[10px] font-mono leading-normal">
                        <code>{issue.fixCode}</code>
                      </pre>
                    )}
                    {issue.affectedUrl && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1">Affected URL</p>
                        <a href={issue.affectedUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline break-all">
                          {issue.affectedUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
}
