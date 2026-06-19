import Link from "next/link";
import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "Pricing — SaaS SEO Audit",
  description:
    "Start free. Upgrade to Pro for unlimited audits and competitor analysis. Agency adds white-label reports and team access.",
};

const TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Try the platform and audit your first site.",
    cta: "Start free audit",
    href: "/audit/new",
    features: [
      { text: "5 audits per month", included: true },
      { text: "Full technical + on-page audit", included: true },
      { text: "AI recommendations (5 per audit)", included: true },
      { text: "CSV export", included: true },
      { text: "Audit history", included: false },
      { text: "Competitor analysis", included: false },
      { text: "PDF reports", included: false },
      { text: "White-label exports", included: false },
      { text: "Team access", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/ month",
    description: "For founders serious about organic growth.",
    cta: "Upgrade to Pro",
    href: "/audit/new",
    highlight: true,
    features: [
      { text: "Unlimited audits", included: true },
      { text: "Unlimited AI recommendations", included: true },
      { text: "Competitor analysis (up to 3)", included: true },
      { text: "PDF + CSV exports", included: true },
      { text: "Audit history", included: true },
      { text: "Priority support", included: true },
      { text: "White-label exports", included: false },
      { text: "Team access", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    name: "Agency",
    price: "$49",
    cadence: "/ month",
    description: "For agencies and teams running audits at scale.",
    cta: "Start agency trial",
    href: "/audit/new",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "White-label PDF reports", included: true },
      { text: "Team access (up to 10 seats)", included: true },
      { text: "API access", included: true },
      { text: "Shared audit library", included: true },
      { text: "Dedicated support", included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Pricing that scales with your traffic
            </h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              Start free. Pay only when audits become your unfair advantage.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border bg-[var(--card)] p-8 shadow-sm ${
                  tier.highlight
                    ? "border-[var(--primary)] ring-1 ring-[var(--primary)]"
                    : "border-[var(--border)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{tier.name}</h2>
                  {tier.highlight && <Badge>Most popular</Badge>}
                </div>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {tier.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {tier.cadence}
                  </span>
                </div>
                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={tier.highlight ? "default" : "outline"}
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      {f.included ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      ) : (
                        <X className="mt-0.5 size-4 shrink-0 text-[var(--muted-foreground)]/50" />
                      )}
                      <span
                        className={
                          f.included
                            ? ""
                            : "text-[var(--muted-foreground)] line-through decoration-1"
                        }
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            All plans include unlimited team members during the launch
            promotion. Stripe billing is wired in milestone 10.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}