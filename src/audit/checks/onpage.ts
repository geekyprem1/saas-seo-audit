import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const META_MIN = 120;
const META_MAX = 160;

export function checkOnPage(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];

  if (!page.title) {
    issues.push({
      checkId: "onpage.title.missing",
      severity: "CRITICAL",
      category: "ON_PAGE",
      title: "Missing page title",
      description: "The page has no `<title>` element.",
      recommendation:
        "Add a unique, descriptive `<title>` between 30 and 60 characters that summarizes the page.",
      whyItMatters:
        "The title is the primary signal search engines use to understand a page and is the most visible element in search results.",
      metadata: { length: 0 },
    });
  } else {
    const len = page.title.length;
    if (len < TITLE_MIN) {
      issues.push({
        checkId: "onpage.title.too-short",
        severity: "MEDIUM",
        category: "ON_PAGE",
        title: "Page title is too short",
        description: `The title is ${len} characters; search results typically truncate around 50–60.`,
        recommendation: `Expand the title to at least ${TITLE_MIN} characters, ideally ${TITLE_MIN}–${TITLE_MAX}.`,
        whyItMatters:
          "Shorter titles miss keyword opportunities and reduce click-through rates from search results.",
        metadata: { length: len },
      });
    } else if (len > TITLE_MAX + 20) {
      issues.push({
        checkId: "onpage.title.too-long",
        severity: "MEDIUM",
        category: "ON_PAGE",
        title: "Page title is too long",
        description: `The title is ${len} characters and will likely be truncated in search results.`,
        recommendation: `Trim the title to ${TITLE_MAX} characters or fewer while keeping the primary keyword at the start.`,
        whyItMatters:
          "Long titles get truncated, hiding important keywords and reducing click-through rates.",
        metadata: { length: len },
      });
    }
  }

  if (!page.metaDescription) {
    issues.push({
      checkId: "onpage.meta-description.missing",
      severity: "HIGH",
      category: "ON_PAGE",
      title: "Missing meta description",
      description: "The page does not define a meta description.",
      recommendation: `Add a compelling meta description between ${META_MIN} and ${META_MAX} characters that summarizes the page and includes a clear call-to-action.`,
      whyItMatters:
        "The meta description is the snippet shown under your page title in search results and directly influences click-through rates.",
      metadata: { length: 0 },
    });
  } else {
    const len = page.metaDescription.length;
    if (len < META_MIN) {
      issues.push({
        checkId: "onpage.meta-description.too-short",
        severity: "LOW",
        category: "ON_PAGE",
        title: "Meta description is too short",
        description: `The meta description is ${len} characters.`,
        recommendation: `Expand it to at least ${META_MIN} characters so search engines display a richer snippet.`,
        whyItMatters:
          "A longer, more descriptive meta description improves click-through rates and previews more page content in SERPs.",
        metadata: { length: len },
      });
    } else if (len > META_MAX) {
      issues.push({
        checkId: "onpage.meta-description.too-long",
        severity: "LOW",
        category: "ON_PAGE",
        title: "Meta description is too long",
        description: `The meta description is ${len} characters and may be truncated.`,
        recommendation: `Trim it to ${META_MAX} characters or fewer.`,
        whyItMatters:
          "Descriptions over the limit get truncated, cutting off your call-to-action.",
        metadata: { length: len },
      });
    }
  }

  if (page.h1.length === 0) {
    issues.push({
      checkId: "onpage.h1.missing",
      severity: "HIGH",
      category: "ON_PAGE",
      title: "Missing H1 heading",
      description: "The page has no H1 heading.",
      recommendation:
        "Add a single, descriptive H1 that includes the primary keyword and summarizes the page content.",
      whyItMatters:
        "The H1 is the strongest on-page heading signal for both users and search engines.",
    });
  } else if (page.h1.length > 1) {
    issues.push({
      checkId: "onpage.h1.multiple",
      severity: "MEDIUM",
      category: "ON_PAGE",
      title: "Multiple H1 headings",
      description: `Found ${page.h1.length} H1 headings; pages should have a single H1.`,
      recommendation:
        "Consolidate to a single H1 and convert the rest to H2 or H3.",
      whyItMatters:
        "Multiple H1s dilute heading hierarchy and confuse both readers and crawlers.",
      metadata: { count: page.h1.length },
    });
  }

  if (!page.canonical) {
    issues.push({
      checkId: "onpage.canonical.missing",
      severity: "MEDIUM",
      category: "ON_PAGE",
      title: "Missing canonical link",
      description: "The page does not declare a canonical URL.",
      recommendation:
        'Add <link rel="canonical" href="https://example.com/page/" /> in the <head>.',
      whyItMatters:
        "Without a canonical, search engines may index duplicate variants of this page and split ranking signals.",
    });
  }

  const ogRequired = ["og:title", "og:description", "og:image", "og:type"];
  const missingOg = ogRequired.filter((k) => !page.openGraph[k]);
  if (missingOg.length > 0) {
    issues.push({
      checkId: "onpage.og.missing",
      severity: "LOW",
      category: "ON_PAGE",
      title: "Missing Open Graph tags",
      description: `Missing Open Graph properties: ${missingOg.join(", ")}.`,
      recommendation:
        "Add the missing og:* meta tags in the <head> to control how the page appears when shared on social platforms.",
      whyItMatters:
        "Open Graph tags control link previews on Facebook, LinkedIn, Slack, and many other platforms, directly affecting social CTR.",
      metadata: { missing: missingOg },
    });
  }

  const twitterRequired = ["twitter:card"];
  const missingTwitter = twitterRequired.filter((k) => !page.twitter[k]);
  if (missingTwitter.length > 0) {
    issues.push({
      checkId: "onpage.twitter.missing",
      severity: "LOW",
      category: "ON_PAGE",
      title: "Missing Twitter card tags",
      description: `Missing Twitter card tags: ${missingTwitter.join(", ")}.`,
      recommendation:
        "Add a twitter:card meta tag (e.g. summary_large_image) for richer Twitter / X previews.",
      whyItMatters:
        "Twitter cards control how your page renders when shared on X and can dramatically improve engagement.",
      metadata: { missing: missingTwitter },
    });
  }

  return issues;
}