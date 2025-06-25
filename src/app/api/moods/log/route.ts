import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import MoodLog from "@/models/moodModel";
import { getDataFromToken } from "@/helpers/getUser";
connect();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const { moodType, moodLevel, reason, note } = await request.json();

    if (!moodType || !moodLevel || moodLevel < 1 || moodLevel > 5) {
      return NextResponse.json({ error: "Invalid mood data" }, { status: 400 });
    }

    const newMood = new MoodLog({
      userId,
      moodType,
      moodLevel,
      reason,
      note,
    });

    await newMood.save();

    return NextResponse.json({
      message: "Mood logged successfully!",
      mood: newMood,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
