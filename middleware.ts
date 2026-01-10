// middleware.ts
import { auth } from "@/lib/auth"; // O "@/auth" si tienes el alias configurado
import { NextResponse } from "next/server";

export default auth((req) => {
  const token = req.auth;
  const isAuthenticated = !!token;

  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Path:", req.nextUrl.pathname);
  console.log("Authenticated:", isAuthenticated);
  console.log("User:", token?.user || null);
  console.log("========================");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/form", "/list", "/dashboard"],
};
