// The /admin session: a cookie holding "<expiry>.<signature>", signed with
// HMAC-SHA256 under ADMIN_PASSWORD (plus ADMIN_SESSION_SECRET when set, so
// sessions can be revoked without changing the password). Uses Web Crypto so
// the same check runs in middleware and on the server.

export const SESSION_COOKIE = "shahee_admin";
export const SESSION_DAYS = 14;

const enc = new TextEncoder();

function secret(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return `${pw}:${process.env.ADMIN_SESSION_SECRET ?? ""}`;
}

async function sign(value: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession(): Promise<string | null> {
  const key = secret();
  if (!key) return null;
  const expiry = String(Date.now() + SESSION_DAYS * 86_400_000);
  return `${expiry}.${await sign(expiry, key)}`;
}

export async function validSession(token: string | undefined): Promise<boolean> {
  const key = secret();
  if (!key || !token) return false;
  const [expiry, sig] = token.split(".");
  if (!expiry || !sig || Number(expiry) < Date.now()) return false;
  return sameString(sig, await sign(expiry, key));
}

/** Constant-time password check. */
export async function passwordMatches(attempt: string): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  // compare digests so the length of the real password never leaks
  const [a, b] = await Promise.all([sign(attempt, "pw"), sign(pw, "pw")]);
  return sameString(a, b);
}
