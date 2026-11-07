"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Menu, X, Bookmark, LogOut, Home, Compass, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";

type HeaderUser = { email?: string | null; name?: string | null; image?: string | null };

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    const load = () => authClient.getSession().then(({ data }) => {
      if (alive) setUser((data?.user as HeaderUser | undefined) ?? null);
    }).catch(() => { if (alive) setUser(null); });
    void load();
    const refresh = () => { void load(); };
    window.addEventListener("kinterest:auth-change", refresh);
    return () => { alive = false; window.removeEventListener("kinterest:auth-change", refresh); };
  }, [pathname]);

  async function handleSignOut() {
    await authClient.signOut();
    window.dispatchEvent(new Event("kinterest:auth-change"));
    setUser(null);
    setOpen(false);
    router.refresh();
  }

  const avatar = user?.image;
  const avatarNode = avatar
    ? <img src={avatar} alt="" className="h-9 w-9 rounded-full border border-[var(--line)] object-cover"/>
    : <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--soft)]"><BrandMark className="h-7 w-7"/></span>;

  return <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl">
    <div className="container flex h-[68px] items-center justify-between gap-3 sm:h-[76px] sm:gap-6">
      <Link href="/" aria-label="Kinterest home" className="flex shrink-0 items-center gap-2.5">
        <BrandMark className="h-9 w-9 sm:h-10 sm:w-10"/>
        <span className="text-[22px] font-bold tracking-[-.07em] sm:text-[25px]">kinterest<span className="text-[var(--accent)]">.</span></span>
      </Link>
      <nav className="hidden items-center gap-6 text-[14px] font-medium text-[var(--muted)] lg:flex xl:gap-8">
        <Link className="hover:text-[var(--accent)]" href="/">Home</Link>
        <Link className="hover:text-[var(--accent)]" href="/explore">Explore</Link>
        <Link className="hover:text-[var(--accent)]" href="/collections">Collections</Link>
      </nav>
      <form action="/search" className="hidden min-w-0 max-w-[430px] flex-1 items-center rounded-full bg-[var(--soft)] px-4 py-3 md:flex">
        <Search size={17} className="mr-2 shrink-0 text-[var(--muted)]"/>
        <input name="q" placeholder="Find a little inspiration..." className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"/>
      </form>
      <ThemeToggle />
      <div className="hidden items-center gap-3 sm:flex">
        <Link href="/favorites" aria-label="Saved ideas" className="rounded-full p-2 text-[var(--muted)] hover:text-[var(--accent)]"><Bookmark size={20}/></Link>
        {user ? <><Link href="/settings" aria-label="Account settings" className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-[var(--soft)]">{avatarNode}<span className="hidden max-w-28 truncate text-sm font-semibold xl:block">{user.name || user.email}</span></Link><button type="button" onClick={() => void handleSignOut()} className="rounded-full p-2 text-[var(--muted)] hover:text-[var(--accent)]" aria-label="Sign out"><LogOut size={18}/></button></> : <><Link href="/login" className="text-sm font-semibold">Log in</Link><Link href="/signup" className="btn-primary">Get started</Link></>}
      </div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full p-2 lg:hidden" aria-label="Toggle menu">{user && avatarNode}{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <div className="container grid gap-4 border-t border-[var(--line)] pb-5 pt-4 lg:hidden">
      <form action="/search" className="flex rounded-full bg-[var(--soft)] px-4 py-3"><Search size={17} className="mr-2"/><input name="q" placeholder="Search inspiration..." className="w-full bg-transparent outline-none"/></form>
      <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3"><Home size={18}/> Home</Link>
      <Link href="/explore" onClick={() => setOpen(false)} className="flex items-center gap-3"><Compass size={18}/> Explore</Link>
      <Link href="/collections" onClick={() => setOpen(false)} className="flex items-center gap-3"><Bookmark size={18}/> Collections</Link>
      <Link href="/favorites" onClick={() => setOpen(false)} className="flex items-center gap-3"><Bookmark size={18}/> Saved ideas</Link>
      {user ? <><Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3"><Settings size={18}/> Profile & settings</Link><button type="button" onClick={() => void handleSignOut()} className="text-left font-semibold">Sign out</button></> : <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>}
    </div>}
  </header>;
}