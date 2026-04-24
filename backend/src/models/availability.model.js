import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true },   
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    date: {
      type: Date, 
      required: true,
      index: true,
    },

    slots: {
      type: [timeSlotSchema],
      required: true,
    },

  },
  { timestamps: true }
);

export default mongoose.model(
  "DoctorAvailability",
  doctorAvailabilitySchema
);
