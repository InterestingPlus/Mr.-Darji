import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "manager", "staff"],
      default: "staff",
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      // required: true,
      default: null,
    },

    language: {
      type: String,
      enum: ["en", "hi", "gu", "mr"],
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
