import { SettingsClient } from "@/components/settings-client";

export default function SettingsPage() {
  return <div className="container max-w-4xl py-10 sm:py-16">
    <p className="eyebrow mb-3">Make it yours</p>
    <h1 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">Settings</h1>
    <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">Manage your profile, personalise your space, and keep your inspiration organised.</p>
    <div className="mt-8"><SettingsClient/></div>
  </div>;
}