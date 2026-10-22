export const ADMIN_COOKIE = "chinwei_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 24) {
    throw new Error("ADMIN_SESSION_SECRET missing or too short (need >=24 chars)");
  }
  return s;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toHex(sig);
}

export async function createSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  const sig = await hmac(issuedAt);
  return `${issuedAt}.${sig}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [issuedAt, sig] = parts;
  const n = Number(issuedAt);
  if (!Number.isFinite(n)) return false;
  if (Date.now() - n > MAX_AGE_SECONDS * 1000) return false;
  const expected = await hmac(issuedAt);
  return timingSafeEqualString(expected, sig);
}

export function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
