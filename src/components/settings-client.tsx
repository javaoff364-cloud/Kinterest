"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, Monitor, Moon, Sun, UserRound, X } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { BrandMark } from "@/components/brand-mark";

type Profile = { name?: string | null; email?: string | null; image?: string | null };
type ThemeMode = "system" | "light" | "dark";

function applyTheme(mode: ThemeMode) {
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function SettingsClient() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    authClient.getSession().then(({ data }) => {
      if (!active) return;
      const user = data?.user as Profile | undefined;
      setProfile(user ?? null);
      setName(user?.name ?? "");
      setImage(user?.image ?? "");
      setLoaded(true);
    }).catch(() => { if (active) { setProfile(null); setLoaded(true); } });
    const saved = (window.localStorage.getItem("kinterest-theme") || "system") as ThemeMode;
    setTheme(saved);
    applyTheme(saved);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => { if ((window.localStorage.getItem("kinterest-theme") || "system") === "system") applyTheme("system"); };
    media.addEventListener("change", onSystemChange);
    return () => { active = false; media.removeEventListener("change", onSystemChange); };
  }, []);

  function changeTheme(value: ThemeMode) {
    setTheme(value);
    window.localStorage.setItem("kinterest-theme", value);
    applyTheme(value);
  }

  function chooseAvatar(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) { setMessage("Please choose a PNG, JPG, WebP or GIF image."); return; }
    if (file.size > 1024 * 1024) { setMessage("Avatar must be smaller than 1 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result ?? ""));
    reader.onerror = () => setMessage("Could not read this image. Try another file.");
    reader.readAsDataURL(file);
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const result = await authClient.updateUser({ name: name.trim(), image: image || null });
      if (result.error) throw new Error(result.error.message || "Could not update profile.");
      setProfile((current) => ({ ...current, name: name.trim(), image }));
      window.dispatchEvent(new Event("kinterest:auth-change"));
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update profile.");
    } finally { setBusy(false); }
  }

  if (!loaded) return <div className="grid gap-4"><div className="h-40 animate-pulse rounded-3xl bg-[var(--soft)]"/><div className="h-24 animate-pulse rounded-3xl bg-[var(--soft)]"/></div>;
  if (!profile) return <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-7"><h2 className="text-xl font-semibold">Sign in to manage your profile</h2><p className="mt-2 text-sm text-[var(--muted)]">Your Kinterest account settings will appear here after you sign in.</p><a href="/login" className="btn-primary mt-5 inline-flex">Log in</a></div>;

  return <div className="grid gap-6">
    <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-7">
      <div className="mb-6 flex items-center gap-3"><span className="rounded-2xl bg-[var(--soft)] p-3"><UserRound size={20}/></span><div><h2 className="text-xl font-semibold">Your profile</h2><p className="text-sm text-[var(--muted)]">Make your Kinterest profile yours.</p></div></div>
      <form onSubmit={saveProfile} className="grid gap-5">
        <div className="flex flex-wrap items-center gap-5"><div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--line)] bg-[var(--soft)]">{image ? <img src={image} alt="Profile avatar" className="h-full w-full object-cover"/> : <BrandMark className="h-14 w-14"/>}</div>
          <div className="grid gap-2"><strong className="text-sm">Profile photo</strong><p className="text-xs text-[var(--muted)]">PNG, JPG, WebP or GIF. Maximum 1 MB.</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold"><Camera size={16}/> Upload photo</button>{image && <button type="button" onClick={() => setImage("")} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--muted)]"><X size={15}/> Remove</button>}</div><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(event) => chooseAvatar(event.target.files?.[0])}/></div>
        </div>
        <label className="grid gap-2 text-sm font-semibold">Display name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-normal outline-none focus:border-[var(--accent)]"/></label>
        <label className="grid gap-2 text-sm font-semibold">Email address<input value={profile.email ?? ""} readOnly className="w-full cursor-not-allowed rounded-xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 font-normal text-[var(--muted)]"/></label>
        <div className="flex flex-wrap items-center gap-4"><button disabled={busy} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">{busy ? "Saving..." : <><Check size={16}/> Save changes</>}</button>{message && <p role="status" className="text-sm text-[var(--muted)]">{message}</p>}</div>
      </form>
    </section>
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-7">
      <div className="flex items-center gap-3"><span className="rounded-2xl bg-[var(--soft)] p-3">{theme==="dark"?<Moon size={20}/>:theme==="light"?<Sun size={20}/>:<Monitor size={20}/>}</span><div><h2 className="font-semibold">Appearance</h2><p className="text-sm text-[var(--muted)]">Choose system, light or dark mode.</p></div></div>
      <select aria-label="Color theme" value={theme} onChange={(event)=>changeTheme(event.target.value as ThemeMode)} className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm font-semibold"><option value="system">System default</option><option value="light">Light</option><option value="dark">Dark</option></select>
    </section>
    <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-7"><h2 className="font-semibold">Privacy and account</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Your account details are managed securely by Neon Auth. Saved ideas and collections remain connected to your signed-in account.</p></section>
  </div>;
}
