import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { pool } from "@/lib/db";
import type { Photo } from "@/lib/types";

export const runtime = "nodejs";
const imageHosts = new Set(["images.unsplash.com", "images.pexels.com", "cdn.pixabay.com"]);
const providers = new Set(["unsplash", "pexels", "pixabay", "demo"]);

function photoFromRow(row: Record<string, string>): Photo {
  return {
    id: row.provider_photo_id,
    provider: row.provider as Photo["provider"],
    imageUrl: row.image_url,
    thumbUrl: row.thumb_url,
    alt: row.alt,
    photographer: row.photographer,
    sourceUrl: row.source_url,
    width: 900,
    height: 1200
  };
}

async function getUser() {
  const { data: session } = await auth.getSession();
  return session?.user ?? null;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { rows } = await pool.query(
    `SELECT provider, provider_photo_id, image_url, thumb_url, alt, photographer, source_url
     FROM public.saved_photos
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user.id]
  );

  return NextResponse.json({ photos: rows.map(photoFromRow) }, {
    headers: { "Cache-Control": "private, no-store" }
  });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let photo: Partial<Photo>;
  try {
    const body = await request.json() as { photo?: Partial<Photo> };
    photo = body.photo ?? {};
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof photo.id !== "string" || !photo.id || photo.id.length > 200 ||
    typeof photo.provider !== "string" || !providers.has(photo.provider) ||
    typeof photo.imageUrl !== "string" || typeof photo.thumbUrl !== "string" ||
    typeof photo.sourceUrl !== "string"
  ) {
    return NextResponse.json({ error: "Invalid image details." }, { status: 400 });
  }

  let image: URL;
  let thumb: URL;
  let source: URL;
  try {
    image = new URL(photo.imageUrl);
    thumb = new URL(photo.thumbUrl || photo.imageUrl);
    source = new URL(photo.sourceUrl);
  } catch {
    return NextResponse.json({ error: "Invalid image URL." }, { status: 400 });
  }

  if (
    image.protocol !== "https:" || thumb.protocol !== "https:" ||
    !imageHosts.has(image.hostname) || !imageHosts.has(thumb.hostname) ||
    source.protocol !== "https:"
  ) {
    return NextResponse.json({ error: "Image source is not allowed." }, { status: 400 });
  }

  const values = [
    user.id,
    photo.provider,
    photo.id,
    image.toString(),
    thumb.toString(),
    String(photo.alt || "").slice(0, 500),
    String(photo.photographer || "").slice(0, 200),
    source.toString()
  ];

  const { rows } = await pool.query(
    `INSERT INTO public.saved_photos
      (user_id, provider, provider_photo_id, image_url, thumb_url, alt, photographer, source_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (user_id, provider, provider_photo_id)
     DO UPDATE SET image_url = EXCLUDED.image_url,
                   thumb_url = EXCLUDED.thumb_url,
                   alt = EXCLUDED.alt,
                   photographer = EXCLUDED.photographer,
                   source_url = EXCLUDED.source_url
     RETURNING provider, provider_photo_id, image_url, thumb_url, alt, photographer, source_url`,
    values
  );

  return NextResponse.json({ photo: photoFromRow(rows[0]) }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let body: { provider?: string; id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.id || body.id.length > 200 || !body.provider || !providers.has(body.provider)) {
    return NextResponse.json({ error: "Invalid image identifier." }, { status: 400 });
  }

  await pool.query(
    "DELETE FROM public.saved_photos WHERE user_id = $1 AND provider = $2 AND provider_photo_id = $3",
    [user.id, body.provider, body.id]
  );

  return NextResponse.json({ success: true });
}
