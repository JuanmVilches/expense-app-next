import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Importación dinámica de auth para evitar errores de edge runtime
  const { auth } = await import("@/lib/auth");

  const session = await auth();
  const isAuthenticated = !!session;

  console.log("=== MIDDLEWARE ===");
  console.log("Path:", request.nextUrl.pathname);
  console.log("Authenticated:", isAuthenticated);
  console.log("User:", session?.user?.email || null);
  console.log("==================");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/form", "/list", "/dashboard"],
};
