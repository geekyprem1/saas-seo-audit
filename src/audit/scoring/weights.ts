export const CATEGORY_WEIGHTS = {
  TECHNICAL: 30,
  ON_PAGE: 30,
  PERFORMANCE: 20,
  CONTENT: 15,
  ACCESSIBILITY: 5,
} as const;

export type ScorableCategory = keyof typeof CATEGORY_WEIGHTS;

export const CATEGORY_LABELS: Record<ScorableCategory, string> = {
  TECHNICAL: "Technical SEO",
  ON_PAGE: "On-page SEO",
  PERFORMANCE: "Performance",
  CONTENT: "Content",
  ACCESSIBILITY: "Accessibility",
};

export const CATEGORY_DESCRIPTIONS: Record<ScorableCategory, string> = {
  TECHNICAL: "Crawlability, HTTPS, redirects, sitemap, robots.txt",
  ON_PAGE: "Title, meta description, headings, OG/Twitter, canonical",
  PERFORMANCE: "LCP, FCP, CLS, TTFB",
  CONTENT: "Word count, readability, heading structure",
  ACCESSIBILITY: "Viewport, alt text, contrast, tap targets",
};