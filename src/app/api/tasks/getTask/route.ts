import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { getDataFromToken } from "@/helpers/getUser";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId,
      deadline: { $gte: today, $lt: tomorrow },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
