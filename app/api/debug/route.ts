import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  try {
    const cookie = request.headers.get("cookie");
    let raw: unknown = null;
    let decoded: unknown = null;
    try {
      // @ts-ignore - raw option may not be typed here depending on version
      raw = await getToken({ req: request, secret, raw: true } as any);
    } catch (e) {
      raw = `error: ${String(e)}`;
    }
    try {
      decoded = await getToken({ req: request, secret });
    } catch (e) {
      decoded = `error: ${String(e)}`;
    }

    // Safely create raw preview string
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

    return NextResponse.json({
      secretPresent: {
        NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
        AUTH_SECRET: !!process.env.AUTH_SECRET,
      },
      secretLength: secret ? secret.length : 0,
      cookie,
      getTokenRaw: rawPreview,
      getTokenDecoded:
        decoded && typeof decoded === "object"
          ? {
              sub: (decoded as any).sub,
              email: (decoded as any).email,
              name: (decoded as any).name,
            }
          : null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
