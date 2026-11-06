import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SavedPhotosProvider } from "@/components/saved-photos-provider";
export const metadata:Metadata={title:"Kinterest — Find your next inspiration",description:"Discover beautiful ideas, save what you love, and create collections that feel like you.",metadataBase:new URL("https://kinterest.vercel.app"),openGraph:{title:"Kinterest",description:"A little inspiration for every day.",type:"website"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SavedPhotosProvider><SiteHeader/><main className="min-h-screen">{children}</main><SiteFooter/></SavedPhotosProvider></body></html>}