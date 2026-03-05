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


export const cancelAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const patientId = req.user?.id;

    if (!id) {
      throw new Error("Appointment ID is required");
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.patient.toString() !== patientId) {
      throw new Error("Unauthorized action");
    }

    if (appointment.status === "completed") {
      throw new Error("Completed appointment cannot be cancelled");
    }

    if (appointment.status === "cancelled") {
      throw new Error("Appointment already cancelled");
    }

    // -------------------  24 Hour Restriction -------------------
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const [hours, minutes] = appointment.timeSlot.split(":");
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const timeDifference = appointmentDateTime - now;

    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (timeDifference <= twentyFourHours) {
      throw new Error(
        "Appointment cannot be cancelled within 24 hours of consultation"
      );
    }

    // -------------------  Update Appointment -------------------
    appointment.status = "cancelled";
    appointment.cancelledBy = "patient";
    appointment.cancellationReason = 'Patient cancelled'

    await appointment.save({ session });

    // -------------------  Free the Slot -------------------
    await DoctorAvailability.updateOne(
      {
        doctor: appointment.doctor,
        date: appointment.appointmentDate,
        "slots.time": appointment.timeSlot,
      },
      {
        $set: { "slots.$.isBooked": false },
      },
      { session }
    );

    //-------------- Initiate refund --------------------
    const payment = await Payment.findOne({ appointment: appointment._id });

    if (payment && payment.status !== "refunded") {

      //--------------- 10% platform fee deduction ----------------
      const platformFee = payment.amount * 0.1;
      const refundAmount = payment.amount - platformFee;

      let wallet = await Wallet.findOne({
        userId: appointment.patient,
        role: "patient",
      });

      if (!wallet) {
        wallet = new Wallet({
          userId: appointment.patient,
          role: "patient",
          balance: 0,
        });
      }

      wallet.balance += refundAmount;
      await wallet.save({ session });

      await Transaction.create(
        [
          {
            wallet: wallet._id,
            type: "credit",
            amount: refundAmount,
            referenceType: "refund",
            referenceId: payment._id,
            notes: `Refund (90%) after 10% platform fee deduction for appointment #${appointment.id.toString()}`,
          },
        ],
        { session }
      );

      payment.status = "refunded";
      await payment.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully (10% platform fee deducted)",
      appointment,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Cancel Appointment (Patient) Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel appointment",
    });
  }
};