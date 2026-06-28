import { useEffect, useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, FileText, Building, CheckCircle2 } from "lucide-react";

export default function Schemes() {
  const { profile } = useProfile();
  const [schemes, setSchemes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!profile) return;
    api.get("/schemes", { params: { state: profile.state, industry: profile.industry, stage: profile.stage } })
      .then(r => setSchemes(r.data.schemes));
  }, [profile, setSchemes]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">Government schemes</h2>
        <p className="text-muted-foreground mt-1">Matched to your state ({profile?.state}), industry ({profile?.industry}) & stage ({profile?.stage}).</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {schemes.map(s => (
          <Card key={s.id} className="border-border hover-lift cursor-pointer" onClick={() => setSelected(s)} data-testid={`scheme-${s.id}`}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-3">
                <Award className="h-5 w-5 text-primary" strokeWidth={1.5} />
                <span className="text-[10px] font-mono uppercase tracking-wider border border-border rounded px-1.5 py-0.5 bg-secondary">{s.category}</span>
              </div>
              <div className="font-display text-lg font-bold mt-3">{s.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.issuing_body}</div>
              <div className="text-sm mt-3 line-clamp-2">{s.benefits}</div>
              <div className="mt-3 text-xs text-primary inline-flex items-center">Details →</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <div data-testid="scheme-modal" onClick={() => setSelected(null)} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 grid place-items-center p-4">
          <Card onClick={e => e.stopPropagation()} className="max-w-2xl w-full max-h-[85vh] overflow-auto border-border">
            <CardContent className="pt-6">
              <div className="label-eyebrow text-primary">{selected.category}</div>
              <h3 className="font-display text-2xl font-bold mt-2">{selected.name}</h3>
              <div className="text-sm text-muted-foreground">{selected.issuing_body}</div>
              <div className="mt-5 space-y-4 text-sm">
                <Block icon={CheckCircle2} title="Eligibility">{selected.eligibility}</Block>
                <Block icon={Award} title="Benefits">{selected.benefits}</Block>
                <Block icon={FileText} title="Documents required">
                  <ul className="list-disc pl-5 space-y-0.5">{selected.documents.map((d, i) => <li key={i}>{d}</li>)}</ul>
                </Block>
                <Block icon={Building} title="Application process">{selected.process}</Block>
              </div>
              <div className="mt-6 flex gap-3">
                <Button asChild data-testid="scheme-link-btn"><a href={selected.website} target="_blank" rel="noopener noreferrer">Official site <ExternalLink className="ml-2 h-4 w-4" /></a></Button>
                <Button variant="outline" data-testid="close-scheme-btn" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Block({ icon: Icon, title, children }) {
  return (
    <div className="border border-border rounded-md p-3">
      <div className="flex items-center gap-2 mb-2"><Icon className="h-4 w-4 text-primary" strokeWidth={1.5} /><span className="font-semibold text-sm">{title}</span></div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
