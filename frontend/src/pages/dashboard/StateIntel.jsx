import { useEffect, useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function StateIntel() {
  const { profile } = useProfile();
  const [data, setData] = useState(null);
  useEffect(() => { if (profile?.state) api.get(`/state/${encodeURIComponent(profile.state)}`).then(r => setData(r.data)); }, [profile, setData]);

  if (!data) return null;

  const sections = [
    { key: "policies", label: "Policies" },
    { key: "grants", label: "Grants" },
    { key: "subsidies", label: "Subsidies" },
    { key: "incentives", label: "Incentives" },
    { key: "registrations", label: "State registrations" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="label-eyebrow text-primary inline-flex items-center gap-2"><MapPin className="h-3 w-3" /> {profile.state}</div>
        <h2 className="font-display text-3xl font-bold tracking-tight mt-2">State intelligence</h2>
        {data.highlight && <p className="text-muted-foreground mt-2 max-w-2xl">{data.highlight}</p>}
      </div>

      <Card className="border-border bg-primary/5">
        <CardContent className="pt-5">
          <div className="label-eyebrow text-primary">Professional tax</div>
          <div className="font-display text-xl font-semibold mt-1">{data.professional_tax}</div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map(s => (
          <Card key={s.key} className="border-border" data-testid={`state-${s.key}`}>
            <CardContent className="pt-5">
              <div className="label-eyebrow text-primary">{s.label}</div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {(data[s.key] || []).map((x, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary">•</span>{x}</li>)}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
