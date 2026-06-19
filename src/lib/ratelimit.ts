import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/lib/redis";

type Bucket = "audit" | "api" | "ai";

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export async function checkRateLimit(
  bucket: Bucket,
  identifier: string,
  limit = 10,
  window = "1 m",
): Promise<RateLimitResult> {
  const redis = getRedis();
  if (!redis) {
    return { success: true, limit, remaining: limit, reset: Date.now() };
  }
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window as `${number} ${"s" | "m" | "h"}`),
    prefix: `rl:${bucket}`,
  });
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}