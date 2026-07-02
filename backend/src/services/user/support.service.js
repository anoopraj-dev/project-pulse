import SupportTicket from "../../models/supportTicket.model.js";
import Escalation from "../../models/escalation.model.js";
import bcrypt from "bcryptjs";
import Patient from "../../models/patient.model.js";
import Doctor from '../../models/doctor.model.js'
import Admin from '../../models/admin.model.js'
import Alert from "../../models/alert.model.js";
import paginate from "../../utils/paginate.js";
import AppError from "../../utils/AppError.js";

// ---------------- SUPPORT TICKETS ----------------

// ---------------- CREATE TICKET ----------------
export const createTicketService = async (data) => {
  return await SupportTicket.create(data);
};

// ---------------- GET TICKETS ----------------
export const getTicketsService = async () => {
  return await SupportTicket.find().sort({ createdAt: -1 }).lean();
};

// ---------------- UPDATE TICKET STATUS ----------------
export const updateTicketStatusService = async (
  id,
  status,
) => {
  return await SupportTicket.findByIdAndUpdate(
    id,
    {status},
    { new: true },
  );
};

// ---------------- SYSTEM ALERTS ----------------


export const getSystemAlertsService = async ({ page = 1, limit = 10 }) => {
  return await paginate({
    model: Alert,
    page,
    limit,
    sort: { createdAt: -1 },
  });
};

// ---------------- UPDATE ALERT STATUS ----------------
export const updateAlertStatusService = async (id, status) => {
  return await Alert.findByIdAndUpdate(id, { status }, { new: true });
};


// ---------------- HELPER (IDENTIFY ROLE) ----------------
const getModelByRole = (role) => {
  switch (role) {
    case "patient":
      return Patient;
    case "doctor":
      return Doctor;
    case "admin":
      return Admin;
    default:
      throw new Error("Invalid role");
  }
};


// ---------------- CHANGE PASSWORD ----------------
export const changePasswordService = async (
  role,
  userId,
  currentPassword,
  newPassword
) => {

  const Model = getModelByRole(role);

  const user = await Model.findById(userId);

  if (!user) {
    throw new AppError(`${role.charAt(0).toUpperCase() + role.slice(1)} not found`, 404);
  }

  // check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  // password strength
  const isValid =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(
      newPassword
    );

  if (!isValid) {
    throw new AppError(
      "Password must be at least 8 characters and include letters, numbers, and a special character",
      400
    );
  }

  // prevent reuse
  const isSame = await bcrypt.compare(newPassword, user.password);

  if (isSame) {
    throw new AppError("New password cannot be same as current password", 400);
  }

  // hash + save
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return true;
};