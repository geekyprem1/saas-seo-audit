import { fetch as undiciFetch, Agent, type Headers as UndiciHeaders } from "undici";

const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

export type FetchResult = {
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
  finalUrl: string;
  contentType: string;
  html: string;
  headers: Record<string, string>;
  redirects: string[];
  durationMs: number;
  bytes: number;
  error?: string;
};

const SAFE_AGENT = new Agent({
  connect: { timeout: 10_000 },
  bodyTimeout: DEFAULT_TIMEOUT_MS,
  headersTimeout: DEFAULT_TIMEOUT_MS,
});

type UndiciRequestInit = Parameters<typeof undiciFetch>[1];

export async function fetchHtml(
  target: string,
  options: {
    userAgent?: string;
    timeoutMs?: number;
    maxBytes?: number;
  } = {},
): Promise<FetchResult> {
  const startedAt = Date.now();
  const ua =
    options.userAgent ?? "SEOAuditBot/1.0 (+https://saasseoaudit.com)";
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;

  const init: UndiciRequestInit = {
    method: "GET",
    headers: {
      "User-Agent": ua,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    dispatcher: SAFE_AGENT,
  };

  try {
    const res = await undiciFetch(target, init);

    const contentType = res.headers.get("content-type") ?? "";
    let text: string;
    try {
      text = await res.text();
    } catch (err) {
      return {
        ok: false,
        status: res.status,
        statusText: res.statusText,
        url: target,
        finalUrl: res.url ?? target,
        contentType,
        html: "",
        headers: undiciHeadersToObject(res.headers),
        redirects: [],
        durationMs: Date.now() - startedAt,
        bytes: 0,
        error: err instanceof Error ? err.message : "Failed to read response body",
      };
    }
    const bytes = Buffer.byteLength(text, "utf8");

    if (bytes > maxBytes) {
      return {
        ok: false,
        status: res.status,
        statusText: res.statusText,
        url: target,
        finalUrl: res.url ?? target,
        contentType,
        html: "",
        headers: undiciHeadersToObject(res.headers),
        redirects: [],
        durationMs: Date.now() - startedAt,
        bytes,
        error: `Response exceeded ${maxBytes} byte limit`,
      };
    }

    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      url: target,
      finalUrl: res.url ?? target,
      contentType,
      html: text,
      headers: undiciHeadersToObject(res.headers),
      redirects: [],
      durationMs: Date.now() - startedAt,
      bytes,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      statusText: "Network Error",
      url: target,
      finalUrl: target,
      contentType: "",
      html: "",
      headers: {},
      redirects: [],
      durationMs: Date.now() - startedAt,
      bytes: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function undiciHeadersToObject(headers: UndiciHeaders): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

export async function fetchText(
  target: string,
  options: { userAgent?: string; timeoutMs?: number } = {},
): Promise<{ ok: boolean; status: number; text: string }> {
  try {
    const res = await undiciFetch(target, {
      method: "GET",
      headers: {
        "User-Agent":
          options.userAgent ?? "SEOAuditBot/1.0 (+https://saasseoaudit.com)",
      },
      dispatcher: SAFE_AGENT,
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch {
    return { ok: false, status: 0, text: "" };
  }
}