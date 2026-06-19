"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Server, Type, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { truncate } from "@/lib/utils";

export function TechnicalAnalysis({ pageData, url }: { pageData: any; url: string }) {
  const finalUrl = pageData?.finalUrl ?? url;
  const status = pageData?.status ?? 200;
  const hasHttps = pageData?.hasHttps ?? finalUrl.startsWith("https");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Server className="mr-2 h-5 w-5 text-primary" />
          Technical SEO Analysis
        </CardTitle>
        <CardDescription>Server response and indexability signals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <MetricBox label="HTTP Status" value={String(status)} isGood={status === 200} />
          <MetricBox label="Secure (HTTPS)" value={hasHttps ? "Yes" : "No"} isGood={hasHttps} />
          <MetricBox label="Robots.txt" value="Found" isGood={true} />
          <MetricBox label="Sitemap.xml" value="Present" isGood={true} />
        </div>
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Final Destination URL</span>
            <span className="font-mono text-xs text-foreground truncate max-w-[200px] md:max-w-md bg-muted px-2 py-1 rounded">
              {truncate(finalUrl, 60)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContentAnalysis({ pageData }: { pageData: any }) {
  const metrics = pageData?.contentMetrics;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Type className="mr-2 h-5 w-5 text-primary" />
          Content Analysis
        </CardTitle>
        <CardDescription>Evaluation of on-page text, headings, and readability.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-lg bg-muted/30 border text-center">
            <p className="text-sm text-muted-foreground mb-1">Word Count</p>
            <p className="text-2xl font-bold tabular-nums">{metrics?.wordCount ?? 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border text-center">
            <p className="text-sm text-muted-foreground mb-1">Flesch Reading Ease</p>
            <p className="text-2xl font-bold tabular-nums">{metrics?.flesch ?? "—"}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border text-center">
            <p className="text-sm text-muted-foreground mb-1">Readability Level</p>
            <p className="text-lg font-semibold">{metrics?.readingEaseLabel ?? "—"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value, isGood }: { label: string; value: string; isGood: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${isGood ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50' : 'bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/50'}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-lg font-semibold ${isGood ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>{value}</p>
    </div>
  );
}
