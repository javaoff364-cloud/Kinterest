"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

function isDark(mode: ThemeMode) {
  return mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const read = () => {
      let mode: ThemeMode = "system";
      try {
        const saved = window.localStorage.getItem("kinterest-theme");
        if (saved === "light" || saved === "dark" || saved === "system") mode = saved;
      } catch {}
      const next = isDark(mode);
      setDark(next);
      document.documentElement.dataset.theme = next ? "dark" : "light";
    };

    read();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", read);
    window.addEventListener("storage", read);
    return () => {
      media.removeEventListener("change", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      window.localStorage.setItem("kinterest-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--soft)] hover:text-[var(--ink)]"
    >
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
