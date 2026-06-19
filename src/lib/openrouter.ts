import OpenAI from "openai";
import { hasOpenRouter, env } from "@/lib/env";

let client: OpenAI | null = null;

export function getOpenRouter(): OpenAI | null {
  if (!hasOpenRouter) return null;
  if (client) return client;
  client = new OpenAI({
    apiKey: env.OPENROUTER_API_KEY!,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
      "X-Title": "SaaS SEO Audit",
    },
  });
  return client;
}

export async function chatCompletion(params: {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  responseFormat?: { type: "json_object" };
  temperature?: number;
  maxTokens?: number;
}): Promise<string | null> {
  const client = getOpenRouter();
  if (!client) return null;

  const tryModel = async (model: string) =>
    client.chat.completions.create({
      model,
      messages: params.messages,
      temperature: params.temperature ?? 0.4,
      max_tokens: params.maxTokens ?? 800,
      response_format: params.responseFormat,
    });

  try {
    const res = await tryModel(env.OPENROUTER_MODEL_PRIMARY);
    return res.choices[0]?.message?.content ?? null;
  } catch (err) {
    console.warn(
      `[openrouter] primary model ${env.OPENROUTER_MODEL_PRIMARY} failed, falling back to ${env.OPENROUTER_MODEL_FALLBACK}`,
      err instanceof Error ? err.message : err,
    );
    try {
      const res = await tryModel(env.OPENROUTER_MODEL_FALLBACK);
      return res.choices[0]?.message?.content ?? null;
    } catch (err2) {
      console.error(
        "[openrouter] fallback failed",
        err2 instanceof Error ? err2.message : err2,
      );
      return null;
    }
  }
}