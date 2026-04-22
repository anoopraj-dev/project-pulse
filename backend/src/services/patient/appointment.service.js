import mongoose from "mongoose";
import Doctor from "../../models/doctor.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Appointment from "../../models/appointments.model.js";
import Payment from "../../models/payments.model.js";
import Wallet from "../../models/wallet.model.js";
import Transaction from "../../models/transaction.model.js";
import Patient from "../../models/patient.model.js";
// import { createConsultation } from "../consultationService.js";
import { createNotification } from "../user/notification.service.js";
import { createConsultationService } from "../user/consultation.service.js";

//-------------- Get booking info ----------------
export const getBookingInfoService = async (doctorId) => {
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID");
  }

  const doctor = await Doctor.findById(doctorId).lean();
  if (!doctor) throw new Error("Doctor not found");

  if (doctor.isBlocked || doctor.status !== "approved") {
    throw new Error("Doctor not available for booking");
  }

  const services = doctor.services.map((s) => ({
    serviceType: s.serviceType,
    fees: s.fees,
  }));

  const availabilityDocs = await DoctorAvailability.find({
    doctorId: doctor._id,
  }).lean();

  const availability = availabilityDocs
    .map((doc) => {
      const freeSlots = doc.slots
        .filter((slot) => !slot.isBooked)
        .map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
        }));

      return { date: doc.date, slots: freeSlots };
    })
    .filter((doc) => doc.slots.length > 0);

  return {
    doctorId: doctor._id,
    doctorName: doctor.name,
    specialty: doctor.professionalInfo?.specializations?.[0] || "",
    services,
    availability,
    profileImage: doctor.profilePicture,
  };
};

//---------------- Book Appointment ----------------
export const bookAppointmentService = async (data, patientId) => {
  let appointment, doctor, patient;

  const { doctorId, date, time, reason, orderId } = data;

  if (!doctorId || !date || !time || !reason) {
    throw new Error("Missing required fields");
  }

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID");
  }

  doctor = await Doctor.findById(doctorId).select("email name");
  patient = await Patient.findById(patientId).select("email name");

  const appointmentDate = new Date(date);

  const payment = await Payment.findOne({
    orderId: orderId?.razorpay_order_id || orderId,
    patient: patientId,
    status: "verified",
  });

  if (!payment) throw new Error("Payment not verified");

  const availabilityUpdate = await DoctorAvailability.findOneAndUpdate(
    {
      doctorId,
      date: appointmentDate,
      "slots.startTime": time,
      "slots.isBooked": false,
    },
    { $set: { "slots.$.isBooked": true } },
    { new: true },
  );

  if (!availabilityUpdate) {
    throw new Error("Time slot already booked or unavailable");
  }
  appointment = await Appointment.findByIdAndUpdate(
    payment.appointment._id,
    { status: "confirmed" },
    { new: true },
  );

  await createConsultationService({
    appointmentId: appointment._id,
  });

  //-------------- Notification ------------
  try {
    await Promise.all([
      createNotification({
        userId: patient._id.toString(),
        role: "patient",
        title: "Appointment Confirmed",
        message: `Your appointment with Dr. ${doctor.name} is confirmed`,
      }),
      createNotification({
        userId: doctor._id.toString(),
        role: "doctor",
        title: "New Appointment",
        message: `New appointment booked by ${patient.name}`,
      }),
    ]);
  } catch (error) {
    console.log("Notification failed", error);
  }

  return { appointment, doctor, patient };
};

//---------------- Get all appointments ----------------
export const getAllAppointmentsService = async (patientId) => {
  return await Appointment.find({ patient: patientId })
    .sort({ createdAt: -1 })
    .populate("doctor", "name profilePicture professionalInfo.specializations");
};

//---------------- Get appointment by ID ----------------
export const getAppointmentByIdService = async (id, patientId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid appointment ID");
  }

  const appointment = await Appointment.findOne({
    _id: id,
    patient: patientId,
  })
    .populate("doctor", "name profilePicture professionalInfo.specializations")
    .populate("patient", "name email")
    .populate("consultation", "_id status");

  if (!appointment) throw new Error("Appointment not found");

  return appointment;
};

//---------------- Cancel appointment ----------------
export const cancelAppointmentService = async (id, patientId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let appointment;

  try {
    appointment = await Appointment.findById(id)
      .populate("patient", "name")
      .populate("doctor", "name");

    if (!appointment) throw new Error("Appointment not found");
    if (appointment.patient._id.toString() !== patientId)
      throw new Error("Unauthorized action");

    if (appointment.status === "completed")
      throw new Error("Completed appointment cannot be cancelled");

    if (appointment.status === "cancelled")
      throw new Error("Appointment already cancelled");

    const appointmentDateTime = new Date(appointment.appointmentDate);
    const [hours, minutes] = appointment.timeSlot.split(":");
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const hoursLeft = (appointmentDateTime - new Date()) / (1000 * 60 * 60);

    let refundPercentage;
    if (hoursLeft > 24) refundPercentage = 1;
    else if (hoursLeft > 6) refundPercentage = 0.8;
    else if (hoursLeft > 2) refundPercentage = 0.5;
    else throw new Error("Cannot cancel within 2 hours");

    appointment.status = "cancelled";
    appointment.cancelledBy = "patient";
    appointment.cancellationReason = "Patient cancelled";

    await appointment.save({ session });

    await DoctorAvailability.updateOne(
      {
        doctorId: appointment.doctor,
        date: appointment.appointmentDate,
        "slots.startTime": appointment.timeSlot,
      },
      { $set: { "slots.$.isBooked": false } },
      { session },
    );

    const payment = await Payment.findOne({ appointment: appointment._id });

    if (payment && payment.status !== "refunded") {
      const refundAmount =
        (payment.amount - payment.amount * 0.05) * refundPercentage;

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
          },
        ],
        { session },
      );

      payment.status = "refunded";
      await payment.save({ session });

      //----------- Update consultation status ------------
      await Consultation.findOneAndUpdate(
        { appointment: appointment._id },
        {
          status: "cancelled",
          endedAt: new Date(),
        },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }

  //-------------- Notifications -------------
  if (appointment?.patient && appointment?.doctor) {
    try {
      await Promise.all([
        createNotification({
          userId: appointment.patient._id.toString(),
          role: "patient",
          title: "Appointment Cancelled",
          message: `Your appointment with Dr. ${appointment.doctor.name} has been cancelled`,
        }),
        createNotification({
          userId: appointment.doctor._id.toString(),
          role: "doctor",
          title: "Appointment Cancelled",
          message: `Appointment with ${appointment.patient.name} has been cancelled`,
        }),
      ]);
    } catch (error) {
      console.log("Notification failed", error);
    }
  }

  return appointment;
};
