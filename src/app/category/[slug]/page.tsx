import { notFound } from "next/navigation";
import { categories } from "@/lib/demo-data";
import { searchPhotos } from "@/lib/providers";
import { PhotoGrid } from "@/components/photo-grid";
import { ExploreSidebar } from "@/components/explore-sidebar";
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const category=categories.find(c=>c.toLowerCase()===decodeURIComponent(slug).toLowerCase());
 if(!category||category==="All")notFound();
 const {photos}=await searchPhotos({category,page:1,perPage:24});
 return <div className="container pt-10 md:pt-12"><p className="eyebrow mb-3">Explore a little deeper</p><h1 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">{category}</h1><p className="my-4 text-[var(--muted)]">A collection of {category.toLowerCase()} ideas to save for later.</p><div className="mt-8 grid gap-7 lg:grid-cols-[14rem_minmax(0,1fr)]"><ExploreSidebar/><section className="min-w-0"><PhotoGrid photos={photos} infinite category={category}/></section></div></div>;
}
