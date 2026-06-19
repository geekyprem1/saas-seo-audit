import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search, Zap, BarChart3, Sparkles, FileDown, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { AuditForm } from "@/components/audit/audit-form";

export const metadata: Metadata = {
  title: "SaaS Landing Page Analyzer — Optimize Conversions & Messaging",
  description:
    "Discover why your landing page isn't converting. Get a complete copy, conversion, offer, and trust signals audit of your SaaS landing page in seconds.",
};

const FEATURES = [
  {
    icon: Search,
    title: "Messaging & Value Prop",
    body: "Clarity, target audience specificity, and differentiation risk analysis — checked instantly.",
  },
  {
    icon: Sparkles,
    title: "AI Growth Consultant",
    body: "Plain-English recommendations detailing business and conversion impacts, not just generic SEO checklists.",
  },
  {
    icon: BarChart3,
    title: "Conversion CTA Audits",
    body: "Evaluate CTA wording, visual contrast, placement, and repetition to plug conversion leaks.",
  },
  {
    icon: Zap,
    title: "Risk Reversal & Offer",
    body: "Ensure pricing transparency, refunds, and satisfaction guarantees are optimized to capture signups.",
  },
  {
    icon: FileDown,
    title: "Trust Signals & Proof",
    body: "Checks for testimonials, partner logos, founder visibility, FAQs, and privacy legal policies.",
  },
  {
    icon: History,
    title: "Immediate Quick Wins",
    body: "Get a clear action list of wins under 1 hour, alongside 30-day and 90-day execution plans.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We adjusted our hero H1 clarity and added a satisfaction guarantee based on the report. Conversions jumped 24% in two weeks.",
    name: "Maya Chen",
    role: "Founder, Linearstack",
  },
  {
    quote:
      "The 'Competitor Positioning Risk' flag was a wake-up call. We realized our copy was identical to 50 other tools. Best $99/mo spent.",
    name: "Daniel Park",
    role: "Head of Growth, Quartzly",
  },
  {
    quote:
      "I stop guessing what to optimize next. The Quick Wins section gave me 4 items that immediately reduced signup friction.",
    name: "Sofia Russo",
    role: "SEO & Growth Lead, Northbeam",
  },
];

const FAQS = [
  {
    q: "How long does a landing page audit take?",
    a: "Most audits finish in 20–40 seconds. We crawl your landing page, evaluate CTA placement, scan for trust markers, and generate a customized CRO report with AI.",
  },
  {
    q: "Why is Growth Score better than a generic SEO score?",
    a: "Founders don't just need search traffic—they need customer conversions. Growth Score weights Conversion (30%), Messaging (25%), Trust (20%), Technical (15%), and Performance (10%) to find out where your funnel is leaking.",
  },
  {
    q: "Which AI models power the growth recommendations?",
    a: "Gemini 2.5 Flash acts as the primary AI engine with automatic failovers, ensuring professional-grade copy critiques and action items.",
  },
  {
    q: "What does the positioning risk check analyze?",
    a: "It flags if your main headline relies on generic buzzwords (e.g. 'Boost your productivity with AI') that could easily belong to 100 other software products, prompting you to sharpen your unique hook.",
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
                This is not an SEO checker. It is an AI Growth Consultant.
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Discover why your landing page{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent">
                  isn't converting.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted-foreground)]">
                Get a comprehensive conversion, messaging, trust, and offer audit in seconds. Built specifically for SaaS founders and indie hackers.
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
                  Analyze your landing page like a CRO consultant
                </h2>
                <p className="mt-4 text-lg text-[var(--muted-foreground)]">
                  Evaluating headlines, subheadlines, value propositions, CTA prominence, pricing risk reversals, founder signals, and Core Web Vitals in one unified run.
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