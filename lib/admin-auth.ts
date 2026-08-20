import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "nexastay_admin_session";

function signature() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return "";
  return createHmac("sha256", secret).update("nexastay-admin").digest("hex");
}

export function adminCredentialsMatch(username: string, password: string) {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

export async function isAdminSession() {
  const value = (await cookies()).get(cookieName)?.value;
  const expected = signature();
  if (!value || !expected || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function adminSessionCookie() {
  return { name: cookieName, value: signature(), options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 } };
}