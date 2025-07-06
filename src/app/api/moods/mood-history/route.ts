import { connect } from "@/dbconfig/dbconfig";
import MoodLog from "@/models/moodModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getUser";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const moods = await MoodLog.find({ userId });

    const moodByDate: Record<string, { mood: string; level: number }[]> = {};

    moods.forEach((mood) => {
      const date = new Date(mood.createdAt).toISOString().split("T")[0];
      if (!moodByDate[date]) moodByDate[date] = [];
      moodByDate[date].push({
        mood: mood.moodType.toLowerCase(),
        level: mood.moodLevel,
      });
    });

    const result: { date: string; mood: string; intensity: number }[] = [];

    Object.entries(moodByDate).forEach(([date, moods]) => {
      const moodWeight: Record<string, number> = {};
      let totalIntensity = 0;

      moods.forEach(({ mood, level }) => {
        moodWeight[mood] = (moodWeight[mood] || 0) + level;
        totalIntensity += level;
      });

      const [dominantMood, dominantValue] = Object.entries(moodWeight).reduce(
        (a, b) => (a[1] > b[1] ? a : b)
      );

      const intensity = Math.round((dominantValue / totalIntensity) * 100);

      result.push({ date, mood: dominantMood, intensity });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
