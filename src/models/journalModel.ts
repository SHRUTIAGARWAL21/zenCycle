import mongoose from "mongoose";
const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String },
  imageUrls: [String],
  pageNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Journal =
  mongoose.models.Journal || mongoose.model("Journal", journalSchema);
export default Journal;
