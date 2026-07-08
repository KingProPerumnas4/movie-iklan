import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET ?? "Kew62HH8IVESLY/kYhgT2L4G4um/rqDqyIhCw4OOdeY=";
const encodedKey = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (session) {
    try {
      await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {}
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: "/admin/:path*",
};
