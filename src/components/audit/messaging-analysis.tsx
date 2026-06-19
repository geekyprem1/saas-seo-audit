"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info, MessageSquare, ShieldAlert } from "lucide-react";

interface MessagingAnalysisProps {
  headline?: string;
  subheadline?: string;
  copyAnalysis?: {
    whatProductDoes?: string;
    targetAudience?: string;
    whyDifferent?: string;
    clarityScore?: number;
    differentiationScore?: number;
  };
  aiDataExtra?: {
    differentiationRisk?: "High" | "Medium" | "Low";
    differentiationReason?: string;
  };
}

export function MessagingAnalysis({ 
  headline = "", 
  subheadline = "", 
  copyAnalysis = {}, 
  aiDataExtra = {} 
}: MessagingAnalysisProps) {
  const whatProductDoes = copyAnalysis.whatProductDoes ?? "A software product for automating workflows.";
  const targetAudience = copyAnalysis.targetAudience ?? "SaaS founders and developers.";
  const whyDifferent = copyAnalysis.whyDifferent ?? "Includes premium growth consulting logic built-in.";
  const clarityScore = copyAnalysis.clarityScore ?? 7;
  const differentiationScore = copyAnalysis.differentiationScore ?? 5;
  const diffRisk = aiDataExtra.differentiationRisk ?? "Medium";
  const diffReason = aiDataExtra.differentiationReason ?? "Messaging relies heavily on standard templates.";

  // Uncertainty trigger
  const isUnclear = clarityScore < 6 || differentiationScore < 5;

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 text-purple-500 rounded-md">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Messaging & Value Proposition Analysis</CardTitle>
            <CardDescription>How effectively does your landing page communicate what you do?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Uncertainty Warning */}
        {isUnclear && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3 items-start animate-in fade-in duration-300">
            <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-500">Uncertainty Alert</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                "We are not sure who this product is for." The positioning is overly generic and lacks clear differentiators. High-intent traffic is likely bouncing because the benefit isn't immediately obvious.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Headlines & Scores */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hero Section Headline</h3>
              <div className="p-4 rounded-lg bg-muted/40 border">
                <p className="font-semibold text-foreground text-base">
                  {headline || <span className="text-red-500 italic">No H1 Headline detected!</span>}
                </p>
                {headline && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Length: {headline.length} chars ({headline.length > 70 ? "Too long" : "Optimal length"})
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hero Subheadline</h3>
              <div className="p-4 rounded-lg bg-muted/40 border">
                <p className="text-sm text-foreground leading-relaxed">
                  {subheadline || <span className="text-muted-foreground italic">No H2 subheadline detected in top hero.</span>}
                </p>
              </div>
            </div>

            {/* Micro scores */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Clarity Score</span>
                  <span className="font-bold">{clarityScore} / 10</span>
                </div>
                <Progress value={clarityScore * 10} className="h-2 bg-muted [&>div]:bg-purple-500" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Differentiation Score</span>
                  <span className="font-bold">{differentiationScore} / 10</span>
                </div>
                <Progress value={differentiationScore * 10} className="h-2 bg-muted [&>div]:bg-purple-500" />
              </div>
            </div>
          </div>

          {/* Right Column: Value Prop & Competitor Risk */}
          <div className="space-y-6">
            <div className="rounded-xl border p-5 space-y-4 bg-muted/20">
              <h4 className="font-semibold text-sm border-b pb-2">Value Proposition Evaluation</h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-purple-400">What Product Does</p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{whatProductDoes}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-400">Who It Is For</p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{targetAudience}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-400">Why It Is Different</p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{whyDifferent}</p>
                </div>
              </div>
            </div>

            {/* Competitor Positioning Risk */}
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  Competitor Positioning Risk
                </h4>
                <Badge variant={diffRisk === "High" ? "destructive" : diffRisk === "Medium" ? "warning" : "secondary"}>
                  Risk: {diffRisk}
                </Badge>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Can this headline belong to 100 other SaaS products?
              </p>
              <p className="text-xs text-foreground leading-relaxed">
                {diffReason}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
