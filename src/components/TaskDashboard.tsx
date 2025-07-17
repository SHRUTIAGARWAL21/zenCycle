import React, { useState, useEffect, memo, useRef } from "react";
import {
  Clock,
  Plus,
  CheckCircle,
  Circle,
  Play,
  Target,
  Menu,
  X,
} from "lucide-react";
import ClockDisplay from "./ClockDisplay";
import TaskStatusHandler from "./tasksStatusHandler";
import { TaskCard } from "./TaskCard";

export type Task = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  expectedTime: number;
  deadline: string;
  progress: number;
  priority: "low" | "mid" | "high";
};

interface TaskDashboardProps {
  user: any;
  tasks: Task[];
  loading: boolean;
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onRefreshTasks: () => void;
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({
  user,
  tasks = [],
  loading = true,
  onAddTask,
  onDeleteTask,
  onRefreshTasks,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Calculate task statistics based on actual Task fields
  const completedTasks = tasks.filter((task) => (task.progress || 0) === 100);
  const inProgressTasks = tasks.filter(
    (task) => (task.progress || 0) > 0 && (task.progress || 0) < 100
  );
  const incompleteTasks = tasks.filter((task) => (task.progress || 0) === 0);

  const totalTasks = tasks.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Circular progress component
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#10b981"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold text-gray-800">{percentage}%</span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <div className="w-80 bg-white/90 backdrop-blur-sm shadow-lg flex flex-col border-r border-gray-200 h-full">
      {/* Task Statistics */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex justify-center mb-6">
          <CircularProgress percentage={completionPercentage} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Target className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Active Tasks
              </span>
            </div>
            <span className="font-bold text-blue-600">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">
                Completed
              </span>
            </div>
            <span className="font-bold text-green-600">
              {completedTasks.length}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <Circle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">
                Incomplete
              </span>
            </div>
            <span className="font-bold text-red-600">
              {incompleteTasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="p-4 lg:p-6">
        <button
          onClick={onAddTask || (() => console.log("Add task clicked"))}
          className="w-full bg-gradient-to-r from-[#5d3d5f] to-[#432d44] text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#cfb5cc] to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d3d5f]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-b from-[#cfb5cc] to-white overflow-y-auto">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div>
          <h1 className="text-xl font-serif text-[#432d44]">Task Management</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile Clock */}
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
            <Clock className="w-4 h-4 text-[#5d3d5f] mr-2" />
            <ClockDisplay />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-[#5d3d5f] text-white hover:bg-[#432d44] transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-80 max-w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Desktop Header with Clock */}
        <div className="hidden lg:flex flex-col lg:flex-row justify-between items-start lg:items-center p-8 pb-4 flex-shrink-0 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-serif text-[#432d44] mb-2">
              Task Management
            </h1>
            <p className="text-gray-600">Organize and track your daily tasks</p>
          </div>

          {/* Real-time Clock */}
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-4 lg:px-6 py-3 lg:py-4 shadow-lg border border-gray-200">
            <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-[#5d3d5f] mr-2 lg:mr-3" />
            <div className="text-center">
              <ClockDisplay />
              <div className="text-xs text-gray-500">Current Time</div>
            </div>
          </div>
        </div>

        {/* Task Columns */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-[1000] grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 p-4 lg:p-8 lg:pt-4">
            {[
              {
                title: "To-Do",
                tasks: incompleteTasks,
                icon: Circle,
                colors: {
                  bg: "bg-red-50/50",
                  border: "border-red-200",
                  icon: "text-red-600",
                  title: "text-red-900",
                  badge: "bg-red-200 text-red-800",
                },
                isIncomplete: true,
              },
              {
                title: "In Progress",
                tasks: inProgressTasks,
                icon: Play,
                colors: {
                  bg: "bg-blue-50/50",
                  border: "border-blue-200",
                  icon: "text-blue-600",
                  title: "text-blue-900",
                  badge: "bg-blue-200 text-blue-800",
                },
                isIncomplete: false,
              },
              {
                title: "Complete",
                tasks: completedTasks,
                icon: CheckCircle,
                colors: {
                  bg: "bg-green-50/50",
                  border: "border-green-200",
                  icon: "text-green-600",
                  title: "text-green-900",
                  badge: "bg-green-200 text-green-800",
                },
                isIncomplete: false,
              },
            ].map((column, index) => (
              <div
                key={index}
                className={`${column.colors.bg} backdrop-blur-sm rounded-lg border ${column.colors.border} flex flex-col h-full min-h-0`}
              >
                <div
                  className={`flex items-center p-4 border-b ${column.colors.border} flex-shrink-0`}
                >
                  <column.icon
                    className={`w-5 h-5 ${column.colors.icon} mr-2`}
                  />
                  <h2
                    className={`text-lg font-semibold ${column.colors.title}`}
                  >
                    {column.title}
                  </h2>
                  <span
                    className={`ml-2 ${column.colors.badge} text-xs px-2 py-1 rounded-full`}
                  >
                    {column.tasks.length}
                  </span>
                </div>
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{ height: "calc(100% - 60px)" }}
                >
                  {column.tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isIncomplete={column.isIncomplete}
                      onDelete={onDeleteTask}
                      onTaskUpdated={onRefreshTasks}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }

        /* Firefox scrollbar */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }

        /* Mobile grid adjustment */
        @media (max-width: 1024px) {
          .grid-cols-1 {
            grid-template-rows: repeat(3, 1fr);
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskDashboard;
