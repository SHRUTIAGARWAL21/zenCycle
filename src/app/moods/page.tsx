"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const moodColors: { [key: string]: string } = {
  happy: "#FFD700",
  sad: "#6495ED",
  angry: "#FF6347",
  anxious: "#9370DB",
  depressed: "#708090",
  neutral: "#A9A9A9",
};

export default function MoodPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await fetch("/api/users/getUser", {
          credentials: "include",
        });
        const userData = await res.json();
        setUser(userData);
      } catch (error: any) {
        console.log("can't fetch user data", error.message);
      }
    };

    fetchUserDetail();
  }, []);

  useEffect(() => {
    const formatHour = (dateStr: string): string => {
      const date = new Date(dateStr);
      let hour = date.getHours();
      const suffix = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}${suffix}`;
    };

    const fetchMoods = async () => {
      try {
        const res = await fetch("/api/moods/today", {
          credentials: "include",
        });
        const data = await res.json();
        const moods = data.moods || [];

        const grouped: { [hour: string]: any } = {};
        const moodTotals: { [key: string]: number } = {};
        let totalIntensity = 0;

        for (const mood of moods) {
          const hour = formatHour(mood.createdAt);
          const type = mood.moodType.toLowerCase();
          const level = mood.moodLevel;

          // Group by hour for line chart
          if (!grouped[hour]) grouped[hour] = { time: hour };
          grouped[hour][type] = (grouped[hour][type] || 0) + level;

          // Accumulate total for bar chart
          moodTotals[type] = (moodTotals[type] || 0) + level;
          totalIntensity += level;
        }

        const lineData = Object.values(grouped).sort(
          (a: any, b: any) =>
            new Date("1970/01/01 " + a.time).getTime() -
            new Date("1970/01/01 " + b.time).getTime()
        );

        const moodPercent: any[] = [];
        for (const type in moodTotals) {
          moodPercent.push({
            mood: type,
            percentage: Math.round((moodTotals[type] / totalIntensity) * 100),
          });
        }

        setLineChartData(lineData);
        setBarChartData(moodPercent);
      } catch (error: any) {
        console.log("can't fetch data : ", error.message);
      }
    };

    fetchMoods();
  }, []);

  const now = new Date();
  const formatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="p-4 bg-gradient-to-b from-[#cfb5cc] to-white">
      <div className="w-full flex flex-col items-center pt-8">
        <h1 className="text-4xl font-serif text-white">
          Hello <span className="text-[#5d3d5f]">{user?.username}!</span>
        </h1>
        <h1 className="text-2xl font-bold pt-3 mb-2">
          How are you feeling today?
        </h1>
        <h3 className="text-sm font-serif text-gray-400">{formatted}</h3>
      </div>

      <div className="w-[40%] bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between relative">
        {/* Header row with text and arrow */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Log your current mood?
          </h2>
          <span className="text-2xl text-purple-500">➜</span>
        </div>

        {/* Quote at bottom in light gray */}
        <p className="mt-4 text-sm text-gray-500">
          “The habit of being happy enables one to be freed, or largely freed,
          from the domination of outward conditions.” – Robert Louis Stevenson
        </p>

        {/* Laughing emoji at bottom-right */}
        <div className="absolute bottom-4 right-4 text-2xl">😂</div>
      </div>

      {/* Bar Chart */}
      <h2 className="text-xl font-semibold mb-3">Mood Percentages</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barChartData}>
          <XAxis dataKey="mood" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentage">
            {barChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={moodColors[entry.mood] || "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Line Chart */}
      <h2 className="text-xl font-semibold mt-12 mb-3">
        Mood Levels Throughout the Day
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineChartData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="happy"
            stroke={moodColors.happy}
            connectNulls
            dot={{ r: 5 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="sad"
            stroke={moodColors.sad}
            connectNulls
            dot={{ r: 5 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="angry"
            stroke={moodColors.angry}
            connectNulls
            dot={{ r: 5 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="anxious"
            stroke={moodColors.anxious}
            connectNulls
            dot={{ r: 5 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="depressed"
            stroke={moodColors.depressed}
            connectNulls
            dot={{ r: 5 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="neutral"
            stroke={moodColors.neutral}
            connectNulls
            dot={{ r: 5 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <div>Reflection of you day : today mostly your mood is </div>
    </main>
  );
}
