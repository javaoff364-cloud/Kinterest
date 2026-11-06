"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

function authMessage(message: string) {
  const value = message.toLowerCase();
  if (value.includes("already") && (value.includes("registered") || value.includes("exists"))) {
    return "Bu email bilan akkaunt mavjud. Tizimga kiring.";
  }
  if (value.includes("invalid") || value.includes("credential")) {
    return "Email yoki parol noto‘g‘ri.";
  }
  if (value.includes("rate") || value.includes("too many") || value.includes("429")) {
    return "Juda ko‘p urinish bo‘ldi. Birozdan keyin qayta urinib ko‘ring.";
  }
  return message.slice(0, 220);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const { error } = await auth.signIn.email({ email, password });
  if (error) redirect("/login?error=" + encodeURIComponent(authMessage(error.message || "Authentication failed.")));
  redirect("/");
}

export async function signUp(formData: FormData) {
  const name = String(formData.get("name") || "").trim().slice(0, 80);
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/signup?error=" + encodeURIComponent("Email manzilini tekshiring."));
  }
  if (password.length < 8) {
    redirect("/signup?error=" + encodeURIComponent("Parol kamida 8 ta belgidan iborat bo‘lsin."));
  }
  const { error } = await auth.signUp.email({ email, password, name });
  if (error) redirect("/signup?error=" + encodeURIComponent(authMessage(error.message)));
  redirect("/");
}

export async function signOut() {
  await auth.signOut();
  redirect("/");
}
