"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email();
const signUpSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: emailSchema,
  password: z.string().min(8).max(128),
});

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
  const emailResult = emailSchema.safeParse(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");
  if (!emailResult.success || !password) {
    redirect("/login?error=" + encodeURIComponent("Email yoki parolni tekshiring."));
  }
  const { error } = await auth.signIn.email({ email: emailResult.data, password });
  if (error) redirect("/login?error=" + encodeURIComponent(authMessage(error.message || "Authentication failed.")));
  redirect("/");
}

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  });
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Ro‘yxatdan o‘tish ma’lumotlarini tekshiring.";
    redirect("/signup?error=" + encodeURIComponent(message));
  }
  const { email, password, name } = parsed.data;
  const { error } = await auth.signUp.email({ email, password, name });
  if (error) redirect("/signup?error=" + encodeURIComponent(authMessage(error.message || "Registration failed.")));
  redirect("/");
}

export async function signOut() {
  await auth.signOut();
  redirect("/");
}
