"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ImageOff } from "lucide-react";
import type { Photo } from "@/lib/types";
import { SaveButton } from "@/components/save-button";

type PhotoGridProps = { photos: Photo[]; infinite?: boolean; query?: string; category?: string };
type ImageResponse = { photos?: Photo[]; hasMore?: boolean };

function PhotoCard({ photo, priority }: { photo: Photo; priority: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return <article className="masonry-card group">
    <Link href={`/photo/${encodeURIComponent(photo.id)}`} aria-label={photo.alt} className="relative block">
      {!loaded && !failed && <span className="absolute inset-0 animate-pulse bg-[var(--soft)]"/>}
      {failed ? <span className="grid min-h-40 place-items-center text-[var(--muted)]"><ImageOff size={24}/></span> :
        <Image src={photo.imageUrl} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width:560px) 48vw, (max-width:900px) 30vw, (max-width:1400px) 20vw, 16vw" priority={priority} loading={priority ? "eager" : "lazy"} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} className={`h-auto w-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}/>}
    </Link>
    <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"><SaveButton photo={photo}/><Link href={`/photo/${encodeURIComponent(photo.id)}`} aria-label="Open image" className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#554f47] shadow"><ArrowUpRight size={17}/></Link></div>
    <Link href={`/photo/${encodeURIComponent(photo.id)}`} className="photo-overlay"><p className="line-clamp-1 text-sm font-semibold">{photo.alt}</p><p className="mt-1 text-xs opacity-80">by {photo.photographer}</p></Link>
  </article>;
}

export function PhotoGrid({ photos, infinite = false, query = "", category = "" }: PhotoGridProps) {
  const [items, setItems] = useState(photos);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(infinite);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set(photos.map((photo) => photo.id)));

  useEffect(() => {
    setItems(photos);
    setPage(1);
    setHasMore(infinite);
    seen.current = new Set(photos.map((photo) => photo.id));
  }, [photos, infinite, query, category]);

  const loadMore = useCallback(async () => {
    if (!infinite || loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page + 1), limit: "24" });
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      const response = await fetch(`/api/images?${params.toString()}`);
      if (!response.ok) throw new Error("Image request failed");
      const data = await response.json() as ImageResponse;
      const next = (data.photos ?? []).filter((photo) => !seen.current.has(photo.id));
      next.forEach((photo) => seen.current.add(photo.id));
      setItems((current) => [...current, ...next]);
      setPage((current) => current + 1);
      setHasMore(Boolean(data.hasMore) && next.length > 0);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [category, hasMore, infinite, loading, page, query]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !infinite || !hasMore || loading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadMore();
    }, { rootMargin: "700px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, infinite, loadMore, loading]);

  return <>
    <div className="masonry">{items.map((photo, index) => <PhotoCard key={photo.id} photo={photo} priority={index < 2}/>)}</div>
    {infinite && (loading || hasMore) && <div ref={sentinel} className="mt-7" aria-live="polite">
      {loading && <div className="skeleton-grid">{Array.from({length:6},(_,i)=><div key={i} className="skeleton-tile" style={{height:`${160+(i%3)*50}px`}}/>)}</div>}
      {!loading && <p className="py-5 text-center text-xs text-[var(--muted)]">Scroll to discover more</p>}
    </div>}
  </>;
}
