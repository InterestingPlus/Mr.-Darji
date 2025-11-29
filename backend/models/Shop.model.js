import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model("Shop", shopSchema);
