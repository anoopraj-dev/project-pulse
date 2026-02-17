import Appointment from "../../models/appointments.model.js";
import { isAppointmentActionAllowed } from "../../utils/appointmentAction.js";

//---------------- Get all appointments --------------
export const getAllAppointments = async (req, res) => {
  try {
    const { id } = req.user;

    //----------------- Fetch all appointments for this doctor ----------------
    const appointments = await Appointment.find({ doctor: id });

    const now = new Date();

    //--------------- Find IDs of appointments that should be expired ----------
    const expiredIds = appointments
      .filter((appt) => {
        if (!appt.time) return false;

        // Only expire pending appointments
        if (appt.status !== "pending") return false;

        const [hours, minutes] = appt.time.split(":");
        const apptDateTime = new Date(appt.appointmentDate);
        apptDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        return apptDateTime < now;
      })
      .map((appt) => appt._id);

    //----------------- Mark them as expired -------------
    if (expiredIds.length > 0) {
      await Appointment.updateMany(
        { _id: { $in: expiredIds } },
        { $set: { status: "expired" } },
      );
    }

    //------------- Fetch updated appointments --------------
    const updatedAppointments = await Appointment.find({ doctor: id })
      .populate("patient", "name profilePicture gender")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      message: "Appointments loaded successfully",
      appointments: updatedAppointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//------------------------- Set Appointments Status --------------------
export const setAppointmentStatus = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const { status } = req.body;

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

    //------------- Restrict actions within 24 hours to appointment---------
    if (!isAppointmentActionAllowed(appointment)) {
      return res.status(400).json({
        success: false,
        message: "Appointment changes are not allowed within 24 hours.",
      });
    }

    const mappedStatus = mapAppointmentActionToStatus(status);

    //------------- Update appointment status -------------------------------
    appointment.status = mappedStatus;
    if (mappedStatus === "cancelled") {
      appointment.cancelledBy = "doctor";
    }
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Action updated successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update action",
    });
  }
};
