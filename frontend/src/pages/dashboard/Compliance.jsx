import { useEffect, useState } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const statusMap = {
  completed: { color: "bg-success/15 text-success border-success/30", label: "Done", icon: CheckCircle2 },
  upcoming: { color: "bg-warning/15 text-foreground border-warning/40", label: "Upcoming", icon: Clock },
  overdue: { color: "bg-destructive/15 text-destructive border-destructive/40", label: "Overdue", icon: AlertCircle },
};

export default function Compliance() {
  const { profile } = useProfile();
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => { if (profile?.id) api.get(`/compliance/${profile.id}`).then(r => setData(r.data)); }, [profile]);

  if (!data) return <div className="grid place-items-center py-20 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading compliance…</div>;

  const items = filter === "all" ? data.items : data.items.filter(i => i.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">Compliance dashboard</h2>
        <p className="text-muted-foreground mt-1">Every filing deadline that matters to your business — color-coded.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { k: "completed", v: data.summary.completed, c: "text-success", I: CheckCircle2 },
          { k: "upcoming", v: data.summary.upcoming, c: "text-warning", I: Clock },
          { k: "overdue", v: data.summary.overdue, c: "text-destructive", I: AlertCircle },
        ].map(s => (
          <button
            key={s.k}
            data-testid={`filter-${s.k}`}
            onClick={() => setFilter(filter === s.k ? "all" : s.k)}
            className={`text-left border rounded-lg p-4 hover-lift ${filter === s.k ? "border-primary bg-primary/5" : "border-border bg-card"}`}
          >
            <s.I className={`h-5 w-5 ${s.c}`} strokeWidth={1.5} />
            <div className={`font-display text-3xl font-bold mt-2 ${s.c}`}>{s.v}</div>
            <div className="text-xs capitalize text-muted-foreground mt-0.5">{s.k}</div>
          </button>
        ))}
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list" data-testid="tab-list">Timeline</TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-2">
          {items.map((it, i) => {
            const cfg = statusMap[it.status];
            return (
              <Card key={i} className="border-border hover-lift">
                <CardContent className="py-4 flex flex-wrap items-center gap-4 justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono border rounded px-1.5 py-0.5 ${cfg.color}`}>
                        <cfg.icon className="h-3 w-3" strokeWidth={1.5} /> {cfg.label}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{it.category}</span>
                    </div>
                    <div className="font-medium mt-1">{it.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Penalty: {it.penalty}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{it.due_date}</div>
                    <div className="text-[10px] text-muted-foreground">{it.documents?.length} docs</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((it, i) => {
              const cfg = statusMap[it.status];
              return (
                <Card key={i} className={`border-l-4 ${it.status === "completed" ? "border-l-success" : it.status === "overdue" ? "border-l-destructive" : "border-l-warning"} border-y border-r border-border`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="font-mono text-xs text-muted-foreground">{it.due_date}</div>
                    <div className="font-medium text-sm mt-1">{it.name}</div>
                    <div className={`text-[10px] uppercase tracking-wider font-mono mt-2 ${cfg.color} inline-block px-1.5 py-0.5 border rounded`}>{cfg.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
