import SupportTicket from "../../models/supportTicket.model.js";
import SystemAlert from "../../models/systemAlert.model.js";
import Escalation from "../../models/escalation.model.js";
import bcrypt from "bcryptjs";
import Patient from "../../models/patient.model.js";

//--------- SUPPORT TICKETS -------------

//------------ Create Ticket -----------
export const createTicketService = async (data) => {
  return await SupportTicket.create(data);
};

//------------ Get Tickets --------
export const getTicketsService = async () => {
  return await SupportTicket.find().sort({ createdAt: -1 }).lean();
};

//--------- Update ticket status -------
export const updateTicketStatusService = async (
  id,
  status,
  resolutionNotes,
) => {
  return await SupportTicket.findByIdAndUpdate(
    id,
    { status, resolutionNotes },
    { new: true },
  );
};

//--------- SYSTEM ALERTS ------------
export const createAlertService = async (data) => {
  return await SystemAlert.create(data);
};

//-------- get Alerts --------
export const getSystemAlersService = async (data) => {
  return await SystemAlert.find().sort({ createdAt: -1 }).lean();
};

//--------- update alert status ---------
export const updateAlertStatusService = async (id, status) => {
  return await SystemAlert.findByIdAndUpdate(id, { status }, { new: true });
};

//------------- ESCALATIONS ----------
export const createEscalationService = async (data) => {
  return await Escalation.create(data);
};

//------- get Escalations ------------
export const getEscalationsService = async () => {
  return await Escalation.find().sort({ createdAt: -1 }).lean();
};

//----------- Resolve Escaltion --------
export const resolveEscalationService = async (id) => {
  return await Escalation.findByIdAndUpdate(
    id,
    { status: "resolved" },
    { new: true },
  );
};


//------------- Change Password -------------
export const changePasswordService = async (
  patientId,
  currentPassword,
  newPassword
) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  // check current password
  const isMatch = await bcrypt.compare(currentPassword, patient.password);

  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  // ---------------- password strength check ----------------
  const isValid =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(
      newPassword
    );

  if (!isValid) {
    const error = new Error(
      "Password must be at least 8 characters and include letters, numbers, and a special character"
    );
    error.statusCode = 400;
    throw error;
  }

  // prevent same password reuse
  const isSamePassword = await bcrypt.compare(
    newPassword,
    patient.password
  );

  if (isSamePassword) {
    const error = new Error(
      "New password cannot be same as current password"
    );
    error.statusCode = 400;
    throw error;
  }

  // hash & save
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  patient.password = hashedPassword;

  await patient.save();

  return true;
};