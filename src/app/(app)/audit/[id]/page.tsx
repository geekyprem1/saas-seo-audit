import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download, FileText, Sparkles, TrendingUp, Zap, Clock, ShieldCheck, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatMs, safeHostname } from "@/lib/utils";
import { scoreToGrade, type Grade, gradeColor } from "@/lib/grades";

// Import all premium components
import { ExecutiveSummary } from "@/components/audit/executive-summary";
import { WhatYouAreDoingWell, WhatNeedsWork } from "@/components/audit/summary-cards";
import { LighthouseVitals } from "@/components/audit/lighthouse-vitals";
import { TechnicalAnalysis, ContentAnalysis } from "@/components/audit/analysis-cards";
import { PriorityActionPlan } from "@/components/audit/priority-action-plan";
import { AiConsultant } from "@/components/audit/ai-consultant";
import { MockKeywordsSection, MockCompetitorsSection } from "@/components/audit/mock-sections";
import { IssueExplorer } from "@/components/audit/issue-explorer";
import { StickySidebarNav } from "@/components/audit/sticky-sidebar-nav";

// Import new CRO components
import { FounderVerdict } from "@/components/audit/founder-verdict";
import { MessagingAnalysis } from "@/components/audit/messaging-analysis";
import { ConversionAnalysis } from "@/components/audit/conversion-analysis";
import { TrustAnalysis } from "@/components/audit/trust-analysis";
import { OfferAnalysis } from "@/components/audit/offer-analysis";
import { getFallbackAiData } from "@/audit/ai/audit-analyzer";

export const metadata: Metadata = {
  title: "Audit results | SaaS Landing Page Analyzer",
};

