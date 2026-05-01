import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    slotId: {
      type: String,
      required: true,
      index: true,
    },

    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },

    status: {
      type: String,
      enum: ["available", "locked", "booked"],
      default: "available",
      index: true,
    },

    lockExpiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
  },
  { _id: true }
);


const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    dateKey: {
      type: String,
      required: true,
      index: true,
    },

    slots: [timeSlotSchema],
  },
  { timestamps: true }
);

export default mongoose.model(
  "DoctorAvailability",
  doctorAvailabilitySchema
);
