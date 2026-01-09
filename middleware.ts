import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  // Debug: print whether secrets exist and raw cookie header (will appear in Vercel logs)
  try {
    console.log("middleware: NEXTAUTH_SECRET present", !!process.env.NEXTAUTH_SECRET, "AUTH_SECRET present", !!process.env.AUTH_SECRET);
    console.log("middleware: secret length", secret ? secret.length : 0);
    console.log("middleware: raw cookie header", request.headers.get("cookie"));
  } catch (err) {
    console.log("middleware secret/cookie debug error", err);
  }

  const token = await getToken({
    req: request,
    secret,
  });

  // Debug: print whether token exists and which auth cookies are present (will appear in Vercel logs)
  try {
    const cookieNames = [
      "__Secure-authjs.session-token",
      "authjs.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.session-token",
      "__Secure-authjs.callback-url",
      "authjs.callback-url",
    ];
    const cookiePresence = cookieNames.map((name) => ({
      name,
      present: !!request.cookies.get(name)?.value,
    }));
    console.log("middleware: token?", !!token, "cookies:", cookiePresence);
  } catch (err) {
    console.log("middleware debug error", err);
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/form", "/list", "/dashboard"] };
