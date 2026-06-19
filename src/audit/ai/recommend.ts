import { createHash } from "node:crypto";
import { chatCompletion } from "@/lib/openrouter";
import { hasOpenRouter } from "@/lib/env";
import { getRedis } from "@/lib/redis";
import {
  AIRecommendationSchema,
  buildPrompt,
  type AIRecommendation,
} from "./prompts";
import type { IssueDraft } from "@/audit/issues/types";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function cacheKey(input: { checkId: string; normalizedUrl: string }): string {
  return `cro-ai-v2:${createHash("sha256")
    .update(`${input.normalizedUrl}|${input.checkId}`)
    .digest("hex")
    .slice(0, 32)}`;
}

export type EnhancedIssue = IssueDraft & {
  source: IssueDraft["title"]; // preserved
};

export async function enhanceIssue(
  issue: IssueDraft,
  context: { url: string; title: string },
  options: { skipCache?: boolean } = {},
): Promise<IssueDraft> {
  // Apply fallback CRO metadata initially
  const baseEnhanced = {
    ...issue,
    businessImpact: issue.businessImpact || "Optimizing this landing page element reduces signup friction and improves user conversions.",
    seoImpact: issue.seoImpact || "Improves overall page structure, crawl accessibility, and keywords relevance.",
    difficulty: issue.difficulty || "LOW",
  };

  if (!hasOpenRouter) return baseEnhanced;

  const redis = getRedis();
  const key = cacheKey({
    checkId: issue.checkId,
    normalizedUrl: context.url,
  });

  if (!options.skipCache && redis) {
    try {
      const cached = await redis.get<AIRecommendation>(key);
      if (cached) {
        return {
          ...baseEnhanced,
          whyItMatters: cached.whyItMatters,
          recommendation: cached.recommendation,
          businessImpact: cached.businessImpact || baseEnhanced.businessImpact,
          seoImpact: cached.seoImpact || baseEnhanced.seoImpact,
          difficulty: cached.difficulty || baseEnhanced.difficulty,
          fixCode: cached.fixCode ?? issue.fixCode,
        };
      }
    } catch (err) {
      console.warn("[ai] redis cache read failed", err);
    }
  }

  const prompt = buildPrompt({
    url: context.url,
    title: context.title,
    issueTitle: issue.title,
    issueDescription: issue.description,
    baseRecommendation: issue.recommendation,
    context: issue.metadata,
  });

  const raw = await chatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You rewrite landing page issues into concrete CRO and conversion advice. Always respond with strict JSON.",
      },
      { role: "user", content: prompt },
    ],
    responseFormat: { type: "json_object" },
    temperature: 0.4,
    maxTokens: 600,
  });

  if (!raw) return baseEnhanced;

  try {
    let cleanRaw = raw.trim();
    if (cleanRaw.startsWith("```")) {
      const firstLineEnd = cleanRaw.indexOf("\n");
      if (firstLineEnd !== -1) {
        cleanRaw = cleanRaw.substring(firstLineEnd + 1);
      } else {
        cleanRaw = cleanRaw.substring(3);
      }
    }
    if (cleanRaw.endsWith("```")) {
      cleanRaw = cleanRaw.substring(0, cleanRaw.length - 3);
    }
    cleanRaw = cleanRaw.trim();

    const parsed = JSON.parse(cleanRaw);
    const validated = AIRecommendationSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn(
        "[ai] response failed schema",
        validated.error.flatten().fieldErrors,
      );
      return baseEnhanced;
    }
    if (redis) {
      try {
        await redis.set(key, validated.data, { ex: CACHE_TTL_SECONDS });
      } catch (err) {
        console.warn("[ai] redis cache write failed", err);
      }
    }
    return {
      ...baseEnhanced,
      whyItMatters: validated.data.whyItMatters,
      recommendation: validated.data.recommendation,
      businessImpact: validated.data.businessImpact,
      seoImpact: validated.data.seoImpact,
      difficulty: validated.data.difficulty,
      fixCode: validated.data.fixCode ?? issue.fixCode,
    };
  } catch (err) {
    console.warn("[ai] response parse failed", err);
    return baseEnhanced;
  }
}

export async function enhanceIssues(
  issues: IssueDraft[],
  context: { url: string; title: string },
  limit = 25,
): Promise<IssueDraft[]> {
  const targets = issues.slice(0, limit);
  const enhanced = await Promise.all(
    targets.map((issue) => enhanceIssue(issue, context)),
  );
  const remaining = issues.slice(limit);
  return [...enhanced, ...remaining];
}