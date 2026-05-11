
import {
  getApprovedDoctorsService,
  viewDoctorProfileService,
} from "../../services/patient/viewDoctors.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// GET ALL DOCTORS
export const getApprovedDoctors = asyncHandler(async (req, res) => {
  const doctors = await getApprovedDoctorsService();
  return res.status(200).json({
    success: true,
    message: "Fetched all doctors",
    users: doctors,
  });
});

// VIEW DOCTOR PROFILE
export const viewDoctorProfile = asyncHandler(async (req, res) => {
  const { doctor, availability } = await viewDoctorProfileService(req.params.id);
  return res.status(200).json({
    success: true,
    message: "Data loaded successfully",
    user: doctor,
    availability,
  });
});