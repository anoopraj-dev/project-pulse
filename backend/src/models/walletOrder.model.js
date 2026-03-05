import mongoose from "mongoose";

const walletOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role",
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
    },
    amount: {
      type: Number, // Amount in smallest currency unit (e.g., paise)
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("WalletOrder", walletOrderSchema);