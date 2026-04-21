import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: ["booking", "payment", "refund", "technical", "other"],
      default: "other",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },

    resolutionNotes: String,

    slaDeadline: Date,

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

//  indexes
supportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 });
supportTicketSchema.index({ type: 1 });

export default mongoose.model("SupportTicket", supportTicketSchema);