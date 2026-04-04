
import {
  getBookingInfoService,
  bookAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  cancelAppointmentService,
} from "../../services/patient/appointment.service.js";

import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { getIO } from "../../socket.js";
import { Notification } from "../../models/notification.model.js";

//-------------- Get booking info ----------------
export const getBookingInfo = async (req, res) => {
  try {
    const bookingInfo = await getBookingInfoService(req.params.id);

    res.status(200).json({ success: true, bookingInfo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//---------------- Book Appointment ----------------
export const bookAppointment = async (req, res) => {
  try {
    const { appointment, doctor, patient } =
      await bookAppointmentService(req.body, req.user.id);

    // emails + notifications remain here (no change)
    const io = getIO();

    const patientNotification = await Notification.create({
      title: "Appointment Confirmed",
      message: `Your appointment with Dr. ${doctor.name} confirmed`,
      recipient: req.user.id,
      role: "patient",
    });

    io.to(req.user.id).emit("notification:new", patientNotification);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//---------------- Get all appointments ----------------
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await getAllAppointmentsService(req.user.id);

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//---------------- Get appointment by ID ----------------
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await getAppointmentByIdService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res.status(
      err.message.includes("Invalid") ? 400 : 404
    ).json({ success: false, message: err.message });
  }
};

//---------------- Cancel appointment ----------------
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await cancelAppointmentService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
