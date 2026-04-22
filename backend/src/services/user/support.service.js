import SupportTicket from "../../models/supportTicket.model.js";
import Escalation from "../../models/escalation.model.js";
import bcrypt from "bcryptjs";
import Patient from "../../models/patient.model.js";
import Doctor from '../../models/doctor.model.js'
import Admin from '../../models/admin.model.js'
import Alert from "../../models/alert.model.js";

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
) => {
  console.log('status in update ticket service',status)
  return await SupportTicket.findByIdAndUpdate(
    id,
    {status},
    { new: true },
  );
};

//--------- SYSTEM ALERTS -----------

//-------- get Alerts --------
export const getSystemAlersService = async (data) => {
  return await Alert.find().sort({createdAt:-1}).lean();
};

//--------- update alert status ---------
export const updateAlertStatusService = async (id, status) => {
  return await Alert.findByIdAndUpdate(id, { status }, { new: true });
};


//----------- Helper (identify role) ---------
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


//------------- Change Password -------------
export const changePasswordService = async (
  role,
  userId,
  currentPassword,
  newPassword
) => {

  console.log('role in service',role)
  const Model = getModelByRole(role);

  const user = await Model.findById(userId);

  if (!user) {
    throw new Error(`${role} not found`);
  }

  // check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  // password strength
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

  // prevent reuse
  const isSame = await bcrypt.compare(newPassword, user.password);

  if (isSame) {
    const error = new Error("New password cannot be same as current password");
    error.statusCode = 400;
    throw error;
  }

  // hash + save
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return true;
};