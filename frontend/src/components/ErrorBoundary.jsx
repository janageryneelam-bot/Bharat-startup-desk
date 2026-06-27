import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  reset = () => this.setState({ hasError: false, error: null });
  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="error-boundary" className="border border-warning/40 bg-warning/10 rounded-md p-5 my-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" strokeWidth={1.5} />
            <div className="label-eyebrow text-warning">Showing demo guidance</div>
          </div>
          <div className="text-sm mt-2">The AI service returned an unexpected response. We've switched to demo guidance so you can keep exploring.</div>
          <button onClick={this.reset} data-testid="error-retry-btn" className="mt-3 inline-flex items-center gap-1.5 text-sm border border-border bg-card hover:bg-secondary rounded-md px-3 py-1.5">
            <RefreshCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Safe-render helper: coerces any value to a renderable string
export function safe(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(safe).join(", ");
  if (typeof v === "object") {
    // Prefer name/title/text/value if present
    for (const k of ["name", "title", "text", "label", "value", "summary"]) {
      if (typeof v[k] === "string") return v[k];
    }
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  return String(v);
}

// Guarantee an array
export function arr(v) {
  if (Array.isArray(v)) return v;
  if (v === null || v === undefined) return [];
  return [v];
}
