import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getUser";
import { connect } from "@/dbconfig/dbconfig";
import Mood from "@/models/moodModel";

connect();

function getWeekRange(referenceDate: Date, offsetWeeks: number = 0) {
  const date = new Date(referenceDate);
  const day = date.getDay(); // 0 = Sunday
  const diffToMonday = (day + 6) % 7;

  // Set to Monday of desired week
  const monday = new Date(date);
  monday.setDate(monday.getDate() - diffToMonday - offsetWeeks * 7);
  monday.setHours(0, 0, 0, 0);

  // Sunday of that week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return [monday, sunday];
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const today = new Date();
    const isSunday = today.getDay() === 0;

    // If Sunday, include this week; else exclude
    const [thisWeekStart, thisWeekEnd] = getWeekRange(today, isSunday ? 0 : 1);
    const [lastWeekStart, lastWeekEnd] = getWeekRange(today, isSunday ? 1 : 2);

    // Fetch moods from DB for both weeks
    const moods = await Mood.find({
      userId,
      createdAt: {
        $gte: lastWeekStart,
        $lte: thisWeekEnd,
      },
    });

    // Separate weeks
    const lastWeekMoods = moods.filter(
      (m) =>
        new Date(m.createdAt) >= lastWeekStart &&
        new Date(m.createdAt) <= lastWeekEnd
    );
    const thisWeekMoods = isSunday
      ? moods.filter(
          (m) =>
            new Date(m.createdAt) >= thisWeekStart &&
            new Date(m.createdAt) <= thisWeekEnd
        )
      : [];

    function summarize(moodList: typeof moods) {
      const total = moodList.length;
      const counts: Record<string, number> = {};
      const reasons: Record<string, string[]> = {};

      for (const m of moodList) {
        const mood = m.moodType.toLowerCase();
        counts[mood] = (counts[mood] || 0) + 1;
        if (!reasons[mood]) reasons[mood] = [];
        if (m.reason) reasons[mood].push(m.reason);
      }

      return Object.entries(counts).map(([mood, count]) => ({
        mood,
        percentage: Math.round((count / total) * 100),
        reason: reasons[mood]?.[0] ?? "No reason given", // You could also join reasons, if needed
      }));
    }

    const thisSummary = summarize(thisWeekMoods);
    const lastSummary = summarize(lastWeekMoods);

    // Comparison (for happy/sad only)
    const getPercent = (arr: any[], mood: string) =>
      arr.find((m) => m.mood === mood)?.percentage || 0;

    const happier =
      getPercent(thisSummary, "happy") - getPercent(lastSummary, "happy");
    const lessSad =
      getPercent(lastSummary, "sad") - getPercent(thisSummary, "sad");

    return NextResponse.json({
      thisWeek: thisSummary,
      lastWeek: lastSummary,
      comparison: {
        happier: Math.max(0, happier),
        lessSad: Math.max(0, lessSad),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
