import Appointment from "../../models/appointments.model.js";
import { expireAppointments } from "../../utils/AppointmentExpiry.js";

// ---------------- GET APPOINTMENTS SERVICE ----------------
export const getAllAppointmentsService = async (filters) => {
  await expireAppointments();

  const { status, doctorId, patientId, fromDate, toDate } = filters;

  const query = {};

  if (status) query.status = status;
  if (doctorId) query.doctor = doctorId;
  if (patientId) query.patient = patientId;

  // ---------------- STRING RANGE FILTER (IMPORTANT CHANGE) ----------------
  if (fromDate || toDate) {
    query.appointmentDate = {};

    if (fromDate) query.appointmentDate.$gte = fromDate; // "YYYY-MM-DD"
    if (toDate) query.appointmentDate.$lte = toDate;
  }

  const appointments = await Appointment.find(query)
    .populate("patient", "name profilePicture work")
    .populate("doctor", "name professionalInfo.specializations profilePicture")
    .sort({
      appointmentDate: 1,
      timeSlot: 1,
    });

  return appointments;
};

// ---------------- SET APPOINTMENTS STATUS ----------------
export const setAdminAppointmentStatusService = async ({
  appointmentId,
  status,
}) => {
  const mapAppointmentActionToStatus = (action) => {
    const actionMap = {
      confirm: "confirmed",
      cancel: "cancelled",
      "re-schedule": "pending",
      complete: "completed",
    };
    return actionMap[action] || null;
  };

  if (!appointmentId) {
    throw new Error("Appointment ID missing");
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const mappedStatus = mapAppointmentActionToStatus(status);

  appointment.status = mappedStatus;

  if (mappedStatus === "confirmed") {
    appointment.cancelledBy = null;
  } else if (mappedStatus === "cancelled") {
    appointment.cancelledBy = "admin";
  }

  await appointment.save();

  return appointment;
};