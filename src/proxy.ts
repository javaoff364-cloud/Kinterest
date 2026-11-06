import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/login",
  publicRoutes: [
    "/",
    "/explore",
    "/search",
    "/collections",
    "/category",
    "/photo",
    "/login",
    "/signup",
    "/api/images",
    "/api/download",
    "/api/saved-photos"
  ]
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
