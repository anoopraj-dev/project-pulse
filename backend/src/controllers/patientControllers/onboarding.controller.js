
import {
  updatePersonalInfoService,
  updateMedicalInfoService,
  updateLifeStyleInfoService,
} from "../../services/patient/onboarding.service.js";

// ---------------- PERSONAL INFO ----------------
export const updatePersonalInfo = async (req, res) => {
  try {
    const patient = await updatePersonalInfoService(
      req.user,
      req.body,
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "Personal information updated successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(
      error.message.includes("Unauthorized")
        ? 401
        : error.message.includes("not found")
        ? 404
        : 500
    ).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// ---------------- MEDICAL INFO ----------------
export const updateMedicalInfo = async (req, res) => {
  try {
    const data = await updateMedicalInfoService(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Medical information updated successfully",
      data,
    });
  } catch (error) {
    return res.status(
      error.message.includes("Unauthorized")
        ? 401
        : error.message.includes("not found")
        ? 404
        : 500
    ).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// ---------------- LIFESTYLE INFO ----------------
export const updateLifeStyleInfo = async (req, res) => {
  try {
    const patient = await updateLifeStyleInfoService(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Lifestyle information updated successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(
      error.message.includes("Unauthorized")
        ? 401
        : error.message.includes("not found")
        ? 404
        : 500
    ).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};