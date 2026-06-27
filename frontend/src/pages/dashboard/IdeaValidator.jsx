import { useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, TrendingUp, ThumbsUp, ThumbsDown, AlertTriangle, Lightbulb, Users } from "lucide-react";
import { toast } from "sonner";
import { safe, arr } from "@/components/ErrorBoundary";

const CLIENT_DEMO = (industry, state) => ({
  _demo_ai: true,
  market_potential: { size: `₹50,000+ Cr Indian ${industry || "startup"} market`, growth: "18-25% CAGR", tam_sam_som: "TAM ₹50,000 Cr | SAM ₹5,000 Cr | SOM ₹50-150 Cr" },
  strengths: ["Growing manufacturing demand", "Industrial ecosystem support", "Recurring B2B contracts", "Asset-light SaaS layer possible"],
  weaknesses: ["High customer acquisition cost in early stage", "Capital intensive setup", "Talent retention"],
  risks: ["Competition", "Capital intensive setup", "Regulatory shifts", "Dependence on a few channels"],
  improvements: ["Narrow ICP first", "Set up referral programme", "Lock 2-3 distribution partners", "File trademark in week 1"],
  competitors: ["Local MSME manufacturers", "Industrial suppliers", "Larger incumbents digitising"],
  verdict: { score: 8, summary: "Proceed with detailed market validation." },
});

export default function IdeaValidator() {
  const { profile } = useProfile();
  const [idea, setIdea] = useState(profile?.description || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const validate = async () => {
    if (!idea) { toast.error("Describe your idea"); return; }
    setLoading(true);
    try {
      const r = await api.post("/validate/idea", { idea, industry: profile?.industry || "AI / SaaS", state: profile?.state || "Karnataka" });
      const d = r.data || {};
      setData(d);
      setIsDemo(!!d?._demo_ai);
      if (d?._demo_ai) toast.message("Showing demo guidance.");
    } catch (err) {
      console.error(err);
      setData(CLIENT_DEMO(profile?.industry || "AI / SaaS", profile?.state || "Karnataka"));
      setIsDemo(true);
      toast.message("Showing demo guidance due to unavailable AI service.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">Business idea validator</h2>
        <p className="text-muted-foreground mt-1">Get a structured market analysis for your idea — score, strengths, risks, competitors.</p>
      </div>

      <Card className="border-border">
        <CardContent className="pt-5">
          <Textarea data-testid="idea-textarea" value={idea} onChange={e => setIdea(e.target.value)} placeholder="Describe your startup idea in 2-3 sentences" className="min-h-[100px]" />
          <Button data-testid="validate-btn" onClick={validate} disabled={loading} className="mt-3">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validating…</> : <><Sparkles className="mr-2 h-4 w-4" /> Validate idea</>}
          </Button>
        </CardContent>
      </Card>

      {data && (
        <div className="space-y-5 fade-up">
          {isDemo && (
            <div data-testid="demo-ai-badge" className="inline-flex items-center gap-2 border border-warning/40 bg-warning/10 px-3 py-1.5 rounded-md text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Demo AI Mode · Showing demo guidance
            </div>
          )}
          <Card className="border-primary bg-primary/5"><CardContent className="pt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="label-eyebrow text-primary">Verdict</div>
              <div className="font-display text-2xl font-bold mt-1">{safe(data?.verdict?.summary)}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-6xl font-bold text-primary" data-testid="verdict-score">{safe(data?.verdict?.score) || "—"}<span className="text-2xl text-muted-foreground">/10</span></div>
            </div>
          </CardContent></Card>

          <div className="grid md:grid-cols-2 gap-4">
            <List icon={ThumbsUp} title="Strengths" items={arr(data.strengths)} color="text-success" />
            <List icon={ThumbsDown} title="Weaknesses" items={arr(data.weaknesses)} color="text-warning" />
            <List icon={AlertTriangle} title="Risks" items={arr(data.risks)} color="text-destructive" />
            <List icon={Lightbulb} title="Improvements" items={arr(data.improvements)} color="text-primary" />
          </div>

          <Card className="border-border"><CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-primary" strokeWidth={1.5} /><div className="label-eyebrow text-primary">Market potential</div></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Stat l="Size" v={safe(data?.market_potential?.size)} />
              <Stat l="Growth" v={safe(data?.market_potential?.growth)} />
              <Stat l="TAM/SAM/SOM" v={safe(data?.market_potential?.tam_sam_som)} />
            </div>
          </CardContent></Card>

          <Card className="border-border"><CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3"><Users className="h-4 w-4 text-primary" strokeWidth={1.5} /><div className="label-eyebrow text-primary">Likely competitors</div></div>
            <ul className="space-y-1.5 text-sm">{arr(data.competitors).map((c, i) => <li key={`comp-${i}`} className="border-b border-border last:border-0 py-2">{safe(c)}</li>)}</ul>
          </CardContent></Card>
        </div>
      )}
    </div>
  );
}

function List({ icon: Icon, title, items, color }) {
  return (
    <Card className="border-border"><CardContent className="pt-5">
      <div className="flex items-center gap-2 mb-3"><Icon className={`h-4 w-4 ${color}`} strokeWidth={1.5} /><div className="label-eyebrow text-primary">{title}</div></div>
      <ul className="space-y-1.5 text-sm">{arr(items).map((x, i) => <li key={`li-${i}`} className="flex gap-2"><span className={color}>•</span>{safe(x)}</li>)}</ul>
    </CardContent></Card>
  );
}
function Stat({ l, v }) { return <div><div className="text-xs text-muted-foreground">{l}</div><div className="font-display text-base font-semibold mt-1">{v}</div></div>; }
