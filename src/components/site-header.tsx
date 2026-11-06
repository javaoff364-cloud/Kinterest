"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Menu, X, Bookmark, Sparkles, LogOut, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/auth/actions";
export function SiteHeader(){
 const [open,setOpen]=useState(false);
 const [email,setEmail]=useState<string|null>(null);
 useEffect(()=>{const supabase=createClient();if(!supabase)return;let alive=true;supabase.auth.getUser().then(({data})=>{if(alive)setEmail(data.user?.email??null);});const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setEmail(session?.user?.email??null));return()=>{alive=false;subscription.unsubscribe();};},[]);
 return <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(251,248,243,.92)] backdrop-blur-xl">
  <div className="container flex h-[76px] items-center justify-between gap-6">
   <Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white"><Sparkles size={19}/></span><span className="text-[25px] font-bold tracking-[-.07em]">kinterest<span className="text-[var(--accent)]">.</span></span></Link>
   <nav className="hidden items-center gap-8 text-[14px] font-medium text-[#625d54] md:flex"><Link className="hover:text-[var(--accent)]" href="/">Home</Link><Link className="hover:text-[var(--accent)]" href="/explore">Explore</Link><Link className="hover:text-[var(--accent)]" href="/collections">Collections</Link></nav>
   <form action="/search" className="hidden min-w-0 max-w-[430px] flex-1 items-center rounded-full bg-[#f0ece5] px-4 py-3 md:flex"><Search size={17} className="mr-2 shrink-0 text-[#8b8479]"/><input name="q" placeholder="Find a little inspiration..." className="w-full bg-transparent text-sm outline-none placeholder:text-[#9b9488]"/></form>
   <div className="hidden items-center gap-4 sm:flex"><Link href="/favorites" aria-label="Saved ideas" className="text-[#5c574e] hover:text-[var(--accent)]"><Bookmark size={20}/></Link>{email?<><Link href="/settings" className="max-w-32 truncate text-sm font-semibold">{email}</Link><form action={signOut}><button className="text-sm font-semibold" aria-label="Sign out"><LogOut size={18}/></button></form></>:<><Link href="/login" className="text-sm font-semibold">Log in</Link><Link href="/signup" className="btn-primary">Get started</Link></>}</div>
   <button onClick={()=>setOpen(!open)} className="rounded-full p-2 md:hidden" aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
  </div>
  {open&&<div className="container grid gap-4 pb-5 md:hidden"><form action="/search" className="flex rounded-full bg-[#f0ece5] px-4 py-3"><Search size={17} className="mr-2"/><input name="q" placeholder="Search inspiration..." className="w-full bg-transparent outline-none"/></form><Link href="/explore" onClick={()=>setOpen(false)}>Explore</Link><Link href="/collections" onClick={()=>setOpen(false)}>Collections</Link><Link href="/favorites" onClick={()=>setOpen(false)}>Saved ideas</Link>{email?<form action={signOut}><button className="font-semibold">Sign out</button></form>:<Link href="/login" onClick={()=>setOpen(false)}>Log in</Link>}</div>}
 </header>;
}