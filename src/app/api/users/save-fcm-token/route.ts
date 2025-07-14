// /app/api/notifications/save-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel"; // your Mongoose user model
import jwt from "jsonwebtoken";
import { connect } from "@/dbconfig/dbconfig";

connect();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    const cookie = request.cookies.get("token")?.value;
    const decoded: any = jwt.verify(cookie!, process.env.TOKEN_SECRET!);

    const user = await User.findById(decoded.id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.fcmToken = token;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Token save failed" }, { status: 500 });
  }
}
