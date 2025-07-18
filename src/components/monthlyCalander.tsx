"use client";
import React, { useState, useEffect } from "react";
import { Clock, Target, TrendingUp } from "lucide-react";

const ProductivityCalendar = () => {
  const [productivityData, setProductivityData] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Mock data for demonstration
  useEffect(() => {
    fetch("/api/productivity/monthly")
      .then((res) => res.json())
      .then((data) => {
        setProductivityData(data.data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
      });
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getProductivityColor = (score) => {
    if (score >= 90)
      return "bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-lg";
    if (score >= 80)
      return "bg-gradient-to-br from-purple-300 to-purple-400 text-white shadow-md";
    if (score >= 70)
      return "bg-gradient-to-br from-blue-300 to-blue-400 text-white shadow-md";
    if (score >= 60)
      return "bg-gradient-to-br from-yellow-200 to-yellow-300 text-yellow-800 shadow-sm";
    if (score >= 50)
      return "bg-gradient-to-br from-orange-200 to-orange-300 text-orange-800 shadow-sm";
    return "bg-gradient-to-br from-red-200 to-red-300 text-red-800 shadow-sm";
  };

  const calculateEfficiency = (expectedTime, actualTime) => {
    // Better efficiency calculation: lower actual time = higher efficiency
    if (actualTime <= expectedTime) {
      return 100; // Perfect or better than expected
    }
    return Math.max(0, Math.round((expectedTime / actualTime) * 100));
  };

  const handleMouseEnter = (dayData, event) => {
    if (dayData) {
      setHoveredDay(dayData);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const handleMouseMove = (event) => {
    if (hoveredDay) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const today = new Date().getDate();
  const isCurrentMonth =
    new Date().getMonth() + 1 === currentMonth &&
    new Date().getFullYear() === currentYear;

  // Create calendar grid
  const calendarDays = [];

  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayData = productivityData.find((item) => item.day === day);
    calendarDays.push({
      day,
      data: dayData,
      isToday: isCurrentMonth && day === today,
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-6  bg-gradient-to-br from-purple-50 to-pink-50  rounded-lg shadow-md min-h-screen">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-purple-800 bg-clip-text text-transparent mb-2">
            Productivity Calendar
          </h1>
          <p className="text-2xl font-semibold text-purple-800">
            {monthNames[currentMonth - 1]} {currentYear}
          </p>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-purple-700 py-3"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {calendarDays.map((dayInfo, index) => {
            if (!dayInfo) {
              return <div key={index} className="aspect-square"></div>;
            }

            const { day, data, isToday } = dayInfo;
            const hasData = !!data;

            return (
              <div
                key={day}
                onMouseEnter={(e) => hasData && handleMouseEnter(data, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center relative
                  transition-all duration-300 transform hover:scale-105 border-2
                  ${
                    hasData
                      ? `${getProductivityColor(
                          data.score
                        )} cursor-pointer hover:shadow-lg border-transparent`
                      : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                  }
                  ${isToday ? "ring-4 ring-purple-400 ring-opacity-50" : ""}
                `}
              >
                <span
                  className={`text-lg font-bold ${
                    isToday ? "text-purple-900" : ""
                  }`}
                >
                  {day}
                </span>
                {hasData && (
                  <div className="text-xs mt-1 text-center opacity-90">
                    <div className="font-semibold">{data.score}%</div>
                  </div>
                )}
                {isToday && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-400 to-purple-500"></div>
            <span className="text-purple-700">90%+ Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-300 to-purple-400"></div>
            <span className="text-purple-700">80%+ Great</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-200 to-yellow-300"></div>
            <span className="text-purple-700">60%+ Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-red-200 to-red-300"></div>
            <span className="text-purple-700">&lt;60% Needs Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
            <span className="text-purple-700">No Data</span>
          </div>
        </div>
      </div>

      {/* Small Hover Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="bg-white rounded-lg shadow-xl p-3 border border-purple-200 max-w-xs">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-purple-600" />
                <span className="text-purple-600">Score: </span>
                <span className="font-semibold text-purple-800">
                  {hoveredDay.score}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-blue-600" />
                <span className="text-blue-600">Expected: </span>
                <span className="font-semibold text-blue-800">
                  {hoveredDay.expectedTime}h
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-green-600" />
                <span className="text-green-600">Actual: </span>
                <span className="font-semibold text-green-800">
                  {hoveredDay.actualTime}h
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityCalendar;
