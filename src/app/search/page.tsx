import { searchPhotos } from "@/lib/providers";
import { PhotoGrid } from "@/components/photo-grid";
import { Search } from "lucide-react";
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const {q=""}=await searchParams;const query=q.trim().slice(0,120);
 const {photos,total}=await searchPhotos({query,page:1,perPage:24});
 return <div className="container pt-10 md:pt-12">
  <p className="eyebrow mb-3">Find something lovely</p><h1 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">Search</h1>
  <form action="/search" className="my-7 flex max-w-2xl items-center rounded-full bg-[var(--soft)] px-5 py-4"><Search size={19} className="mr-3 shrink-0 text-[var(--muted)]"/><input name="q" defaultValue={query} placeholder="Try nature, interiors, travel..." className="w-full bg-transparent outline-none"/></form>
  <p className="mb-6 text-sm text-[var(--muted)]">{query?(`Results for “${query}” · ${total} found`):"Popular inspiration"}</p>
  {photos.length?<PhotoGrid photos={photos} infinite query={query}/>:<div className="rounded-3xl bg-[var(--soft)] px-6 py-20 text-center"><h2 className="text-2xl font-semibold">No matches just yet</h2><p className="mt-2 text-sm text-[var(--muted)]">Try a broader search, like “nature” or “travel”.</p></div>}
 </div>;
}
