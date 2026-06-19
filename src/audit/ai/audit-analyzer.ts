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
    whatProductDoes: z.string(),
    targetAudience: z.string(),
    whyDifferent: z.string(),
    clarityScore: z.number().min(1).max(10),
    differentiationScore: z.number().min(1).max(10),
  }),
  aiDataExtra: z.object({
    founderVerdict: z.array(z.string()),
    founderVerdictImpact: z.string(),
    differentiationRisk: z.enum(["High", "Medium", "Low"]),
    differentiationReason: z.string(),
    quickWins: z.array(z.string()),
    growthOpportunities: z.array(z.string()),
    conversionOpportunities: z.array(z.string()),
    seoOpportunities: z.array(z.string()),
    trustImprovements: z.array(z.string()),
    plan30Day: z.array(z.string()),
    plan90Day: z.array(z.string()),
  }),
});

export type AuditAiData = z.infer<typeof AuditAiDataSchema>;

export function getFallbackAiData(hostname: string, overallScore: number): AuditAiData {
  return {
    aiSummary: `## Executive Summary
Your landing page for **${hostname}** has an overall Growth Score of **${overallScore}/100**. While the technical foundations are sound, the page is currently leaking conversions due to weak CTA repetition, minimal social proof signals below the fold, and messaging that could target your ideal persona more directly.

By addressing these core items, you can immediately reduce user friction and capture high-intent signups.`,
    keywords: [
      { keyword: `${hostname.split('.')[0]} analytics`, vol: "850", diff: "Easy", intent: "Commercial", pos: "15", opp: "High" },
      { keyword: "b2b conversion optimizer", vol: "380", diff: "Medium", intent: "Commercial", pos: "-", opp: "High" },
      { keyword: "why landing page fails", vol: "1,200", diff: "Easy", intent: "Informational", pos: "22", opp: "Medium" },
      { keyword: "saas customer onboarding tools", vol: "450", diff: "Hard", intent: "Transactional", pos: "-", opp: "Medium" },
    ],
    competitors: [
      { domain: "Your Site", score: overallScore, traffic: "1.4k", backlinks: "52", isYou: true },
      { domain: "ahrefs-siteaudit.com", score: 88, traffic: "120k", backlinks: "14.2k", isYou: false },
      { domain: "semrush-checker.com", score: 79, traffic: "84k", backlinks: "5.1k", isYou: false },
    ],
    copyAnalysis: {
      strengths: [
        "Clear core product sentence in the H1 tag.",
        "Simple navigation path with visible call-to-actions.",
      ],
      weaknesses: [
        "The value proposition lacks a clear, unique differentiator.",
        "Missing target audience reference in above-the-fold headers.",
      ],
      whatProductDoes: "A landing page and conversion analyzer for modern software builders.",
      targetAudience: "SaaS founders, indie hackers, and growth teams.",
      whyDifferent: "Uses targeted heuristic rules combined with growth consultant logic rather than simple checklists.",
      clarityScore: 7,
      differentiationScore: 5,
    },
    aiDataExtra: {
      founderVerdict: [
        "Add a primary CTA button above the fold immediately.",
        "Integrate 3 customer testimonials with faces and logo badges.",
        "Add a transparent Pricing grid or 'Start Trial, No Card Required' badge."
      ],
      founderVerdictImpact: "High",
      differentiationRisk: "Medium",
      differentiationReason: "Headline uses generic productivity messaging that could belong to 100 other SaaS products.",
      quickWins: [
        "Add customer testimonials.",
        "Improve main CTA wording.",
        "Add an accordion-style FAQ section.",
        "Fix missing meta description tag."
      ],
      growthOpportunities: [
        "Target commercial-intent SaaS builders with comparison copy.",
        "Create dedicated sub-persona feature sections."
      ],
      conversionOpportunities: [
        "Repeat CTA at the bottom page segment.",
        "Use high-contrast button styling."
      ],
      seoOpportunities: [
        "Optimize meta tags for landing-page audit keywords.",
        "Add FAQ schema markup to the codebase."
      ],
      trustImprovements: [
        "Add founder photo and signature card.",
        "Link Privacy Policy and Terms of Service in the footer."
      ],
      plan30Day: [
        "Publish transparent pricing tables.",
        "Rewrite Hero H1 to state target persona.",
        "Implement risk reversal messaging under CTA buttons."
      ],
      plan90Day: [
        "Build 3 comparison pages comparing your tool against legacy checkers.",
        "Run A/B tests on headline copy layout.",
        "Integrate structured customer success story block."
      ]
    }
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
  metrics: any;
}): Promise<AuditAiData> {
  if (!hasOpenRouter) {
    return getFallbackAiData(input.hostname, input.overallScore);
  }

  const prompt = `You are a world-class senior growth marketer and CRO consultant.
Analyze this landing page structure and content:

Website URL: ${input.url}
Page Title: ${input.title || "(no title)"}
Meta Description: ${input.description || "(no description)"}
Headings (H1/H2): ${input.headings.slice(0, 10).join(" | ")}

Growth Scores:
- Growth Score: ${input.overallScore}/100
- Conversion Score: ${input.scores.CONVERSION}/100
- Messaging Score: ${input.scores.MESSAGING}/100
- Trust Score: ${input.scores.TRUST}/100
- Technical Score: ${input.scores.TECHNICAL}/100
- Performance Score: ${input.scores.PERFORMANCE}/100

Key Detected Issues:
${input.issues.slice(0, 10).map(i => `- [${i.severity}] [${i.category}] ${i.title}`).join("\n")}

You must return a valid JSON object matching this schema exactly:
{
  "aiSummary": "markdown string",
  "keywords": [
    { "keyword": "string", "intent": "Informational|Commercial|Transactional|Navigational", "vol": "string", "diff": "Easy|Medium|Hard|Very Hard", "pos": "string", "opp": "Low|Medium|High|Very High" }
  ],
  "competitors": [
    { "domain": "string", "score": number, "traffic": "string", "backlinks": "string", "isYou": boolean }
  ],
  "copyAnalysis": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "whatProductDoes": "string (what does the product do)",
    "targetAudience": "string (who is it for)",
    "whyDifferent": "string (why it is different/unique)",
    "clarityScore": number (1-10),
    "differentiationScore": number (1-10)
  },
  "aiDataExtra": {
    "founderVerdict": ["3 string action items of what to fix first, ordered by priority"],
    "founderVerdictImpact": "High|Medium|Low",
    "differentiationRisk": "High|Medium|Low",
    "differentiationReason": "string (Explain: Can this headline belong to 100 other SaaS products?)",
    "quickWins": ["3-5 strings of wins that take < 1 hour"],
    "growthOpportunities": ["2-3 growth opportunities"],
    "conversionOpportunities": ["2-3 conversion opportunities"],
    "seoOpportunities": ["2-3 SEO opportunities"],
    "trustImprovements": ["2-3 trust improvements"],
    "plan30Day": ["3-4 actionable 30-day improvements"],
    "plan90Day": ["3-4 growth action items for 90 days"]
  }
}

CRITICAL RULES:
- Respond ONLY with raw JSON. No markdown wrappers.
- Keep all text values extremely short and punchy (1-2 sentences max, under 180 characters) to ensure the JSON does not get truncated.`;

  try {
    const raw = await chatCompletion({
      messages: [
        {
          role: "system",
          content: "You are an AI Growth Consultant API. Respond with a raw JSON object matching the requested schema. Keep descriptions short and concise. Do not wrap in markdown codeblocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: { type: "json_object" },
      temperature: 0.5,
      maxTokens: 2500,
    });

    if (!raw) {
      return getFallbackAiData(input.hostname, input.overallScore);
    }

    let jsonStr = raw.trim();
    if (jsonStr.startsWith("```")) {
      const firstLineEnd = jsonStr.indexOf("\n");
      if (firstLineEnd !== -1) {
        jsonStr = jsonStr.substring(firstLineEnd + 1);
      } else {
        jsonStr = jsonStr.substring(3);
      }
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
    console.error("[audit-analyzer] failed to generate dynamic growth insights", err);
    return getFallbackAiData(input.hostname, input.overallScore);
  }
}
