// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    const isAuthenticated = !!token;

    console.log("=== MIDDLEWARE ===");
    console.log("Path:", request.nextUrl.pathname);
    console.log("Authenticated:", isAuthenticated);
    console.log("User:", token?.email || null);
    console.log("==================");

    if (!isAuthenticated) {
      console.log("Redirecting to login...");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // En caso de error, redirigir a login por seguridad
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/form", "/list", "/dashboard"],
};
