import { NextResponse } from "next/server";
import { adminCredentialsMatch, adminSessionCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!adminCredentialsMatch(String(username), String(password))) return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  const cookie = adminSessionCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}