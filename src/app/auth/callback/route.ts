import { NextResponse,type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request:NextRequest) {
 const {searchParams,origin}=request.nextUrl;
 const code=searchParams.get("code");
 const requested=searchParams.get("next")||"/";
 const next=requested.startsWith("/")&&!requested.startsWith("//")?requested:"/";
 if(code) {
  const supabase=await createClient();
  if(supabase) {
   const {error}=await supabase.auth.exchangeCodeForSession(code);
   if(!error) return NextResponse.redirect(new URL(next,origin));
  }
 }
 return NextResponse.redirect(new URL("/login?error="+encodeURIComponent("Email tasdiqlash havolasi yaroqsiz yoki muddati tugagan."),origin));
}