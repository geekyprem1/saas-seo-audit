import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";

export function checkAccessibility(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];

  if (!page.viewport) {
    issues.push({
      checkId: "a11y.viewport",
      severity: "HIGH",
      category: "ACCESSIBILITY",
      title: "Missing viewport meta tag",
      description:
        'The page does not declare <meta name="viewport" content="width=device-width, initial-scale=1">.',
      recommendation:
        'Add <meta name="viewport" content="width=device-width, initial-scale=1"> in the <head>.',
      whyItMatters:
        "Without a viewport meta tag, mobile browsers render the page at desktop width and the page is considered mobile-unfriendly.",
    });
  }

  if (!page.lang) {
    issues.push({
      checkId: "a11y.lang",
      severity: "LOW",
      category: "ACCESSIBILITY",
      title: "Missing HTML lang attribute",
      description: "The <html> element does not declare a language.",
      recommendation: 'Add lang="en" (or your document\'s primary language) to <html>.',
      whyItMatters:
        "The lang attribute is used by screen readers to choose the right pronunciation and by browsers for translation.",
    });
  }

  return issues;
}