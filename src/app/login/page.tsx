import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import { AuthSubmit } from "@/components/auth-submit";
import { GoogleSignInButton } from "@/components/google-sign-in";
import { BrandMark } from "@/components/brand-mark";
export default async function LoginPage({searchParams}:{searchParams:Promise<{error?:string;message?:string}>}) {
 const query=await searchParams;
 return <div className="container flex justify-center py-12 sm:py-20"><div className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 soft-shadow sm:p-8">
 <div className="mb-7 flex items-center gap-3"><BrandMark className="h-10 w-10"/><span className="text-xl font-bold tracking-tight">kinterest</span></div>
 <h1 className="text-3xl font-semibold tracking-tight">Welcome back.</h1><p className="mt-2 text-sm text-[var(--muted)]">Sign in to save ideas and manage your collections.</p>
 {query.error&&<p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm leading-6 text-rose-700">{query.error}</p>}
 {query.message&&<p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-700">{query.message}</p>}
 <div className="mt-7"><GoogleSignInButton/></div>
 <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]"/><span>OR CONTINUE WITH EMAIL</span><span className="h-px flex-1 bg-[var(--line)]"/></div>
 <form action={signIn} className="grid gap-4"><label className="grid gap-2 text-sm font-medium">Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none focus:border-[var(--accent)]"/></label><label className="grid gap-2 text-sm font-medium">Password<input name="password" type="password" autoComplete="current-password" required placeholder="Your password" className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none focus:border-[var(--accent)]"/></label><AuthSubmit>Sign in</AuthSubmit></form>
 <p className="mt-6 text-center text-sm text-[var(--muted)]">New to Kinterest? <Link className="font-semibold text-[var(--accent)]" href="/signup">Create an account</Link></p>
 </div></div>;
}
