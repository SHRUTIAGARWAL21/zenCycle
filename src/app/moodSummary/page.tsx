"use client";
import { useState, useEffect } from "react";
import MoodHeatmap from "../../components/MoodHeatmap/page";
import WeeklySummary from "../../components/WeeklySummary.tsx/page";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const [heatmapData, setHeatmapData] = useState<
    { date: string; mood: string }[]
  >([]);
  const { user, isLoading } = useAuth();
  useEffect(() => {
    fetch("/api/moods/mood-history", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setHeatmapData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch mood history", err);
      });
  }, []);

  const router = useRouter();

  const handleClickjournal = () => {
    router.push("/journal");
  };

  const moodColors: Record<string, string> = {
    happy: "#FFD700",
    sad: "#6495ED",
    angry: "#FF6347",
    anxious: "#9370DB",
    depressed: "#1f2937",
    neutral: "#A9A9A9",
  };

  return (
    <main className="min-h-screen pt-16 bg-gradient-to-br from-[#cfb5cc] via-[#e1c7dd] to-white">
      <div className="p-4 bg-gradient-to-br from-[#cfb5cc] via-[#e1c7dd] to-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Main Content Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
            {/* Header Section - Profile Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Profile Info */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="relative">
                    <img
                      src="/images/userPfp.jpg"
                      alt="User Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-purple-300 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                      {user?.username || "Loading..."}
                    </h1>
                    <p className="text-gray-600 text-lg">Welcome back! 🌟</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-[#654361] to-[#d590cd] text-white rounded-2xl p-4 sm:p-6 text-center min-w-[120px] sm:min-w-[140px] shadow-lg transform hover:scale-105 transition-transform">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">
                      {user?.Moodstreak || 0}
                    </div>
                    <div className="text-sm opacity-90">Day Streak 🔥</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#654361] to-[#d590cd] text-white rounded-2xl p-4 sm:p-6 text-center min-w-[120px] sm:min-w-[140px] shadow-lg transform hover:scale-105 transition-transform">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">
                      {user?.totalMoodActiveDays || 0}
                    </div>
                    <div className="text-sm opacity-90">Active Days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Middle Section - Weekly Analysis & Journal */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
                {/* Weekly Analysis Section */}
                <div className="xl:col-span-3">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Weekly Analysis
                      </h2>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <WeeklySummary />
                    </div>
                  </div>
                </div>

                {/* Journal Section */}
                <div className="xl:col-span-1">
                  <div className="h-full">
                    <div
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-yellow-200 text-center cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl h-full flex flex-col justify-center"
                      onClick={handleClickjournal}
                    >
                      <div className="flex items-center gap-2 mb-4 justify-center">
                        <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Your Journal
                        </h3>
                      </div>
                      <div className="relative mb-4">
                        <img
                          src="/images/journel.png"
                          alt="Journal"
                          className="w-32 h-32 sm:w-40 sm:h-40 mx-auto object-contain drop-shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                          ✨
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm font-medium">
                        Start Journaling Now!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Mood Heatmap */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Mood Heatmap
                  </h2>
                </div>

                <MoodHeatmap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
