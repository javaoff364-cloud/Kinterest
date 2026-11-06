import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthSubmit } from "@/components/auth-submit";
import { GoogleSignInButton } from "@/components/google-sign-in";
import { BrandMark } from "@/components/brand-mark";
export default async function SignupPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
 const query=await searchParams;
 return <div className="container flex justify-center py-12 sm:py-20"><div className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 soft-shadow sm:p-8">
 <div className="mb-7 flex items-center gap-3"><BrandMark className="h-10 w-10"/><span className="text-xl font-bold tracking-tight">kinterest</span></div>
 <h1 className="text-3xl font-semibold tracking-tight">Make inspiration yours.</h1><p className="mt-2 text-sm text-[var(--muted)]">Create an account to save photos and build collections.</p>
 {query.error&&<p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm leading-6 text-rose-700">{query.error}</p>}
 <div className="mt-7"><GoogleSignInButton/></div>
 <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]"/><span>OR SIGN UP WITH EMAIL</span><span className="h-px flex-1 bg-[var(--line)]"/></div>
 <form action={signUp} className="grid gap-4"><label className="grid gap-2 text-sm font-medium">Your name<input name="name" autoComplete="name" required maxLength={80} placeholder="Your name" className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none"/></label><label className="grid gap-2 text-sm font-medium">Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none"/></label><label className="grid gap-2 text-sm font-medium">Password<input name="password" type="password" autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none"/></label><AuthSubmit>Create account</AuthSubmit></form>
 <p className="mt-6 text-center text-sm text-[var(--muted)]">Already have an account? <Link className="font-semibold text-[var(--accent)]" href="/login">Sign in</Link></p>
 </div></div>;
}
