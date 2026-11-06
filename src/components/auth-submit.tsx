"use client";
import { useFormStatus } from "react-dom";
export function AuthSubmit({children}:{children:React.ReactNode}) {
 const {pending}=useFormStatus();
 return <button type="submit" disabled={pending} aria-disabled={pending} className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60">{pending?"Please wait…":children}</button>;
}