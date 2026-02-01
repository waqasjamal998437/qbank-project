import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminSecret = process.env.ADMIN_SECRET_KEY;

    if (!adminSecret) {
      return NextResponse.json(
        { error: "Admin secret key not configured" },
        { status: 500 }
      );
    }

    if (password !== adminSecret) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Set admin token cookie (expires in 24 hours)
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
