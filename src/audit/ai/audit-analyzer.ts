import { chatCompletion } from "@/lib/openrouter";
import { hasOpenRouter } from "@/lib/env";
import { z } from "zod";
import type { IssueDraft } from "@/audit/issues/types";
import type { CategoryScores } from "@/audit/scoring/score";

export const AuditAiDataSchema = z.object({
  aiSummary: z.string(),
  keywords: z.array(z.object({
    keyword: z.string(),
    intent: z.enum(["Informational", "Commercial", "Transactional", "Navigational"]),
    vol: z.string(),
    diff: z.enum(["Easy", "Medium", "Hard", "Very Hard"]),
    pos: z.string(),
    opp: z.enum(["Low", "Medium", "High", "Very High"]),
  })),
  competitors: z.array(z.object({
    domain: z.string(),
    score: z.number().min(1).max(100),
    traffic: z.string(),
    backlinks: z.string(),
    isYou: z.boolean(),
  })),
  copyAnalysis: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  }),
});

export type AuditAiData = z.infer<typeof AuditAiDataSchema>;

export function getFallbackAiData(hostname: string, overallScore: number): AuditAiData {
  return {
    aiSummary: `## Executive Summary
Your website **${hostname}** has an overall SEO score of **${overallScore}/100**. While the technical foundations are in place, there are key areas for improvement in content density, meta description optimizations, and page performance.

## Top Action Items
- **Optimize Page Load Speed:** Implement modern image formats and optimize hero resources to improve LCP.
- **Enhance Metadata:** Ensure all pages have unique, high-quality title tags and meta descriptions within standard length limits.
- **Structured Data:** Implement schema markup to improve search engine layout and click-through rates.`,
    keywords: [
      { keyword: `${hostname.split('.')[0]} services`, vol: "320", diff: "Easy", intent: "Commercial", pos: "12", opp: "High" },
      { keyword: "best niche tools", vol: "1,200", diff: "Medium", intent: "Informational", pos: "-", opp: "High" },
      { keyword: "how to choose platform", vol: "850", diff: "Easy", intent: "Informational", pos: "24", opp: "Medium" },
      { keyword: "expert pricing comparison", vol: "240", diff: "Hard", intent: "Transactional", pos: "-", opp: "Low" },
    ],
    competitors: [
      { domain: "Your Site", score: overallScore, traffic: "1.2k", backlinks: "48", isYou: true },
      { domain: "competitor-a.com", score: 85, traffic: "45k", backlinks: "1.2k", isYou: false },
      { domain: "competitor-b.com", score: 72, traffic: "18k", backlinks: "310", isYou: false },
    ],
    copyAnalysis: {
      strengths: [
        "Clear and readable heading layout structure",
        "Clean focus on core services above the fold",
      ],
      weaknesses: [
        "Call-to-Action button could be more action-oriented",
        "Missing social proof signals or testimonials near landing zone",
      ],
    },
  };
}

export async function generateAuditAiData(input: {
  url: string;
  hostname: string;
  title: string;
  description: string;
  headings: string[];
  issues: IssueDraft[];
  scores: CategoryScores;
  overallScore: number;
}): Promise<AuditAiData> {
  if (!hasOpenRouter) {
    return getFallbackAiData(input.hostname, input.overallScore);
  }

  const prompt = `You are a world-class senior SEO consultant and growth marketer analyzing a landing page.
Your task is to generate actionable, strategic insights for this website.

Website URL: ${input.url}
Page Title: ${input.title || "(no title)"}
Meta Description: ${input.description || "(no description)"}
Headings: ${input.headings.slice(0, 10).join(" | ")}

SEO Audit Scores:
- Overall SEO Score: ${input.overallScore}/100
- Technical SEO: ${input.scores.TECHNICAL}/100
- Performance: ${input.scores.PERFORMANCE}/100
- Content: ${input.scores.CONTENT}/100
- Accessibility: ${input.scores.ACCESSIBILITY}/100

Key Detected Issues:
${input.issues.slice(0, 8).map(i => `- [${i.severity}] [${i.category}] ${i.title}`).join("\n")}

You must return a valid JSON object matching this schema exactly:
{
  "aiSummary": "markdown string",
  "keywords": [
    { "keyword": "string", "intent": "Informational|Commercial|Transactional|Navigational", "vol": "string (e.g. '1.5k' or '450')", "diff": "Easy|Medium|Hard|Very Hard", "pos": "string (estimated current rank, e.g. '12' or '-')", "opp": "Low|Medium|High|Very High" }
  ],
  "competitors": [
    { "domain": "string", "score": number (1-100), "traffic": "string (e.g. '24k' or '1.2M')", "backlinks": "string (e.g. '800' or '4.5M')", "isYou": boolean }
  ],
  "copyAnalysis": {
    "strengths": ["string (up to 4 bullet points)"],
    "weaknesses": ["string (up to 4 bullet points)"]
  }
}

Instructions for fields:
1. "aiSummary": Write a 2-3 paragraph executive summary in markdown. Under ## Executive Summary, write the core performance and technical state. Under ## Top Action Items, provide 3 bullet points with the highest ROI actions. Keep it direct and empowering for a founder.
2. "keywords": Recommend 4 keyword opportunities that are highly relevant to the website's title, niche, and content.
3. "competitors": Suggest 2 real or potential competitors in the same domain. Add a third entry with domain "Your Site", isYou: true, and the Overall SEO Score.
4. "copyAnalysis": Provide a genuine evaluation of their above-the-fold content, headings, and readability.

Ensure the output is ONLY the raw JSON string. Do not include markdown wrappers like \`\`\`json.`;

  try {
    const raw = await chatCompletion({
      messages: [
        {
          role: "system",
          content: "You are an SEO analysis API. Respond with a raw JSON object matching the requested schema and containing realistic analysis. Do not wrap in markdown syntax.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: { type: "json_object" },
      temperature: 0.5,
      maxTokens: 1000,
    });

    if (!raw) {
      return getFallbackAiData(input.hostname, input.overallScore);
    }

    // Clean JSON of any possible wrapper code blocks
    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.substring(7);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    }
    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr);
    const validated = AuditAiDataSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn("[audit-analyzer] JSON validation failed, using fallback:", validated.error.flatten().fieldErrors);
      return getFallbackAiData(input.hostname, input.overallScore);
    }

    return validated.data;
  } catch (err) {
    console.error("[audit-analyzer] failed to generate dynamic SEO insights", err);
    return getFallbackAiData(input.hostname, input.overallScore);
  }
}
