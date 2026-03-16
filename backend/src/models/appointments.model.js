import mongoose from "mongoose";


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
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [ "pending","confirmed", "completed","cancelled"],
      default: "confirmed",
    },

    cancelledBy: {
      type: String,
      enum: ["patient", "doctor", "admin", null],
      default: null,
    },
    cancellationReason:{
      type: String,
      default:''
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

/* ------Indexes ---------- */
appointmentSchema.index({ doctor: 1, appointmentDate: 1, timeSlot: 1 });
appointmentSchema.index({ patient: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
