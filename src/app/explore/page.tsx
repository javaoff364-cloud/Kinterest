import { searchPhotos } from "@/lib/providers";
import { PhotoGrid } from "@/components/photo-grid";
import { ExploreSidebar } from "@/components/explore-sidebar";
export default async function ExplorePage(){
 const {photos}=await searchPhotos({page:1,perPage:24});
 return <div className="container pt-10 md:pt-12">
  <p className="eyebrow mb-3">A world of ideas</p><h1 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">Explore</h1>
  <p className="mt-3 max-w-xl text-[var(--muted)]">Wander through ideas, places, colors and details collected from around the web.</p>
  <div className="mt-8 grid gap-7 lg:grid-cols-[14rem_minmax(0,1fr)]">
   <ExploreSidebar/>
   <section className="min-w-0"><PhotoGrid photos={photos} infinite query="inspiration"/></section>
  </div>
 </div>;
}
