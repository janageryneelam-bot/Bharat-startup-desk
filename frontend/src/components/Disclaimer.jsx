import { ShieldAlert } from "lucide-react";

export default function Disclaimer({ compact = false }) {
  if (compact) {
    return (
      <p data-testid="disclaimer-compact" className="text-[11px] text-muted-foreground font-mono">
        Educational guidance only. Not legal, tax, or financial advice. Consult professionals before decisions.
      </p>
    );
  }
  return (
    <div data-testid="disclaimer-banner" className="border border-border bg-warning/10 text-foreground px-4 py-2 text-xs flex items-start gap-2 rounded-md">
      <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0 text-warning" strokeWidth={1.5} />
      <span>
        <strong className="font-semibold">Disclaimer:</strong> Bharat Startup Desk provides educational guidance only. Information shown is not legal, tax, financial, or professional advice. Please consult qualified professionals before making decisions.
      </span>
    </div>
  );
}
