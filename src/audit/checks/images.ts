import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";

export function checkImages(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];
  if (page.images.length === 0) return issues;

  const missingAlt = page.images.filter(
    (img) => !img.alt || img.alt.trim().length === 0,
  );
  if (missingAlt.length > 0) {
    issues.push({
      checkId: "images.alt.missing",
      severity: missingAlt.length > 5 ? "HIGH" : "MEDIUM",
      category: "IMAGES",
      title: `${missingAlt.length} image${missingAlt.length === 1 ? "" : "s"} missing alt text`,
      description: `${missingAlt.length} of ${page.images.length} images do not have descriptive alt attributes.`,
      recommendation:
        "Add concise, descriptive alt text to every meaningful image. Use alt=\"\" only for decorative images.",
      whyItMatters:
        "Alt text is required for accessibility (screen readers) and gives search engines strong image-SEO signals.",
      metadata: {
        affected: missingAlt.slice(0, 5).map((i) => i.src),
      },
    });
  }

  const missingDimensions = page.images.filter(
    (img) => img.width === undefined || img.height === undefined,
  );
  if (missingDimensions.length > 0) {
    issues.push({
      checkId: "images.dimensions",
      severity: "LOW",
      category: "PERFORMANCE",
      title: `${missingDimensions.length} image${missingDimensions.length === 1 ? "" : "s"} missing width/height`,
      description:
        "Images without explicit width and height cause layout shifts while loading.",
      recommendation:
        "Add width and height attributes (or use CSS aspect-ratio) so the browser can reserve space before the image loads.",
      whyItMatters:
        "Missing dimensions directly inflate Cumulative Layout Shift (CLS), a Core Web Vital that affects rankings.",
      metadata: { count: missingDimensions.length },
    });
  }

  return issues;
}