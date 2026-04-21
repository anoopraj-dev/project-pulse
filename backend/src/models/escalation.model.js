import mongoose from "mongoose";

const escalationSchema = new mongoose.Schema(
  {
    refType: {
      type: String,
      enum: ["ticket", "payment", "user", "system"],
    },

    refId: mongoose.Schema.Types.ObjectId,

    reason: String,

    status: {
      type: String,
      enum: ["pending", "in-review", "resolved"],
      default: "pending",
    },

    priority: {
      type: String,
      default: "high",
    },
  },
  { timestamps: true }
);
escalationSchema.index({ status: 1, priority: 1 });
export default mongoose.model("Escalation", escalationSchema);