
import {
  getDoctorProfileService,
  updateDoctorProfileService,
  requestProfileResubmissionService,
  resubmitProfileService,
} from "../../services/doctor/profile.service.js";

import { getIO } from "../../socket.js";

// ---------- GET PROFILE ----------
export const getDoctorProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "doctor") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { doctor, availability } =
      await getDoctorProfileService(req.user.id);

    return res.json({
      success: true,
      user: doctor,
      availability,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ---------- UPDATE PROFILE ----------
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await updateDoctorProfileService(req.body);

    return res.status(200).json({
      success: true,
      user: doctor,
    });
  } catch (error) {
    return res.status(
      error.message === "Doctor not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ---------- REQUEST RESUBMISSION ----------
export const requestProfileResubmission = async (req, res) => {
  try {
    const io = getIO();

    const { doctor, notification } =
      await requestProfileResubmissionService(req.user.id);

    io.to("role:admin").emit("notification:new", notification);

    return res.status(200).json({
      success: true,
      message: "Resubmission request sent to admin",
      user: doctor,
    });
  } catch (error) {
    return res.status(
      error.message.includes("not found") ? 404 : 400
    ).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- RESUBMIT PROFILE ----------
export const resubmitProfile = async (req, res) => {
  try {
    const io = getIO();

    const { doctor, notification } =
      await resubmitProfileService(req.user.id);

    io.to("role:admin").emit("notification:new", notification);

    return res.status(200).json({
      success: true,
      message: "Profile resubmitted successfully",
      user: doctor,
    });
  } catch (error) {
    return res.status(
      error.message.includes("not found") ? 404 : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};