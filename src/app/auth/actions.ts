"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=Supabase%20is%20not%20configured");
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=" + encodeURIComponent(error.message));
  redirect("/");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/signup?error=Supabase%20is%20not%20configured");
  const name = String(formData.get("name") || "").trim().slice(0, 80);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  if (error) redirect("/signup?error=" + encodeURIComponent(error.message));
  if (!data.session) redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}