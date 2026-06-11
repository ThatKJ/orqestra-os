import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifySession(token: string): Promise<boolean> {
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [expiry, randomId, signature] = parts;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(adminPassword), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify("HMAC", key, hexToBuffer(signature), encoder.encode(`${expiry}:${randomId}`));
  if (!valid) return false;
  return Date.now() < Number(expiry);
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("admin_session")?.value;
  const url = request.nextUrl.clone();

  if (!sessionToken || !(await verifySession(sessionToken))) {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/dashboard/:path*",
};
