
import {
  createPatientMedicalRecordService,
  getPatientMedicalRecordsService,
  getPatientMedicalRecordsForDoctorService,
  deletePatientMedicalRecordService,
} from "../../services/patient/medicalRecord.service.js";

// -------- CREATE --------
export const createPatientMedicalRecord = async (req, res) => {
  try {
    const record = await createPatientMedicalRecordService(
      req.file,
      req.body,
      req.user
    );

    return res.status(201).json({
      success: true,
      message: "Medical record uploaded successfully",
      record,
    });
  } catch (error) {
    return res.status(
      error.message.includes("required") ? 400 : 500
    ).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// -------- GET PATIENT --------
export const getPatientMedicalRecords = async (req, res) => {
  try {
    const records = await getPatientMedicalRecordsService(req.user.id);

    return res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// -------- GET FOR DOCTOR --------
export const getPatientMedicalRecordsForDoctor = async (req, res) => {
  try {
    const { patient, records } =
      await getPatientMedicalRecordsForDoctorService(req.params.patientId);

    return res.status(200).json({
      success: true,
      patient,
      records,
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

// -------- DELETE --------
export const deletePatientMedicalRecord = async (req, res) => {
  try {
    await deletePatientMedicalRecordService(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Record deleted",
    });
  } catch (error) {
    return res.status(
      error.message.includes("not found")
        ? 404
        : error.message.includes("authorized")
        ? 403
        : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};