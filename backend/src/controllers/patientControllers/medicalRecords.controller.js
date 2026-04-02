import Patient from "../../models/patient.model.js";
import PatientRecord from "../../models/patientRecord.model.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUtility.js";
import cloudinary from "../../config/cloudinary.js";

export const createPatientMedicalRecord = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    const { title, description, category, appointmentId } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const uploadResult = await uploadToCloudinary(file, "patient-records");

    const record = new PatientRecord({
      patient: req.user.id,
      uploadedBy: req.user.role === "doctor" ? "doctor" : "patient",
      title,
      description,
      category: category || "other",
      fileUrl: uploadResult.secure_url,
      fileType: file.mimetype,
      cloudinaryId: uploadResult.public_id,
      appointment: appointmentId || null,
    });

    await record.save();

    return res.status(201).json({
      success: true,
      message: "Medical record uploaded successfully",
      record,
    });
  } catch (error) {
    console.error("createPatientMedicalRecord error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPatientMedicalRecords = async (req, res) => {
  try {
    const patientId = req.user.id;

    const records = await PatientRecord.find({ patient: patientId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, records });
  } catch (error) {
    console.error("getPatientMedicalRecords error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPatientMedicalRecordsForDoctor = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId, "-password");
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const records = await PatientRecord.find({ patient: patientId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, patient, records });
  } catch (error) {
    console.error("getPatientMedicalRecordsForDoctor error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deletePatientMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await PatientRecord.findById(id);

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === "patient" && record.patient.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (record.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(record.cloudinaryId);
      } catch (err) {
        console.warn("Unable to delete cloudinary file", err);
      }
    }

    await record.deleteOne();

    return res.status(200).json({ success: true, message: "Record deleted" });
  } catch (error) {
    console.error("deletePatientMedicalRecord error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
