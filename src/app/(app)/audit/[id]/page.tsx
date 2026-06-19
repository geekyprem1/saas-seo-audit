import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrCreateDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatMs, safeHostname } from "@/lib/utils";
import { scoreToGrade, type Grade, gradeColor } from "@/lib/grades";

// Import all new components
import { ExecutiveSummary } from "@/components/audit/executive-summary";
import { WhatYouAreDoingWell, WhatNeedsWork } from "@/components/audit/summary-cards";
import { LighthouseVitals } from "@/components/audit/lighthouse-vitals";
import { TechnicalAnalysis, ContentAnalysis } from "@/components/audit/analysis-cards";
import { PriorityActionPlan } from "@/components/audit/priority-action-plan";
import { AiConsultant } from "@/components/audit/ai-consultant";
import { MockKeywordsSection, MockCompetitorsSection, MockCopyAnalysisSection } from "@/components/audit/mock-sections";
import { IssueExplorer } from "@/components/audit/issue-explorer";
import { StickySidebarNav } from "@/components/audit/sticky-sidebar-nav";

export const metadata: Metadata = {
  title: "Audit results",
};

export default async function AuditResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const audit = await prisma.audit.findFirst({
    where: { id, userId: user.id },
    include: { issues: true },
  });
  if (!audit) notFound();

  const seoScore = audit.seoScore ?? 0;
  const grade = (audit.grade as Grade | null) ?? scoreToGrade(seoScore);
  const colors = gradeColor(grade);

  const issues = audit.issues.map((i: any) => ({
    checkId: i.title,
    severity: i.severity,
    category: i.category,
    title: i.title,
    description: i.description,
    recommendation: i.recommendation,
    whyItMatters: i.whyItMatters,
    fixCode: i.fixCode ?? undefined,
    affectedUrl: i.affectedUrl ?? undefined,
    metadata: i.metadata ?? undefined,
  }));

  const categoryScores = {
    TECHNICAL: audit.technicalScore ?? 0,
    ON_PAGE: audit.onPageScore ?? 0,
    PERFORMANCE: audit.performanceScore ?? 0,
    CONTENT: audit.contentScore ?? 0,
    ACCESSIBILITY: audit.accessibilityScore ?? 0,
  };

  const pageData = (audit.pageData as any) || {};
  const keywords = pageData.keywords || [];
  const competitors = pageData.competitors || [];
  const copyAnalysis = pageData.copyAnalysis || null;

  const isRunning = audit.status === "PENDING" || audit.status === "RUNNING";
  const isFailed = audit.status === "FAILED";

  const navSections = [
    { id: "overview", label: "Executive Summary" },
    { id: "action-plan", label: "Priority Action Plan" },
    { id: "ai-consultant", label: "AI Consultant" },
    { id: "vitals", label: "Core Web Vitals" },
    { id: "technical", label: "Technical SEO" },
    { id: "content", label: "Content Analysis" },
    { id: "keywords", label: "Keyword Opportunities" },
    { id: "copy", label: "Copy & Messaging" },
    { id: "competitors", label: "Competitor Comparison" },
    { id: "issues", label: "Issue Explorer" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between px-4 sm:px-0">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
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
              <Badge variant="outline" className="font-normal text-muted-foreground">
                {formatMs(audit.durationMs)}
              </Badge>
            )}
            <Badge variant="outline" className={`${colors.bg} ${colors.text} font-semibold border-transparent`}>
              Grade {grade}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="bg-background">
            <Link href={`/api/audit/${audit.id}/export?format=csv`}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Link>
          </Button>
          <Button variant="outline" size="sm" disabled title="PDF export ships in milestone 10" className="bg-background">
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-10 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-medium">Your premium audit is running...</p>
            <p className="text-xs text-muted-foreground mt-1">This page will automatically refresh.</p>
          </CardContent>
        </Card>
      )}

      {isFailed && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-10 text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Audit failed: {audit.errorMessage ?? "Unknown error"}
            </p>
          </CardContent>
        </Card>
      )}

      {!isRunning && !isFailed && (
        <div className="flex flex-col md:flex-row gap-8 relative px-4 sm:px-0">
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden w-64 shrink-0 md:block">
            <StickySidebarNav sections={navSections} />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-12">
            
            {/* 1. Executive Summary */}
            <section id="overview" className="space-y-6 scroll-mt-24">
              <ExecutiveSummary seoScore={seoScore} grade={grade} categoryScores={categoryScores} />
              
              <div className="grid gap-6 md:grid-cols-2">
                <WhatYouAreDoingWell issues={issues} />
                <WhatNeedsWork issues={issues} />
              </div>
            </section>

            {/* 2. Priority Action Plan */}
            <section id="action-plan" className="space-y-4 scroll-mt-24">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Priority Action Plan</h2>
                <p className="text-muted-foreground">Focus on these tasks first to maximize ROI.</p>
              </div>
              <PriorityActionPlan issues={issues} />
            </section>

            {/* 3. AI Consultant */}
            <section id="ai-consultant" className="space-y-4 scroll-mt-24">
              <AiConsultant aiSummary={audit.aiSummary} />
            </section>

            {/* 4. Core Web Vitals */}
            <section id="vitals" className="scroll-mt-24">
              <LighthouseVitals perf={audit.performanceData} />
            </section>

            {/* 5. Technical SEO & Content */}
            <div className="grid gap-6 md:grid-cols-2">
              <section id="technical" className="scroll-mt-24">
                <TechnicalAnalysis pageData={audit.pageData} url={audit.url} />
              </section>
              
              <section id="content" className="scroll-mt-24">
                <ContentAnalysis pageData={audit.pageData} />
              </section>
            </div>

            {/* 6. Mocked Premium Features */}
            <section id="keywords" className="scroll-mt-24">
              <MockKeywordsSection keywords={keywords} />
            </section>

            <section id="copy" className="scroll-mt-24">
              <MockCopyAnalysisSection copyAnalysis={copyAnalysis} />
            </section>

            <section id="competitors" className="scroll-mt-24">
              <MockCompetitorsSection competitors={competitors} />
            </section>

            {/* 7. Issue Explorer */}
            <section id="issues" className="scroll-mt-24">
              <IssueExplorer issues={issues} />
            </section>

          </main>
        </div>
      )}
    </div>
  );
}