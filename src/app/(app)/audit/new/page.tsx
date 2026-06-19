import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditForm } from "@/components/audit/audit-form";

export const metadata: Metadata = {
  title: "Analyze Landing Page",
};

export default function NewAuditPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyze landing page</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Paste the URL of your SaaS landing page. We&apos;ll crawl the copy, evaluate conversions, check trust signals, and ship recommendations in under a minute.
        </p>
      </div>
      <AuditForm />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="size-4" />
            What we analyze
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <li>Hero headline &amp; subheadline clarity</li>
            <li>CTA button wording, contrast &amp; repetition</li>
            <li>Testimonials, trust logos, &amp; founder info</li>
            <li>Pricing tiers, guarantees &amp; offers</li>
            <li>FAQ section &amp; objections coverage</li>
            <li>Privacy policy &amp; terms links</li>
            <li>LCP, FCP, CLS, TTFB (Performance)</li>
            <li>Word count &amp; reading difficulty</li>
            <li>Heading hierarchies &amp; thin content</li>
            <li>Images compression &amp; alt tags</li>
          </ul>
          <Button asChild variant="ghost" size="sm" className="mt-4">
            <Link href="/features">
              See the full checklist
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}