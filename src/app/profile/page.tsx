"use client";
import { useState, useEffect } from "react";
import MoodHeatmap from "../components/MoodHeatmap/page";
import WeeklySummary from "../components/WeeklySummary.tsx/page";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    username: string;
    streak: number;
    totalActiveDays: number;
  } | null>(null);

  const [heatmapData, setHeapmapData] = useState<
    { date: string; mood: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/moods/mood-history", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setHeapmapData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch mood history", err);
      });
  }, []);

  useEffect(() => {
    fetch("/api/users/getUser", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      })
      .catch((err) => console.error("can't fetch user data", err));
  }, []);

  const moodColors: Record<string, string> = {
    happy: "#FFD700",
    sad: "#6495ED",
    angry: "#FF6347",
    anxious: "#9370DB",
    depressed: "#708090",
    neutral: "#A9A9A9",
  };

  return (
    <main>
      <div>{user?.username}</div>
      <div>{user?.streak}🔥</div>
      <div>{user?.totalActiveDays}</div>
      <MoodHeatmap />
      <WeeklySummary />
    </main>
  );
}
