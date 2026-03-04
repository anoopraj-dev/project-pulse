import Appointment from "../../models/appointments.model.js";
import DoctorAvailability from '../../models/availability.model.js'
import mongoose from "mongoose";

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


export const getDoctorAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id; // logged-in doctor

    // -------- Validate ID --------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    // -------- Find appointment belonging to doctor --------
    const appointment = await Appointment.findOne({
      _id: id,
      doctor: doctorId, 
    })
      .populate("patient", "name email profilePicture")

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const doctorId = req.user?.id; 
    
    console.log(req.body)
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

   
    if (appointment.doctor.toString() !== doctorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    //  Prevent invalid state changes
    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed appointment cannot be cancelled",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    // -------------------  Update Appointment -------------------
    appointment.status = "cancelled";
    appointment.cancelledBy = "doctor";
    appointment.cancellationReason = reason.trim();

    await appointment.save();

    // -------------------  Free the Slot -------------------
    await DoctorAvailability.updateOne(
      {
        doctor: appointment.doctor,
        date: appointment.appointmentDate,
        "slots.time": appointment.timeSlot,
      },
      {
        $set: { "slots.$.isBooked": false },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });

  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};