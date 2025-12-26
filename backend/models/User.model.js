import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["owner", "manager", "staff"],
      default: "staff",
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
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
