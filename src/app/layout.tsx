import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SavedPhotosProvider } from "@/components/saved-photos-provider";
export const metadata:Metadata={
 title:{default:"Kinterest — Discover. Explore. Get Inspired.",template:"%s | Kinterest"},
 description:"Discover beautiful pictures, save your favourites, and organise inspiration into collections.",
 icons:{icon:[{url:"/icon.svg",type:"image/svg+xml"}],shortcut:"/icon.svg",apple:"/icon.svg"},
 applicationName:"Kinterest",
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SavedPhotosProvider><SiteHeader/><main className="min-h-screen">{children}</main><SiteFooter/></SavedPhotosProvider></body></html>}