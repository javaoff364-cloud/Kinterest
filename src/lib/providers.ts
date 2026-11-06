import type { Photo } from "./types";
import { demoPhotos } from "./demo-data";
type SearchOptions={query?:string;page?:number;perPage?:number;category?:string};
const clean=(v:string)=>v.replace(/[<>]/g,"").slice(0,120);
export async function searchPhotos({query="",page=1,perPage=24,category=""}:SearchOptions):Promise<{photos:Photo[];total:number;source:string}>{
 const q=clean([query,category].filter(Boolean).join(" ")||"inspiration");
 const tasks:Promise<Photo[]>[]=[];
 if(process.env.UNSPLASH_ACCESS_KEY)tasks.push(fetchUnsplash(q,page,perPage));
 if(process.env.PEXELS_API_KEY)tasks.push(fetchPexels(q,page,perPage));
 if(process.env.PIXABAY_API_KEY)tasks.push(fetchPixabay(q,page,perPage));
 if(!tasks.length){
  if(page>1)return {photos:[],total:demoPhotos.length,source:"demo"};
  const matches=demoPhotos.filter(p=>!query&&!category||[p.alt,p.category,p.photographer].join(" ").toLowerCase().includes(q.toLowerCase()));
  return {photos:matches.length?matches:demoPhotos,total:matches.length||demoPhotos.length,source:"demo"};
 }
 const results=await Promise.allSettled(tasks);
 const photos=results.flatMap(r=>r.status==="fulfilled"?r.value:[]);
 const unique=[...new Map(photos.map(p=>[p.imageUrl.split("?")[0],p])).values()];
 return {photos:unique.slice(0,perPage),total:unique.length,source:"live"};
}
export async function getPhotoById(id:string):Promise<Photo|null>{
 try{
  if(id.startsWith("unsplash-")&&process.env.UNSPLASH_ACCESS_KEY){
   const key=id.slice(9);const r=await fetch(`https://api.unsplash.com/photos/${encodeURIComponent(key)}`,{headers:{Authorization:`Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`},next:{revalidate:3600}});
   if(!r.ok)return null;const x=await r.json();return {id,provider:"unsplash",imageUrl:x.urls.regular,thumbUrl:x.urls.small,alt:x.alt_description||x.description||"Untitled photograph",photographer:x.user.name,photographerUrl:x.user.links.html,sourceUrl:x.links.html,width:x.width,height:x.height};
  }
  if(id.startsWith("pexels-")&&process.env.PEXELS_API_KEY){
   const key=id.slice(7);const r=await fetch(`https://api.pexels.com/v1/photos/${encodeURIComponent(key)}`,{headers:{Authorization:process.env.PEXELS_API_KEY},next:{revalidate:3600}});
   if(!r.ok)return null;const x=await r.json();return {id,provider:"pexels",imageUrl:x.src.large2x||x.src.large,thumbUrl:x.src.medium,alt:x.alt||"Untitled photograph",photographer:x.photographer,photographerUrl:x.photographer_url,sourceUrl:x.url,width:x.width,height:x.height};
  }
  if(id.startsWith("pixabay-")&&process.env.PIXABAY_API_KEY){
   const key=id.slice(8);const u=new URL("https://pixabay.com/api/");u.searchParams.set("key",process.env.PIXABAY_API_KEY);u.searchParams.set("id",key);u.searchParams.set("safesearch","true");const r=await fetch(u,{next:{revalidate:3600}});
   if(!r.ok)return null;const x=(await r.json()).hits?.[0];if(!x)return null;return {id,provider:"pixabay",imageUrl:x.largeImageURL,thumbUrl:x.webformatURL,alt:x.tags||"Untitled photograph",photographer:x.user,sourceUrl:x.pageURL,width:x.imageWidth,height:x.imageHeight};
  }
  return demoPhotos.find(photo=>photo.id===id)||null;
 }catch{return null;}
}
async function fetchUnsplash(q:string,page:number,n:number):Promise<Photo[]>{const u=new URL("https://api.unsplash.com/search/photos");u.searchParams.set("query",q);u.searchParams.set("page",String(page));u.searchParams.set("per_page",String(n));const r=await fetch(u,{headers:{Authorization:`Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`},next:{revalidate:300}});if(!r.ok)throw new Error("Unsplash request failed");const j=await r.json();return (j.results||[]).map((x:any):Photo=>({id:`unsplash-${x.id}`,provider:"unsplash",imageUrl:x.urls.regular,thumbUrl:x.urls.small,alt:x.alt_description||x.description||"Untitled photograph",photographer:x.user.name,photographerUrl:x.user.links.html,sourceUrl:x.links.html,width:x.width,height:x.height}));}
async function fetchPexels(q:string,page:number,n:number):Promise<Photo[]>{const u=new URL("https://api.pexels.com/v1/search");u.searchParams.set("query",q);u.searchParams.set("page",String(page));u.searchParams.set("per_page",String(n));const r=await fetch(u,{headers:{Authorization:process.env.PEXELS_API_KEY!},next:{revalidate:300}});if(!r.ok)throw new Error("Pexels request failed");const j=await r.json();return (j.photos||[]).map((x:any):Photo=>({id:`pexels-${x.id}`,provider:"pexels",imageUrl:x.src.large2x||x.src.large,thumbUrl:x.src.medium,alt:x.alt||"Untitled photograph",photographer:x.photographer,photographerUrl:x.photographer_url,sourceUrl:x.url,width:x.width,height:x.height}));}
async function fetchPixabay(q:string,page:number,n:number):Promise<Photo[]>{const u=new URL("https://pixabay.com/api/");u.searchParams.set("key",process.env.PIXABAY_API_KEY!);u.searchParams.set("q",q);u.searchParams.set("page",String(page));u.searchParams.set("per_page",String(n));u.searchParams.set("image_type","photo");u.searchParams.set("safesearch","true");const r=await fetch(u,{next:{revalidate:300}});if(!r.ok)throw new Error("Pixabay request failed");const j=await r.json();return (j.hits||[]).map((x:any):Photo=>({id:`pixabay-${x.id}`,provider:"pixabay",imageUrl:x.largeImageURL,thumbUrl:x.webformatURL,alt:x.tags||"Untitled photograph",photographer:x.user,sourceUrl:x.pageURL,width:x.imageWidth,height:x.imageHeight}));}
