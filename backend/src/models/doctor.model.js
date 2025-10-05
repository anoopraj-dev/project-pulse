import mongoose, { Schema } from "mongoose";

const DoctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: Schema.ObjectId,
    ref: "Department",
  },
  doctorId: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  dob: {
    type: Date,
  },
  profilePic: {
    type: String,
  },
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
  specializations: {
    type: [String],
  },
  qualifications: {
    type: [String],
  },
  experienceYears: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  services: {
    type: [String],
    enum: ["online", "offline"],
    required: true,
  },
  status: {
    type: String,
    enum: ["approved", "pending", "rejected", "blocked"],
    default: "pending",
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
}, { collection: "doctors", timestamps: true });

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;
