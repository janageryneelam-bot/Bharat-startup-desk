import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, Sparkles, CheckCircle2, ListChecks, IndianRupee, ShieldAlert, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import Disclaimer from "@/components/Disclaimer";
import ThemeToggle from "@/components/ThemeToggle";
import ErrorBoundary, { safe, arr } from "@/components/ErrorBoundary";
import { toast } from "sonner";

export default function Explore() {
  const [meta, setMeta] = useState({ states: [], industries: [] });
  const [form, setForm] = useState({ idea: "", industry: "", state: "", investment: "₹5-10 Lakh" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => { api.get("/meta/all").then(r => setMeta(r.data)).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.idea || !form.industry || !form.state) { toast.error("Please fill idea, industry and state"); return; }
    setLoading(true);
    try {
      const r = await api.post("/explore/idea", form);
      const data = r.data || {};
      setResult(data);
      setIsDemo(!!data?.ai?._demo_ai);
      toast.success(data?.ai?._demo_ai ? "Showing demo guidance" : "Analysis ready");
    } catch (err) {
      console.error(err);
      // Hard fallback: build minimal demo response client-side
      setResult({
        ai: {
          _demo_ai: true,
          business_structure: { recommended: "Private Limited Company", why: "Default safe recommendation for Indian startups — limited liability, investor-friendly, easier banking.", alternatives: ["LLP", "OPC"] },
          registrations: ["GST registration", "Udyam (MSME) registration", "DPIIT Startup India recognition", "Shops & Establishments"],
          licenses: ["Trade License (Municipal)", "Trademark filing"],
          gst: { applicable: true, explanation: "GST registration is generally required once turnover crosses ₹40L (goods) / ₹20L (services), or from Day 1 for interstate / e-commerce sales." },
          trademark: { recommended: true, classes: [35, 42], rationale: "Protect your brand under primary class. DPIIT startups pay ₹4,500/class." },
          schemes: ["Startup India Seed Fund Scheme — up to ₹50 Lakh", "PM Mudra Yojana — up to ₹20 Lakh", "CGTMSE — up to ₹5 Cr collateral-free"],
          estimated_cost: { setup: "₹5-10 Lakh", monthly: "₹1-2 Lakh", breakdown: [{ item: "Incorporation", amount: "₹15,000" }, { item: "GST + Udyam", amount: "₹5,000" }, { item: "Working capital", amount: "₹3-5 Lakh" }] },
          risks: ["Compliance burden", "Cash flow gap before stable revenue", "Customer acquisition cost", "Talent retention"],
          first_10_steps: ["Validate with customers", "Choose company structure", "Reserve name on MCA", "File SPICe+", "PAN/TAN/Bank", "Udyam registration", "GST if applicable", "DPIIT recognition", "Trademark", "Compliance calendar"],
          roadmap_12_months: Array.from({ length: 12 }).map((_, i) => ({ month: i + 1, focus: `Month ${i + 1}`, milestones: ["Step A", "Step B"] })),
        },
        schemes: [], licenses: [], state_benefits: {},
      });
      setIsDemo(true);
      toast.message("Showing demo guidance due to unavailable AI service.");
    } finally { setLoading(false); }
  };

  const ai = result?.ai || {};

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-nav bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" data-testid="back-home-link" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 mr-1.5" /> Home</Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="label-eyebrow text-primary">Flow 01 · No signup</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mt-2">Explore your idea.</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">Tell us what you want to build. We'll return business structure, registrations, licenses, GST, schemes, cost, risks & a 12-month roadmap — personalised to your state.</p>

        <Card className="mt-8 border-border">
          <CardContent className="pt-6">
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Label>Your idea</Label>
                <Textarea data-testid="idea-input" required value={form.idea} onChange={e => setForm({ ...form, idea: e.target.value })} placeholder={`e.g., "I want to start a men's skincare D2C brand."`} className="mt-1.5 min-h-[100px]" />
              </div>
              <div>
                <Label>Industry</Label>
                <Select value={form.industry} onValueChange={v => setForm({ ...form, industry: v })}>
                  <SelectTrigger data-testid="industry-select" className="mt-1.5"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>{meta.industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>State</Label>
                <Select value={form.state} onValueChange={v => setForm({ ...form, state: v })}>
                  <SelectTrigger data-testid="state-select" className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{meta.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Estimated investment</Label>
                <Input data-testid="investment-input" value={form.investment} onChange={e => setForm({ ...form, investment: e.target.value })} placeholder="₹5-10 Lakh" className="mt-1.5" />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" data-testid="generate-btn" disabled={loading} size="lg">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing with Claude Sonnet 4.5…</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate full analysis</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {result && (
          <div className="mt-10 space-y-6 fade-up">
            <Disclaimer />
            {isDemo && (
              <div data-testid="demo-ai-badge" className="inline-flex items-center gap-2 border border-warning/40 bg-warning/10 px-3 py-1.5 rounded-md text-xs font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Demo AI Mode · Showing demo guidance
              </div>
            )}

            <Section title="Business structure" icon={CheckCircle2}>
              <div className="text-lg font-semibold">{safe(ai.business_structure?.recommended)}</div>
              <p className="text-muted-foreground mt-1">{safe(ai.business_structure?.why)}</p>
              {arr(ai.business_structure?.alternatives).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {arr(ai.business_structure?.alternatives).map((a, i) => <span key={`alt-${i}-${safe(a).slice(0,12)}`} className="text-xs border border-border rounded-full px-2.5 py-1 bg-secondary">{safe(a)}</span>)}
                </div>
              )}
            </Section>

            <div className="grid md:grid-cols-2 gap-6">
              <Section title="Registrations" icon={ListChecks}><ul className="space-y-1.5 text-sm">{arr(ai.registrations).map((r, i) => <li key={`reg-${i}`} className="flex items-start gap-2"><span className="text-primary">→</span>{safe(r)}</li>)}</ul></Section>
              <Section title="Licenses" icon={ListChecks}><ul className="space-y-1.5 text-sm">{arr(ai.licenses).map((r, i) => <li key={`lic-${i}`} className="flex items-start gap-2"><span className="text-primary">→</span>{safe(r)}</li>)}</ul></Section>
              <Section title="GST" icon={IndianRupee}>
                <div className={`font-display text-2xl font-bold ${ai.gst?.applicable ? "text-success" : "text-muted-foreground"}`}>{ai.gst?.applicable ? "Required" : "Not required (yet)"}</div>
                <p className="text-muted-foreground text-sm mt-1">{safe(ai.gst?.explanation)}</p>
              </Section>
              <Section title="Trademark" icon={ShieldAlert}>
                <div className={`font-display text-2xl font-bold ${ai.trademark?.recommended ? "text-primary" : "text-muted-foreground"}`}>{ai.trademark?.recommended ? "Recommended" : "Optional"}</div>
                {arr(ai.trademark?.classes).length > 0 && <div className="mt-2 text-sm">Classes: <span className="font-mono">{arr(ai.trademark?.classes).map(safe).join(", ")}</span></div>}
                <p className="text-muted-foreground text-sm mt-1">{safe(ai.trademark?.rationale)}</p>
              </Section>
            </div>

            <Section title="Schemes & subsidies" icon={Sparkles}>
              <ul className="space-y-2 text-sm">{arr(ai.schemes).map((s, i) => <li key={`sch-${i}`} className="border border-border rounded-md p-3 bg-secondary/40">{safe(s)}</li>)}</ul>
            </Section>

            <Section title="Estimated cost" icon={IndianRupee}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><div className="text-xs label-eyebrow text-muted-foreground">Setup</div><div className="font-display text-2xl font-bold mt-1">{safe(ai.estimated_cost?.setup)}</div></div>
                <div><div className="text-xs label-eyebrow text-muted-foreground">Monthly</div><div className="font-display text-2xl font-bold mt-1">{safe(ai.estimated_cost?.monthly)}</div></div>
              </div>
              {arr(ai.estimated_cost?.breakdown).length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {arr(ai.estimated_cost?.breakdown).map((b, i) => <div key={`bd-${i}`} className="flex justify-between border-b border-border py-1.5"><span className="text-muted-foreground">{safe(b?.item)}</span><span className="font-mono">{safe(b?.amount)}</span></div>)}
                  </div>
                </div>
              )}
            </Section>

            <Section title="Risks & challenges" icon={ShieldAlert}>
              <ul className="space-y-1.5 text-sm">{arr(ai.risks).map((r, i) => <li key={`rsk-${i}`} className="flex items-start gap-2"><span className="text-destructive">!</span>{safe(r)}</li>)}</ul>
            </Section>

            <Section title="First 10 steps" icon={ListChecks}>
              <ol className="space-y-2 text-sm">
                {arr(ai.first_10_steps).map((s, i) => (
                  <li key={`step-${i}`} className="flex items-start gap-3 border-l-2 border-primary pl-3"><span className="font-mono text-primary text-xs">{String(i + 1).padStart(2, "0")}</span><span>{safe(s)}</span></li>
                ))}
              </ol>
            </Section>

            <Section title="12-month roadmap" icon={Calendar}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {arr(ai.roadmap_12_months).map((m, i) => (
                  <div key={`rm-${i}`} className="border border-border rounded-md p-3 bg-card">
                    <div className="text-xs label-eyebrow text-primary">Month {safe(m?.month) || i + 1}</div>
                    <div className="font-semibold text-sm mt-1">{safe(m?.focus)}</div>
                    <ul className="mt-2 text-xs text-muted-foreground space-y-1">{arr(m?.milestones).map((x, j) => <li key={`ms-${i}-${j}`}>• {safe(x)}</li>)}</ul>
                  </div>
                ))}
              </div>
            </Section>

            <Card className="border-primary">
              <CardContent className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-display text-xl font-bold">Want a full dashboard for this?</div>
                  <div className="text-sm text-muted-foreground mt-1">Continue onboarding to track compliance, schemes & roadmap in one place.</div>
                </div>
                <Button asChild data-testid="continue-onboarding-btn"><Link to="/onboarding">Start onboarding →</Link></Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h3 className="font-display text-lg font-semibold">{title}</h3>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
