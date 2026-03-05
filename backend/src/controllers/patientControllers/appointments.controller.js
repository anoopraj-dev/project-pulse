import mongoose from "mongoose";
import Doctor from "../../models/doctor.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Appointment from "../../models/appointments.model.js";
import { isAppointmentActionAllowed } from "../../utils/appointmentAction.js";
import Payment from "../../models/payments.model.js";
import Wallet from '../../models/wallet.model.js'
import Transaction from '../../models/transaction.model.js'
import { refundToWallet } from "./wallet.controller.js";

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
    const availabilityDocs = await DoctorAvailability.find({
      doctorId: doctor._id,
    }).lean();

    // -------- Format for frontend --------
    const availability = availabilityDocs
      .map((doc) => {
        const freeSlots = doc.slots
          .filter((slot) => !slot.isBooked)
          .map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
          }));

        return {
          date: doc.date,
          slots: freeSlots,
        };
      })
      .filter((doc) => doc.slots.length > 0);
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
    console.log(req.body)
    const { doctorId, date, time, reason, notes, serviceType, orderId } =
      req.body;
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

    //--------------- Check payment Verification --------------
    const payment = await Payment.findOne({
      orderId,
      patient: patientId,
      status: "verified",
    });
    

    if (!payment) {
      return res.status(403).json({
        success: false,
        message: "Payment not verified",
      });
    }

    if (payment.appointment) {
  return res.status(400).json({
    success: false,
    message: "Appointment already created for this payment",
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
          "slots.isBooked": false,
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

    //---------------- Link appointment to payment --------------
    payment.appointment = appointment._id;
    await payment.save();

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

//------------------ Get single appointment ------------------
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: patientId,
    })
      .populate(
        "doctor",
        "name profilePicture professionalInfo.specializations",
      )
      .populate("patient", "name email");

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

//------------------------- CANCEL APPOINTMENTS --------------------
export const cancelAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;

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

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    // ------------- 24 hour restriction ---------------
    if (!isAppointmentActionAllowed(appointment)) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment cannot be cancelled within 24 hours of consultation.",
      });
    }

    // ---------------- Release Slot ----------------

    const appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate.setUTCHours(0, 0, 0, 0);

    await DoctorAvailability.updateOne(
      {
        doctorId: appointment.doctor,
        date: appointmentDate,
        "slots.startTime": appointment.timeSlot,
      },
      {
        $set: {
          "slots.$.isBooked": false,
        },
      },
    );

    // ---------------- Update Appointment ----------------

    appointment.status = "cancelled";
    appointment.cancelledBy = "patient";

    await appointment.save();

    //--------------- Refund to Wallet -------------------
    const amountToRefund = appointment.amount || 0;

    try {
      if(amountToRefund >0){
      await refundToWallet({
        userId:appointment.patientId,
        role:'patient',
        amount:appointment.amount,
        type:'credit',
        referenceType:'refund',
        referenceId:appointment._id,
        notes:'Appointment cancellation refund'
      })
    }
    } catch (error) {
      console.log(error)
    }

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};
