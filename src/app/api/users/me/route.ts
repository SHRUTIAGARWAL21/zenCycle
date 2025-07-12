import { connect } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getUser";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password ");
    if (!user) throw new Error("unauthorized");
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
