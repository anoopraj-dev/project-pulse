import Patient from "../../models/patient.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";



// ---------------------- PERSONAL INFO -------------------
export const updatePersonalInfo = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { gender, address, phone, dob, work } = req.body;

    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // -------- PROFILE PICTURE --------
    let profilePictureUrl = patient.profilePicture || "";

    console.log('file recievied in backend', req.file)

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);
      profilePictureUrl = uploaded.secure_url;
    }

    // -------- UPDATE DATA --------
    patient.gender = gender;
    patient.address = address;
    patient.phone = phone;
    patient.dob = dob;
    patient.work = work;
    patient.profilePicture = profilePictureUrl;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Personal information updated successfully",
      data: patient,
    });
  } catch (error) {
    console.error("updatePersonalInfo error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ---------------------- MEDICAL INFO --------------------
export const updateMedicalInfo = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
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
      {
        $set: { medical_history: medicalData },
      },
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
      data: patient.medical_history,
    });
  } catch (error) {
    console.error("updateMedicalInfo error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ---------------------- LIFESTYLE INFO ------------------
export const updateLifeStyleInfo = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
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
    } = req.body;

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
      req.user.id,
      {
        $set: {
          lifestyle_habits: lifestyleData,
          firstLogin: false,
        },
      },
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
      message: "Lifestyle information updated successfully",
      data: patient.lifestyle_habits,
    });
  } catch (error) {
    console.error("updateLifeStyleInfo error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
