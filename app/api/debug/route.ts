import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  try {
    const cookie = request.headers.get("cookie");
    let raw = null;
    let decoded = null;
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

    return NextResponse.json({
      secretPresent: {
        NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
        AUTH_SECRET: !!process.env.AUTH_SECRET,
      },
      secretLength: secret ? secret.length : 0,
      cookie,
      getTokenRaw: typeof raw === "string" ? raw.slice(0, 200) : raw,
      getTokenDecoded: decoded
        ? { sub: decoded.sub, email: decoded.email, name: decoded.name }
        : null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
