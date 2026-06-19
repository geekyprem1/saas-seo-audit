"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatMs } from "@/lib/utils";
import { Smartphone, Monitor } from "lucide-react";

export function LighthouseVitals({ perf }: { perf: any }) {
  if (!perf || typeof perf.score !== "number") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
          <CardDescription>Performance data unavailable</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const score = perf.score;
  const isMobile = perf.source === "mobile";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Core Web Vitals</CardTitle>
            <CardDescription>Simulated Lighthouse performance metrics</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-md text-xs">
            {isMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
            <span>{isMobile ? "Mobile" : "Desktop"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-muted/10">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-muted">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * score) / 100}
                  className={`transition-all duration-1000 ${
                    score >= 90 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-500"
                  }`}
                />
              </svg>
              <div className="text-center">
                <span className="text-3xl font-bold">{score}</span>
              </div>
            </div>
            <p className="mt-4 font-medium text-sm text-center">Performance Score</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <VitalMetric 
              label="Largest Contentful Paint (LCP)" 
              abbr="LCP"
              value={perf.lcp} 
              format={(v) => formatMs(v)}
              goodMax={2500} 
              needsImprovementMax={4000} 
            />
            <VitalMetric 
              label="Cumulative Layout Shift (CLS)" 
              abbr="CLS"
              value={perf.cls} 
              format={(v) => v.toFixed(2)}
              goodMax={0.1} 
              needsImprovementMax={0.25} 
            />
            <VitalMetric 
              label="First Contentful Paint (FCP)" 
              abbr="FCP"
              value={perf.fcp} 
              format={(v) => formatMs(v)}
              goodMax={1800} 
              needsImprovementMax={3000} 
            />
            <VitalMetric 
              label="Time to First Byte (TTFB)" 
              abbr="TTFB"
              value={perf.ttfb} 
              format={(v) => formatMs(v)}
              goodMax={800} 
              needsImprovementMax={1800} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VitalMetric({ 
  label, 
  abbr,
  value, 
  format, 
  goodMax, 
  needsImprovementMax 
}: { 
  label: string; 
  abbr: string;
  value: number | null | undefined; 
  format: (v: number) => string;
  goodMax: number; 
  needsImprovementMax: number;
}) {
  if (value == null) return null;

  let status = "good";
  if (value > needsImprovementMax) status = "poor";
  else if (value > goodMax) status = "needs-improvement";

  const colorClass = 
    status === "good" ? "text-emerald-500 bg-emerald-500/20" : 
    status === "needs-improvement" ? "text-amber-500 bg-amber-500/20" : 
    "text-red-500 bg-red-500/20";

  const bgClass = 
    status === "good" ? "bg-emerald-500" : 
    status === "needs-improvement" ? "bg-amber-500" : 
    "bg-red-500";

  // Calculate percentage for the bar (cap at 100%, poor usually means bar is full)
  // We'll make the poor threshold = 80% of the bar.
  const barMax = needsImprovementMax * 1.5;
  const pct = Math.min(100, Math.max(5, (value / barMax) * 100));

  return (
    <div className="flex flex-col justify-center p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-2 w-2 rounded-full ${bgClass}`} />
          <span className="font-semibold text-sm" title={label}>{abbr}</span>
        </div>
        <span className="font-mono text-sm">{format(value)}</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${bgClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
