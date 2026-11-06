"use client";
import { Download } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export function DownloadButton({url,filename}:{url:string;filename:string}) {
 const router=useRouter(); const pathname=usePathname();
 async function download(){
  const supabase=createClient();
  if(!supabase){router.push("/login?message=Sign%20in%20to%20download%20images");return;}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);return;}
  window.location.href=`/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
 }
 return <button type="button" onClick={()=>void download()} className="pill inline-flex items-center gap-2"><Download size={16}/> Download</button>;
}