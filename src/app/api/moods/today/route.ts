import { connect } from "@/dbconfig/dbconfig";
import MoodLog from "@/models/moodModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getUser";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const now = new Date();

    const moods = await MoodLog.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: now },
    });

    return NextResponse.json({ moods });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
