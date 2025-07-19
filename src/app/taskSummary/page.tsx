"use client";
import DailySummary from "@/components/dailySummary";
import ProductivityCalendar from "@/components/monthlyCalander";

import { useAuth } from "../context/AuthContext";

import {
  Clock,
  Target,
  TrendingUp,
  Calendar,
  BarChart3,
  Award,
} from "lucide-react";

export default function DailySummaryPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 bg-gradient-to-br from-[#cfb5cc] via-[#e1c7dd] to-white flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 bg-gradient-to-br from-[#cfb5cc] via-[#e1c7dd] to-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Main Content Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
          {/* Header Section - Profile Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Profile Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full lg:w-auto">
                <div className="relative shrink-0">
                  <img
                    src="/images/userPfp.jpg"
                    alt="User Profile"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-purple-300 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>
                <div className="text-center sm:text-left flex-grow">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 break-words">
                    {user?.username || "Loading..."}
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Task Dashboard 📊
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-3 sm:gap-4 w-full lg:w-auto justify-center lg:justify-end">
                <div className="bg-gradient-to-br from-[#654361] to-[#d590cd] text-white rounded-2xl p-4 sm:p-5 text-center min-w-[100px] sm:min-w-[120px] shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                    {user?.Taskstreak || 0}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90 leading-tight">
                    Day Streak 🔥
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#654361] to-[#d590cd] text-white rounded-2xl p-4 sm:p-5 text-center min-w-[100px] sm:min-w-[120px] shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                    {user?.totalTaskActiveDays || 0}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90 leading-tight">
                    Active Days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Daily Summary Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-500" />
                  Daily Summary
                </h2>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <DailySummary />
              </div>
            </div>

            {/* Productivity Calendar Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-green-500" />
                  Productivity Calendar
                </h2>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <ProductivityCalendar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
