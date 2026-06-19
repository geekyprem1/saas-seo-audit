export const CATEGORY_WEIGHTS = {
  CONVERSION: 30,
  MESSAGING: 25,
  TRUST: 20,
  TECHNICAL: 15,
  PERFORMANCE: 10,
} as const;

export type ScorableCategory = keyof typeof CATEGORY_WEIGHTS | "OFFER" | "CONTENT" | "MEDIA" | "LINKS";

export const CATEGORY_LABELS: Record<ScorableCategory, string> = {
  GROWTH: "Growth Score",
  CONVERSION: "Conversion Score",
  MESSAGING: "Messaging Score",
  TRUST: "Trust Score",
  OFFER: "Offer Score",
  TECHNICAL: "Technical Score",
  PERFORMANCE: "Performance Score",
  CONTENT: "Content Score",
  MEDIA: "Media Score",
  LINKS: "Link Score",
} as any;

export const CATEGORY_DESCRIPTIONS: Record<ScorableCategory, string> = {
  GROWTH: "Overall landing page growth and conversion potential",
  CONVERSION: "CTA visibility, placement, wording, and conversion layout",
  MESSAGING: "Headline clarity, audience targeting, and value proposition",
  TRUST: "Testimonials, founder visibility, policies, and FAQs",
  OFFER: "Pricing visibility, risk reversal, guarantees, and pricing plans",
  TECHNICAL: "SSL, canonical redirects, robots.txt, and indexability",
  PERFORMANCE: "Core Web Vitals (LCP, FCP, CLS, TTFB) and speed metrics",
  CONTENT: "Word count, heading hierarchy, and reading ease",
  MEDIA: "Image optimization, alt texts, and lazy loading",
  LINKS: "Internal and external link hygiene",
} as any;