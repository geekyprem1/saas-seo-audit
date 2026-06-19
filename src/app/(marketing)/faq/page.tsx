import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "FAQ — SaaS SEO Audit",
  description:
    "Ten common questions about how SaaS SEO Audit works, billing, and AI recommendations.",
};

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
    a: "Yes — your first audit is fully anonymous. Sign up free to keep your results, track history, and unlock the full AI recommendation set.",
  },
  {
    q: "How accurate is the performance score?",
    a: "We use Google's official PageSpeed Insights API with mobile-first metrics, the same data Google uses for ranking signals.",
  },
  {
    q: "Do you support competitor analysis?",
    a: "Competitor comparison ships on the Pro plan. Compare up to three competitors on title length, meta, headings, word count, and internal links.",
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

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              Ten things SaaS founders ask before they audit.
            </p>
          </div>
          <div className="mt-12 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--card)]">
            {FAQS.map((item) => (
              <details key={item.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
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
        </section>
      </main>
      <SiteFooter />
    </>
  );
}