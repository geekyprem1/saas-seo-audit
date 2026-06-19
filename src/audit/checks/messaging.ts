import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";

export type MessagingMetrics = {
  headline: string;
  subheadline: string;
  hasH1: boolean;
  multipleH1s: boolean;
  headlineLength: number;
  wordCount: number;
};

export function analyzeMessaging(page: ParsedPage): MessagingMetrics {
  const headline = page.h1.length > 0 ? page.h1[0] : "";
  const subheadline = page.h2.length > 0 ? page.h2[0] : "";

  return {
    headline,
    subheadline,
    hasH1: page.h1.length > 0,
    multipleH1s: page.h1.length > 1,
    headlineLength: headline.length,
    wordCount: page.wordCount,
  };
}

export function checkMessaging(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];
  const metrics = analyzeMessaging(page);

  if (!metrics.hasH1) {
    issues.push({
      checkId: "messaging.headline.missing",
      severity: "CRITICAL",
      category: "MESSAGING",
      title: "Missing main headline (H1)",
      description: "No H1 heading tag was found on the page. Landing pages require a clear primary headline.",
      businessImpact: "Visitors arrive and cannot instantly understand what you offer, leading to high drop-offs and poor brand recall.",
      seoImpact: "Search engine crawlers rely heavily on the H1 tag to establish the page's primary theme, severely harming your search potential.",
      recommendation: "Wrap your primary hero headline in an `<h1>` tag. Keep it clear, concise, and focused on the core value.",
      difficulty: "LOW",
      whyItMatters: "The H1 headline is the single most prominent element on a landing page, responsible for keeping a user's attention in the first 3 seconds.",
    });
  } else if (metrics.multipleH1s) {
    issues.push({
      checkId: "messaging.headline.multiple",
      severity: "LOW",
      category: "MESSAGING",
      title: "Multiple H1 headings detected",
      description: `We found ${page.h1.length} H1 headings on this page. A landing page should have exactly one H1.`,
      businessImpact: "Dilutes page layout focus; users may find the visual hierarchy confusing if multiple texts look like top-level titles.",
      seoImpact: "Search engines get conflicting signals about the main topic of the page, weakening your ranking focus.",
      recommendation: "Ensure there is only one `<h1>` tag in the hero section. Convert secondary top-level titles to `<h2>` or `<h3>` tags.",
      difficulty: "LOW",
      whyItMatters: "Single H1 architecture establishes a clear visual and semantic anchor for both search engines and humans.",
    });
  }

  if (metrics.hasH1 && metrics.headlineLength > 100) {
    issues.push({
      checkId: "messaging.headline.too_long",
      severity: "MEDIUM",
      category: "MESSAGING",
      title: "Headline is too long",
      description: `The main headline contains ${metrics.headlineLength} characters, which exceeds the recommended 70-character threshold.`,
      businessImpact: "Long headlines reduce readability and clutter the hero layout, causing visitors to lose interest.",
      seoImpact: "None directly, but poor engagement indirectly hurts search quality scores.",
      recommendation: "Condense your main headline to 6-10 words (under 70 characters). Move supporting descriptions or features to the subheadline.",
      difficulty: "LOW",
      whyItMatters: "Great hero copy is punchy. A shorter main headline is easier to scan, process, and remember.",
    });
  }

  if (metrics.hasH1 && metrics.headlineLength < 15) {
    issues.push({
      checkId: "messaging.headline.too_short",
      severity: "LOW",
      category: "MESSAGING",
      title: "Headline is too vague or short",
      description: `The main headline is only ${metrics.headlineLength} characters long, which is unlikely to convey a complete value proposition.`,
      businessImpact: "Under-communicates the value of your product, failing to explain what your SaaS actually does.",
      seoImpact: "Missed opportunity to target high-intent search keywords in your primary heading.",
      recommendation: "Expand the headline to clearly state the primary benefit or function of your product.",
      difficulty: "LOW",
      whyItMatters: "A 2-3 word headline like 'Welcome' or 'Software' lacks the specificity needed to hook SaaS buyers.",
    });
  }

  if (metrics.hasH1 && !metrics.subheadline) {
    issues.push({
      checkId: "messaging.subheadline.missing",
      severity: "HIGH",
      category: "MESSAGING",
      title: "Missing subheadline",
      description: "No supporting subheading (H2) was detected near the top section of the page.",
      businessImpact: "Leaves the main headline carrying the entire cognitive load. Visitors won't get enough context about how the product works.",
      seoImpact: "Missed semantic structure to contextualize the main headline theme.",
      recommendation: "Add an H2 subheadline immediately below your H1. Use 2-3 lines of text to explain who the product is for and how it achieves the headline's promise.",
      difficulty: "LOW",
      whyItMatters: "Subheadlines bridge the gap between a high-level value prop and concrete features, providing the necessary 'hook' to read further.",
    });
  }

  return issues;
}
