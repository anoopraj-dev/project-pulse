import Patient from "../../models/patient.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";

//------- PATIENT ONBOARDING CONTROLLERS -------//

//-------- PERSONAL INFO -------//
export const updatePersonalInfo = async (req, res) => {
  try {
    const { gender, address, phone, dob, work } = req.body;
    const updateData = { gender, address, phone, dob, work };
    const patient = await Patient.findByIdAndUpdate(req.user.id, updateData);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Personal information updated successfully",
    });
  } catch (error) {
    return res.status(500).json("Internal Server error");
  }
};

//-------- MEDICAL INFO -------//
export const updateMedicalInfo = async (req, res) => {
  try {
    const {
      bloodGroup,
      height,
      weight,
      allergies = [],
      medicalConditions = [],
      cholesterol,
      bloodPressure,
      sugarLevel,
    } = req.body;

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
      req.user.id,
      { $set: { medical_history: medicalData } },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical information updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

//-------- LIFE STYLE INFO -------//

export const updateLifeStyleInfo = async (req, res) => {
  try {
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
    } = req.body;

    const lifeStyleData = {
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
      req.user.id,
      { $set: { lifestyle_habits: lifeStyleData,firstLogin: false } },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical information updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

