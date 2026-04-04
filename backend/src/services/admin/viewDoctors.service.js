import Doctor from "../../models/doctor.model.js";
import { Notification } from "../../models/notification.model.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { sendEmail } from "../../config/nodemailer.js";
import { getIO } from "../../socket.js";

//---------------- Send Notification & Email -------------
const notifyDoctor = async (doctorId, title, message, emailData = null) => {
  const io = getIO();
  const notification = await Notification.create({
    title,
    message,
    recipient: doctorId,
    role: "doctor",
    read: false,
  });

  io.to(doctorId.toString()).emit("notification:new", notification);

  if (emailData) {
    try {
      await sendEmail(emailData);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
};

//---------------- Approve Doctor ------------------------
export const approveDoctorService = async (doctorId) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { status: "approved", resubmissionApproved: false },
    { new: true }
  );

  if (!doctor) throw new Error("Doctor not found");

  const mailOptions = {
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to: doctor.email,
    subject: "Profile Approved – Welcome to Pulse360",
    html: emailTemplate({
      title: "Profile Approved",
      subtitle: "Doctor Profile Review",
      body: `
        <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
        <p>Your profile has been <strong>approved</strong> and is now visible on the platform.</p>
      `,
      highlightText: "Your account is now active",
      highlightType: "success",
    }),
  };

  await notifyDoctor(doctor._id, "Profile Approved", "Your profile has been approved by admin", mailOptions);

  return doctor;
};

//---------------- Reject Doctor ------------------------
export const rejectDoctorService = async (doctorId, reason) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { status: "rejected", rejectionReason: reason, resubmissionRequested: false },
    { new: true }
  );

  if (!doctor) throw new Error("Doctor not found");

  const mailOptions = {
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to: doctor.email,
    subject: "Profile Rejected – Action Required",
    html: emailTemplate({
      title: "Profile Rejected",
      subtitle: "Doctor Profile Review",
      body: `
        <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
        <p>Your profile has been <strong>rejected</strong>.</p>
      `,
      highlightText: reason,
      highlightType: "error",
    }),
  };

  await notifyDoctor(doctor._id, "Profile Rejected", "Your profile has been rejected by admin", mailOptions);

  return doctor;
};

//---------------- Block Doctor ------------------------
export const blockDoctorService = async (doctorId, reason) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { status: "blocked", isBlocked: true, blockedReason: reason },
    { new: true }
  );

  if (!doctor) throw new Error("Doctor not found");

  const mailOptions = {
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to: doctor.email,
    subject: "Profile Blocked – Action Required",
    html: emailTemplate({
      title: "Profile Blocked",
      subtitle: "Doctor Profile Review",
      body: `<p>Your profile has been blocked for violating terms and conditions.</p>`,
      highlightText: reason,
      highlightType: "error",
    }),
  };

  await notifyDoctor(doctor._id, "Profile Blocked", "Your profile has been blocked", mailOptions);

  return doctor;
};

//---------------- Unblock Doctor ----------------------
export const unblockDoctorService = async (doctorId) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { status: "pending", isBlocked: false, blockedReason: "" },
    { new: true }
  );

  if (!doctor) throw new Error("Doctor not found");

  const mailOptions = {
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to: doctor.email,
    subject: "Profile Unblocked",
    html: emailTemplate({
      title: "Profile Unblocked",
      subtitle: "Doctor Profile Review",
      body: `<p>Your profile has been <strong>unblocked</strong> and is awaiting admin approval.</p>`,
      highlightText: "Profile unblocked and waiting admin approval",
      highlightType: "success",
    }),
  };

  await notifyDoctor(doctor._id, "Profile Unblocked", "Your profile has been unblocked", mailOptions);

  return doctor;
};

//---------------- Revoke Doctor Status -----------------
export const revokeDoctorStatusService = async (doctorId, status) => {
  const allowedStatuses = ["pending", "approved", "rejected", "blocked", "resubmit"];
  if (!allowedStatuses.includes(status)) throw new Error("Invalid status value");

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  doctor.status = status;
  doctor.resubmission = true;

  if (status !== "rejected") doctor.rejectionReason = "";
  if (status !== "blocked") doctor.blockedReason = "";

  await doctor.save();

  const mailOptions = {
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to: doctor.email,
    subject: "Profile Status Updated",
    html: emailTemplate({
      title: "Profile Status Updated",
      subtitle: "Doctor Profile Review",
      body: `<p>Your profile status has been updated to <strong>${status.toUpperCase()}</strong>.</p>`,
      highlightText: `Current Status: ${status}`,
      highlightType: status === "approved" ? "success" : "warning",
    }),
  };

  await notifyDoctor(doctor._id, "Profile Status Revoked", "Your profile status has been updated", mailOptions);

  return doctor;
};

//---------------- Get All Doctors ---------------------
export const getAllDoctorsService = async () => {
  const doctors = await Doctor.find().select("-password");
  if (!doctors) throw new Error("No doctors found");
  return doctors;
};