import Link from "next/link";
import { categories } from "@/lib/demo-data";
export function CategoryTabs({active="All"}:{active?:string}){return <div className="flex gap-2 overflow-x-auto pb-2">{categories.map(c=><Link key={c} href={c==="All"?"/explore":`/category/${encodeURIComponent(c.toLowerCase())}`} className={`pill ${active.toLowerCase()===c.toLowerCase()?"active":""}`}>{c}</Link>)}</div>}