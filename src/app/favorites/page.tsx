import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { FavoritesContent } from "./favorites-content";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/login?next=%2Ffavorites");
  return <FavoritesContent />;
}
