import mongoose from "mongoose";
import Doctor from "../../models/doctor.model.js";
import Availability from "../../models/availability.model.js";
import Appointment from "../../models/appointments.model.js";
import { isAppointmentActionAllowed } from "../../utils/appointmentAction.js";

//-------------- Get booking info ----------------
export const getBookingInfo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const doctor = await Doctor.findById(id).lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (doctor.isBlocked || doctor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Doctor not available for booking",
      });
    }

    // -------- Extract Services --------
    const services = doctor.services.map((service) => ({
      serviceType: service.serviceType,
      fees: service.fees,
    }));

    // -------- Get ALL availability documents --------
    const availabilityDocs = await Availability.find({
      doctorId: doctor._id,
    }).lean();

    // -------- Format for frontend --------
    const availability = availabilityDocs.map((doc) => ({
      date: doc.date,
      slots: doc.slots
        .filter((slot) => !slot.isBooked) // only free slots
        .map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
    }));

    const bookingInfo = {
      doctorId: doctor._id,
      doctorName: doctor.name,
      specialty: doctor.professionalInfo?.specializations?.[0] || "",
      services,
      availability,
    };

    return res.status(200).json({
      success: true,
      bookingInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//------------------------ Book Appointment -----------------------
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, notes, serviceType } = req.body;
    const patientId = req.user.id;

    // ---------------- Validation ----------------
    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const appointmentDate = new Date(date);

    // ---------------- Update availability ----------------
    const availabilityUpdate = await mongoose
      .model("DoctorAvailability")
      .findOneAndUpdate(
        {
          doctorId,
          date: appointmentDate,
          "slots.startTime": time,
          "slots.isBooked": false, // ensures not already booked
        },
        {
          $set: {
            "slots.$.isBooked": true,
          },
        },
        { new: true },
      );

    if (!availabilityUpdate) {
      return res.status(409).json({
        success: false,
        message: "Time slot already booked or unavailable",
      });
    }

    // ----------------  Create appointment ----------------
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      appointmentDate,
      timeSlot: time,
      serviceType,
      reason,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to book appointment",
    });
  }
};

//------------------ Get all appointments ------------------

export const getAllAppointments = async (req, res) => {
  try {
    const { id } = req.user;
    const appointments = await Appointment.find({ patient: id }).populate(
      "doctor",
      "name profilePicture professionalInfo.specializations",
    );
    res.status(200).json({
      success: true,
      message: "Appointments loaded successfully",
      appointments,
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
    const mapAppointmentActionToStatus = (action) => {
      const actionMap = {
        confirm: "confirmed",
        cancel: "cancelled",
        "re-schedule": "pending",
        complete: "completed",
      };

      return actionMap[action] || null;
    };

    const { id: appointmentId } = req.params;
    const { status } = req.body;

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
    appointment.cancelledBy = "patient";

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
