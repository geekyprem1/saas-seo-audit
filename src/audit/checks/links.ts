import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";

export function checkLinks(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];

  if (page.internalLinks.length === 0) {
    issues.push({
      checkId: "links.internal.none",
      severity: "HIGH",
      category: "LINKS",
      title: "No internal links found",
      description:
        "The page does not link to any other page on the same domain.",
      recommendation:
        "Add contextual internal links to related content so users and crawlers can discover more of your site.",
      whyItMatters:
        "Internal links distribute page authority (PageRank) and are the primary way crawlers navigate your site.",
    });
  }

  if (page.externalLinks.length === 0) {
    issues.push({
      checkId: "links.external.none",
      severity: "LOW",
      category: "LINKS",
      title: "No external links found",
      description: "The page does not link to any external resources.",
      recommendation:
        "Where relevant, link to authoritative external sources to support your content.",
      whyItMatters:
        "Outbound links to reputable sources build trust signals and improve content quality assessments.",
    });
  }

  return issues;
}