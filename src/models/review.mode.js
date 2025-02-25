import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
    {
      rating: {
        type: Number,
        default: 0,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
      reviewer: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

export const Review = mongoose.model("Review", reviewSchema);
