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
  return (
    <div className="p-4 bg-gradient-to-br from-[#cfb5cc] via-[#e1c7dd] to-white">
      <div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              {user?.username || "Loading..."}
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome back! Ready to be productive? 🌟
            </p>
          </div>
        </div>
      </div>

      <DailySummary />
      <div className="py-6"></div>
      <ProductivityCalendar />
    </div>
  );
}
