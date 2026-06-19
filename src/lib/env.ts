import { z } from "zod";

const OptionalString = z
  .string()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const ServerEnv = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  CLERK_SECRET_KEY: OptionalString,
  CLERK_WEBHOOK_SECRET: OptionalString,
  OPENROUTER_API_KEY: OptionalString,
  OPENROUTER_MODEL_PRIMARY: z.string().default("google/gemini-2.5-flash"),
  OPENROUTER_MODEL_FALLBACK: z.string().default("deepseek/deepseek-chat"),
  GOOGLE_PSI_API_KEY: OptionalString,
  UPSTASH_REDIS_REST_URL: OptionalString,
  UPSTASH_REDIS_REST_TOKEN: OptionalString,
  CRON_SECRET: z.string().optional(),
  LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("info"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const PublicEnv = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: OptionalString,
});

const parsedServer = ServerEnv.safeParse(process.env);
const parsedPublic = PublicEnv.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

if (!parsedServer.success && process.env.NODE_ENV !== "test") {
  console.warn(
    "[env] some optional env vars missing — running in fallback mode",
    parsedServer.error.flatten().fieldErrors,
  );
}
if (!parsedPublic.success) {
  console.warn(
    "[env] invalid public env:",
    parsedPublic.error.flatten().fieldErrors,
  );
}

export const env = {
  ...(parsedServer.success
    ? parsedServer.data
    : ({} as Record<string, never>)),
  ...(parsedPublic.success
    ? parsedPublic.data
    : ({} as Record<string, never>)),
} as z.infer<typeof ServerEnv> & z.infer<typeof PublicEnv>;

export const hasClerk = Boolean(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
export const hasOpenRouter = Boolean(env.OPENROUTER_API_KEY);
export const hasUpstash = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN,
);
export const hasPsi = Boolean(env.GOOGLE_PSI_API_KEY);