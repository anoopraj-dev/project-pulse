import Appointment from "../../models/appointments.model.js";

//-------------- Get appointments service ------------

export const getAllAppointmentsService = async (filters) => {
  const { status, doctorId, patientId, fromDate, toDate } = filters;

  const query = {};

  if (status) query.status = status;
  if (doctorId) query.doctor = doctorId;
  if (patientId) query.patient = patientId;

  if (fromDate || toDate) {
    query.appointmentDateTime = {};
    if (fromDate) query.appointmentDateTime.$gte = new Date(fromDate);
    if (toDate) query.appointmentDateTime.$lte = new Date(toDate);
  }

  const appointments = await Appointment.find(query)
    .populate("patient", "name profilePicture work")
    .populate("doctor", "name professionalInfo.specializations profilePicture")

    .sort({ appointmentDateTime: 1 });

  //-------------- Auto-mark expired appointments ------------
  const now = new Date();

  for (const appt of appointments) {
    if (appt.status === "pending" || appt.status === "confirmed") {
      const appointmentDateTime = new Date(appt.appointmentDateTime);

      if (!isNaN(appointmentDateTime) && appointmentDateTime < now) {
        appt.status = "expired";
        await appt.save();
      }
    }
  }

  return appointments;
};

//--------------------- Set Appointment Status service --------------------

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

  //------------- Admin actions --------------------
  if (mappedStatus === "confirmed") {
    appointment.cancelledBy = null;
  } else if (mappedStatus === "cancelled") {
    appointment.cancelledBy = "admin";
  }

  await appointment.save();

  return appointment;
};
