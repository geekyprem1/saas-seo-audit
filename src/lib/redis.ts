import { Redis } from "@upstash/redis";
import { hasUpstash } from "@/lib/env";

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (!hasUpstash) return null;
  if (client) return client;
  client = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return client;
}