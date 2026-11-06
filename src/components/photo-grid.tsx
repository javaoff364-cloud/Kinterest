"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ArrowUpRight } from "lucide-react";
import type { Photo } from "@/lib/types";
export function PhotoGrid({photos}:{photos:Photo[]}){
 const [saved,setSaved]=useState<string[]>([]);
 const toggle=(id:string)=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 return <div className="masonry">{photos.map(p=><article key={p.id} className="masonry-card group">
  <Link href={`/photo/${encodeURIComponent(p.id)}`} aria-label={p.alt}><Image src={p.imageUrl} alt={p.alt} width={p.width} height={p.height} sizes="(max-width:560px) 48vw, (max-width:900px) 30vw, 18vw" unoptimized/></Link>
  <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100"><button onClick={()=>toggle(p.id)} aria-label="Save image" className={`grid h-9 w-9 place-items-center rounded-full bg-white shadow ${saved.includes(p.id)?"text-rose-500":"text-[#554f47]"}`}><Heart size={17} fill={saved.includes(p.id)?"currentColor":"none"}/></button><Link href={`/photo/${encodeURIComponent(p.id)}`} className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#554f47] shadow"><ArrowUpRight size={17}/></Link></div>
  <Link href={`/photo/${encodeURIComponent(p.id)}`} className="photo-overlay"><p className="line-clamp-1 text-sm font-semibold">{p.alt}</p><p className="mt-1 text-xs opacity-80">by {p.photographer}</p></Link>
 </article>)}</div>;
}