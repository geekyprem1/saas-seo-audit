import { z } from "zod";

const PrivateIPv4 = /^(?:10\.|127\.|169\.254\.|192\.168\.|0\.0\.0\.0|172\.(?:1[6-9]|2[0-9]|3[01])\.)/;
const Localhost = /^(?:localhost|.*\.local|.*\.internal)$/i;

export const NormalizedUrlSchema = z.object({
  url: z.string().url(),
  normalizedUrl: z.string().url(),
  hostname: z.string(),
  protocol: z.enum(["http:", "https:"]),
});

export type NormalizedUrl = z.infer<typeof NormalizedUrlSchema>;

export function normalizeUrl(input: string): NormalizedUrl {
  const raw = input.trim();
  if (!raw) throw new Error("URL is required");

  let candidate = raw;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("Invalid URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported");
  }

  if (Localhost.test(parsed.hostname)) {
    throw new Error("Localhost URLs are not allowed");
  }

  const ipMatch = parsed.hostname.match(/^\d{1,3}(?:\.\d{1,3}){3}$/);
  if (ipMatch && PrivateIPv4.test(parsed.hostname)) {
    throw new Error("Private network URLs are not allowed");
  }

  parsed.hash = "";
  parsed.username = "";
  parsed.password = "";

  if (
    (parsed.protocol === "https:" && parsed.port === "443") ||
    (parsed.protocol === "http:" && parsed.port === "80")
  ) {
    parsed.port = "";
  }

  let path = parsed.pathname;
  if (path.length > 1 && path.endsWith("/")) {
    path = path.replace(/\/+$/, "");
    parsed.pathname = path || "/";
  }

  const normalizedUrl = parsed.toString();
  return {
    url: candidate,
    normalizedUrl,
    hostname: parsed.hostname,
    protocol: parsed.protocol as "http:" | "https:",
  };
}