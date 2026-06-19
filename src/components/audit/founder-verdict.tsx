"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, ArrowUpRight, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FounderVerdictProps {
  verdictList?: string[];
  impact?: string;
}

export function FounderVerdict({ verdictList = [], impact = "High" }: FounderVerdictProps) {
  // Safe defaults if empty
  const items = verdictList.length > 0 ? verdictList : [
    "Add a primary CTA button directly above the fold in the Hero section.",
    "Embed 3 customer testimonials with avatars and company logo badges below the fold.",
    "Publish pricing tiers transparently with a satisfaction guarantee snippet."
  ];

  return (
    <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-background to-sky-950/20 overflow-hidden relative shadow-md">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="h-32 w-32 text-indigo-500" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Founder Verdict</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                If I were a SaaS founder, I would fix these 3 things first
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Estimated Conversion Impact:</span>
            <Badge className="bg-indigo-500 hover:bg-indigo-600 font-bold uppercase tracking-wider px-2.5 py-0.5">
              {impact}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {items.slice(0, 3).map((item, idx) => (
            <div 
              key={idx} 
              className="relative flex flex-col justify-between rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-5 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-xs">
                    {idx + 1}
                  </span>
                  <Badge variant="outline" className="text-[10px] text-indigo-400 border-indigo-500/30 font-medium">
                    Priority {idx === 0 ? "Critical" : idx === 1 ? "High" : "Medium"}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {item}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs text-indigo-400 font-semibold gap-1">
                <span>Fix now</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
