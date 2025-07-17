"use client";
import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Target,
  BarChart3,
} from "lucide-react";

const DailySummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const fetchDailySummary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tasks/getTodaySummary", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === 200) {
        // Parse JSON response from AI
        const parsedSummary = JSON.parse(data.summary);
        setSummaryData(parsedSummary);
      } else {
        setError(data.err || "Failed to fetch daily summary");
      }
    } catch (err) {
      setError("Network error occurred while fetching summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySummary();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleRefresh = () => {
    fetchDailySummary();
  };

  const getProductivityColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-400";
    if (progress >= 50) return "bg-yellow-400";
    return "bg-red-400";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
          <span className="ml-2 text-sm text-gray-700">Loading summary...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Unable to Load Summary
          </h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!summaryData) return null;

  const sections = [
    {
      id: "completed",
      title: "Tasks Completed",
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      count: summaryData.tasksCompleted?.length || 0,
      content: summaryData.tasksCompleted || [],
    },
    {
      id: "pending",
      title: "Pending Tasks",
      icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
      count: summaryData.pendingTasks?.length || 0,
      content: summaryData.pendingTasks || [],
    },
    {
      id: "time",
      title: "Time Analysis",
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      count: `${summaryData.timeAnalysis?.productivityScore || 0}%`,
      content: summaryData.timeAnalysis || {},
    },
    {
      id: "gaps",
      title: "Productivity Gaps",
      icon: <TrendingUp className="w-4 h-4 text-orange-600" />,
      count: summaryData.productivityGaps?.length || 0,
      content: summaryData.productivityGaps || [],
    },
    {
      id: "suggestions",
      title: "Suggestions",
      icon: <Lightbulb className="w-4 h-4 text-purple-600" />,
      count: summaryData.suggestions?.length || 0,
      content: summaryData.suggestions || [],
    },
  ];

  return (
    <div className="pt-24">
      <div className="max-w-4xl  mx-auto p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Daily Summary</h1>
              <p className="text-xs text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-700 px-3 py-1 rounded-md transition-all duration-200 flex items-center gap-1 border border-white/30 text-sm"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {/* Brief Summary */}
        <div className="mb-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30">
          <p className="text-sm text-gray-700 leading-relaxed">
            {summaryData.summary}
          </p>
        </div>

        {/* Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((section) => (
            <div key={section.id} className="relative">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/80 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <h3 className="font-medium text-gray-800 text-sm">
                      {section.title}&nbsp;
                      <span className="text-md font-serif text-purple-600 mb-1">
                        {section.count}
                      </span>
                    </h3>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </button>

              {expandedSections[section.id] && (
                <div className="mt-2 p-3 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-lg border border-purple-200/50 shadow-sm">
                  {section.id === "completed" && (
                    <div className="space-y-2">
                      {section.content.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white/70 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-sm font-medium text-gray-800">
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">
                              Efficiency:
                            </span>
                            <span
                              className={`text-sm font-semibold ${getProductivityColor(
                                task.productivity
                              )}`}
                            >
                              {task.productivity}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === "pending" && (
                    <div className="space-y-2">
                      {section.content.map((task, index) => (
                        <div key={index} className="p-2 bg-white/70 rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-800">
                              {task.title}
                            </span>
                            <span className="text-xs text-gray-600">
                              {task.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(
                                task.progress
                              )}`}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === "time" && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white/70 rounded-md text-center">
                          <p className="text-xs text-gray-600">Expected</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {section.content.totalExpectedTime}
                          </p>
                        </div>
                        <div className="p-2 bg-white/70 rounded-md text-center">
                          <p className="text-xs text-gray-600">Actual</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {section.content.actualTime}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 bg-white/70 rounded-md text-center">
                        <p className="text-xs text-gray-600">
                          Productivity Score
                        </p>
                        <p
                          className={`text-lg font-bold ${getProductivityColor(
                            section.content.productivityScore
                          )}`}
                        >
                          {section.content.productivityScore}%
                        </p>
                      </div>
                    </div>
                  )}

                  {(section.id === "gaps" || section.id === "suggestions") && (
                    <div className="space-y-2">
                      {section.content.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-2 bg-white/70 rounded-md"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 text-center">
          <p className="text-xs text-gray-700">
            <span className="font-medium">Keep growing!</span> Every day counts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
