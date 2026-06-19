import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";

const CTA_WORDS = [
  "get started",
  "start free trial",
  "start trial",
  "book demo",
  "request demo",
  "join waitlist",
  "request access",
  "sign up",
  "try free",
  "create account",
  "get access",
];

export type ConversionMetrics = {
  ctas: Array<{
    text: string;
    href: string;
    tag: string;
    isPrimary: boolean;
  }>;
  hasCtaAboveFold: boolean;
  ctaCount: number;
  hasContrastCta: boolean;
};

export function analyzeConversion(page: ParsedPage): ConversionMetrics {
  const $ = page.$;
  const ctas: ConversionMetrics["ctas"] = [];
  let hasCtaAboveFold = false;

  // Search in links and buttons
  $("a, button, input[type='submit']").each((idx, el) => {
    const text = $(el).text().trim().toLowerCase();
    const href = $(el).attr("href") ?? "";
    const tag = el.tagName.toLowerCase();
    
    // Check if the text matches standard CTA keywords
    const matchesCtaWord = CTA_WORDS.some(word => text.includes(word));
    
    if (matchesCtaWord && text.length < 40) {
      const isPrimary = text.includes("start") || text.includes("get") || text.includes("trial") || text.includes("demo");
      ctas.push({
        text: $(el).text().trim(),
        href,
        tag,
        isPrimary,
      });

      // Simple heuristic for above the fold: is the element in the top portion of the document
      // We check if the element's index or its parents appear early in the HTML string.
      // If the parent of this element is a header, nav, or section that is early, or if it is within the first 3000 chars of the page's HTML body.
      const elHtml = $.html(el);
      const firstIndex = page.html.indexOf(elHtml);
      if (firstIndex !== -1 && firstIndex < 4000) {
        hasCtaAboveFold = true;
      }
    }
  });

  // Verify contrast CTA - checks if button/link has primary-like tailwind classes or styles
  let hasContrastCta = false;
  $("a, button").each((_, el) => {
    const classList = $(el).attr("class") ?? "";
    const styleAttr = $(el).attr("style") ?? "";
    const text = $(el).text().trim().toLowerCase();
    const matchesCtaWord = CTA_WORDS.some(word => text.includes(word));

    if (matchesCtaWord) {
      if (
        classList.includes("bg-") || 
        classList.includes("primary") || 
        classList.includes("btn-") || 
        styleAttr.includes("background-color") ||
        styleAttr.includes("background:")
      ) {
        hasContrastCta = true;
      }
    }
  });

  return {
    ctas,
    hasCtaAboveFold,
    ctaCount: ctas.length,
    hasContrastCta,
  };
}

export function checkConversion(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];
  const metrics = analyzeConversion(page);

  if (metrics.ctaCount === 0) {
    issues.push({
      checkId: "conversion.cta.missing",
      severity: "CRITICAL",
      category: "CONVERSION",
      title: "No Call-to-Action (CTA) found",
      description: "We couldn't detect any primary Call-to-Action buttons (like 'Get Started' or 'Book Demo') on your landing page.",
      businessImpact: "Users have no clear path to convert, resulting in extremely high bounce rates and near-zero conversions.",
      seoImpact: "Poor user engagement signals (high bounce, zero interactions) can negatively impact search rankings over time.",
      recommendation: "Add a prominent Call-to-Action button above the fold. Use active verbs such as 'Start Free Trial' or 'Book Demo'.",
      difficulty: "LOW",
      whyItMatters: "A landing page without a clear CTA is a dead end for users. A CTA guides user intent and converts passive traffic into active users.",
    });
  } else if (metrics.ctaCount === 1) {
    issues.push({
      checkId: "conversion.cta.single",
      severity: "HIGH",
      category: "CONVERSION",
      title: "Only one CTA found",
      description: "Only one primary Call-to-Action was detected. Users who scroll down the page won't see CTAs in later sections.",
      businessImpact: "Lower conversion rates. Visitors who scroll to read features or pricing have to scroll back to the top to convert.",
      seoImpact: "Reduced conversion rate optimization (CRO) leads to higher customer acquisition cost (CAC).",
      recommendation: "Repeat your primary CTA in the mid-page sections (e.g., after the features) and in a dedicated closing/bottom hero section.",
      difficulty: "LOW",
      whyItMatters: "Repeated CTAs keep the conversion path readily accessible as users gain confidence while scrolling through your landing page content.",
    });
  }

  if (metrics.ctaCount > 0 && !metrics.hasCtaAboveFold) {
    issues.push({
      checkId: "conversion.cta.above_fold_missing",
      severity: "CRITICAL",
      category: "CONVERSION",
      title: "No CTA above the fold",
      description: "All detected Call-to-Action buttons are located lower on the page, requiring users to scroll down to find them.",
      businessImpact: "Drastic drop in initial conversion rate, as up to 57% of visitor time is spent above the fold.",
      seoImpact: "High immediate bounce rate due to lack of clarity on what the user should do next.",
      recommendation: "Insert a high-contrast primary CTA button directly in the main Hero section so it is visible immediately upon load.",
      difficulty: "LOW",
      whyItMatters: "First impressions happen above the fold. High-intent users expect to see a call-to-action immediately without scrolling.",
    });
  }

  if (metrics.ctaCount > 0 && !metrics.hasContrastCta) {
    issues.push({
      checkId: "conversion.cta.contrast",
      severity: "MEDIUM",
      category: "CONVERSION",
      title: "CTA lacks visual contrast",
      description: "Your primary CTAs do not use a contrasting background color, making them blend in with secondary navigation or surrounding body text.",
      businessImpact: "Users overlook the call-to-action, causing a leak in the sign-up funnel.",
      seoImpact: "Sub-optimal engagement levels from organic landing traffic.",
      recommendation: "Apply a contrasting background color (e.g., brand primary color) to your primary CTA button. Ensure it stands out visually from body text.",
      difficulty: "LOW",
      whyItMatters: "Visual hierarchy is key. High-contrast CTAs attract the user's eye and prompt action.",
    });
  }

  return issues;
}
