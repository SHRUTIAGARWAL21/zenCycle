"use client";
import { useEffect, useState } from "react";

type MoodStat = {
  mood: string;
  percentage: number;
  reason?: string;
};

type WeeklySummaryData = {
  thisWeek: MoodStat[];
  lastWeek: MoodStat[];
  comparison: {
    happier: number;
    lessSad: number;
  };
};

const moodEmojiMap: Record<string, string> = {
  happy: "😄",
  sad: "😢",
  angry: "😡",
  anxious: "😰",
  depressed: "😞",
  neutral: "😐",
};

export default function WeeklySummary() {
  const [summary, setSummary] = useState<WeeklySummaryData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    fetch("/api/moods/weekly-summary", { credentials: "include" })
      .then((res) => res.json())
      .then(setSummary)
      .catch((err) => console.error("Failed to fetch summary", err));
  }, [mounted]);

  if (!mounted || !summary) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow mt-6 max-w-2xl mx-auto border border-gray-200">
      <h2 className="text-xl font-bold text-center mb-4 text-[#4a3d7c]">
        📅 Weekly Mood Summary
      </h2>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-[#4a3d7c] mb-2">
          {summary.thisWeek.length > 0 ? "This Week" : "Last Completed Week"}
        </h3>
        {summary.thisWeek.map((mood) => (
          <div
            key={mood.mood}
            className="flex justify-between items-start mb-1 text-sm"
          >
            <div>
              {moodEmojiMap[mood.mood]}{" "}
              <span className="capitalize font-medium">{mood.mood}</span>
              {" — "}
              <span className="text-gray-500">{mood.reason || "—"}</span>
            </div>
            <div className="font-semibold text-[#4a3d7c]">
              {mood.percentage}%
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold text-[#4a3d7c] mb-2">
          🆚 Compared to Previous Week
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          You were{" "}
          <span className="text-green-600 font-semibold">
            {summary.comparison.happier}% happier
          </span>{" "}
          and{" "}
          <span className="text-blue-600 font-semibold">
            {summary.comparison.lessSad}% less sad
          </span>{" "}
          than the previous week.
        </p>
      </div>

      {summary.comparison.happier > 0 && (
        <div className="text-center mt-3 text-green-700 text-lg font-bold animate-bounce">
          🌱 Great Progress! Keep it up!
        </div>
      )}
    </div>
  );
}
