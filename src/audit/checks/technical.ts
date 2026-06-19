import type { IssueDraft } from "@/audit/issues/types";
import { fetchHtml } from "@/audit/crawler";

export type TechnicalContext = {
  finalUrl: string;
  status: number;
  hasHttps: boolean;
  redirectChain: string[];
  html: string;
  htmlLoaded: boolean;
  sitemapStatus: number | null;
  robotsStatus: number | null;
  hasSitemap: boolean;
  hasRobots: boolean;
  lang: string;
};

export async function gatherTechnicalContext(
  normalizedUrl: string,
  initialHtml: string,
  initialStatus: number,
  initialFinalUrl: string,
): Promise<TechnicalContext> {
  const origin = new URL(normalizedUrl).origin;
  const [sitemap, robots] = await Promise.all([
    fetchHtml(`${origin}/sitemap.xml`, { maxBytes: 2_000_000 }),
    fetchHtml(`${origin}/robots.txt`, { maxBytes: 256_000 }),
  ]);

  return {
    finalUrl: initialFinalUrl,
    status: initialStatus,
    hasHttps: initialFinalUrl.startsWith("https://"),
    redirectChain: [],
    html: initialHtml,
    htmlLoaded: Boolean(initialHtml),
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status,
    hasSitemap: sitemap.ok && /<urlset/i.test(sitemap.html),
    hasRobots: robots.ok,
    lang: "",
  };
}

export function checkTechnical(ctx: TechnicalContext): IssueDraft[] {
  const issues: IssueDraft[] = [];

  if (!ctx.hasHttps) {
    issues.push({
      checkId: "technical.https",
      severity: "CRITICAL",
      category: "TECHNICAL",
      title: "Page not served over HTTPS",
      description: "The page is served over plain HTTP.",
      recommendation:
        "Issue a free SSL certificate (Let's Encrypt) and force-redirect all HTTP traffic to HTTPS via 301.",
      whyItMatters:
        "HTTPS is a confirmed Google ranking factor and required for modern features like HTTP/2 and Service Workers.",
    });
  }

  if (ctx.status >= 400) {
    issues.push({
      checkId: "technical.status",
      severity: "CRITICAL",
      category: "TECHNICAL",
      title: `Page returned HTTP ${ctx.status}`,
      description: `The page responded with status ${ctx.status}.`,
      recommendation:
        "Investigate the server response and fix the underlying error so users and crawlers can access the page.",
      whyItMatters:
        "Pages returning 4xx/5xx are excluded from search indexes and harm user experience.",
      metadata: { status: ctx.status },
    });
  }

  if (!ctx.hasSitemap) {
    issues.push({
      checkId: "technical.sitemap.missing",
      severity: "HIGH",
      category: "TECHNICAL",
      title: "Missing or invalid sitemap.xml",
      description: `No valid sitemap was found at /sitemap.xml (status ${ctx.sitemapStatus ?? "—"}).`,
      recommendation:
        "Generate an XML sitemap that includes every indexable page and submit it to Google Search Console and Bing Webmaster Tools.",
      whyItMatters:
        "A sitemap helps search engines discover and prioritize all of your indexable pages.",
    });
  }

  if (!ctx.hasRobots) {
    issues.push({
      checkId: "technical.robots.missing",
      severity: "MEDIUM",
      category: "TECHNICAL",
      title: "Missing robots.txt",
      description: `No robots.txt was found at /robots.txt (status ${ctx.robotsStatus ?? "—"}).`,
      recommendation:
        "Create a robots.txt at the site root that points to your sitemap and allows the pages you want indexed.",
      whyItMatters:
        "robots.txt is the first file crawlers fetch; missing it can slow discovery and signal an unfinished site.",
    });
  }

  return issues;
}