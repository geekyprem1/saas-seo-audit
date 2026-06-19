import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditForm } from "@/components/audit/audit-form";

export const metadata: Metadata = {
  title: "New audit",
};

export default function NewAuditPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Run a new audit</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Paste the URL of any public page. We&apos;ll crawl, score, and ship
          recommendations in under a minute.
        </p>
      </div>
      <AuditForm />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="size-4" />
            What we check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <li>Page title &amp; meta description</li>
            <li>H1 / H2 / H3 hierarchy</li>
            <li>Open Graph &amp; Twitter cards</li>
            <li>Image alt text</li>
            <li>Internal &amp; external links</li>
            <li>HTTPS &amp; SSL validity</li>
            <li>Sitemap.xml &amp; robots.txt</li>
            <li>Mobile viewport &amp; tap targets</li>
            <li>LCP, FCP, CLS, TTFB (via PageSpeed)</li>
            <li>Word count &amp; readability</li>
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