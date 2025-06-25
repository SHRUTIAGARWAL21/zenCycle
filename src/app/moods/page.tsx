"use client";
import { useState, useEffect } from "react";

export default function MoodPage() {
  const [percentages, setPercentages] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await fetch("/api/moods/today");
        const data = await res.json();
        const moods = data.moods || [];

        const moodTotals: { [key: string]: number } = {};
        let totalIntensity = 0;

        for (const mood of moods) {
          const type = mood.moodType.toLowerCase();
          const level = mood.moodLevel;

          if (!moodTotals[type]) {
            moodTotals[type] = 0;
          }

          moodTotals[type] += level;
          totalIntensity += level;
        }

        const moodPercent: { [key: string]: number } = {};
        for (const type in moodTotals) {
          moodPercent[type] = Math.round(
            (moodTotals[type] / totalIntensity) * 100
          );
        }

        setPercentages(moodPercent);
      } catch (error: any) {
        console.log("can't fetch data : ", error.message);
      }
    };

    fetchMoods();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Mood Percentages (By Intensity)</h2>
      <ul className="mt-4 space-y-2">
        {Object.entries(percentages).map(([mood, percent]) => (
          <li key={mood}>
            <strong>{mood}</strong>: {percent}%
          </li>
        ))}
      </ul>
    </div>
  );
}
