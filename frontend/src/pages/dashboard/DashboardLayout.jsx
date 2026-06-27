import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useProfile } from "@/lib/profile";
import { useEffect } from "react";
import { Home, ListChecks, Award, MapPin, FileText, Shield, Rocket, MessageSquare, Sparkles, LogOut, Building2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Disclaimer from "@/components/Disclaimer";

const links = [
  { to: "/dashboard", icon: Home, label: "Overview", end: true, id: "nav-overview" },
  { to: "/dashboard/compliance", icon: ListChecks, label: "Compliance", id: "nav-compliance" },
  { to: "/dashboard/schemes", icon: Award, label: "Govt Schemes", id: "nav-schemes" },
  { to: "/dashboard/state", icon: MapPin, label: "State Intel", id: "nav-state" },
  { to: "/dashboard/licenses", icon: FileText, label: "Licenses", id: "nav-licenses" },
  { to: "/dashboard/trademark", icon: Shield, label: "Trademark/IP", id: "nav-trademark" },
  { to: "/dashboard/roadmap", icon: Rocket, label: "Roadmap", id: "nav-roadmap" },
  { to: "/dashboard/validator", icon: Sparkles, label: "Idea Validator", id: "nav-validator" },
  { to: "/dashboard/copilot", icon: MessageSquare, label: "AI Copilot", id: "nav-copilot" },
];

export default function DashboardLayout() {
  const { profile, setProfile } = useProfile();
  const nav = useNavigate();
  useEffect(() => { if (!profile) nav("/"); }, [profile, nav]);
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 border-r border-border bg-card flex-col">
        <div className="h-16 px-5 flex items-center gap-2 border-b border-border">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-display font-bold">B</div>
          <Link to="/" className="font-display text-base font-bold">Bharat Startup Desk</Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={l.id}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`
              }
            >
              <l.icon className="h-4 w-4" strokeWidth={1.5} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={() => { setProfile(null); nav("/"); }}
            data-testid="logout-btn"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} /> Exit dashboard
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass-nav bg-background/70 border-b border-border">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="font-display font-semibold truncate" data-testid="profile-name">{profile.name || "Unnamed Startup"}</span>
                <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground hidden sm:inline">{profile.stage}</span>
                <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground hidden sm:inline">{profile.state}</span>
                {profile.is_demo && <span data-testid="demo-mode-badge" className="text-xs font-mono bg-warning/20 text-foreground px-2 py-0.5 rounded">DEMO MODE</span>}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="px-6 lg:px-10 py-6">
          <Disclaimer />
          <div className="mt-6"><Outlet /></div>
        </div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card flex overflow-x-auto">
          {links.slice(0, 5).map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `flex-1 py-2.5 flex flex-col items-center gap-0.5 text-[10px] ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <l.icon className="h-4 w-4" strokeWidth={1.5} />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
}
