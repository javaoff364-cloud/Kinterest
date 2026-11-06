"use client";
import { Share2 } from "lucide-react";
export function ShareButton(){return <button type="button" onClick={()=>void navigator.clipboard?.writeText(window.location.href)} className="pill inline-flex items-center gap-2"><Share2 size={16}/> Share</button>;}