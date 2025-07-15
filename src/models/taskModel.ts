import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  expectedTime: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number, // in minutes
    default: 0,
  },
  deadline: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  reason: {
    type: String,
    default: "",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
