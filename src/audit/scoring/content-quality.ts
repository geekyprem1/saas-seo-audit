const SENTENCE_SPLIT = /[.!?]+(?:\s|$)/g;

export function countWords(text: string): number {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return 0;
  return trimmed.split(" ").filter(Boolean).length;
}

export function countSentences(text: string): number {
  const matches = text.split(SENTENCE_SPLIT).filter((s) => s.trim().length > 0);
  return Math.max(matches.length, 1);
}

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/u, "")
    .replace(/^y/u, "");
  const matches = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(matches?.length ?? 0, 1);
}

export function fleschReadingEase(text: string): number {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  if (wordCount < 30) return 0;
  const sentenceCount = countSentences(text);
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score =
    206.835 -
    1.015 * (wordCount / sentenceCount) -
    84.6 * (syllableCount / wordCount);
  return Math.round(score * 10) / 10;
}

export function readingEaseLabel(score: number): {
  label: string;
  color: "good" | "ok" | "bad";
} {
  if (score >= 60) return { label: "Easy to read", color: "good" };
  if (score >= 30) return { label: "Moderately difficult", color: "ok" };
  return { label: "Difficult", color: "bad" };
}

export function keywordDensity(text: string, keyword: string): number {
  if (!keyword) return 0;
  const lower = text.toLowerCase();
  const k = keyword.toLowerCase().trim();
  if (!k) return 0;
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = lower.match(new RegExp(`\\b${escaped}\\b`, "g"));
  const wordCount = countWords(text);
  if (wordCount === 0) return 0;
  return Math.round(((matches?.length ?? 0) / wordCount) * 10000) / 100;
}