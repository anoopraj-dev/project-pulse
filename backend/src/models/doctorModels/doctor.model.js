import mongoose, { Schema } from "mongoose";

//schema for experience
export const experienceSchema = new mongoose.Schema({
    years:{type: Number},
    hospitalName:{type: String},
    location: {type: String}
})


//schema for education
const EducationSchema = new Schema({
  degree: { type: String, required: true },
  college: { type: String, required: true },
  completionYear: { type: Number, required: true },
  certificate: { type: String }, 
});

//schema for services
const servicesSchema = new Schema({
  servicetype: {type:String},
  fees:{type:Number}
})

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
  professionalInfo: [experienceSchema],
  rating: {
    type: Number,
    default: 0,
  },
  education:[EducationSchema],
  services: [servicesSchema],
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
  location:{
    type:String
  }
}, { collection: "doctors", timestamps: true });



const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;
