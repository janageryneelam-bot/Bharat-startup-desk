import { useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Trademark() {
  const { profile } = useProfile();
  const [name, setName] = useState(profile?.name || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!name) { toast.error("Enter a brand name"); return; }
    setLoading(true);
    try {
      const r = await api.post("/trademark/advice", { startup_name: name, industry: profile?.industry || "AI / SaaS" });
      setData(r.data);
    } catch { toast.error("AI generation failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">Trademark & IP Advisor</h2>
        <p className="text-muted-foreground mt-1">Get class recommendations, filing cost, IP checklist & patent opportunity for your brand.</p>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6 flex flex-col md:flex-row gap-3">
          <Input data-testid="brand-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Brand / startup name" className="md:flex-1" />
          <Button data-testid="generate-tm-btn" onClick={generate} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing…</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate advice</>}
          </Button>
        </CardContent>
      </Card>

      {data && (
        <div className="space-y-5 fade-up">
          <Card className="border-border">
            <CardContent className="pt-5">
              <div className="label-eyebrow text-primary">Recommended classes</div>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {(data.recommended_classes || []).map((c, i) => (
                  <div key={i} className="border border-border rounded-md p-3">
                    <div className="font-display text-2xl font-bold text-primary">Class {c.class}</div>
                    <div className="text-sm text-muted-foreground mt-1">{c.covers}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">IP checklist</div><ul className="mt-3 space-y-1.5 text-sm">{(data.ip_checklist || []).map((x, i) => <li key={i} className="flex gap-2"><Shield className="h-3.5 w-3.5 text-primary mt-1" strokeWidth={1.5} />{x}</li>)}</ul></CardContent></Card>
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">Filing tips</div><ul className="mt-3 space-y-1.5 text-sm">{(data.suggestions || []).map((x, i) => <li key={i} className="flex gap-2"><span className="text-primary">→</span>{x}</li>)}</ul></CardContent></Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">Estimated cost</div><div className="font-display text-xl font-bold mt-2">{data.estimated_cost}</div></CardContent></Card>
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">Timeline</div><div className="font-display text-xl font-bold mt-2">{data.timeline}</div></CardContent></Card>
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">Patent opportunity</div><div className="font-display text-xl font-bold mt-2">{data.patent_opportunity?.likely ? "Yes" : "Unlikely"}</div><div className="text-xs text-muted-foreground mt-1">{data.patent_opportunity?.rationale}</div></CardContent></Card>
          </div>
        </div>
      )}
    </div>
  );
}
