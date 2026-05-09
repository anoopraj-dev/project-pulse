
import {
  getPatientProfileService,
  updatePatientProfileService,
} from "../../services/patient/profile.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// -------- GET PROFILE --------
export const getPatientProfile = asyncHandler(async (req, res) => {
  const patient = await getPatientProfileService(req.user);
  return res.json({ success: true, user: patient });
});

// -------- UPDATE PROFILE --------
export const updatePatientProfile = asyncHandler(async (req, res) => {
  const patient = await updatePatientProfileService(req.user.id, req.body, req.file);
  return res.status(200).json({ success: true, user: patient });
});