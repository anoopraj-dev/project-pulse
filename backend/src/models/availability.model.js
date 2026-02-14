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

    weekStart: { //Monday of that week
      type: Date, 
      required: true,
      index: true,
    },

    weekEnd: {
      type: Date, // Saturday of that week
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "DoctorAvailability",
  doctorAvailabilitySchema
);
