
import {
  approveDoctorService,
  rejectDoctorService,
  blockDoctorService,
  unblockDoctorService,
  revokeDoctorStatusService,
  getAllDoctorsService,
} from "../../services/admin/viewDoctors.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// ---------------- APPROVE DOCTOR ----------------
export const approveDoctorsRequest = asyncHandler(async (req, res) => {
  const doctor = await approveDoctorService(req.params.id);
  res.status(200).json({ success: true, message: `Approved Dr ${doctor.name}`, user: doctor });
});

// ---------------- REJECT DOCTOR ----------------
export const rejectDoctorsRequest = asyncHandler(async (req, res) => {
  const doctor = await rejectDoctorService(req.params.id, req.body.reason);
  res.status(200).json({ success: true, message: `Rejected Dr ${doctor.name}`, user: doctor });
});

// ---------------- BLOCK DOCTOR ----------------
export const blockDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await blockDoctorService(req.params.id, req.body.reason);
  res.status(200).json({ success: true, message: `Blocked Dr ${doctor.name}`, user: doctor });
});

// ---------------- UNBLOCK DOCTOR ----------------
export const unblockDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await unblockDoctorService(req.params.id);
  res.status(200).json({ success: true, message: `Unblocked Dr ${doctor.name}`, user: doctor });
});

// ---------------- REVOKE DOCTOR STATUS ----------------
export const revokeDoctorStatus = asyncHandler(async (req, res) => {
  const doctor = await revokeDoctorStatusService(req.params.id, req.body.status);
  res.status(200).json({ success: true, message: `Doctor status updated to ${doctor.status}`, user: doctor });
});

// ---------------- GET ALL DOCTORS ----------------
export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await getAllDoctorsService();
  res.status(200).json({ success: true, message: "Data loaded successfully", users: doctors });
});