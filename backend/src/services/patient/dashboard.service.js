import mongoose from "mongoose";
import Appointment from "../../models/appointments.model.js";
import Payment from "../../models/payments.model.js";
import Prescription from "../../models/prescription.model.js";
import Patient from "../../models/patient.model.js";
import { getStartOfTodayIndia } from "../../utils/timeUtils.js";

//------------ Dashboard Stats ---------------
export const patientDashboardStatsService = async (patientId) => {
  const now = getStartOfTodayIndia();

  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // ---------------- APPOINTMENTS ----------------
  const totalAppointments = await Appointment.countDocuments({
    patient: patientId,
  });

  const completedAppointments = await Appointment.find({
    patient: patientId,
    status: "completed",
  }).select("_id createdAt");

  const completedIds = completedAppointments.map((a) => a._id);

  const upcoming = await Appointment.countDocuments({
    patient: patientId,
    appointmentDate: { $gte: now },
    status: { $in: ["confirmed", "pending"] },
  });

  // ---------------- EXPENSES (ALL VERIFIED PAYMENTS) ----------------
  const paymentAgg = await Payment.aggregate([
    {
      $match: {
        patient: new mongoose.Types.ObjectId(patientId),
        status: "verified",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }, // paise
      },
    },
  ]);

  const expenses = (paymentAgg[0]?.total || 0) / 100; // convert to rupees

  // ---------------- LAST MONTH EXPENSES ----------------
  const lastMonthPaymentAgg = await Payment.aggregate([
    {
      $match: {
        patient: new mongoose.Types.ObjectId(patientId),
        status: "verified",
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const lastMonthExpenses =
    (lastMonthPaymentAgg[0]?.total || 0) / 100;

  // ---------------- RESPONSE ----------------
  return {
    totalAppointments,
    consultations: completedIds.length,
    upcoming,
    expenses,
    lastMonthAppointments: 0, // Placeholder if needed, or calculate actual
    lastMonthExpenses,
  };
};

//---------------- Upcoming appointments -------------
export const upcomingAppointmentsService = async (patientId) => {
  const now = getStartOfTodayIndia();

  const appointments = await Appointment.find({
    patient: patientId,
    appointmentDate: { $gte: now },
    status: { $in: ["confirmed"] },
    
  })
    .populate("doctor", "name profilePicture specialization")
    .sort({ appointmentDate: 1 })
    .limit(10);

  return appointments.map((a) => {
    const dateObj = new Date(a.appointmentDate);

    return {
      id: a._id,
      name: a.doctor?.name || "Doctor",
      type: a.serviceType || "Consultation",
      time: a.timeSlot,
      date: dateObj.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      profilePicture: a.doctor?.profilePicture || null,
      rawDate: a.appointmentDate,
    };
  });
};


export const patientDashboardChartService = async (patientId, range = "week") => {
  const now = new Date();
  let startDate = new Date();

  // ---------------- RANGE ----------------
  if (range === "day") {
    startDate.setHours(0, 0, 0, 0);
  } else if (range === "week") {
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
  } else if (range === "month") {
    startDate.setMonth(now.getMonth() - 1);
    startDate.setHours(0, 0, 0, 0);
  } else if (range === "year") {
    startDate.setFullYear(now.getFullYear() - 1);
    startDate.setHours(0, 0, 0, 0);
  }

  // ---------------- INIT MAP ----------------
  const dataMap = {};
  let labelMap = [];

  if (range === "day") {
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00";
      dataMap[i] = { label: hour, consultations: 0, expenses: 0 };
    }
  } else if (range === "week") {
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = d.toISOString().split("T")[0];
      dataMap[key] = {
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        consultations: 0,
        expenses: 0,
      };
    }
  } else if (range === "month") {
    for (let i = 0; i < 30; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = d.toISOString().split("T")[0];
      dataMap[key] = {
        label: d.getDate().toString(),
        consultations: 0,
        expenses: 0,
      };
    }
  } else if (range === "year") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      const d = new Date(startDate);
      d.setMonth(startDate.getMonth() + i);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      dataMap[key] = {
        label: months[d.getMonth()],
        consultations: 0,
        expenses: 0,
      };
    }
  }

  // ---------------- FETCH DATA ----------------
  const appointments = await Appointment.find({
    patient: patientId,
    status: "completed",
    appointmentDate: { $gte: startDate, $lte: now },
  }).select("appointmentDate");

  appointments.forEach((a) => {
    let key;
    const date = new Date(a.appointmentDate);
    if (range === "day") key = date.getHours();
    else if (range === "year") key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    else key = date.toISOString().split("T")[0];

    if (dataMap[key]) {
      dataMap[key].consultations += 1;
    }
  });

  const payments = await Payment.find({
    patient: patientId,
    status: "verified",
    createdAt: { $gte: startDate, $lte: now },
  }).select("amount createdAt");

  payments.forEach((p) => {
    let key;
    const date = new Date(p.createdAt);
    if (range === "day") key = date.getHours();
    else if (range === "year") key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    else key = date.toISOString().split("T")[0];

    if (dataMap[key]) {
      dataMap[key].expenses += (p.amount || 0) / 100;
    }
  });

  return Object.values(dataMap);
};

//-------------- prescriptions --------------
export const patientPrescriptionsService = async (patientId) => {
  const prescriptions = await Prescription.find({ patient: patientId })
  .populate("doctor", "name")
  .sort({ createdAt: -1 })
  .limit(3);

return prescriptions.map((p) => ({
  ...p.toObject(),
  medicineSummary: p.medicines
    .map((m) => `${m.medicine} (${m.dosage}, ${m.timing})`)
    .join(", "),
}));
};


//------------- vitals ---------
export const patientVitalsService = async (patientId) => {
  return await Patient.findById(patientId).select(
    "medical_history.name medical_history.weight medical_history.height medical_history.sugarLevel medical_history.bloodPressure"
  );
};