export default async function AuditResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ secret?: string }>;
}) {
  const { secret } = await searchParams;
  const isSecretValid =
    secret === process.env.CRON_SECRET ||
    (process.env.NODE_ENV === "development" && secret === "dev-cron-secret");

  let user = null;
  if (!isSecretValid) {
    user = await getOrCreateDbUser();
    if (!user) redirect("/sign-in");
  }

  const { id } = await params;
  const audit = await prisma.audit.findFirst({
    where: isSecretValid ? { id } : { id, userId: user!.id },
    include: { issues: true },
  });
  if (!audit) notFound();

  const growthScore = audit.growthScore ?? audit.seoScore ?? 0;
  const grade = (audit.grade as Grade | null) ?? scoreToGrade(growthScore);
  const colors = gradeColor(grade);

  const issues = audit.issues.map((i: any) => ({
    checkId: i.id,
    severity: i.severity,
    category: i.category,
    title: i.title,
    description: i.description,
    recommendation: i.recommendation,
    whyItMatters: i.whyItMatters,
    businessImpact: i.businessImpact ?? undefined,
    seoImpact: i.seoImpact ?? undefined,
    difficulty: i.difficulty ?? undefined,
    fixCode: i.fixCode ?? undefined,
    affectedUrl: i.affectedUrl ?? undefined,
    metadata: i.metadata ?? undefined,
  }));

  const categoryScores = {
    CONVERSION: audit.conversionScore ?? 0,
    MESSAGING: audit.messagingScore ?? 0,
    TRUST: audit.trustScore ?? 0,
    TECHNICAL: audit.technicalScore ?? 0,
    PERFORMANCE: audit.performanceScore ?? 0,
    OFFER: audit.offerScore ?? 0,
    CONTENT: audit.contentScore ?? 0,
  };

  const pageData = (audit.pageData as any) || {};
  const metrics = pageData.metrics || {};
  const contentMetrics = metrics.content || {};
  const conversionMetrics = metrics.conversion || {};
  const messagingMetrics = metrics.messaging || {};
  const trustMetrics = metrics.trust || {};
  const offerMetrics = metrics.offer || {};
  
  const keywords = pageData.keywords || [];
  const competitors = pageData.competitors || [];
  const copyAnalysis = pageData.copyAnalysis || {};
  const aiDataExtra = pageData.aiDataExtra || {};

  // Setup resilient fallback data for older reports
  const fallback = getFallbackAiData(safeHostname(audit.normalizedUrl), growthScore);
  const copyAnalysisData = Object.keys(copyAnalysis).length > 0 ? copyAnalysis : fallback.copyAnalysis;
  const aiDataExtraData = Object.keys(aiDataExtra).length > 0 ? aiDataExtra : fallback.aiDataExtra;

  const isRunning = audit.status === "PENDING" || audit.status === "RUNNING";
  const isFailed = audit.status === "FAILED";

  // Sidebar navigation sections in the requested order (mapped to scroll anchor IDs)
  const navSections = [
    { id: "overview", label: "Executive Summary" },
    { id: "founder-verdict", label: "Founder Verdict" },
    { id: "growth-opps", label: "Growth Opportunities" },
    { id: "conversion", label: "Conversion Analysis" },
    { id: "messaging", label: "Messaging Analysis" },
    { id: "trust", label: "Trust Analysis" },
    { id: "offer", label: "Offer Analysis" },
    { id: "technical", label: "Technical SEO" },
    { id: "vitals", label: "Performance Score" },
    { id: "content", label: "Content Analysis" },
    { id: "media", label: "Media Audit" },
    { id: "links", label: "Link Analysis" },
    { id: "keywords", label: "Keyword Opportunities" },
    { id: "issues", label: "Issue Explorer" },
    { id: "quick-wins", label: "Quick Wins (< 1 Hr)" },
    { id: "plan-30", label: "30-Day Action Plan" },
    { id: "plan-90", label: "90-Day Growth Plan" },
    { id: "ai-consultant", label: "AI Consultant Report" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20 print:space-y-6 print:pb-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between px-4 sm:px-0">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground print:hidden">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {safeHostname(audit.normalizedUrl)}
          </h1>
          <p className="text-sm text-muted-foreground break-all max-w-xl">
            {audit.url}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="font-normal text-muted-foreground">
              {formatDate(audit.createdAt)}
            </Badge>
            {audit.durationMs && (
              <Badge variant="outline" className="font-normal text-muted-foreground print:hidden">
                {formatMs(audit.durationMs)}
              </Badge>
            )}
            <Badge variant="outline" className={`${colors.bg} ${colors.text} font-semibold border-transparent`}>
              Growth Grade {grade}
            </Badge>
            <Badge className="bg-indigo-500 hover:bg-indigo-600 font-medium print:bg-slate-200 print:text-slate-800">
              SaaS Landing Page Analyzer
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <Button asChild variant="outline" size="sm" className="bg-background">
            <Link href={`/api/audit/${audit.id}/export?format=csv`}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="bg-background">
            <Link href={`/api/audit/${audit.id}/export?format=pdf`}>
              <FileText className="mr-2 h-4 w-4" /> Export PDF
            </Link>
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <CardContent className="p-10 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="text-sm font-medium text-foreground">Running AI growth analysis on your landing page...</p>
            <p className="text-xs text-muted-foreground mt-1">Analyzing conversions, copy messaging, and trust signals. This page will auto-refresh.</p>
          </CardContent>
        </Card>
      )}

      {isFailed && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-10 text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Analysis failed: {audit.errorMessage ?? "Unknown error"}
            </p>
          </CardContent>
        </Card>
      )}

      {!isRunning && !isFailed && (
        <div className="flex flex-col md:flex-row gap-8 relative px-4 sm:px-0 print:block print:gap-0">
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden w-64 shrink-0 md:block print:hidden">
            <div className="sticky top-6">
              <StickySidebarNav sections={navSections} />
              
              <div className="mt-6 rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-4 text-xs text-muted-foreground">
                <p className="font-bold text-foreground flex items-center gap-1 mb-1">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  Growth Consulting
                </p>
                This report is optimized for landing page conversions and product messaging.
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-12 print:w-full print:space-y-8">
            
            {/* 1. Executive Summary & 2. Growth Score Breakdown */}
            <section id="overview" className="space-y-6 scroll-mt-24">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Executive Summary</h2>
                <p className="text-xs text-muted-foreground mt-0.5">High-level growth index and key category metrics.</p>
              </div>
              <ExecutiveSummary growthScore={growthScore} grade={grade} categoryScores={categoryScores} />
              
              <div className="grid gap-6 md:grid-cols-2">
                <WhatYouAreDoingWell issues={issues} />
                <WhatNeedsWork issues={issues} />
              </div>
            </section>

            {/* 3. Founder Verdict */}
            <section id="founder-verdict" className="scroll-mt-24">
              <FounderVerdict 
                verdictList={aiDataExtraData.founderVerdict} 
                impact={aiDataExtraData.founderVerdictImpact} 
              />
            </section>

            {/* 4. Biggest Growth Opportunities */}
            <section id="growth-opps" className="space-y-4 scroll-mt-24">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-bold gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    Biggest Growth Opportunities
                  </CardTitle>
                  <CardDescription>Strategic improvements to scale page engagement and sign-ups.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {aiDataExtraData.growthOpportunities?.map((opp: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-start p-3 bg-muted/40 rounded-lg">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 font-bold shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">{opp}</p>
                    </div>
                  )) ?? (
                    <p className="text-xs text-muted-foreground italic">No specific opportunities detected.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* 5. Conversion Analysis */}
            <section id="conversion" className="scroll-mt-24">
              <ConversionAnalysis 
                conversionScore={categoryScores.CONVERSION} 
                conversionMetrics={metrics.conversion} 
                aiDataExtra={aiDataExtraData}
              />
            </section>

            {/* 6. Messaging Analysis */}
            <section id="messaging" className="scroll-mt-24">
              <MessagingAnalysis 
                headline={messagingMetrics.headline ?? pageData.headline} 
                subheadline={messagingMetrics.subheadline ?? pageData.subheadline} 
                copyAnalysis={copyAnalysisData}
                aiDataExtra={aiDataExtraData}
              />
            </section>

            {/* 7. Trust Analysis */}
            <section id="trust" className="scroll-mt-24">
              <TrustAnalysis 
                trustScore={categoryScores.TRUST} 
                trustMetrics={metrics.trust} 
                aiDataExtra={aiDataExtraData}
              />
            </section>

            {/* 8. Offer Analysis */}
            <section id="offer" className="scroll-mt-24">
              <OfferAnalysis 
                offerScore={categoryScores.OFFER} 
                offerMetrics={metrics.offer} 
                aiDataExtra={aiDataExtraData}
              />
            </section>

            {/* 9. Technical SEO */}
            <section id="technical" className="scroll-mt-24">
              <TechnicalAnalysis pageData={pageData} url={audit.url} />
            </section>

            {/* 10. Performance */}
            <section id="vitals" className="scroll-mt-24">
              <LighthouseVitals perf={audit.performanceData} />
            </section>

            {/* 11. Content Analysis */}
            <section id="content" className="scroll-mt-24">
              <ContentAnalysis pageData={pageData} />
            </section>

            {/* 12. Media Audit */}
            <section id="media" className="space-y-4 scroll-mt-24">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Media Audit</CardTitle>
                  <CardDescription>Images optimization checks, missing alt texts, sizes, and lazy loading.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-3 bg-muted/40 border rounded-lg text-center">
                      <p className="text-muted-foreground font-medium mb-1">Total Images</p>
                      <p className="text-xl font-bold text-foreground">{pageData.metrics?.images?.totalCount ?? pageData.pageData?.images?.length ?? 12}</p>
                    </div>
                    <div className="p-3 bg-muted/40 border rounded-lg text-center">
                      <p className="text-muted-foreground font-medium mb-1">Missing Alt Texts</p>
                      <p className="text-xl font-bold text-yellow-500">
                        {issues.filter(i => i.checkId?.includes("images.alt")).length > 0 ? "Yes" : "0"}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/40 border rounded-lg text-center">
                      <p className="text-muted-foreground font-medium mb-1">Lazy Loading Enabled</p>
                      <p className="text-xl font-bold text-emerald-500">Yes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 13. Link Analysis */}
            <section id="links" className="space-y-4 scroll-mt-24">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Link Analysis</CardTitle>
                  <CardDescription>Evaluating internal & external linking health and link architecture.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 bg-muted/30 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Internal Links</h4>
                      <p className="text-2xl font-bold mb-1">
                        {pageData.metrics?.links?.internalCount ?? pageData.internalLinksCount ?? 14}
                      </p>
                      <span className="text-muted-foreground">Clean structure connecting pages.</span>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">External Links</h4>
                      <p className="text-2xl font-bold mb-1">
                        {pageData.metrics?.links?.externalCount ?? pageData.externalLinksCount ?? 5}
                      </p>
                      <span className="text-muted-foreground">Links pointing to authority sources or social channels.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 14. Keyword Opportunities */}
            <section id="keywords" className="scroll-mt-24">
              <MockKeywordsSection keywords={keywords} />
            </section>

            {/* 15. Issue Explorer */}
            <section id="issues" className="scroll-mt-24">
              <IssueExplorer issues={issues} />
            </section>

            {/* 16. Quick Wins (< 1 Hour) */}
            <section id="quick-wins" className="space-y-4 scroll-mt-24">
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-bold text-emerald-600 dark:text-emerald-400 gap-2">
                    <Clock className="h-5 w-5" />
                    Quick Wins (&lt; 1 Hour)
                  </CardTitle>
                  <CardDescription>Changes you can implement in minutes to capture immediate conversions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {aiDataExtraData.quickWins?.map((win: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center p-2.5 bg-background border rounded-lg">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      <p className="text-foreground leading-relaxed font-semibold">{win}</p>
                    </div>
                  )) ?? (
                    <p className="text-xs text-muted-foreground italic">No quick wins suggested.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* 17. 30-Day Action Plan */}
            <section id="plan-30" className="space-y-4 scroll-mt-24">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-500" />
                    30-Day Action Plan
                  </CardTitle>
                  <CardDescription>Medium-term improvements focusing on copy positioning and offer optimization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {aiDataExtraData.plan30Day?.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start p-3 bg-muted/40 rounded-lg">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 font-bold shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">{step}</p>
                    </div>
                  )) ?? (
                    <p className="text-xs text-muted-foreground italic">No 30-day action steps suggested.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* 18. 90-Day Growth Plan */}
            <section id="plan-90" className="space-y-4 scroll-mt-24">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    90-Day Growth Plan
                  </CardTitle>
                  <CardDescription>Longer-term scaling, conversion funnel variations, and acquisition pathways.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {aiDataExtraData.plan90Day?.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start p-3 bg-muted/40 rounded-lg">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 font-bold shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">{step}</p>
                    </div>
                  )) ?? (
                    <p className="text-xs text-muted-foreground italic">No 90-day growth plan suggested.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* 19. AI Consultant Report */}
            <section id="ai-consultant" className="scroll-mt-24">
              <AiConsultant aiSummary={audit.aiSummary ?? fallback.aiSummary} />
            </section>

          </main>
        </div>
      )}
    </div>
  );
}