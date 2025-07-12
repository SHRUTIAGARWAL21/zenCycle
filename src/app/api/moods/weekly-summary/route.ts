import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getUser";
import { connect } from "@/dbconfig/dbconfig";
import Mood from "@/models/moodModel";

connect();

function getWeekRange(referenceDate: Date, offsetWeeks: number = 0) {
  const date = new Date(referenceDate);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diffToMonday = (day + 6) % 7;

  const monday = new Date(date);
  monday.setDate(monday.getDate() - diffToMonday - offsetWeeks * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return [monday, sunday];
}

function getMostFrequentReason(reasons: string[]) {
  const freq: Record<string, number> = {};
  for (const r of reasons) {
    freq[r] = (freq[r] || 0) + 1;
  }

  let mostCommon = "";
  let maxCount = 0;
  for (const [reason, count] of Object.entries(freq)) {
    if (count > maxCount) {
      mostCommon = reason;
      maxCount = count;
    }
  }

  return mostCommon || "No reason given";
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const today = new Date();
    const isSunday = today.getDay() === 0;

    let activeWeekStart: Date, activeWeekEnd: Date;
    let previousWeekStart: Date, previousWeekEnd: Date;

    if (isSunday) {
      // Sunday: Show current and previous weeks
      [activeWeekStart, activeWeekEnd] = getWeekRange(today, 0); // This week (Mon–Sun)
      [previousWeekStart, previousWeekEnd] = getWeekRange(today, 1); // Last week
    } else {
      // Mon–Sat: Show last completed week and week before that
      [activeWeekStart, activeWeekEnd] = getWeekRange(today, 1); // Last full week
      [previousWeekStart, previousWeekEnd] = getWeekRange(today, 2); // One before that
    }

    // Fetch moods across both weeks
    const moods = await Mood.find({
      userId,
      createdAt: {
        $gte: previousWeekStart,
        $lte: activeWeekEnd,
      },
    });

    const thisWeekMoods = moods.filter(
      (m) =>
        new Date(m.createdAt) >= activeWeekStart &&
        new Date(m.createdAt) <= activeWeekEnd
    );

    const lastWeekMoods = moods.filter(
      (m) =>
        new Date(m.createdAt) >= previousWeekStart &&
        new Date(m.createdAt) <= previousWeekEnd
    );

    function summarize(moodList: typeof moods) {
      const total = moodList.length;
      if (total === 0) return [];

      const counts: Record<string, number> = {};
      const reasonMap: Record<string, string[]> = {};

      for (const m of moodList) {
        const mood = m.moodType.toLowerCase();
        counts[mood] = (counts[mood] || 0) + 1;

        if (!reasonMap[mood]) reasonMap[mood] = [];
        if (m.reason) reasonMap[mood].push(m.reason);
      }

      return Object.entries(counts).map(([mood, count]) => ({
        mood,
        percentage: Math.round((count / total) * 100),
        reason: getMostFrequentReason(reasonMap[mood]),
      }));
    }

    return NextResponse.json({
      thisWeek: summarize(thisWeekMoods),
      lastWeek: summarize(lastWeekMoods),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
