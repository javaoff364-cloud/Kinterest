"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

const AUTH_TIMEOUT_MS = 15_000;

export function GoogleSignInButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    if (busy) return;
    setBusy(true);
    setError("");
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      // Use the current host so Preview and Production return to their own domains.
      const callbackURL = new URL("/", window.location.origin).toString();
      const request = authClient.signIn.social({ provider: "google", callbackURL });
      const timeout = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Google sign-in is taking too long. Check your connection and OAuth settings, then try again.")), AUTH_TIMEOUT_MS);
      });
      const { error: authError } = await Promise.race([request, timeout]);
      if (authError) {
        const message = authError.message || "Google sign-in failed.";
        if (/account_not_linked/i.test(message)) {
          throw new Error("This Google email already has a Kinterest account. Sign in with that account's email and password, then connect Google from Settings.");
        }
        throw new Error(message);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed. Please try again.");
      setBusy(false);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  return <div className="grid gap-2">
    <button type="button" onClick={() => void signIn()} disabled={busy} aria-busy={busy} className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--line)] bg-[var(--card)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--soft)] disabled:cursor-wait disabled:opacity-60">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.75 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.53H2.16v2.87A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.85 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.11V7.02H2.16A11 11 0 0 0 1 12c0 1.78.43 3.46 1.16 4.98l3.69-2.87Z"/><path fill="#EA4335" d="M12 5.36c1.62 0 3.06.56 4.2 1.66l3.15-3.15C17.45 2.1 14.97 1 12 1a11 11 0 0 0-9.84 6.02l3.69 2.87C6.72 7.29 9.14 5.36 12 5.36Z"/></svg>
      {busy ? "Connecting… (up to 15s)" : "Continue with Google"}
    </button>
    {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-center text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
  </div>;
}
