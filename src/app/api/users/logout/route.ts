import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "logged out successfully" });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
