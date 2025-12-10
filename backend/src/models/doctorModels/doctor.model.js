
import mongoose, { Schema } from "mongoose";

const DoctorSchema = new Schema(
  {
    // --- Basic Info (unchanged) ---
    name: { type: String, required: true },
    doctorId: { type: String, unique: true, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: { type: Date },
    profilePicture: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    location: { type: String },
    about:{type:String},

    // --- Authentication & Role (unchanged) ---
    password: { type: String, required: true },
    role: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    firstLogin: { type: Boolean, default: true },

    // --- Ratings & Status (unchanged) ---
    rating: { type: Number, default: 0 },
    status: { type: String, enum: ["approved", "pending", "rejected", "blocked"], default: "pending" },

    // --- Professional Info  ---
    professionalInfo: {
      qualifications: { type: [String], default: [] },
      specializations: { type: [String], default: [] },
      experience: [{
        years: { type: Number },
        hospitalName: { type: String },
        location: { type: String },
        experienceCertificate: { type: String }
      }],
      education: [{
        degree: { type: String },
        college: { type: String },
        completionYear: { type: Number },
        certificate: { type: String }
      }],

      medicalLicense: {
        registrationNumber: {
          type: String,
          required: [true, "Registration number required"],
          match: [/^[A-Z]{2,4}\d{4,6}$/i, "Must be KMC12345 format"],
          default: "KMC0001"  
        },
        stateCouncil: {
          type: String,
          required: [true, "State council required"],
          enum: [
            "Andhra Pradesh Medical Council (APMC)",
            "Delhi Medical Council (DMC)",
            "Karnataka Medical Council (KMC)",
            "Kerala State Medical Council (KSMC)",
            "Maharashtra Medical Council (MMC)",
            "Tamil Nadu Medical Council (TNMC)",
            "Telangana State Medical Council (TSMC)",
          ],
          default: "Karnataka Medical Council (KMC)"  // ✅ Valid enum
        },
        yearOfRegistration: {
          type: Number,
          required: [true, "Year of registration required"],
          min: 1950,
          max: 2026, 
          default: 2024 
        },
        proofDocument: { type: String },
      },
    },

    services: [{
      serviceType: { type: String, required: true },
      fees: { type: Number, required: true, min: 0 },
      availableDates: [{
        date: { type: Date, required: true },
        timeSlots: [{
          start: { type: String, required: true },
          end: { type: String, required: true },
        }],
      }],
    }],

    department: { type: Schema.Types.ObjectId, ref: "Department" },
  },
  { collection: "doctors", timestamps: true }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);
export default Doctor;
