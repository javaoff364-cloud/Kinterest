import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SavedPhotosProvider } from "@/components/saved-photos-provider";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
 title: { default: "Kinterest — Discover. Explore. Get Inspired.", template: "%s | Kinterest" },
 description: "Discover beautiful pictures, save your favourites, and organise inspiration into collections.",
 icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], shortcut: "/icon.svg", apple: "/icon.svg" },
 applicationName: "Kinterest",
 manifest: "/manifest.webmanifest",
 appleWebApp: { capable: true, statusBarStyle: "default", title: "Kinterest" }
};
export const viewport: Viewport = {
 width: "device-width",
 initialScale: 1,
 viewportFit: "cover",
 themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fbf8f3" }, { media: "(prefers-color-scheme: dark)", color: "#171715" }]
};
const themeScript = `(()=>{try{const mode=localStorage.getItem("kinterest-theme")||"system";const dark=mode==="dark"||(mode==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=dark?"dark":"light"}catch{document.documentElement.dataset.theme="light"}})()`;
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><SavedPhotosProvider><SiteHeader/><main className="min-h-screen">{children}</main><SiteFooter/><PwaRegister/></SavedPhotosProvider></body></html>;
}
