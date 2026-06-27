import { useEffect, useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Rocket } from "lucide-react";

const segs = [
  { key: "30_days", label: "Next 30 days" },
  { key: "90_days", label: "Next 90 days" },
  { key: "180_days", label: "Next 6 months" },
  { key: "365_days", label: "Next 12 months" },
];

export default function Roadmap() {
  const { profile } = useProfile();
  const [plan, setPlan] = useState(null);
  useEffect(() => { if (profile?.id) api.post(`/profiles/${profile.id}/plan`).then(r => setPlan(r.data)); }, [profile]);

  if (!plan) return <div className="grid place-items-center py-20 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Generating roadmap…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">Personalised roadmap</h2>
        <p className="text-muted-foreground mt-1">From today to 12 months — broken into actionable phases.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {segs.map(s => (
          <Card key={s.key} className="border-border" data-testid={`roadmap-${s.key}`}>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <div className="label-eyebrow text-primary">{s.label}</div>
              </div>
              <ol className="space-y-2">
                {(plan.roadmap?.[s.key] || []).map((x, i) => (
                  <li key={i} className="flex gap-3 text-sm border-l-2 border-primary pl-3">
                    <span className="font-mono text-primary text-xs">{String(i + 1).padStart(2, "0")}</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
