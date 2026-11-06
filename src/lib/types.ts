export type Photo = {
  id: string; provider: "unsplash" | "pexels" | "pixabay" | "demo";
  imageUrl: string; thumbUrl: string; alt: string; photographer: string;
  photographerUrl?: string; sourceUrl: string; width: number; height: number;
  color?: string; likes?: number; category?: string;
};
export type Collection = { id: string; title: string; description: string; cover: string; count: number; };