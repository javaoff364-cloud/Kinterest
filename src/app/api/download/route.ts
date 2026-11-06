import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

export const runtime = "nodejs";

const allowedHosts = new Set(["images.unsplash.com", "images.pexels.com", "cdn.pixabay.com"]);

export async function GET(request: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) return NextResponse.json({ error: "Image URL is required." }, { status: 400 });

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid image URL." }, { status: 400 });
  }

  if (url.protocol !== "https:" || !allowedHosts.has(url.hostname)) {
    return NextResponse.json({ error: "Image host is not allowed." }, { status: 400 });
  }

  const upstream = await fetch(url, { redirect: "error", cache: "no-store" });
  if (!upstream.ok) return NextResponse.json({ error: "Image could not be downloaded." }, { status: 502 });

  const type = upstream.headers.get("content-type") || "application/octet-stream";
  if (!type.startsWith("image/")) return NextResponse.json({ error: "The requested file is not an image." }, { status: 415 });

  const requested = (request.nextUrl.searchParams.get("filename") || "kinterest-image.jpg")
    .replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${requested}"`,
      "Cache-Control": "private, no-store"
    }
  });
}
