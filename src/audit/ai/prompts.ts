import { z } from "zod";

export const AIRecommendationSchema = z.object({
  whyItMatters: z
    .string()
    .min(10)
    .max(1000)
    .describe(
      "One short paragraph explaining why fixing this matters for user experience.",
    ),
  recommendation: z
    .string()
    .min(10)
    .max(1200)
    .describe(
      "Actionable fix the user can ship today, phrased as a numbered or imperative sentence.",
    ),
  businessImpact: z
    .string()
    .min(10)
    .max(1000)
    .describe("Explain the conversion and customer acquisition impact for a founder."),
  seoImpact: z
    .string()
    .min(10)
    .max(1000)
    .describe("Explain the search ranking and search visibility impact."),
  difficulty: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .describe("Rate the effort required to fix this issue."),
  fixCode: z
    .string()
    .max(4000)
    .optional()
    .describe("Optional HTML, CSS, meta tag, or config snippet that implements the fix."),
});

export type AIRecommendation = z.infer<typeof AIRecommendationSchema>;

export function buildPrompt(input: {
  url: string;
  title: string;
  issueTitle: string;
  issueDescription: string;
  baseRecommendation: string;
  context?: Record<string, unknown>;
}): string {
  const ctx = input.context
    ? `\n\nContext (JSON):\n${JSON.stringify(input.context, null, 2)}`
    : "";
  return `You are a world-class SaaS Growth and CRO Consultant. Rewrite the recommendation for the landing page issue below so it is concrete, prioritized, and immediately actionable for a SaaS founder trying to acquire customers and optimize conversions.

Rules:
- Return strict JSON matching this TypeScript type:
  { whyItMatters: string; recommendation: string; businessImpact: string; seoImpact: string; difficulty: "LOW" | "MEDIUM" | "HIGH"; fixCode?: string }
- whyItMatters: 1-2 sentences explaining why fixing this matters for user experience.
- recommendation: 1-2 imperative sentences describing exactly what to change.
- businessImpact: Explain how this affects customer acquisition, pricing conversions, and bounce rates.
- seoImpact: Explain how this affects search rankings and crawlability.
- difficulty: Rate the effort required to fix it ("LOW", "MEDIUM", or "HIGH").
- fixCode: only include a short snippet if it would actually be pasted into a file. Otherwise omit.

URL: ${input.url}
Page title: ${input.title || "(no title)"}

Issue: ${input.issueTitle}
Detected: ${input.issueDescription}
Baseline fix: ${input.baseRecommendation}${ctx}`;
}