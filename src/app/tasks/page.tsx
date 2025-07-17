"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import AddTaskModal from "@/components/AddTaskModel";
import TaskDashboard from "@/components/TaskDashboard";

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

export default function Taskpage() {
  const { user, isLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    expectedTime: "",
    priority: "mid",
  });

  const now = new Date();
  const formatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fetchTasks = async () => {
    if (isLoading || !user) {
      if (!isLoading && !user) setLoading(false);
      return;
    }

    try {
      const res = await axios.get("/api/tasks/getTask");
      if (res.data && res.data.tasks) {
        setTasks(res.data.tasks);
      } else if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, isLoading]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskAdded = async () => {
    try {
      const res = await axios.get("/api/tasks/getTask");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error fetching tasks after adding:", err);
    } finally {
      setShowModal(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/deleteTask`, {
        data: { taskId },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log("Submitting task:", formData);
      const res = await axios.post("/api/tasks/addTask", formData);
      console.log("Task created:", res.data);

      // Handle different response structures
      let newTask;
      if (res.data && res.data.task) {
        newTask = res.data.task;
      } else if (res.data && res.data._id) {
        newTask = res.data;
      } else {
        console.warn("Unexpected response format:", res.data);
        // Refetch tasks as fallback
        const tasksRes = await axios.get("/api/tasks/getTask");
        if (tasksRes.data && tasksRes.data.tasks) {
          setTasks(tasksRes.data.tasks);
        }
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          deadline: "",
          expectedTime: "",
          priority: "mid",
        });
        return;
      }

      setTasks((prev) => [...prev, newTask]);
      setFormData({
        title: "",
        description: "",
        deadline: "",
        expectedTime: "",
        priority: "mid",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  // Show loading if auth is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#cfb5cc] to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d3d5f]"></div>
      </div>
    );
  }

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#cfb5cc] to-white">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#432d44] mb-4">
            Please log in to view your tasks
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-[#cfb5cc] to-white overflow-y-auto">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm shadow-sm border-b border-gray-200 px-8 py-6">
        {/* Mobile: Header below navbar (default behavior) */}
        <div className="block md:hidden text-center pt-16">
          <h1 className="text-3xl font-serif text-[#432d44]">
            Hello <span className="text-[#5d3d5f]">{user?.username}</span>
          </h1>
          <p className="text-sm text-gray-600">{formatted}</p>
        </div>

        {/* Desktop: Header on top left */}
        <div className="hidden md:block">
          <div className="flex items-center justify-start">
            <div className="text-left">
              <h1 className="text-3xl font-serif text-[#432d44]">
                Hello <span className="text-[#5d3d5f]">{user?.username}</span>
              </h1>
              <p className="text-sm text-gray-600">{formatted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d3d5f]"></div>
        </div>
      )}

      {/* No tasks section */}
      {!loading && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <img
            src="/images/taskempty.avif"
            alt="Empty workspace"
            className="w-64 h-48 object-cover rounded-lg shadow-lg mb-8"
          />
          <h2 className="text-3xl font-serif text-[#432d44] mb-4">
            Ready to conquer your day?
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-8">
            Add your first task and start tracking your productive journey today
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#5d3d5f] to-[#432d44] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Task
          </button>
        </div>
      )}

      <TaskDashboard
        user={user}
        tasks={tasks}
        loading={loading}
        onAddTask={() => setShowModal(true)}
        onDeleteTask={handleDeleteTask}
        onRefreshTasks={fetchTasks} // ✅ Add this
      />

      {/* Add task modal */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
    </div>
  );
}
