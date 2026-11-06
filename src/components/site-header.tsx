"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, Compass, Bookmark, UserRound, Sparkles } from "lucide-react";
export function SiteHeader(){
 const [open,setOpen]=useState(false);
 return <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(251,248,243,.92)] backdrop-blur-xl">
  <div className="container flex h-[76px] items-center justify-between gap-6">
   <Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white"><Sparkles size={19}/></span><span className="text-[25px] font-bold tracking-[-.07em]">kinterest<span className="text-[var(--accent)]">.</span></span></Link>
   <nav className="hidden items-center gap-8 text-[14px] font-medium text-[#625d54] md:flex"><Link className="hover:text-[var(--accent)]" href="/">Home</Link><Link className="hover:text-[var(--accent)]" href="/explore">Explore</Link><Link className="hover:text-[var(--accent)]" href="/collections">Collections</Link></nav>
   <form action="/search" className="hidden min-w-0 max-w-[430px] flex-1 items-center rounded-full bg-[#f0ece5] px-4 py-3 md:flex"><Search size={17} className="mr-2 shrink-0 text-[#8b8479]"/><input name="q" placeholder="Find a little inspiration..." className="w-full bg-transparent text-sm outline-none placeholder:text-[#9b9488]"/></form>
   <div className="hidden items-center gap-4 sm:flex"><Link href="/favorites" aria-label="Saved ideas" className="text-[#5c574e] hover:text-[var(--accent)]"><Bookmark size={20}/></Link><Link href="/login" className="text-sm font-semibold">Log in</Link><Link href="/signup" className="btn-primary">Get started</Link></div>
   <button onClick={()=>setOpen(!open)} className="rounded-full p-2 md:hidden" aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
  </div>
  {open&&<div className="container grid gap-4 pb-5 md:hidden"><form action="/search" className="flex rounded-full bg-[#f0ece5] px-4 py-3"><Search size={17} className="mr-2"/><input name="q" placeholder="Search inspiration..." className="w-full bg-transparent outline-none"/></form><Link href="/explore" onClick={()=>setOpen(false)}>Explore</Link><Link href="/collections" onClick={()=>setOpen(false)}>Collections</Link><Link href="/favorites" onClick={()=>setOpen(false)}>Saved ideas</Link><Link href="/login" onClick={()=>setOpen(false)}>Log in</Link></div>}
 </header>;
}