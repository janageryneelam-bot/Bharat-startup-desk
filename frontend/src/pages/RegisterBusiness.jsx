import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2, Loader2, BadgeCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useProfile } from "@/lib/profile";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Disclaimer from "@/components/Disclaimer";

export default function RegisterBusiness() {
  const [meta, setMeta] = useState({ states: [], company_types: [] });
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", company_type: "Private Limited Company", incorporated_on: "2022-04-01", state: "", cin: "", gstin: "", llpin: "", udyam: "", dpiit: "" });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setProfile } = useProfile();
  const nav = useNavigate();

  useEffect(() => { api.get("/meta/all").then(r => setMeta(r.data)); }, []);

  const lookup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.company_type || !form.state) { toast.error("Name, company type, state are required"); return; }
    setLoading(true);
    try {
      const r = await api.post("/registered/lookup", form);
      setPreview(r.data);
      setStep(2);
    } catch { toast.error("Lookup failed"); }
    finally { setLoading(false); }
  };

  const confirm = () => {
    setProfile({ ...preview.profile, is_demo: false });
    toast.success("Dashboard loaded with public-data preview");
    nav("/dashboard");
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
        <div className="label-eyebrow text-primary">Flow 03 · Already registered</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mt-2">Bring your company in.</h1>
        <p className="text-muted-foreground mt-3">Enter your company details. We'll fetch a public-data preview you can verify & edit.</p>

        {step === 1 && (
          <Card className="mt-8 border-border">
            <CardContent className="pt-6">
              <form onSubmit={lookup} className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Label>Company name *</Label>
                  <Input data-testid="company-name-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., NeuralForge Technologies Pvt Ltd" className="mt-1.5" />
                </div>
                <div>
                  <Label>Company type *</Label>
                  <Select value={form.company_type} onValueChange={v => setForm({ ...form, company_type: v })}>
                    <SelectTrigger data-testid="ctype-select" className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{meta.company_types.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>State of registration *</Label>
                  <Select value={form.state} onValueChange={v => setForm({ ...form, state: v })}>
                    <SelectTrigger data-testid="state-select" className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{meta.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Incorporation date *</Label>
                  <Input data-testid="incorp-input" type="date" required value={form.incorporated_on} onChange={e => setForm({ ...form, incorporated_on: e.target.value })} className="mt-1.5" />
                </div>
                <div className="md:col-span-2 pt-2 border-t border-border">
                  <div className="label-eyebrow text-muted-foreground mb-3">Optional identifiers</div>
                </div>
                {["cin", "gstin", "llpin", "udyam", "dpiit"].map(k => (
                  <div key={k}>
                    <Label className="uppercase text-xs">{k}</Label>
                    <Input data-testid={`${k}-input`} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="mt-1.5 font-mono" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <Button type="submit" data-testid="lookup-btn" size="lg" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching public preview…</> : <><Building2 className="mr-2 h-4 w-4" /> Fetch public data preview</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && preview && (
          <div className="mt-8 space-y-5">
            <div data-testid="demo-preview-badge" className="inline-flex items-center gap-2 border border-warning/40 bg-warning/10 text-foreground px-3 py-1.5 rounded-md text-xs font-mono">
              <BadgeCheck className="h-3.5 w-3.5 text-warning" /> {preview.preview_badge}
            </div>
            <Card className="border-border">
              <CardContent className="pt-6">
                <h2 className="font-display text-2xl font-bold">We found the following public information. Please verify.</h2>
                <p className="text-sm text-muted-foreground mt-1">Edit any field that isn't accurate. This drives your entire dashboard.</p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {Object.entries(preview.profile).filter(([k]) => !["id", "is_demo", "created_at"].includes(k)).map(([k, v]) => (
                    <div key={k}>
                      <Label className="uppercase text-[10px] tracking-wider font-mono">{k}</Label>
                      <Input
                        data-testid={`preview-${k}-input`}
                        value={v ?? ""}
                        onChange={e => setPreview({ ...preview, profile: { ...preview.profile, [k]: e.target.value } })}
                        className="mt-1 font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button data-testid="confirm-preview-btn" onClick={confirm}>Looks good — load dashboard →</Button>
                  <Button variant="outline" data-testid="edit-back-btn" onClick={() => setStep(1)}>Back</Button>
                </div>
                <div className="mt-5"><Disclaimer compact /></div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
