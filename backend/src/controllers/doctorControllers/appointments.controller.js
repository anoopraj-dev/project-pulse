import {
  cancelAppointmentService,
  getAllAppointmentsService,
  getDoctorAppointmentByIdService,
} from "../../services/doctor/appointment.service.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { sendEmail } from "../../config/nodemailer.js";
import { createNotification } from "../../services/user/notification.service.js";

export const getAllAppointments = async (req, res) => {
  try {
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const appointments = await getAllAppointmentsService(doctorId);

    return res.status(200).json({
      success: true,
      message: "Appointments loaded successfully",
      appointments,
    });
  } catch (error) {
    console.error("Get All Appointments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDoctorAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const appointment = await getDoctorAppointmentByIdService(id, doctorId);

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const doctorId = req.user?.id;

    const { appointment, patient, doctor, patientId } =
      await cancelAppointmentService({ id, reason, doctorId });

    // -------- Emails --------
    const patientMailOptions = {
      to: patient.email,
      subject: "Appointment Cancellation",
      html: emailTemplate({
        title: "Doctor Cancelled Appointment",
        subtitle: `Your appointment with ${doctor.name} has been cancelled`,
      }),
    };

    const doctorMailOptions = {
      to: doctor.email,
      subject: "Appointment Cancellation",
      html: emailTemplate({
        title: "Appointment cancelled",
      }),
    };

    await Promise.allSettled([
      sendEmail(patientMailOptions),
      sendEmail(doctorMailOptions),
    ]);

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel appointment",
    });
  }
};
