import Appointment from "../../models/appointments.model.js";

//-------------- Get appointments ------------

export const getAllAppointments = async (req, res) => {
  try {
    const { status, doctorId, patientId, fromDate, toDate } = req.query;

    // Build query object
    const query = {};

    if (status) {
      query.status = status;
    }

    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;

    if (fromDate || toDate) {
      query.appointmentDate = {};
      if (fromDate) query.appointmentDate.$gte = new Date(fromDate);
      if (toDate) query.appointmentDate.$lte = new Date(toDate);
    }

    // Fetch appointments
    const appointments = await Appointment.find(query)
      .populate("patient", "name profilePicture")
      .populate("doctor", "name professionalInfo.specializations profilePicture")
      .sort({ appointmentDate: 1, timeSlot: 1 });

    // Auto-mark expired appointments
    const now = new Date();
    for (const appt of appointments) {
      if (appt.status === "pending" || appt.status === "confirmed") {
        const appointmentDateTime = new Date(
          `${appt.appointmentDate.toISOString().split("T")[0]}T${appt.timeSlot}`
        );
        if (appointmentDateTime.getTime() < now.getTime()) {
          appt.status = "expired";
          await appt.save();
        }
      }
    }

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
    const { status } = req.body; // admin chooses the status

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
      return res.status(400).json({
        success: false,
        message: "Appointment ID missing",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const mappedStatus = mapAppointmentActionToStatus(status);

    //------------- Update appointment status --------------------
    appointment.status = mappedStatus;

    // Admin actions:
    if (mappedStatus === "confirmed") {
      appointment.cancelledBy = null; // reset if confirmed
    } else if (mappedStatus === "cancelled") {
      appointment.cancelledBy = "admin"; // record admin cancelled
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment status updated by admin successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
    });
  }
};

