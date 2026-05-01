import mongoose from "mongoose";
import Doctor from "../../models/doctor.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Appointment from "../../models/appointments.model.js";
import Payment from "../../models/payments.model.js";
import Patient from "../../models/patient.model.js";
import { createNotification } from "../user/notification.service.js";
import { createConsultationService } from "../user/consultation.service.js";
import paginate from "../../utils/paginate.js";

// -------- Helper: Build UTC Date --------
const buildUTCDate = (date, time) => {
  return new Date(`${date}T${time}:00+05:30`);
};

//-------- Get Booking Info --------
export const getBookingInfoService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).lean();
  if (!doctor) throw new Error("Doctor not found");

  const services = doctor.services.map((s) => ({
    serviceType: s.serviceType,
    fees: s.fees,
  }));

  const availabilityDocs = await DoctorAvailability.find({ doctorId }).lean();

  const availability = availabilityDocs
    .map((doc) => ({
      date: doc.dateKey,
      slots: doc.slots
        .filter((slot) => slot.status === "available")
        .map((slot) => {
          const start = new Date(slot.startAt);
          const end = new Date(slot.endAt);

          return {
            start: `${String(start.getHours()).padStart(2, "0")}:${String(
              start.getMinutes(),
            ).padStart(2, "0")}`,
            end: `${String(end.getHours()).padStart(2, "0")}:${String(
              end.getMinutes(),
            ).padStart(2, "0")}`,
          };
        }),
    }))
    .filter((d) => d.slots.length > 0);

  return {
    doctorId: doctor._id,
    doctorName: doctor.name,
    specialty: doctor.professionalInfo?.specializations?.[0] || "",
    services,
    availability,
    profileImage: doctor.profilePicture,
  };
};

// -------- Book Appointment --------
export const bookAppointmentService = async (data, patientId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { doctorId, date, time, reason, orderId } = data;

    if (!doctorId || !date || !time || !reason) {
      throw new Error("Missing required fields");
    }

    const doctor = await Doctor.findById(doctorId).select("email name");
    const patient = await Patient.findById(patientId).select("email name");

    if (!doctor || !patient) {
      throw new Error("Doctor or patient not found");
    }

    const slotStartUTC = buildUTCDate(date, time);

    /* -------- Verify payment -------- */
    const payment = await Payment.findOne({
      orderId: orderId?.razorpay_order_id || orderId,
      patient: patientId,
      status: "verified",
    });

    if (!payment) throw new Error("Payment not verified");

    /* -------- Atomic slot locking -------- */
    const availabilityUpdate = await DoctorAvailability.findOneAndUpdate(
      {
        doctorId,
        dateKey: date,
        "slots.startAt": slotStartUTC,
        "slots.status": "available",
      },
      {
        $set: {
          "slots.$.status": "booked",
          "slots.$.appointmentId": payment.appointment, // important linkage
        },
      },
      { new: true, session },
    );

    if (!availabilityUpdate) {
      throw new Error("Time slot already booked or unavailable");
    }

    //---------------- store date in utc--------
    const appointmentDate = buildUTCDate(date, time);

    /* -------- Update appointment -------- */
    const appointment = await Appointment.findByIdAndUpdate(
      payment.appointment,
      {
        status: "confirmed",
        appointmentDate,
        timeSlot: time,
        reason,
        isActive: true,
      },
      { new: true, session },
    );

    if (!appointment) throw new Error("Appointment not found");

    /* -------- Create consultation -------- */
    await createConsultationService({
      appointmentId: appointment._id,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    /* -------- Notifications -------- */
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

    return { appointment, doctor, patient };
  } catch (err) {
    console.error("BOOK APPOINTMENT ERROR:", err);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw err;
  }
};
/* -------- Get All Appointments -------- */
export const getAllAppointmentsService = async (
  patientId,
  { page = 1, limit = 5, status },
) => {
  const query = { patient: patientId };

  if (status && status !== "all") {
    const statusMap = {
      confirmed: "confirmed",
      history: "completed",
      cancelled: "cancelled",
    };

    if (statusMap[status]) {
      query.status = statusMap[status];
    }
  }

  return await paginate({
    model: Appointment,
    query,
    page,
    limit,
    sort: { createdAt: -1 },
    populate: {
      path: "doctor",
      select: "name profilePicture professionalInfo.specializations",
    },
  });
};

/* -------- Get Appointment By ID -------- */
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

/* -------- Cancel Appointment -------- */
export const cancelAppointmentService = async (id, patientId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const appointment = await Appointment.findById(id)
      .populate("doctor", "name")
      .populate("patient", "name");

    if (!appointment) throw new Error("Appointment not found");

    if (appointment.patient._id.toString() !== patientId) {
      throw new Error("Unauthorized action");
    }

    if (appointment.status === "completed") {
      throw new Error("Cannot cancel completed appointment");
    }

    if (appointment.status === "cancelled") {
      throw new Error("Already cancelled");
    }

    const dateKey = appointment.appointmentDate.toISOString().split("T")[0];

    const slotStartUTC = buildUTCDate(dateKey, appointment.timeSlot);

    /* Unlock slot */
    await DoctorAvailability.updateOne(
      {
        doctorId: appointment.doctor._id,
        dateKey,
        "slots.startAt": slotStartUTC,
      },
      {
        $set: {
          "slots.$.status": "available",
        },
      },
      { session },
    );

    /* Update appointment */
    appointment.status = "cancelled";
    appointment.cancelledBy = "patient";

    await appointment.save({ session });

    await session.commitTransaction();
    session.endSession();

    /* Notifications */
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

    return appointment;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
