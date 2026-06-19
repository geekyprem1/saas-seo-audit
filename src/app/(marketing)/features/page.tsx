import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "Features — SaaS SEO Audit",
  description:
    "Every check, score, and recommendation that powers SaaS SEO Audit.",
};

const SECTIONS = [
  {
    title: "Technical SEO",
    body: "Crawlability, indexability, redirects, sitemap, robots.txt, HTTPS, mobile friendliness, and schema markup.",
    items: [
      "HTTPS and SSL certificate validation",
      "Sitemap.xml presence and validity",
      "Robots.txt directives and crawl rules",
      "Redirect chain detection (up to 5 hops)",
      "Canonical URL configuration",
      "Mobile viewport and tap-target analysis",
    ],
  },
  {
    title: "On-page SEO",
    body: "The signals that decide whether you rank for a given query.",
    items: [
      "Title length and keyword placement",
      "Meta description quality and length",
      "H1 / H2 / H3 hierarchy",
      "Open Graph and Twitter card completeness",
      "Internal and external link analysis",
      "Image alt text coverage",
    ],
  },
  {
    title: "Performance",
    body: "Real Core Web Vitals pulled live from Google's PageSpeed Insights API.",
    items: [
      "Largest Contentful Paint (LCP)",
      "First Contentful Paint (FCP)",
      "Cumulative Layout Shift (CLS)",
      "Time to First Byte (TTFB)",
      "Performance score (0–100)",
      "Mobile-first metrics",
    ],
  },
  {
    title: "AI Recommendations",
    body: "Every issue is rewritten by Gemini 2.5 Flash with a DeepSeek fallback so founders actually ship the fix.",
    items: [
      "Plain-English impact for every issue",
      "Actionable, prioritized fix instructions",
      "Optional copy-paste code snippets",
      "Severity tagging (Critical, High, Medium, Low)",
      "Redis-cached to control API spend",
      "Batched for sub-30s turnarounds",
    ],
  },
  {
    title: "Reports & History",
    body: "Stop losing audits in Slack DMs. Keep them, share them, ship them.",
    items: [
      "Audit history with search and filter",
      "CSV exports of every issue",
      "PDF exports with branded cover page",
      "Re-run audits in one click",
      "SEO score trend over time",
      "Shareable audit links",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Every check your SaaS needs to rank
            </h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              We crawl, score, and recommend. You ship the fixes.
            </p>
          </div>
          <div className="mt-16 space-y-12">
            {SECTIONS.map((section, idx) => (
              <div
                key={section.title}
                className={`grid gap-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 lg:grid-cols-2 ${
                  idx % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-[var(--muted-foreground)]">
                    {section.body}
                  </p>
                </div>
                <ul className="space-y-3 text-sm">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button asChild size="lg">
              <Link href="/audit/new">
                Run your first audit
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}