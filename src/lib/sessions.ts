const sessions = new Map<string, { token: string; expiresAt: number }>();

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ADMIN_PASSWORD || ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bufferToHex(signature);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSession(): Promise<string> {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const randomId = crypto.randomUUID();
  const payload = `${expiry}:${randomId}`;
  const signature = await sign(payload);
  return `${payload}:${signature}`;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}
