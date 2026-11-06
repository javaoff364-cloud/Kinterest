"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function signIn(formData:FormData){const supabase=await createClient();if(!supabase)throw new Error("Supabase is not configured yet.");const email=String(formData.get("email")||"");const password=String(formData.get("password")||"");const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw new Error(error.message);redirect("/");}
export async function signUp(formData:FormData){const supabase=await createClient();if(!supabase)throw new Error("Supabase is not configured yet.");const email=String(formData.get("email")||"");const password=String(formData.get("password")||"");const {error}=await supabase.auth.signUp({email,password});if(error)throw new Error(error.message);redirect("/");}
export async function signOut(){const supabase=await createClient();if(supabase)await supabase.auth.signOut();redirect("/");}
