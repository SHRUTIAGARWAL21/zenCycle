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
  timeExpected: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number,
  },
  deadline: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
