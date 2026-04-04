import Doctor from "../../models/doctor.model.js";
import { Notification } from "../../models/notification.model.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { sendEmail } from "../../config/nodemailer.js";
import { getIO } from "../../socket.js";
import { sendEmailService } from "../user/email.service.js";
import { EMAIL_TYPES } from "../../constants/email.constants.js";
import { createNotification } from "../user/notification.service.js";

// //---------------- Send Notification & Email -------------
// const notifyDoctor = async (doctorId, title, message, emailData = null) => {
//   const io = getIO();
//   const notification = await Notification.create({
//     title,
//     message,
//     recipient: doctorId,
//     role: "doctor",
//     read: false,
//   });

//   io.to(doctorId.toString()).emit("notification:new", notification);

//   if (emailData) {
//     try {
//       await sendEmail(emailData);
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   }
// };

//---------------- Approve Doctor ------------------------
export const approveDoctorService = async (doctorId) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { status: "approved", resubmissionApproved: false },
    { new: true },
  );

  if (!doctor) throw new Error("Doctor not found");

  await sendEmailService({
    to: doctor.email,
    name: doctor.name,
    role: "doctor",
    ...EMAIL_TYPES.DOCTOR_APPROVED,
  });

  await createNotification({
    userId: doctorId?.toString(),
    title: "Profile Approved",
    message: "Your profile have been approved",
  });

  return doctor;
};

//---------------- Reject Doctor ------------------------
export const rejectDoctorService = async (doctorId, reason) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    {
      status: "rejected",
      rejectionReason: reason,
      resubmissionRequested: false,
    },
    { new: true },
  );

  if (!doctor) throw new Error("Doctor not found");

  await sendEmailService({
    to: doctor.email,
    name: doctor.name,
    role: "doctor",
    highlightText: reason,
    ...EMAIL_TYPES.DOCTOR_REJECTED,
  });

  await createNotification({
    userId: doctorId.toString(),
    title: "Profile Rejected",
    message: "Your profile have been rejected, check your email for details",
  });

  return doctor;
};

//---------------- Block Doctor ------------------------
export const blockDoctorService = async (doctorId, reason) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { status: "blocked", isBlocked: true, blockedReason: reason },
    { new: true },
  );

  if (!doctor) throw new Error("Doctor not found");

  await sendEmailService({
    to: doctor.email,
    name: doctor.name,
    role: "doctor",
    highlightText: reason,
    ...EMAIL_TYPES.DOCTOR_BLOCKED,
  });

  await createNotification({
    userId: doctorId?.toString(),
    title: "Profile Blocked",
    message: "Your profile has been blocked, Check your mail for more details",
  });
  return doctor;
};

//---------------- Unblock Doctor ----------------------
export const unblockDoctorService = async (doctorId) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { status: "pending", isBlocked: false, blockedReason: "" },
    { new: true },
  );

  if (!doctor) throw new Error("Doctor not found");

  await sendEmailService({
    to: doctor.email,
    name: doctor.name,
    role: "doctor",
    ...EMAIL_TYPES.DOCTOR_UNBLOCKED,
  });

  await createNotification({
    userId: doctorId.toString(),
    title: "Profile Unblocked",
    message: "Your profile has been unblocked",
  });
  return doctor;
};

//---------------- Revoke Doctor Status -----------------
export const revokeDoctorStatusService = async (doctorId, status) => {
  const allowedStatuses = [
    "pending",
    "approved",
    "rejected",
    "blocked",
    "resubmit",
  ];
  if (!allowedStatuses.includes(status))
    throw new Error("Invalid status value");

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  doctor.status = status;
  doctor.resubmission = true;

  if (status !== "rejected") doctor.rejectionReason = "";
  if (status !== "blocked") doctor.blockedReason = "";

  await doctor.save();

  await sendEmailService({
    to: doctor.email,
    name: doctor.name,
    role: "doctor",
    highlightText: `Status:${status}`,
    ...EMAIL_TYPES.DOCTOR_STATUS_UPDATED,
  });

  await createNotification({
    userId: doctorId.toString(),
    title: "Profile Status Update",
    message: "Your profile status has been updated, check mail for more info",
  });
  return doctor;
};

//---------------- Get All Doctors ---------------------
export const getAllDoctorsService = async () => {
  const doctors = await Doctor.find().select("-password");
  if (!doctors) throw new Error("No doctors found");
  return doctors;
};
