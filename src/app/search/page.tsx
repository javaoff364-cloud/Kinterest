import { searchPhotos } from "@/lib/providers";
import { PhotoGrid } from "@/components/photo-grid";
import { Search, AlertCircle } from "lucide-react";
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const {q=""}=await searchParams;const query=q.trim().slice(0,120);
 const result=await searchPhotos({query,page:1,perPage:24});
 const {photos,total,providerErrors,providerStatus}=result;
 const pexelsMissing=!providerStatus.pexels;
 return <div className="container min-w-0 pt-10 md:pt-12">
  <p className="eyebrow mb-3">Find something lovely</p><h1 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">Search</h1>
  <form action="/search" className="my-7 flex min-w-0 w-full max-w-2xl items-center rounded-full bg-[var(--soft)] px-4 py-3 sm:px-5 sm:py-4"><Search size={19} className="mr-3 shrink-0 text-[var(--muted)]"/><input name="q" defaultValue={query} placeholder="Try nature, interiors, travel..." className="min-w-0 flex-1 bg-transparent outline-none"/></form>
  <p className="mb-6 text-sm text-[var(--muted)]">{query?(`Results for “${query}” · ${total} found`):"Popular inspiration"}</p>
  {pexelsMissing&&<div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm"><AlertCircle className="mt-0.5 shrink-0 text-amber-600" size={18}/><div><strong>Pexels is not connected.</strong><p className="mt-1 text-[var(--muted)]">Add PEXELS_API_KEY in Vercel → Project Settings → Environment Variables, then redeploy. Keep the key private and do not add NEXT_PUBLIC_ to its name.</p></div></div>}
  {providerErrors.length>0&&<div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm"><strong>Some image providers failed:</strong><ul className="mt-2 list-disc pl-5 text-[var(--muted)]">{providerErrors.map(error=><li key={error}>{error}</li>)}</ul></div>}
  {photos.length?<PhotoGrid photos={photos} infinite query={query}/>:<div className="rounded-3xl bg-[var(--soft)] px-6 py-20 text-center"><h2 className="text-2xl font-semibold">No matches just yet</h2><p className="mt-2 text-sm text-[var(--muted)]">{providerErrors.length?"Image providers did not return results. Check the API key status above.":"Try a broader search, like “nature” or “travel”."}</p></div>}
 </div>;
}
