import { NextRequest, NextResponse } from "next/server";
import { searchPhotos } from "@/lib/providers";
export const runtime="nodejs";
export async function GET(request:NextRequest){
 const params=request.nextUrl.searchParams;const q=(params.get("q")||"").trim().slice(0,120);const category=(params.get("category")||"").slice(0,60);const page=Math.max(1,Math.min(100,Number(params.get("page")||1)));const perPage=Math.max(1,Math.min(50,Number(params.get("limit")||24)));
 try{const result=await searchPhotos({query:q,category,page,perPage});return NextResponse.json({...result,page,hasMore:result.photos.length===perPage},{headers:{"Cache-Control":"public, s-maxage=300, stale-while-revalidate=600"}});}
 catch(error){console.error("Image search failed",error);return NextResponse.json({error:"Image search is temporarily unavailable.",photos:[],total:0},{status:502});}
}