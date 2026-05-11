
import {
  getBookingInfoService,
  bookAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  cancelAppointmentService,
} from "../../services/patient/appointment.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

//-------------- Get booking info ----------------
export const getBookingInfo = asyncHandler(async (req, res) => {
  const bookingInfo = await getBookingInfoService(req.params.id);
  res.status(200).json({ success: true, bookingInfo });
});

//---------------- Book Appointment ----------------
export const bookAppointment = asyncHandler(async (req, res) => {
  const { appointment } = await bookAppointmentService(req.body, req.user.id);
  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    appointment,
  });
});

//---------------- Get all appointments ----------------
export const getAllAppointments = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(20, Math.max(1, parseInt(limit) || 5));

  const appointments = await getAllAppointmentsService(req.user.id, {
    page: pageNum,
    limit: limitNum,
    status,
  });

  res.status(200).json({ success: true, data: appointments });
});

//---------------- Get appointment by ID ----------------
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await getAppointmentByIdService(req.params.id, req.user.id);
  res.status(200).json({ success: true, appointment });
});

//---------------- Cancel appointment ----------------
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await cancelAppointmentService(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: "Appointment cancelled successfully",
    appointment,
  });
});
