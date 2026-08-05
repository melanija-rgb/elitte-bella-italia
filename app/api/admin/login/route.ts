import { NextResponse } from "next/server";
import { COOKIE_NAME, getAdminPassword, getSessionToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || password !== getAdminPassword()) {
      return NextResponse.json(
        { error: "Pogrešna lozinka" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, getSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Greška pri prijavi" }, { status: 500 });
  }
}
