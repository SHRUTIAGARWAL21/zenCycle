import mongoose from "mongoose";

const productivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    productivityScore: {
      type: Number,
      required: true,
    },
    totalExpectedTime: {
      type: Number,
      required: true,
    },
    totalActualTime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Productivity =
  mongoose.models.Productivity ||
  mongoose.model("Productivity", productivitySchema);

export default Productivity;
