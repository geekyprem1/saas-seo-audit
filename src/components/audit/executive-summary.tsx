"use client";

import * as React from "react";
import { ScoreRing } from "./score-ring";
import { ScoreBreakdown } from "./score-breakdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Grade } from "@/lib/grades";
import { Gauge, Zap, Search, LayoutTemplate, Activity } from "lucide-react";

export interface ExecutiveSummaryProps {
  seoScore: number;
  grade: Grade;
  categoryScores: {
    TECHNICAL: number;
    ON_PAGE: number;
    PERFORMANCE: number;
    CONTENT: number;
    ACCESSIBILITY: number;
  };
}

export function ExecutiveSummary({ seoScore, grade, categoryScores }: ExecutiveSummaryProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Score */}
      <Card className="col-span-full lg:col-span-1 border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="flex h-full flex-col items-center justify-center py-8">
          <ScoreRing score={seoScore} grade={grade} size={160} />
          <h2 className="mt-4 text-center font-semibold text-lg">Overall SEO Score</h2>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Based on {Object.keys(categoryScores).length} core metrics
          </p>
        </CardContent>
      </Card>

      {/* Sub-scores Grid */}
      <div className="col-span-full lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard 
          title="Technical SEO" 
          score={categoryScores.TECHNICAL} 
          icon={<Gauge className="h-5 w-5 text-blue-500" />} 
          description="Indexability, sitemap, robots.txt"
        />
        <MetricCard 
          title="Content Analysis" 
          score={categoryScores.CONTENT} 
          icon={<FileTextIcon className="h-5 w-5 text-purple-500" />} 
          description="Word count, readability, headings"
        />
        <MetricCard 
          title="On-Page SEO" 
          score={categoryScores.ON_PAGE} 
          icon={<Search className="h-5 w-5 text-orange-500" />} 
          description="Meta tags, canonicals, OG tags"
        />
        <MetricCard 
          title="Performance" 
          score={categoryScores.PERFORMANCE} 
          icon={<Zap className="h-5 w-5 text-yellow-500" />} 
          description="Core Web Vitals & speed"
        />
      </div>
    </div>
  );
}

function MetricCard({ title, score, icon, description }: { title: string; score: number; icon: React.ReactNode; description: string }) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-md">{icon}</div>
            <div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold tabular-nums leading-none">{score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                score >= 90 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
