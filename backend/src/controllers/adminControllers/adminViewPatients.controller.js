
import {
  getAllPatientsService,
  getPatientProfileService,
  blockPatientService,
  unblockPatientService,
} from "../../services/admin/viewPatients.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// ---------------- GET ALL PATIENTS ----------------
export const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await getAllPatientsService();
  res.status(200).json({ success: true, message: "Data loaded successfully", users: patients });
});

// ---------------- GET PATIENT PROFILE ----------------
export const getPatientProfile = asyncHandler(async (req, res) => {
  const patient = await getPatientProfileService(req.params.id);
  res.status(200).json({ success: true, message: "Data loaded successfully", user: patient });
});

// ---------------- BLOCK PATIENT ----------------
export const blockPatientProfile = asyncHandler(async (req, res) => {
  const patient = await blockPatientService(req.params.id, req.body.reason);
  res.status(200).json({ success: true, message: "Patient blocked successfully", user: patient });
});

// ---------------- UNBLOCK PATIENT ----------------
export const unblockPatientProfile = asyncHandler(async (req, res) => {
  const patient = await unblockPatientService(req.params.id);
  res.status(200).json({ success: true, message: "Patient unblocked successfully", user: patient });
});