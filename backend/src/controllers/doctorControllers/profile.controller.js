
import {
  getDoctorProfileService,
  updateDoctorProfileService,
  requestProfileResubmissionService,
  resubmitProfileService,
} from "../../services/doctor/profile.service.js";
import { getIO } from "../../socket.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// ---------------- GET PROFILE ----------------
export const getDoctorProfile = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "doctor") {
    throw new AppError("Not authorized", 403);
  }

  const { doctor, availability } = await getDoctorProfileService(req.user.id);

  return res.json({ success: true, user: doctor, availability });
});

// ---------------- UPDATE PROFILE ----------------
export const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await updateDoctorProfileService(req.body);
  return res.status(200).json({ success: true, user: doctor });
});

// ---------------- REQUEST RESUBMISSION ----------------
export const requestProfileResubmission = asyncHandler(async (req, res) => {
  const io = getIO();
  const { doctor, notification } = await requestProfileResubmissionService(req.user.id);
  io.to("role:admin").emit("notification:new", notification);

  return res.status(200).json({
    success: true,
    message: "Resubmission request sent to admin",
    user: doctor,
  });
});

// ---------------- RESUBMIT PROFILE ----------------
export const resubmitProfile = asyncHandler(async (req, res) => {
  const io = getIO();
  const { doctor, notification } = await resubmitProfileService(req.user.id);
  io.to("role:admin").emit("notification:new", notification);

  return res.status(200).json({
    success: true,
    message: "Profile resubmitted successfully",
    user: doctor,
  });
});