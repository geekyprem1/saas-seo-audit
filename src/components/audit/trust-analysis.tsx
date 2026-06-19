"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ShieldCheck, AlertCircle } from "lucide-react";

interface TrustAnalysisProps {
  trustScore?: number;
  trustMetrics?: {
    hasTestimonials: boolean;
    hasLogos: boolean;
    hasCaseStudies: boolean;
    hasFounderInfo: boolean;
    hasSecurityBadges: boolean;
    hasPricing: boolean;
    hasFaq: boolean;
    hasContact: boolean;
    hasPrivacyPolicy: boolean;
    hasTermsOfService: boolean;
  };
  aiDataExtra?: {
    trustImprovements?: string[];
  };
}

export function TrustAnalysis({
  trustScore = 100,
  trustMetrics,
  aiDataExtra
}: TrustAnalysisProps) {
  const metrics = trustMetrics ?? {
    hasTestimonials: false,
    hasLogos: false,
    hasCaseStudies: false,
    hasFounderInfo: false,
    hasSecurityBadges: false,
    hasPricing: false,
    hasFaq: false,
    hasContact: false,
    hasPrivacyPolicy: false,
    hasTermsOfService: false,
  };

  const improvements = aiDataExtra?.trustImprovements ?? [
    "Place a headshot of the founder with a short personal note in the footer.",
    "Add security cert badges (SSL, GDPR, or SOC2) next to checkout CTAs.",
    "Embed real customer testimonials displaying name, title, and verified icon."
  ];

  const trustElements = [
    { key: "hasTestimonials", label: "Customer Testimonials", desc: "Quotes/reviews from users" },
    { key: "hasLogos", label: "Customer Logos", desc: "Logos of brands using your tool" },
    { key: "hasFounderInfo", label: "Founder Visibility", desc: "Founder name, headshot, or bio" },
    { key: "hasSecurityBadges", label: "Security Badges", desc: "GDPR, SOC2, SSL, or encryption mentions" },
    { key: "hasPricing", label: "Transparent Pricing", desc: "Billing amounts and plans shown" },
    { key: "hasFaq", label: "FAQ Section", desc: "Friction-reducing accordion section" },
    { key: "hasContact", label: "Support Contacts", desc: "Help email, form, or support link" },
    { key: "hasPrivacyPolicy", label: "Privacy Policy", desc: "Linked legal privacy document" },
    { key: "hasTermsOfService", label: "Terms of Service", desc: "Linked terms of service document" },
  ];

  const missingCount = trustElements.filter(e => !metrics[e.key as keyof typeof metrics]).length;

  return (
    <Card className="overflow-hidden border border-border bg-card">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Trust & Credibility Audit</CardTitle>
              <CardDescription>Inspecting reviews, security indicators, founder details, and legal pages</CardDescription>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold">{trustScore}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Summary Banner */}
        {missingCount > 0 && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3 items-center">
            <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your page is missing <strong className="text-foreground">{missingCount} out of {trustElements.length}</strong> core trust elements. B2B software buyers heavily scrutinize team identities, FAQs, and legal links.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Trust Check List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trust Element Checklist</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {trustElements.map((el) => {
                const detected = !!metrics[el.key as keyof typeof metrics];
                return (
                  <div key={el.key} className="flex items-start gap-2.5 p-3 rounded-lg border bg-muted/10">
                    {detected ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4.5 w-4.5 text-red-400 dark:text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-none">{el.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 truncate" title={el.desc}>{el.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recommended Trust Improvements</h4>
            <div className="space-y-2">
              {improvements.map((imp, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3 bg-muted/30 border border-border/60 rounded-lg text-xs">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 font-bold shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
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
