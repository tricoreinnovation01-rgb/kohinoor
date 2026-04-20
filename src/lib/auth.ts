import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE = "diya_admin_token";
const MAX_AGE = 60 * 60 * 24 * 7;

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return s;
}

export type JwtPayload = { sub: string; email: string; role: string };

export function signAdminToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email, role: "admin" }, getSecret(), {
    expiresIn: MAX_AGE,
  });
}

export function verifyAdminToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}

export async function setAuthCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getAuthFromCookies(): Promise<JwtPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}
