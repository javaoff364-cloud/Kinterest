"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Photo } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type SavedContextValue = { saved: string[]; savedPhotos: Photo[]; isSaved: (photo: Photo) => boolean; toggle: (photo: Photo) => Promise<void> };
const SavedContext = createContext<SavedContextValue | null>(null);
const keyOf = (photo: Pick<Photo, "provider" | "id">) => `${photo.provider}:${photo.id}`;

export function SavedPhotosProvider({ children }: { children: React.ReactNode }) {
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const load = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSavedPhotos([]); return; }
    const { data, error } = await supabase.from("saved_photos").select("provider,provider_photo_id,image_url,thumb_url,alt,photographer,source_url");
    if (!error) setSavedPhotos((data ?? []).map((row) => ({
      id: row.provider_photo_id, provider: row.provider as Photo["provider"],
      imageUrl: row.image_url, thumbUrl: row.thumb_url, alt: row.alt,
      photographer: row.photographer, sourceUrl: row.source_url,
      width: 900, height: 1200
    })));
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void load(); });
    return () => subscription.unsubscribe();
  }, [load]);

  const toggle = useCallback(async (photo: Photo) => {
    const supabase = createClient();
    if (!supabase) { router.push("/login?message=Account%20setup%20is%20required"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/login?next=${encodeURIComponent(pathname || "/")}`); return; }
    const key = keyOf(photo);
    if (savedPhotos.some((item) => keyOf(item) === key)) {
      const { error } = await supabase.from("saved_photos").delete().eq("provider", photo.provider).eq("provider_photo_id", photo.id);
      if (error) { window.alert("Could not remove this saved image. Please try again."); return; }
      setSavedPhotos((current) => current.filter((item) => keyOf(item) !== key));
    } else {
      const { error } = await supabase.from("saved_photos").upsert({
        user_id: user.id, provider: photo.provider, provider_photo_id: photo.id,
        image_url: photo.imageUrl, thumb_url: photo.thumbUrl || photo.imageUrl,
        alt: photo.alt, photographer: photo.photographer, source_url: photo.sourceUrl
      }, { onConflict: "user_id,provider,provider_photo_id" });
      if (error) { window.alert("Could not save this image. Please try again."); return; }
      setSavedPhotos((current) => current.some((item) => keyOf(item) === key) ? current : [...current, photo]);
    }
  }, [pathname, router, savedPhotos]);

  const saved = useMemo(() => savedPhotos.map(keyOf), [savedPhotos]);
  const value = useMemo(() => ({ saved, savedPhotos, isSaved: (photo: Photo) => saved.includes(keyOf(photo)), toggle }), [saved, savedPhotos, toggle]);
  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}
export function useSavedPhotosContext() {
  const value = useContext(SavedContext);
  if (!value) throw new Error("useSavedPhotosContext must be used inside SavedPhotosProvider");
  return value;
}