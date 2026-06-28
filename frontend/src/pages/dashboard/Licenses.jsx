import { useEffect, useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Licenses() {
  const { profile } = useProfile();
  const [items, setItems] = useState([]);
  useEffect(() => { if (profile?.industry) api.get("/licenses", { params: { industry: profile.industry, state: profile.state } }).then(r => setItems(r.data.licenses)); }, [profile, setItems]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">License recommendations</h2>
        <p className="text-muted-foreground mt-1">Curated for {profile?.industry} businesses operating in {profile?.state}.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(l => (
          <Card key={l.id} className="border-border hover-lift" data-testid={`license-${l.id}`}>
            <CardContent className="pt-5">
              <FileText className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <div className="font-display text-lg font-bold mt-3">{l.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{l.authority}</div>
              <div className="mt-3 text-sm"><span className="text-muted-foreground">Trigger:</span> {l.trigger}</div>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="border border-border rounded p-2"><div className="text-muted-foreground">Timeline</div><div className="font-mono mt-0.5 font-semibold">{l.timeline}</div></div>
                <div className="border border-border rounded p-2"><div className="text-muted-foreground">Cost</div><div className="font-mono mt-0.5 font-semibold">{l.cost}</div></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
