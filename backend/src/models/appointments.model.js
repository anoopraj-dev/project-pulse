import mongoose from "mongoose";

const rescheduleHistorySchema = new mongoose.Schema(
  {
    oldDate: Date,
    oldTimeSlot: String,
    newDate: Date,
    newTimeSlot: String,
    changedBy: {
      type: String,
      enum: ["doctor", "patient", "admin"],
    },
    reason: String,
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "rejected",
        "rescheduled",
      ],
      default: "pending",
    },

    cancelledBy: {
      type: String,
      enum: ["patient", "doctor", "admin", null],
      default: null,
    },

    cancellationReason: {
      type: String,
    },

    rescheduleHistory: [rescheduleHistorySchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ------Indexes ---------- */
appointmentSchema.index({ doctor: 1, appointmentDate: 1, timeSlot: 1 });
appointmentSchema.index({ patient: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
