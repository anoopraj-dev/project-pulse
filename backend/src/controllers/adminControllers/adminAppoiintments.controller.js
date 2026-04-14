
import {
  getAllAppointmentsService,
  setAdminAppointmentStatusService,
} from "../../services/admin/appointment.service.js";

//-------------- Get appointments ------------

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await getAllAppointmentsService(req.query);

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

//--------------------- Set Appointment Status --------------------

export const setAdminAppointmentStatus = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await setAdminAppointmentStatusService({
      appointmentId,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Appointment status updated by admin successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Appointment not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Appointment ID missing") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
    });
  }
};
