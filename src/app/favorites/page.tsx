import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FavoritesContent } from "./favorites-content";
export default async function FavoritesPage(){const supabase=await createClient();if(!supabase)redirect("/login?message=Sign%20in%20to%20view%20saved%20ideas");const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login?next=%2Ffavorites");return <FavoritesContent/>;}