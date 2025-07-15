import React, { useState, useEffect } from "react";
import { Clock, Plus, CheckCircle, Circle, Play, Target } from "lucide-react";

export type Task = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  expectedTime: number;
  deadline: string;
  progress: number;
  priority: "low" | "medium" | "high";
};

interface TaskDashboardProps {
  user: any;
  tasks: Task[];
  loading: boolean;
  onAddTask: () => void;
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({
  user,
  tasks = [],
  loading = true,
  onAddTask,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate task statistics based on actual Task fields
  const completedTasks = tasks.filter((task) => (task.progress || 0) === 100);
  const inProgressTasks = tasks.filter(
    (task) => (task.progress || 0) > 0 && (task.progress || 0) < 100
  );
  const incompleteTasks = tasks.filter((task) => (task.progress || 0) === 0);

  const totalTasks = tasks.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Format current time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

  const TaskCard = ({
    task,
    isIncomplete = false,
  }: {
    task: Task;
    isIncomplete?: boolean;
  }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3 flex-1">
          {isIncomplete && (
            <button className="mt-1 w-4 h-4 border-2 border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 flex-shrink-0">
              <Circle className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
            {task.title}
          </h3>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
            task.priority
          )} ml-2 flex-shrink-0`}
        >
          {task.priority}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
        {task.description}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{new Date(task.deadline).toLocaleDateString()}</span>
        <span>{task.expectedTime}h</span>
      </div>
      {task.progress !== undefined && task.progress > 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${task.progress || 0}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {task.progress || 0}% complete
          </span>
        </div>
      )}
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
    <div className="flex h-screen bg-gradient-to-b from-[#cfb5cc] to-white">
      {/* Sidebar */}
      <div className="w-80 bg-white/90 backdrop-blur-sm shadow-lg flex flex-col border-r border-gray-200">
        {/* Task Statistics */}
        <div className="p-6 border-b border-gray-200">
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
        <div className="p-6">
          <button
            onClick={onAddTask}
            className="w-full bg-gradient-to-r from-[#5d3d5f] to-[#432d44] text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header with Clock */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif text-[#432d44] mb-2">
              Task Management
            </h1>
            <p className="text-gray-600">Organize and track your daily tasks</p>
          </div>

          {/* Real-time Clock */}
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border border-gray-200">
            <Clock className="w-6 h-6 text-[#5d3d5f] mr-3" />
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-[#432d44]">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-gray-500">Current Time</div>
            </div>
          </div>
        </div>

        {/* Task Columns */}
        <div
          className="grid grid-cols-3 gap-6"
          style={{ height: "calc(100vh - 240px)" }}
        >
          {/* Incomplete Column */}
          <div className="bg-red-50/50 backdrop-blur-sm rounded-lg border border-red-200 flex flex-col">
            <div className="flex items-center p-4 border-b border-red-200">
              <Circle className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-red-900">Incomplete</h2>
              <span className="ml-2 bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">
                {incompleteTasks.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {incompleteTasks.map((task) => (
                <TaskCard key={task._id} task={task} isIncomplete={true} />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-blue-50/50 backdrop-blur-sm rounded-lg border border-blue-200 flex flex-col">
            <div className="flex items-center p-4 border-b border-blue-200">
              <Play className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-blue-900">
                In Progress
              </h2>
              <span className="ml-2 bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {inProgressTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

          {/* Complete Column */}
          <div className="bg-green-50/50 backdrop-blur-sm rounded-lg border border-green-200 flex flex-col">
            <div className="flex items-center p-4 border-b border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-green-900">Complete</h2>
              <span className="ml-2 bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                {completedTasks.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {completedTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TaskDashboard;
