import mongoose, { Schema } from "mongoose";
import { medicalSchema } from "./medicalHistory.js";

const PatientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: Date,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
    medical_history: medicalSchema
    ,
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    role: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    firstLogin: {
      type: Boolean,
      default: true,
    },
    work:{
      type: String,
    }
  },
  { collection: "patients", timestamps: true }
);

const Patient = mongoose.model("Patient", PatientSchema);

export default Patient;
