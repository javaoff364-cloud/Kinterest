import type { SVGProps } from "react";
export function BrandMark({className,...props}:{className?:string}&SVGProps<SVGSVGElement>){
 return <svg viewBox="0 0 64 64" role="img" aria-label="Kinterest" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
  <rect width="64" height="64" rx="18" fill="#D9785B"/>
  <path d="M18 19.5C22.5 14.8 30.2 14.8 34.7 19.5L44.8 30.1C49.2 34.7 49.2 42.2 44.8 46.8C40.3 51.5 32.6 51.5 28.1 46.8L24.7 43.3" fill="none" stroke="#FFFDF9" strokeWidth="6" strokeLinecap="round"/>
  <path d="M46 44.5C41.5 49.2 33.8 49.2 29.3 44.5L19.2 33.9C14.8 29.3 14.8 21.8 19.2 17.2C23.7 12.5 31.4 12.5 35.9 17.2L39.3 20.7" fill="none" stroke="#FFFDF9" strokeWidth="6" strokeLinecap="round"/>
  <circle cx="32" cy="32" r="4" fill="#FFFDF9"/>
 </svg>;
}