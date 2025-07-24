"use client";
import { useState, useEffect } from "react";
import { MoodClock } from "../../components/moodClock/page";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const moodColors: Record<string, string> = {
  happy: "#FFD700",
  sad: "#6495ED",
  angry: "#FF6347",
  anxious: "#9370DB",
  depressed: "#708090",
  neutral: "#A9A9A9",
};

const moodEmojiMap: Record<string, string> = {
  happy: "😄",
  sad: "😢",
  angry: "😡",
  anxious: "😰",
  depressed: "😞",
  neutral: "😊",
};

const moodMessageMap: Record<string, string> = {
  happy: "Very Happy",
  sad: "A bit Down",
  angry: "Frustrated",
  anxious: "Anxious",
  depressed: "Feeling Low",
  neutral: "Feeling Okay",
};

type MoodEntry = {
  mood: string;
  percentage: number;
  intensity?: number;
  reasons?: string;
};

const CustomMoodBar = ({
  data,
  onHover,
  onLeave,
}: {
  data: MoodEntry[];
  onHover: (mood: MoodEntry, event: React.MouseEvent<HTMLDivElement>) => void;
  onLeave: () => void;
}) => {
  if (!data || data.length === 0) return null;
  const maxPercentage = Math.max(...data.map((d) => d.percentage));
  const maxHeight = 200;

  return (
    <div className="flex items-end justify-center gap-4 p-6 bg-white rounded-2xl shadow-lg">
      {data.map((mood) => {
        const height = (mood.percentage / maxPercentage) * maxHeight;
        const actualHeight = Math.max(height, 60);

        return (
          <div
            key={mood.mood}
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
            onMouseEnter={(e) => onHover(mood, e)}
            onMouseLeave={onLeave}
          >
            <div className="text-2xl mb-2 relative z-10">
              {moodEmojiMap[mood.mood] || "😊"}
            </div>
            <div
              className="w-12 rounded-full flex items-end justify-center relative"
              style={{
                height: `${actualHeight}px`,
                backgroundColor: moodColors[mood.mood] || "#A9A9A9",
                opacity: 0.8,
              }}
            >
              <span className="text-white text-xs font-bold mb-2">
                {mood.percentage}%
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-2 capitalize">
              {mood.mood}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MoodTooltip = ({
  mood,
  position,
  visible,
}: {
  mood: MoodEntry | null;
  position: { x: number; y: number };
  visible: boolean;
}) => {
  if (!visible || !mood) return null;
  return (
    <div
      className="absolute z-50 bg-purple-300 text-white p-3 rounded-lg shadow-lg max-w-xs pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="text-sm font-semibold mb-1">
        {moodMessageMap[mood.mood]} {moodEmojiMap[mood.mood]}
      </div>
      <div className="text-xs text-gray-100">
        Intensity: {mood.intensity ?? "N/A"}
      </div>
      <div className="text-xs text-gray-100">
        Percentage: {mood.percentage}%
      </div>
      {mood.reasons && (
        <div className="text-xs text-gray-100 mt-1">
          Reasons: {mood.reasons}
        </div>
      )}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
    </div>
  );
};

export default function MoodPage() {
  const [barChartData, setBarChartData] = useState<MoodEntry[]>([]);
  const [rawMoodData, setRawMoodData] = useState<any[]>([]);
  const [firstEntry, setFirstEntry] = useState(false);
  const [dominantMood, setDominantMood] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<MoodEntry | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const { user, isLoading } = useAuth();
  useEffect(() => {
    const formatHour = (dateStr: string): string => {
      const date = new Date(dateStr);
      let hour = date.getHours();
      const suffix = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}${suffix}`;
    };

    fetch("/api/moods/today", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const moods = data.moods || [];
        if (moods.length === 0) setFirstEntry(true);
        setRawMoodData(moods);

        const moodTotals: Record<string, number> = {};
        const moodIntensities: Record<string, number[]> = {};
        const moodReasons: Record<string, string[]> = {};
        let totalIntensity = 0;

        for (const mood of moods) {
          const type = mood.moodType.toLowerCase();
          const level = mood.moodLevel;

          moodTotals[type] = (moodTotals[type] || 0) + level;
          totalIntensity += level;

          (moodIntensities[type] ||= []).push(level);
          if (mood.reason) (moodReasons[type] ||= []).push(mood.reason);
        }

        const moodPercent: MoodEntry[] = Object.keys(moodTotals).map((type) => {
          const avgIntensity =
            moodIntensities[type].reduce((a, b) => a + b) /
            moodIntensities[type].length;
          const reasons = moodReasons[type]?.join(", ") || "No specific reason";
          return {
            mood: type,
            percentage: Math.round((moodTotals[type] / totalIntensity) * 100),
            intensity: Math.round(avgIntensity * 10) / 10,
            reasons,
          };
        });

        const maxMood = Object.keys(moodTotals).reduce((a, b) =>
          moodTotals[a] > moodTotals[b] ? a : b
        );

        setDominantMood(maxMood);
        setBarChartData(moodPercent);
      })
      .catch((err) => console.error("can't fetch data", err));
  }, []);

  const handleBarHover = (
    moodData: MoodEntry,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setTooltipPosition({ x: event.pageX, y: event.pageY - 40 });
    setTooltipData(moodData);
    setTooltipVisible(true);
  };

  const handleBarLeave = () => {
    setTooltipVisible(false);
    setTooltipData(null);
  };

  const now = new Date();
  const formatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <main className="pt-16 lg:px-32 md:px-24 sm:px-12 bg-gradient-to-b from-[#cfb5cc] to-white min-h-screen relative">
      <div className="w-full flex flex-col items-center pt-8">
        <h1 className="text-4xl font-serif text-white">
          Hello <span className="text-[#5d3d5f]">{user?.username}!</span>
        </h1>
        <h1 className="text-2xl font-serif text-[#462b48] pt-3 mb-2">
          {firstEntry
            ? "How are you feeling today?"
            : "How are you feeling now?"}
        </h1>
        <h3 className="text-sm font-serif text-gray-400">{formatted}</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mt-10 px-4 sm:px-0">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:w-[60%] w-full flex flex-col sm:flex-row justify-between items-center">
          <div className="flex-1">
            {firstEntry ? (
              <>
                <h2 className="text-2xl font-bold text-[#4a3d7c]">
                  {getGreeting()}
                </h2>
                <h1 className="text-2xl font-bold text-[#4a3d7c]">
                  {user?.username}
                </h1>
              </>
            ) : (
              <>
                <h2 className="text-sm text-gray-500 mb-1">I'm feeling</h2>
                <h1 className="text-3xl font-bold text-[#4a3d7c]">
                  {moodMessageMap[dominantMood || "neutral"]}
                </h1>
              </>
            )}

            <p className="text-sm italic mt-2 text-gray-500 max-w-[90%] leading-snug">
              "When your heart is full, share your light with the world."
            </p>
          </div>
          <div className="text-[120px] leading-none mt-6 sm:mt-0 sm:ml-4">
            {moodEmojiMap[dominantMood || "neutral"]}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:w-[35%] w-full">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <Link
              href="/logMood"
              className="text-base font-semibold text-[#4a3d7c]"
            >
              Enter your current mood
            </Link>
            <p className="text-sm text-gray-400 mt-2">
              Wishing you a happy day 🌟
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-[#b8b2b2] font-medium">
                🔥 Daily Streak
              </h3>
              <p className="text-2xl font-bold text-[#695aa4]">
                {user?.Moodstreak ?? 0} days 🔥
              </p>
            </div>
            <Link
              href="/profile"
              className="w-10 h-10 rounded-full bg-[#695aa4] text-white flex items-center justify-center font-bold shadow onClick={onProfileClick}"
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col lg:flex-row gap-8 items-start justify-center px-4">
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-md p-6">
            {firstEntry ? (
              // First Entry State
              <div className="text-center py-4">
                <h2 className="text-xl font-semibold mb-2 text-purple-800">
                  Track Your Today's Mood
                </h2>
                <p className="text-purple-600 mb-6">
                  Start by entering your mood
                </p>
                <Link
                  href="/logMood"
                  className="bg-[#903895] text-white px-6 py-2 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Log First Mood
                </Link>
              </div>
            ) : (
              // Regular State - Show mood data
              <>
                <h2 className="text-xl font-semibold mb-4 text-center lg:text-left">
                  Today's Mood Overview
                </h2>
                <CustomMoodBar
                  data={barChartData}
                  onHover={handleBarHover}
                  onLeave={handleBarLeave}
                />
              </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full">
          <MoodClock moodData={rawMoodData} />
        </div>
      </div>

      <MoodTooltip
        mood={tooltipData}
        position={tooltipPosition}
        visible={tooltipVisible}
      />
    </main>
  );
}
