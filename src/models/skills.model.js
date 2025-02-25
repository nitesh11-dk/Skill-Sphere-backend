import mongoose from "mongoose";


const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
  }
);

export default mongoose.model("Skill", skillSchema);
