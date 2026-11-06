"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Photo } from "@/lib/types";

type SavedContextValue = {
  saved: string[];
  savedPhotos: Photo[];
  isSaved: (photo: Photo) => boolean;
  toggle: (photo: Photo) => Promise<void>;
};

const SavedContext = createContext<SavedContextValue | null>(null);
const keyOf = (photo: Pick<Photo, "provider" | "id">) => `${photo.provider}:${photo.id}`;

export function SavedPhotosProvider({ children }: { children: React.ReactNode }) {
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/saved-photos", { cache: "no-store" });
      if (!response.ok) {
        setSavedPhotos([]);
        return;
      }
      const data = await response.json() as { photos?: Photo[] };
      setSavedPhotos(data.photos ?? []);
    } catch {
      setSavedPhotos([]);
    }
  }, []);

  useEffect(() => {
    void load();
    const refresh = () => { void load(); };
    window.addEventListener("kinterest:auth-change", refresh);
    return () => window.removeEventListener("kinterest:auth-change", refresh);
  }, [load, pathname]);

  const toggle = useCallback(async (photo: Photo) => {
    const exists = savedPhotos.some((item) => keyOf(item) === keyOf(photo));
    try {
      const response = await fetch("/api/saved-photos", {
        method: exists ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exists ? { provider: photo.provider, id: photo.id } : { photo })
      });

      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
        return;
      }
      if (!response.ok) {
        window.alert(exists ? "Could not remove this saved image. Please try again." : "Could not save this image. Please try again.");
        return;
      }

      setSavedPhotos((current) => exists
        ? current.filter((item) => keyOf(item) !== keyOf(photo))
        : current.some((item) => keyOf(item) === keyOf(photo)) ? current : [...current, photo]
      );
    } catch {
      window.alert("Network error. Please try again.");
    }
  }, [pathname, router, savedPhotos]);

  const saved = useMemo(() => savedPhotos.map(keyOf), [savedPhotos]);
  const value = useMemo(() => ({
    saved,
    savedPhotos,
    isSaved: (photo: Photo) => saved.includes(keyOf(photo)),
    toggle
  }), [saved, savedPhotos, toggle]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSavedPhotosContext() {
  const value = useContext(SavedContext);
  if (!value) throw new Error("useSavedPhotosContext must be used inside SavedPhotosProvider");
  return value;
}
