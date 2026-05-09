
import {
  getAllAppointmentsService,
  setAdminAppointmentStatusService,
} from "../../services/admin/appointment.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

//-------------- Get appointments ------------
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await getAllAppointmentsService(req.query);
  res.status(200).json({ success: true, appointments });
});

//--------------------- Set Appointment Status --------------------
export const setAdminAppointmentStatus = asyncHandler(async (req, res) => {
  const { id: appointmentId } = req.params;
  const { status } = req.body;

  if (!appointmentId) throw new AppError("Appointment ID missing", 400);

  const appointment = await setAdminAppointmentStatusService({ appointmentId, status });
  res.status(200).json({
    success: true,
    message: "Appointment status updated by admin successfully",
    appointment,
  });
});
