import {
  cancelAppointmentService,
  getAllAppointmentsService,
  getDoctorAppointmentByIdService,
} from "../../services/doctor/appointment.service.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { sendEmail } from "../../config/nodemailer.js";
import { createNotification } from "../../services/user/notification.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

export const getAllAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user?.id;
  if (!doctorId) throw new AppError("Unauthorized", 401);

  const appointments = await getAllAppointmentsService(doctorId);

  return res.status(200).json({
    success: true,
    message: "Appointments loaded successfully",
    appointments,
  });
});

export const getDoctorAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctorId = req.user.id;

  const appointment = await getDoctorAppointmentByIdService(id, doctorId);

  return res.status(200).json({ success: true, appointment });
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const doctorId = req.user?.id;

  const { appointment, patient, doctor } =
    await cancelAppointmentService({ id, reason, doctorId });

  // -------- Emails --------
  await Promise.allSettled([
    sendEmail({
      to: patient.email,
      subject: "Appointment Cancellation",
      html: emailTemplate({
        title: "Doctor Cancelled Appointment",
        subtitle: `Your appointment with ${doctor.name} has been cancelled`,
      }),
    }),
    sendEmail({
      to: doctor.email,
      subject: "Appointment Cancellation",
      html: emailTemplate({ title: "Appointment cancelled" }),
    }),
  ]);

  return res.status(200).json({
    success: true,
    message: "Appointment cancelled successfully",
    appointment,
  });
});
