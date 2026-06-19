import type { ParsedPage } from "@/audit/parse";
import type { IssueDraft } from "@/audit/issues/types";
import { fleschReadingEase, readingEaseLabel } from "@/audit/scoring/content-quality";

const MIN_WORDS = 300;
const OPTIMAL_WORDS = 600;

export type ContentMetrics = {
  wordCount: number;
  sentenceCount: number;
  flesch: number;
  readingEaseLabel: string;
  readingEaseColor: "good" | "ok" | "bad";
  headingDepth: number;
};

export function analyzeContent(page: ParsedPage): ContentMetrics {
  const flesch = fleschReadingEase(page.text);
  const ease = readingEaseLabel(flesch);
  const sentenceCount = Math.max(
    page.text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length,
    1,
  );
  return {
    wordCount: page.wordCount,
    sentenceCount,
    flesch,
    readingEaseLabel: ease.label,
    readingEaseColor: ease.color,
    headingDepth:
      page.h1.length + page.h2.length + page.h3.length,
  };
}

export function checkContent(page: ParsedPage): IssueDraft[] {
  const issues: IssueDraft[] = [];

  if (page.wordCount < MIN_WORDS) {
    issues.push({
      checkId: "content.thin",
      severity: page.wordCount < 100 ? "HIGH" : "MEDIUM",
      category: "CONTENT",
      title: "Thin page content",
      description: `The page contains only ${page.wordCount} words.`,
      recommendation: `Expand the page to at least ${MIN_WORDS} words of unique, useful content (aim for ${OPTIMAL_WORDS}+ for competitive terms).`,
      whyItMatters:
        "Pages with very little content are unlikely to rank for competitive queries and provide limited value to readers.",
      metadata: { wordCount: page.wordCount },
    });
  }

  if (page.h2.length === 0 && page.wordCount > 200) {
    issues.push({
      checkId: "content.headings.structure",
      severity: "LOW",
      category: "CONTENT",
      title: "No H2 subheadings",
      description:
        "Long pages without H2 subheadings are hard to scan and parse.",
      recommendation:
        "Break the content into logical sections using H2 (and H3 where helpful).",
      whyItMatters:
        "Heading structure improves scannability for readers and helps search engines understand topical structure.",
    });
  }

  const flesch = fleschReadingEase(page.text);
  if (flesch > 0 && flesch < 30) {
    issues.push({
      checkId: "content.readability",
      severity: "MEDIUM",
      category: "CONTENT",
      title: "Difficult to read",
      description: `Flesch reading ease score is ${flesch.toFixed(1)} (difficult).`,
      recommendation:
        "Shorten sentences, prefer common words, and break up long paragraphs to improve readability.",
      whyItMatters:
        "Easier-to-read content typically earns more engagement, longer time-on-page, and better rankings.",
      metadata: { flesch },
    });
  }

  return issues;
}