
import {
  createPatientMedicalRecordService,
  getPatientMedicalRecordsService,
  getPatientMedicalRecordsForDoctorService,
  deletePatientMedicalRecordService,
} from "../../services/patient/medicalRecord.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// -------- CREATE --------
export const createPatientMedicalRecord = asyncHandler(async (req, res) => {
  const record = await createPatientMedicalRecordService(req.file, req.body, req.user);
  return res.status(201).json({
    success: true,
    message: "Medical record uploaded successfully",
    record,
  });
});

// -------- GET PATIENT --------
export const getPatientMedicalRecords = asyncHandler(async (req, res) => {
  const records = await getPatientMedicalRecordsService(req.user.id);
  return res.status(200).json({ success: true, records });
});

// -------- GET FOR DOCTOR --------
export const getPatientMedicalRecordsForDoctor = asyncHandler(async (req, res) => {
  const { patient, records } = await getPatientMedicalRecordsForDoctorService(req.params.patientId);
  return res.status(200).json({ success: true, patient, records });
});

// -------- DELETE --------
export const deletePatientMedicalRecord = asyncHandler(async (req, res) => {
  await deletePatientMedicalRecordService(req.params.id, req.user);
  return res.status(200).json({ success: true, message: "Record deleted" });
});