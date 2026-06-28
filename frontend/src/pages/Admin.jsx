import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Database } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Admin() {
  const [counts, setCounts] = useState(null);
  useEffect(() => { api.get("/admin/datasets").then(r => setCounts(r.data)); }, [setCounts]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-nav bg-background/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" data-testid="back-home-link" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 mr-1.5" /> Home</Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div>
          <div className="label-eyebrow text-primary">Admin · Datasets</div>
          <h1 className="font-display text-4xl font-bold tracking-tighter mt-2">Knowledge base</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Curated Indian startup ecosystem data backing the platform. Edits in code → restart backend.</p>
        </div>
        {counts && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(counts).map(([k, v]) => (
              <Card key={k} className="border-border"><CardContent className="pt-5">
                <Database className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <div className="font-display text-3xl font-bold mt-3">{v}</div>
                <div className="text-xs capitalize text-muted-foreground mt-1">{k.replaceAll("_", " ")}</div>
              </CardContent></Card>
            ))}
          </div>
        )}
        <Card className="border-border"><CardContent className="pt-5">
          <div className="label-eyebrow text-primary">Editing datasets</div>
          <p className="text-sm text-muted-foreground mt-2">For this MVP, datasets live in <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">/app/backend/data.py</code>. Add schemes / state benefits / licenses there and restart the backend. A full CRUD admin UI is planned in the next iteration.</p>
        </CardContent></Card>
      </div>
    </div>
  );
}
