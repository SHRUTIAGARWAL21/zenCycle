"use client";

import { useState } from "react";
import axios from "axios";
import { Task } from "@/app/tasks/page";

interface AddTaskModalProps {
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
}

export default function AddTaskModal({
  onClose,
  onTaskAdded,
}: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    expectedTime: "",
    priority: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const [hours, minutes] = formData.deadline.split(":");

      const now = new Date();
      now.setHours(Number(hours));
      now.setMinutes(Number(minutes));
      now.setSeconds(0);
      now.setMilliseconds(0);

      const payload = {
        ...formData,
        expectedTime: Number(formData.expectedTime),
        deadline: now.toISOString(),
      };

      const res = await fetch("/api/tasks/addtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      const data = await res.json();
      onTaskAdded(data);
      onClose();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-[#5d3d5f]">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5d3d5f] text-sm"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5d3d5f] resize-none text-sm"
              placeholder="Brief description"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {["low", "mid", "high"].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority }))}
                  className={`flex-1 px-3 py-1 rounded-md text-sm font-medium border ${
                    formData.priority === priority
                      ? priority === "low"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : priority === "mid"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                        : "bg-red-100 text-red-700 border-red-300"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Expected Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Time (in minutes)
            </label>
            <input
              type="number"
              name="expectedTime"
              value={formData.expectedTime}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5d3d5f] text-sm"
              placeholder="Time required for this task"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="time"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5d3d5f] text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5d3d5f] to-[#432d44] text-white rounded-lg hover:shadow-md text-sm"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
