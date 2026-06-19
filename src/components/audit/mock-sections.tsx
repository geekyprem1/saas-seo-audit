"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, TrendingUp, BarChart2 } from "lucide-react";

export interface KeywordOpportunity {
  keyword: string;
  intent: string;
  vol: string;
  diff: string;
  pos: string;
  opp: string;
}

export function MockKeywordsSection({ keywords }: { keywords?: KeywordOpportunity[] }) {
  const data = keywords && keywords.length > 0 ? keywords : [
    { keyword: "saas seo audit", vol: "2,400", diff: "Medium", intent: "Commercial", pos: "12", opp: "High" },
    { keyword: "technical seo tool", vol: "8,100", diff: "Hard", intent: "Navigational", pos: "45", opp: "Medium" },
    { keyword: "free site audit", vol: "14,000", diff: "Very Hard", intent: "Informational", pos: "-", opp: "Low" },
    { keyword: "seo dashboard for agencies", vol: "850", diff: "Easy", intent: "Transactional", pos: "4", opp: "Very High" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Search className="mr-2 h-5 w-5 text-primary" />
              Keyword Opportunities
            </CardTitle>
            <CardDescription>Estimated search volumes and ranking difficulty for your niche.</CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {keywords && keywords.length > 0 ? "AI Analysis" : "Pro Feature"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead className="text-right">Search Volume</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Current Pos</TableHead>
                <TableHead>Opportunity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((kw, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{kw.keyword}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs">{kw.intent}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{kw.vol}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${
                      kw.diff === "Easy" ? "text-emerald-500" : kw.diff === "Medium" ? "text-amber-500" : "text-red-500"
                    }`}>
                      {kw.diff}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{kw.pos}</TableCell>
                  <TableCell>
                    <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {kw.opp}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export interface CompetitorData {
  domain: string;
  score: number;
  traffic: string;
  backlinks: string;
  isYou: boolean;
}

export function MockCompetitorsSection({ competitors }: { competitors?: CompetitorData[] }) {
  const data = competitors && competitors.length > 0 ? competitors : [
    { domain: "Your Site", score: 82, traffic: "12.4k", backlinks: "142", isYou: true },
    { domain: "ahrefs.com", score: 98, traffic: "2.1M", backlinks: "4.5M", isYou: false },
    { domain: "semrush.com", score: 95, traffic: "3.4M", backlinks: "8.2M", isYou: false },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Competitor Comparison
            </CardTitle>
            <CardDescription>See how your site stacks up against industry leaders.</CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {competitors && competitors.length > 0 ? "AI Comparison" : "Pro Feature"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {data.map((comp, i) => (
            <div key={i} className={`p-4 rounded-lg border ${comp.isYou ? 'border-primary bg-primary/5' : 'bg-muted/30'}`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-sm">{comp.domain}</h4>
                {comp.isYou && <Badge variant="default" className="text-[10px] h-4 px-1">YOU</Badge>}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SEO Score</span>
                  <span className="font-semibold">{comp.score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Traffic</span>
                  <span className="font-semibold">{comp.traffic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Backlinks</span>
                  <span className="font-semibold">{comp.backlinks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export interface CopyAnalysisData {
  strengths: string[];
  weaknesses: string[];
}

export function MockCopyAnalysisSection({ copyAnalysis }: { copyAnalysis?: CopyAnalysisData | null }) {
  const data = copyAnalysis ? copyAnalysis : {
    strengths: [
      "Clear value proposition in above-the-fold content",
      "Good use of action-oriented verbs (e.g., \"Start\", \"Boost\")",
      "Natural integration of primary keywords in H2s",
    ],
    weaknesses: [
      "Lack of social proof (testimonials, trust badges) near CTA",
      "Call-To-Action buttons are generic (\"Submit\" instead of \"Get Started\")",
      "High \"Flesch Reading Ease\" score suggests text might be too complex",
    ],
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl">
              <span className="text-primary mr-2 text-xl font-bold">Aa</span>
              Copy & Messaging Analysis
            </CardTitle>
            <CardDescription>AI-driven analysis of your landing page copy and conversion signals.</CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {copyAnalysis ? "AI Insights" : "Pro Feature"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 bg-emerald-50 dark:bg-emerald-950/20">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Strengths</h4>
              <ul className="text-sm space-y-2 text-emerald-800 dark:text-emerald-300">
                {data.strengths.map((str, i) => (
                  <li key={i}>• {str}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20">
              <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Weaknesses</h4>
              <ul className="text-sm space-y-2 text-amber-800 dark:text-amber-300">
                {data.weaknesses.map((weak, i) => (
                  <li key={i}>• {weak}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
