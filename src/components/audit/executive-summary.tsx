import { ScoreRing } from "./score-ring";
import { Card, CardContent } from "@/components/ui/card";
import { type Grade } from "@/lib/grades";
import { Gauge, Zap, MessageSquare, ShieldCheck, Gift, Activity, FileText } from "lucide-react";

export interface ExecutiveSummaryProps {
  growthScore: number;
  grade: Grade;
  categoryScores: {
    CONVERSION: number;
    MESSAGING: number;
    TRUST: number;
    TECHNICAL: number;
    PERFORMANCE: number;
    OFFER: number;
    CONTENT?: number;
  };
}

export function ExecutiveSummary({ growthScore, grade, categoryScores }: ExecutiveSummaryProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Score */}
      <Card className="col-span-full lg:col-span-1 border-indigo-500/20 bg-indigo-500/5 shadow-sm">
        <CardContent className="flex h-full flex-col items-center justify-center py-8">
          <ScoreRing score={growthScore} grade={grade} size={160} />
          <h2 className="mt-4 text-center font-bold text-lg text-foreground">Overall Growth Score</h2>
          <p className="text-center text-xs text-muted-foreground mt-1 max-w-[200px]">
            Weighted conversion and copy-effectiveness index
          </p>
        </CardContent>
      </Card>

      {/* Sub-scores Grid */}
      <div className="col-span-full lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard 
          title="Conversion" 
          score={categoryScores.CONVERSION} 
          icon={<Zap className="h-4 w-4 text-emerald-500" />} 
          description="CTA wordings & placement"
        />
        <MetricCard 
          title="Messaging" 
          score={categoryScores.MESSAGING} 
          icon={<MessageSquare className="h-4 w-4 text-purple-500" />} 
          description="Headline & value prop clarity"
        />
        <MetricCard 
          title="Trust Signals" 
          score={categoryScores.TRUST} 
          icon={<ShieldCheck className="h-4 w-4 text-blue-500" />} 
          description="Social proof, reviews, FAQs"
        />
        <MetricCard 
          title="Offer Details" 
          score={categoryScores.OFFER} 
          icon={<Gift className="h-4 w-4 text-pink-500" />} 
          description="Pricing & risk reversals"
        />
        <MetricCard 
          title="Technical & SEO" 
          score={categoryScores.TECHNICAL} 
          icon={<Gauge className="h-4 w-4 text-orange-500" />} 
          description="Redirects, HTTPS, indexability"
        />
        <MetricCard 
          title="Performance" 
          score={categoryScores.PERFORMANCE} 
          icon={<Activity className="h-4 w-4 text-yellow-500" />} 
          description="Load speed & Web Vitals"
        />
      </div>
    </div>
  );
}

function MetricCard({ title, score, icon, description }: { title: string; score: number; icon: React.ReactNode; description: string }) {
  return (
    <Card className="border border-border bg-card hover:bg-accent/10 transition-colors">
      <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
        <div className="flex items-start gap-2">
          <div className="p-1.5 bg-muted rounded-md shrink-0">{icon}</div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs text-foreground truncate">{title}</h3>
            <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">{description}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-end justify-between leading-none">
            <span className="text-xl font-bold tabular-nums">{score}</span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                score >= 90 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
