"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const ProductivityCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [productivityData, setProductivityData] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock data - replace with your API call
  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        const response = await fetch("/api/tasks/getMonthlyProductivity");
        const data = await response.json();
        setProductivityData(data.dailyProductivity);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching productivity data:", error);
        setLoading(false);
      }
    };

    fetchProductivityData();
  }, [currentDate]);

  const getProductivityColor = (score) => {
    if (score >= 90)
      return "bg-gradient-to-br from-purple-500 to-violet-600 text-white"; // Excellent
    if (score >= 80)
      return "bg-gradient-to-br from-purple-400 to-violet-500 text-white"; // Very Good
    if (score >= 70)
      return "bg-gradient-to-br from-purple-300 to-violet-400 text-purple-900"; // Good
    if (score >= 60)
      return "bg-gradient-to-br from-purple-200 to-violet-300 text-purple-800"; // Average
    if (score >= 50)
      return "bg-gradient-to-br from-orange-200 to-yellow-300 text-orange-800"; // Below Average
    return "bg-gradient-to-br from-red-200 to-red-300 text-red-800"; // Poor
  };

  const getProductivityIcon = (score) => {
    if (score >= 70) return <TrendingUp className="w-3 h-3" />;
    if (score >= 50) return <Minus className="w-3 h-3" />;
    return <TrendingDown className="w-3 h-3" />;
  };

  const getProductivityLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    if (score >= 50) return "Below Avg";
    return "Poor";
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const emptyDays = Array(startingDayOfWeek).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-purple-800">
            Productivity Calendar
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 hover:bg-purple-50"
          >
            <ChevronLeft className="w-5 h-5 text-purple-600" />
          </button>
          <h2 className="text-xl font-semibold text-purple-700 min-w-[180px] text-center">
            {monthName} {year}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 hover:bg-purple-50"
          >
            <ChevronRight className="w-5 h-5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-purple-600 to-violet-600">
          {days.map((day) => (
            <div key={day} className="p-4 text-center font-semibold text-white">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 p-1 bg-gray-50">
          {/* Empty days for month start */}
          {emptyDays.map((_, index) => (
            <div
              key={`empty-${index}`}
              className="h-24 bg-gray-100 rounded-lg"
            ></div>
          ))}

          {/* Month days */}
          {monthDays.map((day) => {
            const dateKey = formatDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            );
            const dayData = productivityData[dateKey];
            const hasNoTasks = dayData?.message === "No tasks added";
            const score = dayData?.productivityScore;

            return (
              <div
                key={day}
                className={`h-24 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  hasNoTasks || !dayData
                    ? "bg-gray-200 border-gray-300"
                    : `${getProductivityColor(
                        score
                      )} border-purple-200 shadow-md hover:shadow-lg`
                }`}
              >
                <div className="h-full flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-sm font-semibold ${
                        hasNoTasks || !dayData ? "text-gray-500" : ""
                      }`}
                    >
                      {day}
                    </span>
                    {score && (
                      <div className="flex items-center space-x-1">
                        {getProductivityIcon(score)}
                      </div>
                    )}
                  </div>

                  {hasNoTasks || !dayData ? (
                    <div className="text-xs text-gray-500 text-center">
                      No tasks
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-lg font-bold mb-1">{score}%</div>
                      <div className="text-xs opacity-80">
                        {getProductivityLabel(score)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-4">
          Productivity Scale
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-violet-600"></div>
            <span className="text-sm">90-100% Excellent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-400 to-violet-500"></div>
            <span className="text-sm">80-89% Very Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-300 to-violet-400"></div>
            <span className="text-sm">70-79% Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-200 to-violet-300"></div>
            <span className="text-sm">60-69% Average</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-200 to-yellow-300"></div>
            <span className="text-sm">50-59% Below Avg</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-red-200 to-red-300"></div>
            <span className="text-sm">0-49% Poor</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gray-200"></div>
            <span className="text-sm text-gray-600">No tasks added</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityCalendar;
