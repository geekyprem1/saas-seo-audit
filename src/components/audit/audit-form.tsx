"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "polling" | "completed" | "error";

export function AuditForm({
  onCompleted,
}: {
  onCompleted?: (auditId: string) => void;
}) {
  const router = useRouter();
  const [url, setUrl] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [auditId, setAuditId] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL");
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }
      const data = (await res.json()) as
        | { auditId: string }
        | { error: string; reset?: number; remaining?: number };

      if (!res.ok || "error" in data) {
        const msg = "error" in data ? data.error : "Failed to start audit";
        setError(msg);
        setStatus("error");
        return;
      }
      setAuditId(data.auditId);
      setStatus("polling");
      poll(data.auditId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  };

  const poll = React.useCallback(async (id: string) => {
    const start = Date.now();
    const interval = 1500;
    while (Date.now() - start < 90_000) {
      try {
        const res = await fetch(`/api/audit/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { status: string };
          if (data.status === "COMPLETED") {
            setStatus("completed");
            onCompleted?.(id);
            return;
          }
          if (data.status === "FAILED") {
            setError("Audit failed. Please try again or pick a different URL.");
            setStatus("error");
            return;
          }
        }
      } catch {
        // network blip — keep polling
      }
      await new Promise((r) => setTimeout(r, interval));
    }
    setError("Audit timed out. Please try again.");
    setStatus("error");
  }, [onCompleted]);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={status === "submitting" || status === "polling"}
              autoComplete="off"
              required
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              We&apos;ll crawl the page, run messaging, conversion, trust, and performance checks, and
              generate a Growth Score in under a minute.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={status === "submitting" || status === "polling"}
            className="w-full sm:w-auto"
          >
            {status === "submitting" || status === "polling" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {status === "submitting" ? "Starting…" : "Analyzing…"}
              </>
            ) : (
              "Analyze Landing Page"
            )}
          </Button>

          {status === "polling" && (
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <p className="text-xs text-[var(--muted-foreground)]">
                Crawling, scoring, and generating AI growth recommendations. This usually
                takes 20–40 seconds.
              </p>
            </div>
          )}

          {status === "completed" && auditId && (
            <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-4" />
              Audit complete. Redirecting…
              <a
                href={`/audit/${auditId}`}
                className="ml-auto font-medium underline-offset-4 hover:underline"
              >
                View report →
              </a>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="size-4" />
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}