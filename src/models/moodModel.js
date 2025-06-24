import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moodType: {
    type: String,
    required: true,
  },
  moodLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reason: {
    type: [String],
    default: [],
  },
  note: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MoodLog =
  mongoose.models.MoodLog || mongoose.model("MoodLog", moodSchema);
export default MoodLog;
