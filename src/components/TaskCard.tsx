import React, { useState, useEffect, memo, useRef } from "react";
import TaskStatusHandler from "./tasksStatusHandler";
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
export const TaskCard = memo(
  ({
    task,
    isIncomplete = false,
    onDelete,
    onTaskUpdated,
  }: {
    task: Task;
    isIncomplete?: boolean;
    onDelete?: (taskId: string) => void;
    onTaskUpdated: () => void;
  }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isCompleted = task.progress === 100;
    const [showStatusPopup, setShowStatusPopup] = useState(false);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        setTimeout(() => {
          if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
          ) {
            setShowMenu(false);
          }
        }, 0); // delay to let button click register first
      };

      if (showMenu) {
        window.addEventListener("click", handleClickOutside);
      }

      return () => {
        window.removeEventListener("click", handleClickOutside);
      };
    }, [showMenu]);

    const handleDelete = () => {
      if (onDelete) {
        onDelete(task._id);
      }
      setShowMenu(false);
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "high":
          return "bg-red-100 text-red-800 border-red-200";
        case "mid":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "low":
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <div
        className={`rounded-lg p-4 shadow-sm border transition-shadow duration-200 ${
          isCompleted
            ? "bg-green-50 border-green-200 opacity-90"
            : "bg-white border-gray-200 hover:shadow-md"
        }`}
      >
        {showStatusPopup && (
          <TaskStatusHandler
            taskId={task._id}
            expectedTime={task.expectedTime}
            onClose={() => setShowStatusPopup(false)}
            onSuccess={() => {
              setShowStatusPopup(false);
              onTaskUpdated();
            }}
          />
        )}

        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-3 flex-1">
            {(isIncomplete || (task.progress > 0 && task.progress < 100)) && (
              <button
                className="mt-1 w-4 h-4 border-2 border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 flex-shrink-0"
                onClick={() => setShowStatusPopup(true)}
                title="Update Progress"
              ></button>
            )}

            <h3
              className={`font-medium text-sm line-clamp-2 flex-1 ${
                isCompleted ? "text-green-900" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                task.priority
              )} flex-shrink-0`}
            >
              {task.priority}
            </span>

            {/* Three-dot menu - only show if not completed */}
            {!isCompleted && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[80px]">
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors duration-200 whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Rest of your component remains the same */}
        <p
          className={`text-xs mb-2 line-clamp-2 ${
            isCompleted ? "text-green-800" : "text-gray-500"
          }`}
        >
          {task.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {new Date(task.deadline).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
          <span>{task.expectedTime}h</span>
        </div>

        {task.progress !== undefined &&
          task.progress > 0 &&
          task.progress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {task.progress}% complete
              </span>
            </div>
          )}
      </div>
    );
  }
);
