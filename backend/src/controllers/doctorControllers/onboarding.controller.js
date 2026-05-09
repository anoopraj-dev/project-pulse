
import {
  updatePersonalInfoService,
  updateProfessionalInfoService,
  updateServicesInfoService,
} from "../../services/doctor/onboarding.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// -------- PERSONAL INFO --------
export const updatePersonalInfo = asyncHandler(async (req, res) => {
  const doctorId = req.user?.id;
  if (!doctorId) throw new AppError("Unauthorized", 401);

  const updatedDoctor = await updatePersonalInfoService(doctorId, req.body, req.file);

  return res.status(200).json({
    success: true,
    message: "Personal information updated successfully",
    data: updatedDoctor,
  });
});

// -------- PROFESSIONAL INFO --------
export const updateProfessionalInfo = asyncHandler(async (req, res) => {
  const doctorId = req.user?.id;
  if (!doctorId) throw new AppError("Unauthorized", 401);

  const data = await updateProfessionalInfoService(doctorId, req.body, req.files);

  return res.status(200).json({
    success: true,
    message: "Professional information updated successfully",
    data,
  });
});

// -------- SERVICES INFO --------
export const updateServicesInfo = asyncHandler(async (req, res) => {
  const doctorId = req.user?.id;
  if (!doctorId) throw new AppError("Unauthorized", 401);

  const doctor = await updateServicesInfoService(doctorId, req.body.services);

  return res.status(200).json({
    success: true,
    message: "Service info updated successfully",
    data: doctor,
    firstLogin: doctor.firstLogin,
  });
});