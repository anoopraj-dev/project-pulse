import Appointment from "../../models/appointments.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Wallet from "../../models/wallet.model.js";
import Payment from "../../models/payments.model.js";
import Transaction from "../../models/transaction.model.js";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import mongoose from "mongoose";

// ---------------- Get All Appointments ----------------
export const getAllAppointmentsService = async (doctorId) => {
  const appointments = await Appointment.find({ doctor: doctorId });

  const now = new Date();

  // Find expired appointments
  const expiredIds = appointments
    .filter((appt) => {
      if (!appt.time) return false;
      if (appt.status !== "pending") return false;

      const [hours, minutes] = appt.time.split(":");
      const apptDateTime = new Date(appt.appointmentDate);
      apptDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      return apptDateTime < now;
    })
    .map((appt) => appt._id);

  // Update expired
  if (expiredIds.length > 0) {
    await Appointment.updateMany(
      { _id: { $in: expiredIds } },
      { $set: { status: "expired" } }
    );
  }

  // Fetch updated
  const updatedAppointments = await Appointment.find({ doctor: doctorId })
    .populate("patient", "name profilePicture gender")
    .sort({ appointmentDate: 1 });

  return updatedAppointments;
};

// ---------------- Get Appointment By ID ----------------
export const getDoctorAppointmentByIdService = async (id, doctorId) => {
  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid appointment ID");
  }

  const appointment = await Appointment.findOne({
    _id: id,
    doctor: doctorId,
  }).populate("patient", "name email profilePicture");

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
};

//------------ cancel appointment service -------------------

export const cancelAppointmentService = async ({ id, reason, doctorId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) throw new Error("Appointment not found");

    const patientId = appointment.patient;

    const patient = await Patient.findById(patientId).select("-password");
    const doctor = await Doctor.findById(doctorId).select("-password");

    if (!reason || !reason.trim()) {
      throw new Error("Cancellation reason is required");
    }

    if (appointment.doctor.toString() !== doctorId) {
      throw new Error("Unauthorized action");
    }

    if (appointment.status === "completed") {
      throw new Error("Completed appointment cannot be cancelled");
    }

    if (appointment.status === "cancelled") {
      throw new Error("Appointment already cancelled");
    }

    // Update appointment
    appointment.status = "cancelled";
    appointment.cancelledBy = "doctor";
    appointment.cancellationReason = reason.trim();

    await appointment.save({ session });

    // Free slot
    await DoctorAvailability.updateOne(
      {
        doctor: appointment.doctor,
        date: appointment.appointmentDate,
        "slots.time": appointment.timeSlot,
      },
      { $set: { "slots.$.isBooked": false } },
      { session }
    );

    // Refund
    const payment = await Payment.findOne({ appointment: appointment._id });

    if (payment && payment.status !== "refunded") {
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

      wallet.balance += payment.amount;
      await wallet.save({ session });

      await Transaction.create(
        [
          {
            wallet: wallet._id,
            type: "credit",
            amount: payment.amount,
            referenceType: "refund",
            referenceId: payment._id,
          },
        ],
        { session }
      );

      payment.status = "refunded";
      await payment.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return {
      appointment,
      patient,
      doctor,
      patientId,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


