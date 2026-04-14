import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import { Notification } from "../../models/notification.model.js";

//------------- Get admin dashboard stats -------------
export const getAdminDashboardService = async () => {
  const [doctorCount, patientCount] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
  ]);

  const pendingDoctorsApproval = await Doctor.find({ status: "pending" })
    .select("name professionalInfo.specializations createdAt profilePicture")
    .sort({ createdAt: -1 });

  return {
    doctorCount,
    patientCount,
    pendingDoctorsApproval,
  };
};

//-------------- Get pending doctor profile -------------
export const getPendingDoctorProfileService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).select("-password");
  if (!doctor) throw new Error("Doctor not found");
  return doctor;
};

//--------------- Get doctor documents -------------
export const getDoctorDocumentsService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");
  return doctor;
};

//---------------- Get admin notifications -------------
export const getAdminNotificationsService = async () => {
  const notifications = await Notification.find({ role: "admin" }).sort({
    createdAt: -1,
  });
  return notifications;
};