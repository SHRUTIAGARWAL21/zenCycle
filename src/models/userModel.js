import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    Moodstreak: {
      type: Number,
      default: 0,
    },
    lastMoodLoggedDate: {
      type: Date,
    },
    Taskstreak: {
      type: Number,
      default: 0,
    },
    lastTaskLoggedDate: {
      type: Date,
    },
    totalTaskActiveDays: { type: Number, default: 0 },

    totalMoodActiveDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
