import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  // Debug: print whether secrets exist and raw cookie header (will appear in Vercel logs)
  try {
    console.log(
      "middleware: NEXTAUTH_SECRET present",
      !!process.env.NEXTAUTH_SECRET,
      "AUTH_SECRET present",
      !!process.env.AUTH_SECRET
    );
    console.log("middleware: secret length", secret ? secret.length : 0);
    console.log("middleware: raw cookie header", request.headers.get("cookie"));
  } catch (err) {
    console.log("middleware secret/cookie debug error", err);
  }

  // Try getting raw token first to inspect what getToken receives/returns
  let token = null;
  try {
    // @ts-ignore - raw may not be typed in this version of next-auth
    const raw: unknown = await getToken({
      req: request,
      secret,
      raw: true,
    } as any);
    // Safely produce a short preview string for logs without assuming types
    let rawPreview: string | null = null;
    if (raw == null) rawPreview = null;
    else if (typeof raw === "string") rawPreview = raw.slice(0, 200);
    else if (typeof raw === "object") {
      try {
        rawPreview = JSON.stringify(raw).slice(0, 200);
      } catch {
        rawPreview = String(raw).slice(0, 200);
      }
    } else {
      rawPreview = String(raw).slice(0, 200);
    }
    console.log("middleware: getToken raw:", rawPreview);
  } catch (err) {
    console.log("middleware: getToken(raw) error", err);
  }

  try {
    token = await getToken({ req: request, secret });
    console.log(
      "middleware: getToken decoded:",
      token ? { sub: token.sub, email: token.email, name: token.name } : null
    );
  } catch (err) {
    console.log("middleware: getToken(decoded) error", err);
  }

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
