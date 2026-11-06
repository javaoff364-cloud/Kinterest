"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function authMessage(message:string) {
 const value=message.toLowerCase();
 if(value.includes("rate limit")||value.includes("too many requests")||value.includes("429")) return "Ro‘yxatdan o‘tish vaqtincha cheklangan. Birozdan keyin qayta urinib ko‘ring.";
 if(value.includes("already registered")||value.includes("already been registered")) return "Bu email bilan akkaunt mavjud. Tizimga kiring.";
 if(value.includes("invalid login credentials")) return "Email yoki parol noto‘g‘ri.";
 return message.slice(0,220);
}

export async function signIn(formData:FormData) {
 const supabase=await createClient();
 if(!supabase) redirect("/login?error=Supabase%20sozlanmagan");
 const email=String(formData.get("email")||"").trim().toLowerCase();
 const password=String(formData.get("password")||"");
 const {error}=await supabase.auth.signInWithPassword({email,password});
 if(error) redirect("/login?error="+encodeURIComponent(authMessage(error.message)));
 redirect("/");
}

export async function signUp(formData:FormData) {
 const supabase=await createClient();
 if(!supabase) redirect("/signup?error=Supabase%20sozlanmagan");
 const name=String(formData.get("name")||"").trim().slice(0,80);
 const email=String(formData.get("email")||"").trim().toLowerCase();
 const password=String(formData.get("password")||"");
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/signup?error=Email%20manzilini%20tekshiring");
 if(password.length<8) redirect("/signup?error=Parol%20kamida%208%20ta%20belgi%20bo‘lsin");
 const {data,error}=await supabase.auth.signUp({email,password,options:{data:{name}}});
 if(error) redirect("/signup?error="+encodeURIComponent(authMessage(error.message)));
 if(!data.session) redirect("/signup?error="+encodeURIComponent("Supabase dashboard'da Confirm email sozlamasini o‘chiring, keyin qayta ro‘yxatdan o‘ting."));
 redirect("/");
}

export async function signOut() {
 const supabase=await createClient();
 if(supabase) await supabase.auth.signOut();
 redirect("/");
}