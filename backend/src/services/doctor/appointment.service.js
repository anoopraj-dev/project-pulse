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
import { viewReceiptService } from "../user/receipt.service.js";
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";

const sendRefundNotificationAndEmail = async ({ patientId, appointmentId, amount }) => {
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) return;

    const payment = await Payment.findOne({ appointment: appointmentId });
    if (!payment) return;

    // 1. Notification
    try {
      await createNotification({
        userId: patient._id.toString(),
        role: "patient",
        title: "Refund Processed",
        message: `A refund of ₹ ${(amount / 100).toFixed(2)} has been credited to your wallet.`,
      });
    } catch (err) {
      console.error("Refund notification failed:", err.message);
    }

    // 2. Email Receipt
    try {
      const pdfBuffer = await viewReceiptService(payment._id, "", "patient");

      await sendEmail({
        from: `"PULSE360" <${process.env.GMAIL_USER}>`,
        to: patient.email,
        subject: "Refund Receipt - PULSE360",
        html: emailTemplate({
          title: "Refund Processed",
          subtitle: "PULSE360 Refund Update",
          body: `<p>Hello <strong>${patient.name}</strong>,</p>
                 <p>A refund of <strong>₹ ${(amount / 100).toFixed(2)}</strong> has been credited to your wallet for appointment <strong>#${appointmentId.toString().slice(-6).toUpperCase()}</strong>.</p>
                 <p>Please find your refund receipt attached to this email.</p>`,
          highlightText: `Refunded: ₹ ${(amount / 100).toFixed(2)}`,
          highlightType: "success"
        }),
        attachments: [
          { filename: `refund-receipt-${payment.receipt}.pdf`, content: pdfBuffer }
        ]
      });
    } catch (err) {
      console.error("Refund email failed:", err.message);
    }
  } catch (err) {
    console.error("Refund notifier helper failed:", err.message);
  }
};

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

    let refundProcessed = false;
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
      refundProcessed = true;
    }

    await session.commitTransaction();
    session.endSession();

    if (refundProcessed && payment) {
      sendRefundNotificationAndEmail({
        patientId: appointment.patient,
        appointmentId: appointment._id,
        amount: payment.amount,
      }).catch((err) => console.error("Refund notification background error:", err));
    }
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
