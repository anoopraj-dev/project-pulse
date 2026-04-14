import Patient from "../../models/patient.model.js";
import { Notification } from "../../models/notification.model.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { sendEmail } from "../../config/nodemailer.js";
import { getIO } from "../../socket.js";

//----------- Helper: Notify patient ---------------
const notifyPatient = async (patientId, title, message, emailData = null) => {
  const io = getIO();

  const notification = await Notification.create({
    title,
    message,
    recipient: patientId,
    role: "patient",
    read: false,
  });

  io.to(patientId.toString()).emit("notification:new", notification);

  if (emailData) {
    try {
      await sendEmail(emailData);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
};

//---------------- Get All Patients -----------------
export const getAllPatientsService = async () => {
  const patients = await Patient.find();
  if (!patients || patients.length === 0) throw new Error("No patients found");
  return patients;
};

//---------------- Get Patient Profile --------------
export const getPatientProfileService = async (patientId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error("Patient not found");
  return patient;
};

//---------------- Block Patient -------------------
export const blockPatientService = async (patientId, reason) => {
  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  patient.status = "blocked";
  patient.blockedReason = reason;
  await patient.save();

  const mailOptions = {
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to: patient.email,
    subject: "Profile Blocked",
    html: emailTemplate({
      title: "Account Blocked",
      subtitle: "Patient Profile Review",
      body: `
        <p>Hello <strong>${patient.name}</strong>,</p>
        <p>Your profile has been temporarily blocked for: <strong>${reason}</strong></p>
        <p>Please contact support for further action.</p>
      `,
      highlightText: `Current Status: ${patient.status}`,
      highlightType: "error",
    }),
  };

  await notifyPatient(patient._id, "Profile Blocked", "Your profile has been blocked", mailOptions);

  return patient;
};

//---------------- Unblock Patient -----------------
export const unblockPatientService = async (patientId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  patient.status = "active";
  patient.blockedReason = "";
  await patient.save();

  await notifyPatient(patient._id, "Profile Unblocked", "Your profile has been unblocked");

  return patient;
};