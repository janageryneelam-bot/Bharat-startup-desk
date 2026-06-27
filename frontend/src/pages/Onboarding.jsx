import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import { useProfile } from "@/lib/profile";
import { toast } from "sonner";
import Disclaimer from "@/components/Disclaimer";

const TURNOVER = ["0-25L", "25L-1Cr", "1-5Cr", "5-10Cr", "10-25Cr", "25Cr+"];
const FUNDING = ["Bootstrapped", "₹10-25L", "₹25L-1Cr", "₹1-3Cr", "₹3-10Cr", "₹10Cr+"];

export default function Onboarding() {
  const [meta, setMeta] = useState({ states: [], industries: [], stages: [], company_types: [] });
  const [form, setForm] = useState({
    name: "", industry: "", state: "", stage: "Idea", operation_state: "",
    annual_turnover: "0-25L", employee_count: 1, business_model: "",
    funding_requirement: "Bootstrapped", description: "", company_type: "Private Limited Company",
  });
  const [loading, setLoading] = useState(false);
  const { setProfile } = useProfile();
  const nav = useNavigate();

  useEffect(() => { api.get("/meta/all").then(r => setMeta(r.data)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.industry || !form.state || !form.stage) { toast.error("Industry, state, and stage are required"); return; }
    setLoading(true);
    try {
      const payload = { ...form, operation_state: form.operation_state || form.state, employee_count: Number(form.employee_count) || 1 };
      const r = await api.post("/profiles", payload);
      setProfile(r.data);
      toast.success("Profile created. Generating AI plan…");
      nav("/dashboard");
    } catch (err) {
      toast.error("Failed to create profile");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-nav bg-background/70 border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" data-testid="back-home-link" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 mr-1.5" /> Home</Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="label-eyebrow text-primary">Flow 02 · Idea / MVP stage</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mt-2">Set up your startup.</h1>
        <p className="text-muted-foreground mt-3">We'll build a dashboard with roadmap, compliance, schemes & health score.</p>

        <Card className="mt-8 border-border">
          <CardContent className="pt-6">
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Label>Startup name (optional)</Label>
                <Input data-testid="name-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., NeuralForge" className="mt-1.5" />
              </div>
              <div>
                <Label>Industry *</Label>
                <Select value={form.industry} onValueChange={v => setForm({ ...form, industry: v })}>
                  <SelectTrigger data-testid="industry-select" className="mt-1.5"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>{meta.industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>State of operation *</Label>
                <Select value={form.state} onValueChange={v => setForm({ ...form, state: v })}>
                  <SelectTrigger data-testid="state-select" className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{meta.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Startup stage *</Label>
                <Select value={form.stage} onValueChange={v => setForm({ ...form, stage: v })}>
                  <SelectTrigger data-testid="stage-select" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{meta.stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Company type (planned)</Label>
                <Select value={form.company_type} onValueChange={v => setForm({ ...form, company_type: v })}>
                  <SelectTrigger data-testid="company-type-select" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{meta.company_types.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Expected turnover (yr 1)</Label>
                <Select value={form.annual_turnover} onValueChange={v => setForm({ ...form, annual_turnover: v })}>
                  <SelectTrigger data-testid="turnover-select" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{TURNOVER.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Planned employees</Label>
                <Input data-testid="employees-input" type="number" min="0" value={form.employee_count} onChange={e => setForm({ ...form, employee_count: e.target.value })} className="mt-1.5" />
              </div>
              <div className="md:col-span-2">
                <Label>Business model</Label>
                <Input data-testid="model-input" value={form.business_model} onChange={e => setForm({ ...form, business_model: e.target.value })} placeholder="e.g., B2B SaaS subscription, D2C e-commerce" className="mt-1.5" />
              </div>
              <div>
                <Label>Funding requirement</Label>
                <Select value={form.funding_requirement} onValueChange={v => setForm({ ...form, funding_requirement: v })}>
                  <SelectTrigger data-testid="funding-select" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{FUNDING.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Brief description</Label>
                <Textarea data-testid="desc-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does your startup do?" className="mt-1.5" />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" data-testid="create-profile-btn" size="lg" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</> : <><Sparkles className="mr-2 h-4 w-4" /> Create my dashboard</>}
                </Button>
              </div>
              <div className="md:col-span-2"><Disclaimer compact /></div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
