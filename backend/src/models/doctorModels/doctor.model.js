
import mongoose, { Schema } from "mongoose";

const DoctorSchema = new Schema(
  {
    // --- Basic Info ---
    name: { type: String, required: true },
    doctorId: { type: String, unique: true, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: { type: Date },
    profilePic: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    location: { type: String },

    // --- Authentication & Role ---
    password: { type: String, required: true },
    role: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    firstLogin: { type: Boolean, default: true },

    // --- Ratings & Status ---
    rating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected", "blocked"],
      default: "pending",
    },

    // --- Professional Info ---
    professionalInfo: {
      qualifications: { type: [String], default: [] },
      specializations: { type: [String], default: [] },
      experience: [
        {
          years: { type: Number, required: true, min: 0 },
          hospitalName: { type: String, required: true },
          location: { type: String, required: true },
        }
      ],
      education: [
        {
          degree: { type: String, required: true },
          college: { type: String, required: true },
          completionYear: { type: Number, required: true, min: 1900 },
          certificate: { type: String },
        }
      ],

    },

    // --- Services ---
    services: [
      {
        serviceType: { type: String, required: true },
        fees: { type: Number, required: true, min: 0 },
        availableDates: [
          {
            date: { type: Date, required: true },
            timeSlots: [
              {
                start: { type: String, required: true }, // e.g., "09:00"
                end: { type: String, required: true }    // e.g., "12:00"
              }
            ]
          }
        ]
      }
    ],

    // --- Department reference ---
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department"
    }
  },
  { collection: "doctors", timestamps: true }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;
