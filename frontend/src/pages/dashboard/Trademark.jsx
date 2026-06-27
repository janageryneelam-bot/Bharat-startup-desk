import { useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { safe, arr } from "@/components/ErrorBoundary";

const CLIENT_DEMO = (name, industry) => ({
  _demo_ai: true,
  recommended_classes: [
    { class: 35, covers: "Business / advertising / e-commerce services" },
    { class: industry === "Manufacturing" ? 6 : (industry === "AI / SaaS" ? 42 : 35), covers: industry === "Manufacturing" ? "Common metals & their alloys (rivets, springs, fasteners)" : (industry === "AI / SaaS" ? "Software, SaaS & technology services" : "Industry-specific class") },
  ],
  suggestions: [
    `File '${name || "your brand"}' under primary class within first 7 days`,
    "Run free search on ipindia.gov.in before filing",
    "Use TM-A on the IP India portal",
    "DPIIT startup fee is ₹4,500/class vs ₹9,000",
    "Display ™ from day 1; ® only after registration",
  ],
  ip_checklist: [
    "Conduct trademark search",
    "File application (TM-A)",
    "Monitor objections (4-month window)",
    "Domain + social handle registration",
    "NDA + IP assignment in employment contracts",
    "Copyright on creative content",
  ],
  patent_opportunity: { likely: industry === "AI / SaaS" || industry === "Manufacturing", rationale: "Provisional patent locks priority date for 12 months at ₹1,600 (startup rate)." },
  estimated_cost: "₹4,500 - ₹9,000 per class",
  timeline: "Registration in 12-24 months if no opposition",
});

export default function Trademark() {
  const { profile } = useProfile();
  const [name, setName] = useState(profile?.name || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const generate = async () => {
    if (!name) { toast.error("Enter a brand name"); return; }
    setLoading(true);
    try {
      const r = await api.post("/trademark/advice", { startup_name: name, industry: profile?.industry || "AI / SaaS" });
      const d = r.data || {};
      setData(d);
      setIsDemo(!!d?._demo_ai);
      if (d?._demo_ai) toast.message("Showing demo guidance.");
    } catch (err) {
      console.error(err);
      setData(CLIENT_DEMO(name, profile?.industry || "AI / SaaS"));
      setIsDemo(true);
      toast.message("Showing demo guidance due to unavailable AI service.");
    } finally { setLoading(false); }
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
          {isDemo && (
            <div data-testid="demo-ai-badge" className="inline-flex items-center gap-2 border border-warning/40 bg-warning/10 px-3 py-1.5 rounded-md text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Demo AI Mode · Showing demo guidance
            </div>
          )}
          <Card className="border-border">
            <CardContent className="pt-5">
              <div className="label-eyebrow text-primary">Recommended classes</div>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {arr(data.recommended_classes).map((c, i) => {
                  // c may be { class, covers } OR a plain string like "Class 6"
                  const cls = typeof c === "object" && c !== null ? safe(c.class) : safe(c);
                  const cov = typeof c === "object" && c !== null ? safe(c.covers) : "";
                  return (
                    <div key={`cls-${i}-${cls}`} className="border border-border rounded-md p-3">
                      <div className="font-display text-2xl font-bold text-primary">{String(cls).startsWith("Class") ? cls : `Class ${cls}`}</div>
                      {cov && <div className="text-sm text-muted-foreground mt-1">{cov}</div>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">IP checklist</div><ul className="mt-3 space-y-1.5 text-sm">{arr(data.ip_checklist).map((x, i) => <li key={`ip-${i}`} className="flex gap-2"><Shield className="h-3.5 w-3.5 text-primary mt-1" strokeWidth={1.5} />{safe(x)}</li>)}</ul></CardContent></Card>
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">Filing tips</div><ul className="mt-3 space-y-1.5 text-sm">{arr(data.suggestions).map((x, i) => <li key={`tip-${i}`} className="flex gap-2"><span className="text-primary">→</span>{safe(x)}</li>)}</ul></CardContent></Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">Estimated cost</div><div className="font-display text-xl font-bold mt-2">{safe(data.estimated_cost)}</div></CardContent></Card>
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">Timeline</div><div className="font-display text-xl font-bold mt-2">{safe(data.timeline)}</div></CardContent></Card>
            <Card className="border-border"><CardContent className="pt-5"><div className="label-eyebrow text-primary">Patent opportunity</div><div className="font-display text-xl font-bold mt-2">{data?.patent_opportunity?.likely ? "Yes" : "Unlikely"}</div><div className="text-xs text-muted-foreground mt-1">{safe(data?.patent_opportunity?.rationale)}</div></CardContent></Card>
          </div>
        </div>
      )}
    </div>
  );
}
