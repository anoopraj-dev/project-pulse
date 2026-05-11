
import {
  updatePersonalInfoService,
  updateMedicalInfoService,
  updateLifeStyleInfoService,
} from "../../services/patient/onboarding.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// ---------------- PERSONAL INFO ----------------
export const updatePersonalInfo = asyncHandler(async (req, res) => {
  const patient = await updatePersonalInfoService(req.user, req.body, req.file);
  return res.status(200).json({
    success: true,
    message: "Personal information updated successfully",
    data: patient,
  });
});

// ---------------- MEDICAL INFO ----------------
export const updateMedicalInfo = asyncHandler(async (req, res) => {
  const data = await updateMedicalInfoService(req.user.id, req.body);
  return res.status(200).json({
    success: true,
    message: "Medical information updated successfully",
    data,
  });
});

// ---------------- LIFESTYLE INFO ----------------
export const updateLifeStyleInfo = asyncHandler(async (req, res) => {
  const patient = await updateLifeStyleInfoService(req.user.id, req.body);
  return res.status(200).json({
    success: true,
    message: "Lifestyle information updated successfully",
    data: patient,
  });
});