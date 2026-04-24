import Patient from "../../models/patient.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

// ---------------- PERSONAL INFO ----------------
export const updatePersonalInfoService = async (user, body, file) => {
  if (!user?.id) {
    throw new Error("Unauthorized access");
  }

  const { gender, address, phone, dob, work } = body;

  const patient = await Patient.findById(user.id);
  if (!patient) {
    throw new Error("Patient not found");
  }

  let profilePictureUrl = patient.profilePicture || "";

  if (file) {
    const uploaded = await uploadToCloudinary(file);
    profilePictureUrl = uploaded.secure_url;
  }

  patient.gender = gender;
  patient.address = address;
  patient.phone = phone;
  patient.dob = dob;
  patient.work = work;
  patient.profilePicture = profilePictureUrl;

  await patient.save();

  return patient;
};

// ---------------- MEDICAL INFO ----------------
export const updateMedicalInfoService = async (userId, body) => {
  if (!userId) {
    throw new Error("Unauthorized access");
  }

  const {
    bloodGroup,
    height,
    weight,
    allergies = [],
    medicalConditions = [],
    cholesterol,
    bloodPressure,
    sugarLevel,
  } = body;

  const medicalData = {
    bloodGroup,
    height,
    weight,
    allergies,
    medicalConditions,
    cholesterol,
    bloodPressure,
    sugarLevel,
  };

  const patient = await Patient.findByIdAndUpdate(
    userId,
    { $set: { medical_history: medicalData } },
    { new: true, runValidators: true }
  ).select("-password");

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient.medical_history;
};

// ---------------- LIFESTYLE INFO ----------------
export const updateLifeStyleInfoService = async (userId, body) => {
  if (!userId) {
    throw new Error("Unauthorized access");
  }

  const {
    smoking,
    alcohol,
    exerciseFrequency,
    diet = [],
    sleepHours,
    stressLevel,
    waterIntake,
    caffeineIntake,
    physicalActivityType,
    screenTime,
    otherHabits = [],
  } = body;

  const lifestyleData = {
    smoking,
    alcohol,
    exerciseFrequency,
    diet,
    sleepHours,
    stressLevel,
    waterIntake,
    caffeineIntake,
    physicalActivityType,
    screenTime,
    otherHabits,
  };

  const patient = await Patient.findByIdAndUpdate(
    userId,
    {
      $set: {
        lifestyle_habits: lifestyleData,
        firstLogin: false,
      },
    },
    { new: true, runValidators: true }
  ).select("-password");

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};