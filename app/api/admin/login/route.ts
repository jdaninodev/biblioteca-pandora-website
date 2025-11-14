import { NextResponse } from "next/server";
import { signAdmin, TOKEN_NAME } from "../../../../lib/adminAuth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdmin({ role: "admin", email });

    const res = NextResponse.json({ ok: true });
    res.cookies.set({ name: TOKEN_NAME, value: token, httpOnly: true, path: "/", maxAge: 60 * 60 * 24 });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
