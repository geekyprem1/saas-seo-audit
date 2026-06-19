import { z } from "zod";

export const AIRecommendationSchema = z.object({
  whyItMatters: z
    .string()
    .min(20)
    .max(280)
    .describe(
      "One short paragraph explaining the SEO impact in plain English for a non-technical founder.",
    ),
  recommendation: z
    .string()
    .min(20)
    .max(320)
    .describe(
      "Actionable fix the user can ship today, phrased as a numbered or imperative sentence.",
    ),
  fixCode: z
    .string()
    .max(500)
    .optional()
    .describe("Optional HTML, meta tag, or config snippet that implements the fix."),
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
  return `You are a senior SaaS SEO advisor. Rewrite the recommendation for the issue below so it is concrete, prioritized, and immediately actionable for a non-technical SaaS founder.

Rules:
- Return strict JSON matching this TypeScript type:
  { whyItMatters: string; recommendation: string; fixCode?: string }
- whyItMatters: 1-2 sentences explaining the SEO impact.
- recommendation: 1-2 imperative sentences describing exactly what to change.
- fixCode: only include a short snippet (HTML meta tag, robots.txt line, or config) if it would actually be pasted into a file. Otherwise omit.
- Do not invent details not implied by the issue. Do not promise ranking boosts.

URL: ${input.url}
Page title: ${input.title || "(no title)"}

Issue: ${input.issueTitle}
Detected: ${input.issueDescription}
Baseline fix: ${input.baseRecommendation}${ctx}`;
}