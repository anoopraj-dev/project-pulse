// import mongoose, { Schema } from "mongoose";

// //schema for experience
// export const experienceSchema = new Schema({
//   years: { type: Number },
//   hospitalName: { type: String },
//   location: { type: String }
// })

// //schema for availbility
// const availbilitySchema = new Schema({
//   date: { type: Date },
//   timeSlots: { type: String }
// })


// //schema for education
// const EducationSchema = new Schema({
//   degree: { type: String, required: true },
//   college: { type: String, required: true },
//   completionYear: { type: Number, required: true },
//   certificate: { type: String },
// });

// //professionalInfo
// const professionalSchema = new Schema({
//   qualifications: [String],
//   specializations: [String],
//   experience: experienceSchema,
//   education: EducationSchema

// })

// //schema for services
// const servicesSchema = new Schema({
//   servicetype: { type: String },
//   fees: { type: Number },
//   availableDates: [availbilitySchema]
// })



// const DoctorSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   department: {
//     type: Schema.ObjectId,
//     ref: "Department",
//   },
//   doctorId: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   gender: {
//     type: String,
//     enum: ["male", "female", "other"],
//   },
//   dob: {
//     type: Date,
//   },
//   profilePic: {
//     type: String,
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   phone: {
//     type: String,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   specializations: {
//     type: [String],
//   },
//   qualifications: {
//     type: [String],
//   },
//   professionalInfo: 
//     {
//       qualifications: [String],
//       specializations: [String],
//       experience: [
//         {
//           years: { type: Number },
//           hospitalName: { type: String },
//           location: { type: String }
//         }
//       ],
//       education: [
//         {
//           degree: { type: String, required: true },
//           college: { type: String, required: true },
//           completionYear: { type: Number, required: true },
//           certificate: { type: String },
//         }
//       ]

//     },
  
//   rating: {
//     type: Number,
//     default: 0,
//   },
//   services: [servicesSchema],
//   status: {
//     type: String,
//     enum: ["approved", "pending", "rejected", "blocked"],
//     default: "pending",
//   },
//   role: {
//     type: String,
//     required: true,
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   firstLogin: {
//     type: Boolean,
//     default: true,
//   },
//   location: {
//     type: String
//   }
// }, { collection: "doctors", timestamps: true });



// const Doctor = mongoose.model("Doctor", DoctorSchema);

// export default Doctor;


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
