import type { IssueDraft } from "@/audit/issues/types";
import { hasPsi } from "@/lib/env";

export type PerformanceResult = {
  score: number | null;
  lcp: number | null;
  fcp: number | null;
  cls: number | null;
  ttfb: number | null;
  source: "psi" | "skipped" | "error";
  error?: string;
};

export async function fetchPerformance(
  url: string,
  strategy: "mobile" | "desktop" = "mobile",
): Promise<PerformanceResult> {
  if (!hasPsi) {
    return {
      score: null,
      lcp: null,
      fcp: null,
      cls: null,
      ttfb: null,
      source: "skipped",
    };
  }

  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", strategy);
  endpoint.searchParams.set("category", "PERFORMANCE");
  for (const metric of ["LARGEST_CONTENTFUL_PAINT_MS", "FIRST_CONTENTFUL_PAINT_MS", "CUMULATIVE_LAYOUT_SHIFT", "EXPERIMENTAL_TIME_TO_FIRST_BYTE"]) {
    endpoint.searchParams.append("metric", metric);
  }
  endpoint.searchParams.set("key", process.env.GOOGLE_PSI_API_KEY!);

  try {
    const res = await fetch(endpoint.toString(), {
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) {
      return {
        score: null,
        lcp: null,
        fcp: null,
        cls: null,
        ttfb: null,
        source: "error",
        error: `PSI ${res.status}`,
      };
    }
    const data = (await res.json()) as {
      lighthouseResult?: {
        categories?: { performance?: { score?: number } };
        audits?: Record<
          string,
          { numericValue?: number; score?: number; displayValue?: string }
        >;
      };
    };
    const perfScore = data.lighthouseResult?.categories?.performance?.score;
    const audits = data.lighthouseResult?.audits ?? {};
    return {
      score: typeof perfScore === "number" ? Math.round(perfScore * 100) : null,
      lcp: audits["largest-contentful-paint"]?.numericValue ?? null,
      fcp: audits["first-contentful-paint"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      ttfb: audits["experimental-time-to-first-byte"]?.numericValue ?? null,
      source: "psi",
    };
  } catch (err) {
    return {
      score: null,
      lcp: null,
      fcp: null,
      cls: null,
      ttfb: null,
      source: "error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function checkPerformance(
  perf: PerformanceResult,
): IssueDraft[] {
  const issues: IssueDraft[] = [];
  if (perf.source === "skipped" || perf.score === null) {
    return issues;
  }

  if (perf.lcp !== null && perf.lcp > 2500) {
    issues.push({
      checkId: "performance.lcp",
      severity: perf.lcp > 4000 ? "HIGH" : "MEDIUM",
      category: "PERFORMANCE",
      title: "Slow Largest Contentful Paint",
      description: `LCP is ${(perf.lcp / 1000).toFixed(2)}s (target: under 2.5s).`,
      recommendation:
        "Optimize your hero image or text block, preload critical resources, and serve them from a CDN.",
      whyItMatters:
        "LCP is a Core Web Vital and a confirmed ranking factor; slow LCP also increases bounce rate.",
      metadata: { lcp: perf.lcp },
    });
  }

  if (perf.cls !== null && perf.cls > 0.1) {
    issues.push({
      checkId: "performance.cls",
      severity: perf.cls > 0.25 ? "HIGH" : "MEDIUM",
      category: "PERFORMANCE",
      title: "High Cumulative Layout Shift",
      description: `CLS is ${perf.cls.toFixed(2)} (target: under 0.1).`,
      recommendation:
        "Reserve dimensions for images and embeds, avoid inserting content above existing content, and use CSS aspect-ratio.",
      whyItMatters:
        "Layout shifts frustrate users and directly hurt CLS, a Core Web Vital.",
      metadata: { cls: perf.cls },
    });
  }

  if (perf.ttfb !== null && perf.ttfb > 800) {
    issues.push({
      checkId: "performance.ttfb",
      severity: perf.ttfb > 1800 ? "HIGH" : "MEDIUM",
      category: "PERFORMANCE",
      title: "Slow Time To First Byte",
      description: `TTFB is ${(perf.ttfb / 1000).toFixed(2)}s (target: under 0.8s).`,
      recommendation:
        "Reduce server response time with caching, a CDN, and faster database queries.",
      whyItMatters:
        "TTFB affects every other performance metric; slow server responses cascade into worse LCP and FCP.",
      metadata: { ttfb: perf.ttfb },
    });
  }

  return issues;
}