import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search, Zap, BarChart3, Sparkles, FileDown, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { AuditForm } from "@/components/audit/audit-form";

export const metadata: Metadata = {
  title: "SaaS SEO Audit — Grow Your SaaS with Organic Traffic",
  description:
    "Get a complete SEO audit in seconds. Discover exactly what is holding your SaaS rankings back and what to fix first.",
};

const FEATURES = [
  {
    icon: Search,
    title: "Technical SEO Analysis",
    body: "HTTPS, sitemap, robots, redirects, canonical, mobile-friendliness — checked in one crawl.",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    body: "Every issue comes with a plain-English fix written by Gemini 2.5 Flash and DeepSeek fallback.",
  },
  {
    icon: BarChart3,
    title: "Competitor Tracking",
    body: "Compare your title, meta, headings, word count, and links against three competitors side-by-side.",
  },
  {
    icon: Zap,
    title: "Performance Score",
    body: "Live LCP, FCP, CLS, and TTFB pulled straight from the Google PageSpeed Insights API.",
  },
  {
    icon: FileDown,
    title: "PDF & CSV Reports",
    body: "Export white-label-ready reports for clients, partners, or your investors.",
  },
  {
    icon: History,
    title: "Audit History",
    body: "Track SEO improvements over time. Re-run audits in one click and watch the score climb.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We went from page 3 to page 1 for our highest-intent keyword in six weeks. The AI recommendations were the unlock.",
    name: "Maya Chen",
    role: "Founder, Linearstack",
  },
  {
    quote:
      "I stopped guessing what to fix next. The audit tells me the three things that move the needle, in order.",
    name: "Daniel Park",
    role: "Head of Growth, Quartzly",
  },
  {
    quote:
      "We audit 40 client sites a month. The white-label PDF alone pays for the Agency plan ten times over.",
    name: "Sofia Russo",
    role: "SEO Lead, Northbeam Studio",
  },
];

const FAQS = [
  {
    q: "How long does an audit take?",
    a: "Most audits finish in 20–40 seconds. We crawl the page, run checks, fetch PageSpeed metrics, and enrich every issue with AI guidance.",
  },
  {
    q: "Do you store the HTML of my site?",
    a: "Only on paid plans and only for the duration needed to generate and review your report. We never sell or share site data.",
  },
  {
    q: "Which AI models power the recommendations?",
    a: "Gemini 2.5 Flash by default, with DeepSeek V4 Flash as an automatic fallback if the primary model is rate-limited.",
  },
  {
    q: "Can I run audits without signing up?",
    a: "Yes — the first audit is fully anonymous. Sign up free to keep your results, track history, and unlock the AI recommendations.",
  },
  {
    q: "How accurate is the performance score?",
    a: "We use Google's official PageSpeed Insights API with mobile-first metrics, the same data Google uses for ranking signals.",
  },
  {
    q: "Do you support competitor analysis?",
    a: "Competitor comparison ships on the Pro plan. You can compare up to three competitors on title length, meta, headings, word count, and internal link counts.",
  },
  {
    q: "Can I export reports for clients?",
    a: "Pro and Agency plans include CSV exports. Agency adds white-label PDF reports with your logo and brand color.",
  },
  {
    q: "Do you have an API?",
    a: "API access is included on the Agency plan. Every audit endpoint is REST-shaped and returns clean JSON.",
  },
  {
    q: "How do you handle private or staging sites?",
    a: "We block localhost, private IP ranges, and require public DNS. Staging sites need a public URL to be audited.",
  },
  {
    q: "What if I find a bug or false positive?",
    a: "Email support@saasseoaudit.com. We treat every report seriously and ship fixes within days.",
  },
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
          <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/60 px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] backdrop-blur">
                <Sparkles className="size-3.5" />
                Now with Gemini 2.5 Flash recommendations
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Grow Your SaaS with{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent">
                  Organic Traffic
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted-foreground)]">
                Get a complete SEO audit in seconds and discover exactly what is
                holding your rankings back.
              </p>
              <div className="mt-10">
                <AuditForm />
              </div>
              <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                No credit card required. First audit takes about 30 seconds.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--border)]/60 bg-[var(--muted)]/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                  Everything you need
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Six audits in one crawl
                </h2>
                <p className="mt-4 text-lg text-[var(--muted-foreground)]">
                  Technical SEO, on-page, performance, content, accessibility,
                  and link checks — run in parallel and graded A through F.
                </p>
                <Button asChild size="lg" className="mt-6">
                  <Link href="/audit/new">
                    Start free audit
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5"
                  >
                    <f.icon className="size-5 text-[var(--primary)]" />
                    <p className="mt-3 font-semibold">{f.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {f.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Loved by SaaS founders
              </h2>
              <p className="mt-3 text-[var(--muted-foreground)]">
                Real teams using SaaS SEO Audit to ship fewer features and rank
                for more.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
                >
                  <blockquote className="text-sm leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[var(--primary)]/15 font-semibold text-[var(--primary)]">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t.role}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)]/60 bg-[var(--muted)]/40 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-[var(--muted-foreground)]">
                Everything you need to know before you audit your first site.
              </p>
            </div>
            <div className="mt-10 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--background)]">
              {FAQS.map((item) => (
                <details key={item.q} className="group p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                    {item.q}
                    <span className="ml-4 text-[var(--muted-foreground)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-10 text-center text-white shadow-xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to find out what is holding you back?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/80">
                Run a free audit now. Upgrade only when you need unlimited
                audits, competitor tracking, and PDF exports.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-6">
                <Link href="/audit/new">
                  Start free audit
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}