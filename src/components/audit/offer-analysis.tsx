"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Gift, Info, Check, ShieldAlert } from "lucide-react";

interface OfferAnalysisProps {
  offerScore?: number;
  offerMetrics?: {
    offerType: "Free Trial" | "Free Plan" | "Demo" | "Waitlist" | "Unknown";
    pricingVisible: boolean;
    hasRiskReversal: boolean;
    hasGuarantee: boolean;
    hasNoCcRequired: boolean;
  };
  aiDataExtra?: {
    growthOpportunities?: string[];
  };
}

export function OfferAnalysis({
  offerScore = 100,
  offerMetrics,
  aiDataExtra
}: OfferAnalysisProps) {
  const metrics = offerMetrics ?? {
    offerType: "Unknown" as const,
    pricingVisible: false,
    hasRiskReversal: false,
    hasGuarantee: false,
    hasNoCcRequired: false,
  };

  const improvements = [
    metrics.offerType === "Unknown" 
      ? "Choose a clear entry offer type (e.g. Free Trial or Freemium Plan) rather than leaving the pricing call vague."
      : null,
    !metrics.pricingVisible
      ? "Publish pricing plans or a transparent tier comparison grid immediately to prevent friction."
      : null,
    !metrics.hasRiskReversal
      ? "Add a 'Cancel anytime' or 'No Credit Card Required' micro-copy near your registration forms."
      : null,
    !metrics.hasGuarantee
      ? "Integrate a '30-day money-back guarantee' badge to eliminate checkout hesitation."
      : null,
    "Introduce a tier that specifically caters to Indie Hackers or early-stage builders (e.g., a low-cost starter plan)."
  ].filter(Boolean) as string[];

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-500/10 text-pink-500 rounded-md">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Offer & Risk Reversal Analysis</CardTitle>
              <CardDescription>Evaluating the strength, friction, pricing transparency, and guarantees of your offer</CardDescription>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold">{offerScore}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Core Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="bg-muted/10">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Offer Model</span>
              <p className="text-lg font-bold mt-2 text-foreground">{metrics.offerType}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/10">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Transparent Pricing</span>
              <div className="flex items-center gap-2 mt-2">
                {metrics.pricingVisible ? (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold">Visible</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                    <span className="text-sm font-semibold">Hidden</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/10">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Risk Reversal</span>
              <div className="flex items-center gap-2 mt-2">
                {metrics.hasRiskReversal ? (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                    <span className="text-sm font-semibold">Missing</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/10">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Refund Guarantees</span>
              <div className="flex items-center gap-2 mt-2">
                {metrics.hasGuarantee ? (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold">Yes</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4.5 w-4.5 text-yellow-500 shrink-0" />
                    <span className="text-sm font-semibold">No</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Offer Details */}
          <div className="space-y-4 rounded-xl border p-5 bg-muted/20">
            <h4 className="font-bold text-sm border-b pb-2">Offer Characteristics</h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">pricing plan transparency</span>
                <span className="font-semibold text-foreground">{metrics.pricingVisible ? "Verified Transparent" : "Obscured / Missing"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Satisfaction Guarantee</span>
                <span className="font-semibold text-foreground">{metrics.hasGuarantee ? "Detected" : "Not Detected"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">No-Card Signup microcopy</span>
                <span className="font-semibold text-foreground">{metrics.hasNoCcRequired ? "Detected" : "Not Detected"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">General Commitment Risk</span>
                <Badge variant={metrics.hasRiskReversal ? "secondary" : "destructive"}>
                  {metrics.hasRiskReversal ? "Low Risk" : "High Commitment Risk"}
                </Badge>
              </li>
            </ul>
          </div>

          {/* Offer Improvements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Actionable Offer Improvements</h4>
            <div className="space-y-2">
              {improvements.map((imp, idx) => (
                <div key={idx} className="flex gap-2 items-start p-3 bg-muted/40 rounded-lg text-xs">
                  <Check className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                  <p className="text-foreground leading-relaxed font-medium">
                    {imp}
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
