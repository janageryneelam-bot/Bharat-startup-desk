import { useEffect, useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, ArrowUpRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";

function HealthGauge({ score }) {
  const tier = score >= 75 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive";
  const dash = (score / 100) * 282;
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 100 100" className="-rotate-90 h-full w-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="6" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className={tier} strokeWidth="6" strokeDasharray={`${dash} 282`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className={`font-display text-5xl font-bold ${tier}`} data-testid="health-score-value">{score}</div>
          <div className="text-xs label-eyebrow text-muted-foreground">/100</div>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { profile } = useProfile();
  const [plan, setPlan] = useState(null);
  const [comp, setComp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    setLoading(true);
    Promise.all([
      api.post(`/profiles/${profile.id}/plan`).then(r => r.data).catch(() => null),
      api.get(`/compliance/${profile.id}`).then(r => r.data).catch(() => null),
    ]).then(([p, c]) => { setPlan(p); setComp(c); setLoading(false); });
  }, [profile?.id]);

  if (loading) return <div className="grid place-items-center py-20 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Generating your personalised plan…</div>;

  const score = plan?.health_score?.score || 0;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-border lg:col-span-1" data-testid="health-card">
          <CardContent className="pt-6">
            <div className="label-eyebrow text-primary">Startup health score</div>
            <div className="flex items-center justify-center py-4"><HealthGauge score={score} /></div>
            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
              {Object.entries(plan?.health_score?.factors || {}).map(([k, v]) => (
                <div key={k} className="border border-border rounded-md p-2">
                  <div className="capitalize text-muted-foreground">{k.replaceAll("_", " ")}</div>
                  <div className="font-mono font-bold mt-0.5">{v}/20</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2">
          <CardContent className="pt-6">
            <div className="label-eyebrow text-primary">Compliance pulse</div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Stat label="Completed" value={comp?.summary?.completed || 0} color="text-success" icon={CheckCircle2} />
              <Stat label="Upcoming" value={comp?.summary?.upcoming || 0} color="text-warning" icon={Clock} />
              <Stat label="Overdue" value={comp?.summary?.overdue || 0} color="text-destructive" icon={AlertCircle} />
            </div>
            <div className="mt-5 border-t border-border pt-4 space-y-2">
              <div className="label-eyebrow text-muted-foreground">Next 3 due</div>
              {(comp?.items || []).filter(x => x.status !== "completed").slice(0, 3).map((x, i) => (
                <div key={i} className="flex items-center justify-between text-sm border-b border-border last:border-0 py-2">
                  <span>{x.name}</span>
                  <span className="font-mono text-xs">{x.due_date}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4" data-testid="open-compliance-btn"><Link to="/dashboard/compliance">Open compliance <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="label-eyebrow text-primary">Top scheme matches</div>
            <ul className="mt-3 space-y-2">
              {(plan?.government_benefits || []).slice(0, 5).map((b, i) => (
                <li key={i} className="text-sm border-l-2 border-primary pl-3">{b}</li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-4" data-testid="open-schemes-btn"><Link to="/dashboard/schemes">All schemes →</Link></Button>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="label-eyebrow text-primary">30-day focus</div>
            <ul className="mt-3 space-y-2">
              {(plan?.roadmap?.["30_days"] || []).map((x, i) => (
                <li key={i} className="text-sm flex gap-2"><span className="text-primary">→</span>{x}</li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-4" data-testid="open-roadmap-btn"><Link to="/dashboard/roadmap">Full roadmap →</Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary bg-primary/5">
        <CardContent className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl font-bold">Have a question about your startup?</div>
            <div className="text-sm text-muted-foreground mt-1">Ask AI Copilot anything — GST, registrations, funding, compliance.</div>
          </div>
          <Button asChild data-testid="open-copilot-btn"><Link to="/dashboard/copilot"><Sparkles className="mr-2 h-4 w-4" /> Open Copilot</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon }) {
  return (
    <div className="border border-border rounded-md p-3">
      <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.5} />
      <div className={`font-display text-3xl font-bold mt-1 ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
