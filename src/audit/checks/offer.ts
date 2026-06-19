import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";

export type OfferMetrics = {
  offerType: "Free Trial" | "Free Plan" | "Demo" | "Waitlist" | "Unknown";
  pricingVisible: boolean;
  hasRiskReversal: boolean;
  hasGuarantee: boolean;
  hasNoCcRequired: boolean;
};

export function analyzeOffer(page: ParsedPage): OfferMetrics {
  const text = page.text.toLowerCase();
  const html = page.html.toLowerCase();

  // Detect Offer Type
  let offerType: OfferMetrics["offerType"] = "Unknown";
  
  if (text.includes("free trial") || text.includes("start trial") || text.includes("try free")) {
    offerType = "Free Trial";
  } else if (text.includes("free plan") || text.includes("always free") || text.includes("free tier") || text.includes("free forever")) {
    offerType = "Free Plan";
  } else if (text.includes("book demo") || text.includes("request demo") || text.includes("schedule demo")) {
    offerType = "Demo";
  } else if (text.includes("waitlist") || text.includes("request access")) {
    offerType = "Waitlist";
  }

  // Pricing Visible
  const pricingVisible = text.includes("pricing") || text.includes("$") || 
                         text.includes("plan") || text.includes("subscription") ||
                         html.includes("pricing-table");

  // Guarantee / Risk reversal
  const hasGuarantee = text.includes("guarantee") || text.includes("money back") || 
                       text.includes("refund") || text.includes("money-back");
  const hasNoCcRequired = text.includes("no credit card required") || text.includes("no cc required") ||
                          text.includes("card required") === false && text.includes("no credit card");
  const hasRiskReversal = hasGuarantee || hasNoCcRequired || text.includes("cancel anytime") || 
                          text.includes("risk free") || text.includes("risk-free");

  return {
    offerType,
    pricingVisible,
    hasRiskReversal,
    hasGuarantee,
    hasNoCcRequired,
  };
}

export function checkOffer(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];
  const metrics = analyzeOffer(page);

  // 1. Risk Reversal Missing
  if (!metrics.hasRiskReversal) {
    issues.push({
      checkId: "offer.risk_reversal.missing",
      severity: "HIGH",
      category: "OFFER",
      title: "No risk reversal found",
      description: "We couldn't find statements like 'No credit card required', 'Cancel anytime', or 'Money-back guarantee' near your CTA or pricing section.",
      businessImpact: "Users may hesitate to try the product due to friction and perceived commitment risk.",
      seoImpact: "Lower page conversion rates and lower visitor engagement session duration.",
      recommendation: "Add a risk reversal micro-copy directly below your primary CTA (e.g. '14-day free trial. No credit card required. Cancel anytime.').",
      difficulty: "LOW",
      whyItMatters: "Minimizing perceived risk is one of the easiest ways to lift conversions. Reassure users that they won't be charged unexpectedly.",
    });
  }

  // 2. Pricing Info Missing
  if (!metrics.pricingVisible) {
    issues.push({
      checkId: "offer.pricing.hidden",
      severity: "CRITICAL",
      category: "OFFER",
      title: "Pricing is not visible or clear",
      description: "We found no details about plans, pricing tiers, billing amounts, or subscription models.",
      businessImpact: "Founders lose up to 40% of prospective signups. Modern B2B buyers expect transparent pricing and hate 'Contact Sales' as the only option.",
      seoImpact: "Loss of high-intent organic leads searching for pricing details (e.g. 'SaaS pricing').",
      recommendation: "Publish your pricing transparently on the landing page or add a clear link to a dedicated pricing page with a comparison matrix.",
      difficulty: "MEDIUM",
      whyItMatters: "Transparency builds trust. Hiding pricing signals that your product is either overpriced or complicated to acquire.",
    });
  }

  // 3. Guarantees Missing (if pricing is visible but no refund/guarantee is mentioned)
  if (metrics.pricingVisible && !metrics.hasGuarantee) {
    issues.push({
      checkId: "offer.guarantee.missing",
      severity: "MEDIUM",
      category: "OFFER",
      title: "No refund or satisfaction guarantee",
      description: "There is no satisfaction guarantee or money-back period mentioned for paid tiers.",
      businessImpact: "Decreased conversion on paid checkouts as users fear buying software that might not solve their problem.",
      seoImpact: "None directly, but lowers checkout funnel efficiency.",
      recommendation: "Introduce a '30-day money-back guarantee' or '100% satisfaction refund policy' to decrease purchase hesitation.",
      difficulty: "LOW",
      whyItMatters: "Guarantees shift the risk from the buyer to the seller, lowering the threshold for purchase decisions.",
    });
  }

  return issues;
}
