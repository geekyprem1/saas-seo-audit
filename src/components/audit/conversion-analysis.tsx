"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Zap, Target, Layout, MoveRight } from "lucide-react";

interface ConversionAnalysisProps {
  conversionScore?: number;
  conversionMetrics?: {
    ctas: Array<{
      text: string;
      href: string;
      tag: string;
      isPrimary: boolean;
    }>;
    hasCtaAboveFold: boolean;
    ctaCount: number;
    hasContrastCta: boolean;
  };
  aiDataExtra?: {
    conversionOpportunities?: string[];
  };
}

export function ConversionAnalysis({
  conversionScore = 100,
  conversionMetrics,
  aiDataExtra
}: ConversionAnalysisProps) {
  const metrics = conversionMetrics ?? {
    ctas: [],
    hasCtaAboveFold: false,
    ctaCount: 0,
    hasContrastCta: false,
  };

  const opportunities = aiDataExtra?.conversionOpportunities ?? [
    "Place a primary CTA ('Start Free Trial') in the center of the hero section.",
    "Repeat the call-to-action in a floating header or bottom banner.",
    "Use a contrasting button color that stands out from the page theme."
  ];

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-md">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Conversion & CTA Analysis</CardTitle>
              <CardDescription>Evaluating CTA visibility, wordings, and placement on the page</CardDescription>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold">{conversionScore}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Core CTA Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-muted/10">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CTA Count</p>
                <p className="text-2xl font-bold mt-1">{metrics.ctaCount}</p>
              </div>
              <Badge variant={metrics.ctaCount > 1 ? "secondary" : "destructive"}>
                {metrics.ctaCount === 0 ? "None" : metrics.ctaCount === 1 ? "Too Few" : "Optimal"}
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/10">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Above the Fold</p>
                <p className="text-sm font-semibold mt-1">
                  {metrics.hasCtaAboveFold ? "Visible instantly" : "Hidden below fold"}
                </p>
              </div>
              {metrics.hasCtaAboveFold ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/10">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visual Contrast</p>
                <p className="text-sm font-semibold mt-1">
                  {metrics.hasContrastCta ? "High Contrast" : "Low Contrast"}
                </p>
              </div>
              {metrics.hasContrastCta ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-500 shrink-0" />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed CTA Table/List */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Target className="h-4 w-4" />
              Detected Action Buttons & Links
            </h4>
            
            {metrics.ctas.length === 0 ? (
              <div className="border border-dashed p-8 text-center rounded-lg text-xs text-muted-foreground">
                No buttons matching CTA patterns were detected on the page.
              </div>
            ) : (
              <div className="divide-y rounded-lg border bg-muted/20 overflow-hidden">
                {metrics.ctas.map((cta, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-foreground break-words">"{cta.text}"</span>
                      {cta.href && (
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5" title={cta.href}>
                          {cta.href}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 ml-4 shrink-0">
                      <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">&lt;{cta.tag}&gt;</code>
                      {cta.isPrimary && (
                        <Badge className="bg-emerald-500 text-white text-[9px] hover:bg-emerald-600 font-bold uppercase">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Opportunities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Layout className="h-4 w-4" />
              Recommended CTA Improvements
            </h4>
            <div className="space-y-2">
              {opportunities.map((opp, idx) => (
                <div key={idx} className="flex gap-2 items-start p-3 bg-muted/40 rounded-lg text-xs">
                  <MoveRight className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-foreground leading-relaxed font-medium">
                    {opp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
