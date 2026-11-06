"use client";
import { Heart } from "lucide-react";
import type { Photo } from "@/lib/types";
import { useSavedPhotos } from "@/hooks/use-saved-photos";

export function SaveButton({ photo }: { photo: Photo }) {
  const { isSaved, toggle } = useSavedPhotos();
  const active = isSaved(photo);
  return <button type="button" onClick={() => void toggle(photo)} aria-label={active ? "Remove from saved" : "Save idea"} aria-pressed={active} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${active ? "bg-rose-50 text-rose-600" : "bg-[var(--accent)] text-white hover:bg-[#c5684c]"}`}>
    <Heart size={17} fill={active ? "currentColor" : "none"}/>{active ? "Saved" : "Save idea"}
  </button>;
}