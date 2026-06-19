import * as cheerio from "cheerio";

export type ParsedPage = {
  finalUrl: string;
  status: number;
  contentType: string;
  html: string;
  $: ReturnType<typeof cheerio.load>;
  text: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  canonical: string;
  robotsMeta: string;
  viewport: string;
  h1: string[];
  h2: string[];
  h3: string[];
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  images: Array<{ src: string; alt: string; width?: number; height?: number }>;
  internalLinks: string[];
  externalLinks: string[];
  wordCount: number;
  hasHttps: boolean;
  headers: Record<string, string>;
  lang: string;
};

export function parseHtml(html: string, finalUrl: string): ParsedPage {
  const $ = cheerio.load(html);
  const text = $("body").text().replace(/\s+/g, " ").trim();

  const title = ($("title").first().text() ?? "").trim();
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ?? "";
  const metaKeywords =
    $('meta[name="keywords"]').attr("content")?.trim() ?? "";
  const canonical = $('link[rel="canonical"]').attr("href")?.trim() ?? "";
  const robotsMeta =
    $('meta[name="robots"]').attr("content")?.trim() ?? "";
  const viewport =
    $('meta[name="viewport"]').attr("content")?.trim() ?? "";
  const lang = ($("html").attr("lang") ?? "").trim();

  const h1 = $("h1")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const h2 = $("h2")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const h3 = $("h3")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  const openGraph: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const key = $(el).attr("property");
    const value = $(el).attr("content");
    if (key && value) openGraph[key] = value;
  });

  const twitter: Record<string, string> = {};
  $('meta[name^="twitter:"]').each((_, el) => {
    const key = $(el).attr("name");
    const value = $(el).attr("content");
    if (key && value) twitter[key] = value;
  });

  const images: ParsedPage["images"] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src");
    if (!src) return;
    images.push({
      src,
      alt: $(el).attr("alt") ?? "",
      width: parseIntOrUndefined($(el).attr("width")),
      height: parseIntOrUndefined($(el).attr("height")),
    });
  });

  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  let baseHost = "";
  try {
    baseHost = new URL(finalUrl).hostname;
  } catch {
    baseHost = "";
  }

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") ||
        href.startsWith("tel:") || href.startsWith("javascript:")) {
      return;
    }
    try {
      const resolved = new URL(href, finalUrl);
      if (resolved.hostname === baseHost) {
        internalLinks.push(resolved.toString());
      } else {
        externalLinks.push(resolved.toString());
      }
    } catch {
      internalLinks.push(href);
    }
  });

  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const hasHttps = finalUrl.startsWith("https://");

  return {
    finalUrl,
    status: 200,
    contentType: "text/html",
    html,
    $,
    text,
    title,
    metaDescription,
    metaKeywords,
    canonical,
    robotsMeta,
    viewport,
    h1,
    h2,
    h3,
    openGraph,
    twitter,
    images,
    internalLinks: dedupe(internalLinks),
    externalLinks: dedupe(externalLinks),
    wordCount,
    hasHttps,
    headers: {},
    lang,
  };
}

function parseIntOrUndefined(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr));
}