import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema(
  {
    // ---Basic Info---
    name: { type: String, required: true },
    patientId: { type: String, required: true, unique: true },
    gender: { type: String,enum: ['male', 'female', 'other'] },
    dob: { type: Date },
    profilePicture: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    work: { type: String },
    address: {type: [String]},

    // ---Authentication & Role---
    password: { type: String, required: true },
    role: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    firstLogin: { type: Boolean, default: true },

    //---Medical Information--
    medical_history: {
      bloodGroup: { type: String},
      height: { type: Number },
      weight: { type: Number },
      sugarLevel: { type: String},
      bloodPressure: { type: String},
      cholesterol: { type: String },
      allergies: { type: [String] },
      medicalConditions: { type: [String] }

    },

    //---LifeStyle & Habits Information
    lifestyle_habits: {
      smoking: { type: String, enum: ['No','Occasionally','Regularly']},
      alcohol: { type: String, enum: ['No','Occasionally', 'Regularly']},
      exerciseFrequency: { type: String },
      diet: { type: [String]},
      sleepHours: { type: Number },
      stressLevel: { type: String },
      waterIntake: { type: Number },
      caffeineIntake: { type: String },
      physicalActivityType: { type: [String]},
      screenTime: { type: Number},
      otherHabits: { type: [String] }
    }



  }, { collection: 'patients', timestamps: true }
)

const Patient = mongoose.model("Patient", PatientSchema);

export default Patient;