import type { Photo } from "./types";
import { demoPhotos } from "./demo-data";
type SearchOptions={query?:string;page?:number;perPage?:number;category?:string};
type ProviderName="Unsplash"|"Pexels"|"Pixabay";
type ProviderResult={photos:Photo[];total:number;source:string;providerErrors:string[];providerStatus:{unsplash:boolean;pexels:boolean;pixabay:boolean}};
const clean=(v:string)=>v.replace(/[<>]/g,"").slice(0,120);
export async function searchPhotos({query="",page=1,perPage=24,category=""}:SearchOptions):Promise<ProviderResult>{
 const q=clean([query,category].filter(Boolean).join(" ")||"inspiration");
 const providerStatus={unsplash:Boolean(process.env.UNSPLASH_ACCESS_KEY),pexels:Boolean(process.env.PEXELS_API_KEY),pixabay:Boolean(process.env.PIXABAY_API_KEY)};
 const tasks:{name:ProviderName;request:Promise<Photo[]>}[]=[];
 if(providerStatus.unsplash)tasks.push({name:"Unsplash",request:fetchUnsplash(q,page,perPage)});
 if(providerStatus.pexels)tasks.push({name:"Pexels",request:fetchPexels(q,page,perPage)});
 if(providerStatus.pixabay)tasks.push({name:"Pixabay",request:fetchPixabay(q,page,perPage)});
 if(!tasks.length){
  if(page>1)return {photos:[],total:demoPhotos.length,source:"demo",providerErrors:[],providerStatus};
  const matches=demoPhotos.filter(p=>!query&&!category||[p.alt,p.category,p.photographer].join(" ").toLowerCase().includes(q.toLowerCase()));
  return {photos:matches,total:matches.length,source:"demo",providerErrors:[],providerStatus};
 }
 const results=await Promise.allSettled(tasks.map(task=>task.request));
 const providerErrors:string[]=[];
 const photos=results.flatMap((result,index)=>{
  if(result.status==="fulfilled")return result.value;
  providerErrors.push(`${tasks[index].name}: ${result.reason instanceof Error?result.reason.message:"request failed"}`);
  return [];
 });
 const unique=[...new Map(photos.map(p=>[p.imageUrl.split("?")[0],p])).values()];
 return {photos:unique.slice(0,perPage),total:unique.length,source:unique.length?"live":"unavailable",providerErrors,providerStatus};
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
   if(!r.ok)return null;const x=await r.json();const hit=x.hits?.[0];if(!hit)return null;return {id,provider:"pixabay",imageUrl:hit.largeImageURL,thumbUrl:hit.webformatURL,alt:hit.tags||"Untitled photograph",photographer:hit.user,sourceUrl:hit.pageURL,width:hit.imageWidth,height:hit.imageHeight};
  }
  return demoPhotos.find(photo=>photo.id===id)||null;
 }catch{return null;}
}
async function fetchUnsplash(q:string,page:number,n:number):Promise<Photo[]>{
 const u=new URL("https://api.unsplash.com/search/photos");u.searchParams.set("query",q);u.searchParams.set("page",String(page));u.searchParams.set("per_page",String(n));
 const r=await fetch(u,{headers:{Authorization:`Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`},next:{revalidate:300}});
 if(!r.ok)throw new Error(`HTTP ${r.status}`);const j=await r.json();
 return (j.results||[]).map((x:any):Photo=>({id:`unsplash-${x.id}`,provider:"unsplash",imageUrl:x.urls.regular,thumbUrl:x.urls.small,alt:x.alt_description||x.description||"Untitled photograph",photographer:x.user.name,photographerUrl:x.user.links.html,sourceUrl:x.links.html,width:x.width,height:x.height}));
}
async function fetchPexels(q:string,page:number,n:number):Promise<Photo[]>{
 const u=new URL("https://api.pexels.com/v1/search");u.searchParams.set("query",q);u.searchParams.set("page",String(page));u.searchParams.set("per_page",String(n));
 const r=await fetch(u,{headers:{Authorization:process.env.PEXELS_API_KEY!},next:{revalidate:300}});
 if(!r.ok)throw new Error(`HTTP ${r.status} — check that PEXELS_API_KEY is valid and active`);const j=await r.json();
 return (j.photos||[]).map((x:any):Photo=>({id:`pexels-${x.id}`,provider:"pexels",imageUrl:x.src.large2x||x.src.large,thumbUrl:x.src.medium,alt:x.alt||"Untitled photograph",photographer:x.photographer,photographerUrl:x.photographer_url,sourceUrl:x.url,width:x.width,height:x.height}));
}
async function fetchPixabay(q:string,page:number,n:number):Promise<Photo[]>{
 const u=new URL("https://pixabay.com/api/");u.searchParams.set("key",process.env.PIXABAY_API_KEY!);u.searchParams.set("q",q);u.searchParams.set("page",String(page));u.searchParams.set("per_page",String(n));u.searchParams.set("image_type","photo");u.searchParams.set("safesearch","true");
 const r=await fetch(u,{next:{revalidate:300}});if(!r.ok)throw new Error(`HTTP ${r.status}`);const j=await r.json();
 return (j.hits||[]).map((x:any):Photo=>({id:`pixabay-${x.id}`,provider:"pixabay",imageUrl:x.largeImageURL,thumbUrl:x.webformatURL,alt:x.tags||"Untitled photograph",photographer:x.user,sourceUrl:x.pageURL,width:x.imageWidth,height:x.imageHeight}));
}
