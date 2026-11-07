"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--soft)] hover:text-[var(--ink)]"
    >
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
