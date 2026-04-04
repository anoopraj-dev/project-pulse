import Patient from "../../models/patient.model.js";
import PatientRecord from "../../models/patientRecord.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";
import cloudinary from "../../config/cloudinary.js";

// -------- CREATE RECORD --------
export const createPatientMedicalRecordService = async (file, body, user) => {
  if (!file) {
    throw new Error("File is required");
  }

  const { title, description, category, appointmentId } = body;

  if (!title) {
    throw new Error("Title is required");
  }

  const uploadResult = await uploadToCloudinary(file, "patient-records");

  const record = new PatientRecord({
    patient: user.id,
    uploadedBy: user.role === "doctor" ? "doctor" : "patient",
    title,
    description,
    category: category || "other",
    fileUrl: uploadResult.secure_url,
    fileType: file.mimetype,
    cloudinaryId: uploadResult.public_id,
    appointment: appointmentId || null,
  });

  await record.save();

  return record;
};

// -------- GET PATIENT RECORDS --------
export const getPatientMedicalRecordsService = async (patientId) => {
  return await PatientRecord.find({ patient: patientId }).sort({
    createdAt: -1,
  });
};

// -------- GET RECORDS FOR DOCTOR --------
export const getPatientMedicalRecordsForDoctorService = async (patientId) => {
  const patient = await Patient.findById(patientId, "-password");

  if (!patient) {
    throw new Error("Patient not found");
  }

  const records = await PatientRecord.find({ patient: patientId }).sort({
    createdAt: -1,
  });

  return { patient, records };
};

// -------- DELETE RECORD --------
export const deletePatientMedicalRecordService = async (recordId, user) => {
  const record = await PatientRecord.findById(recordId);

  if (!record) {
    throw new Error("Record not found");
  }

  if (user.role === "patient" && record.patient.toString() !== user.id) {
    throw new Error("Not authorized");
  }

  if (record.cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(record.cloudinaryId);
    } catch (err) {
      console.warn("Unable to delete cloudinary file", err);
    }
  }

  await record.deleteOne();

  return true;
};