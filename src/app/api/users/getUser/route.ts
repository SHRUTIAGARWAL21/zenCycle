import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateStreak } from "@/helpers/updateStreak";

connect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.TOKEN_SECRET!;
    let decoded: any;

    try {
      decoded = jwt.verify(token, secret);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json({ error: "TokenExpired" }, { status: 401 });
      } else {
        return NextResponse.json({ error: "InvalidToken" }, { status: 401 });
      }
    }

    const userId = decoded.id;

    const user = await User.findById(userId).select(
      "username streak totalActiveDays"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await updateStreak(userId);

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
