"use client";
import { useCallback, useEffect, useState } from "react";
const KEY="kinterest:saved-photos";
export function useSavedPhotos(){
 const [saved,setSaved]=useState<string[]>([]);
 useEffect(()=>{try{const value=localStorage.getItem(KEY);if(value)setSaved(JSON.parse(value));}catch{setSaved([]);}},[]);
 const toggle=useCallback((id:string)=>setSaved(current=>{const next=current.includes(id)?current.filter(x=>x!==id):[...current,id];try{localStorage.setItem(KEY,JSON.stringify(next));}catch{}return next;}),[]);
 return {saved,toggle,isSaved:(id:string)=>saved.includes(id)};
}