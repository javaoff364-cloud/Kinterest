"use client";
import { useSavedPhotosContext } from "@/components/saved-photos-provider";
export function useSavedPhotos() { return useSavedPhotosContext(); }