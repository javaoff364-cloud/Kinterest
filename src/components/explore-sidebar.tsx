import Link from "next/link";
import { Bookmark, Compass, Home, Layers3, Leaf, Palette, Plane, Shirt, Utensils, Armchair, Building2 } from "lucide-react";

const categories = [
  { name: "Nature", icon: Leaf }, { name: "Interior", icon: Armchair },
  { name: "Travel", icon: Plane }, { name: "Fashion", icon: Shirt },
  { name: "Food", icon: Utensils }, { name: "Architecture", icon: Building2 },
  { name: "Art", icon: Palette }
];

export function ExploreSidebar() {
  return <>
    <aside className="sticky top-28 hidden h-fit w-56 shrink-0 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4 lg:block">
      <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">Discover</p>
      <nav className="grid gap-1 text-sm">
        <Link href="/" className="sidebar-link"><Home size={17}/> Home</Link>
        <Link href="/explore" className="sidebar-link active"><Compass size={17}/> Explore</Link>
        <Link href="/collections" className="sidebar-link"><Layers3 size={17}/> Collections</Link>
        <Link href="/favorites" className="sidebar-link"><Bookmark size={17}/> Saved ideas</Link>
      </nav>
      <div className="my-4 border-t border-[var(--line)]"/>
      <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">Categories</p>
      <nav className="grid gap-1 text-sm">
        {categories.map(({name,icon:Icon})=><Link key={name} href={`/category/${name.toLowerCase()}`} className="sidebar-link"><Icon size={17}/>{name}</Link>)}
      </nav>
    </aside>
    <nav aria-label="Explore categories" className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
      {categories.map(({name})=><Link key={name} href={`/category/${name.toLowerCase()}`} className="pill">{name}</Link>)}
    </nav>
  </>;
}
