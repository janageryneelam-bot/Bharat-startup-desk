import { useTheme } from "@/lib/theme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      data-testid="theme-toggle-btn"
      aria-label="Toggle theme"
      className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border bg-card hover:bg-secondary transition-colors"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
