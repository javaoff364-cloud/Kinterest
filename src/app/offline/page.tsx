import Link from "next/link";

export default function OfflinePage() {
  return <div className="container flex min-h-[65vh] items-center justify-center py-16 text-center">
    <div className="max-w-md rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8">
      <p className="eyebrow">You are offline</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">A little pause.</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Kinterest could not reach the internet. Reconnect and try again. Previously opened pages may still be available.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">Try again</Link>
    </div>
  </div>;
}
