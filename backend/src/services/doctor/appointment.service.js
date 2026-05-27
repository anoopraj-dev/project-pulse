import Appointment from "../../models/appointments.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Wallet from "../../models/wallet.model.js";
import Payment from "../../models/payments.model.js";
import Transaction from "../../models/transaction.model.js";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import mongoose from "mongoose";
import { createNotification } from "../user/notification.service.js";
import { expireAppointments } from "../../utils/AppointmentExpiry.js";

// ---------------- GET ALL APPOINTMENTS ----------------
export const getAllAppointmentsService = async (doctorId) => {
  await expireAppointments();

  const updatedAppointments = await Appointment.find({ doctor: doctorId })
    .populate("patient", "name profilePicture gender")
    .sort({ appointmentDate: 1, timeSlot: 1 });

  return updatedAppointments;
};

// ---------------- GET APPOINTMENT BY ID ----------------
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

// ---------------- CANCEL APPOINTMENT SERVICE ----------------

export const cancelAppointmentService = async ({ id, reason, doctorId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let appointment, doctor, patient, patientId;

  try {
    appointment = await Appointment.findById(id);
    if (!appointment) throw new Error("Appointment not found");

    patientId = appointment.patient;

    patient = await Patient.findById(patientId).select("-password");
    doctor = await Doctor.findById(doctorId).select("-password");

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

    // ---------------- CANCEL APPOINTMENT ----------------
    appointment.status = "cancelled";
    appointment.cancelledBy = "doctor";
    appointment.cancellationReason = reason.trim();

    await appointment.save({ session });

    // ---------------- FREE SLOT (STRING MATCH) ----------------
    await DoctorAvailability.updateOne(
      {
        doctorId: appointment.doctor,
        date: appointment.appointmentDate, // "YYYY-MM-DD" string
        "slots.startTime": appointment.timeSlot, // "HH:mm"
      },
      {
        $set: {
          "slots.$.isBooked": false,
        },
      },
      { session },
    );

    // ---------------- REFUND ----------------
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
        { session },
      );

      payment.status = "refunded";
      await payment.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

  // ---------------- NOTIFICATIONS ----------------
  try {
    await Promise.all([
      createNotification({
        userId: doctor?._id.toString(),
        role: "doctor",
        title: "Appointment Cancelled",
        message: `Appointment with ${patient.name} has been cancelled`,
      }),
      createNotification({
        userId: patient?._id.toString(),
        role: "patient",
        title: "Appointment Cancelled",
        message: `Appointment with ${doctor.name} has been cancelled`,
      }),
    ]);
  } catch (err) {
    console.error("Notification failed", err);
  }

  return {
    appointment,
    patient,
    doctor,
    patientId,
  };
};
