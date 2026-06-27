import { useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, TrendingUp, ThumbsUp, ThumbsDown, AlertTriangle, Lightbulb, Users } from "lucide-react";
import { toast } from "sonner";

export default function IdeaValidator() {
  const { profile } = useProfile();
  const [idea, setIdea] = useState(profile?.description || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = async () => {
    if (!idea) { toast.error("Describe your idea"); return; }
    setLoading(true);
    try {
      const r = await api.post("/validate/idea", { idea, industry: profile?.industry || "AI / SaaS", state: profile?.state || "Karnataka" });
      setData(r.data);
    } catch { toast.error("Failed"); }
    finally { setLoading(false); }
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
          <Card className="border-primary bg-primary/5"><CardContent className="pt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="label-eyebrow text-primary">Verdict</div>
              <div className="font-display text-2xl font-bold mt-1">{data.verdict?.summary}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-6xl font-bold text-primary" data-testid="verdict-score">{data.verdict?.score}<span className="text-2xl text-muted-foreground">/10</span></div>
            </div>
          </CardContent></Card>

          <div className="grid md:grid-cols-2 gap-4">
            <List icon={ThumbsUp} title="Strengths" items={data.strengths} color="text-success" />
            <List icon={ThumbsDown} title="Weaknesses" items={data.weaknesses} color="text-warning" />
            <List icon={AlertTriangle} title="Risks" items={data.risks} color="text-destructive" />
            <List icon={Lightbulb} title="Improvements" items={data.improvements} color="text-primary" />
          </div>

          <Card className="border-border"><CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-primary" strokeWidth={1.5} /><div className="label-eyebrow text-primary">Market potential</div></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Stat l="Size" v={data.market_potential?.size} />
              <Stat l="Growth" v={data.market_potential?.growth} />
              <Stat l="TAM/SAM/SOM" v={data.market_potential?.tam_sam_som} />
            </div>
          </CardContent></Card>

          <Card className="border-border"><CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3"><Users className="h-4 w-4 text-primary" strokeWidth={1.5} /><div className="label-eyebrow text-primary">Likely competitors</div></div>
            <ul className="space-y-1.5 text-sm">{(data.competitors || []).map((c, i) => <li key={i} className="border-b border-border last:border-0 py-2">{c}</li>)}</ul>
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
      <ul className="space-y-1.5 text-sm">{(items || []).map((x, i) => <li key={i} className="flex gap-2"><span className={color}>•</span>{x}</li>)}</ul>
    </CardContent></Card>
  );
}
function Stat({ l, v }) { return <div><div className="text-xs text-muted-foreground">{l}</div><div className="font-display text-base font-semibold mt-1">{v}</div></div>; }
