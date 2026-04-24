import Appointment from "../../models/appointments.model.js";
import Payment from "../../models/payments.model.js";
import Prescription from "../../models/prescription.model.js";
import Patient from "../../models/patient.model.js";

//------------ Dashboard Stats ---------------
export const patientDashboardStatsService = async (patientId) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

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

  // ---------------- EXPENSES (ONLY PAYMENTS) ----------------
  const paymentAgg = await Payment.aggregate([
    {
      $match: {
        appointment: { $in: completedIds },
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
  const lastMonthAppointments = await Appointment.find({
    patient: patientId,
    status: "completed",
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  }).select("_id");

  const lastMonthIds = lastMonthAppointments.map((a) => a._id);

  const lastMonthPaymentAgg = await Payment.aggregate([
    {
      $match: {
        appointment: { $in: lastMonthIds },
        status: "verified",
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
    lastMonthAppointments: lastMonthAppointments.length,
    lastMonthExpenses,
  };
};

//---------------- Upcoming appointments -------------
export const upcomingAppointmentsService = async (patientId) => {
  const now = new Date();
now.setHours(0, 0, 0, 0);

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


export const patientDashboardChartService = async (patientId) => {
  const now = new Date();

  const startDate = new Date();
  startDate.setDate(now.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  // ---------------- INIT 7 DAYS (SAFE KEY) ----------------
  const daysMap = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const key = d.toISOString().split("T")[0]; // YYYY-MM-DD (SAFE)

    daysMap[key] = {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      consultations: 0,
      expenses: 0,
    };
  }

  // ---------------- COMPLETED APPOINTMENTS ----------------
  const appointments = await Appointment.find({
    patient: patientId,
    status: "completed",
    appointmentDate: { $gte: startDate, $lte: now },
  }).select("_id appointmentDate");

  const appointmentMap = new Map();

  appointments.forEach((a) => {
    const key = new Date(a.appointmentDate).toISOString().split("T")[0];
    appointmentMap.set(a._id.toString(), key);

    if (daysMap[key]) {
      daysMap[key].consultations += 1;
    }
  });

  const appointmentIds = [...appointmentMap.keys()];

  // ---------------- PAYMENTS (ONLY THESE APPOINTMENTS) ----------------
  const payments = await Payment.find({
    appointment: { $in: appointmentIds },
    status: "verified",
  }).select("amount appointment");

  payments.forEach((p) => {
    const apptKey = appointmentMap.get(p.appointment.toString());

    if (apptKey && daysMap[apptKey]) {
      daysMap[apptKey].expenses += (p.amount || 0) / 100;
    }
  });

  return Object.values(daysMap);
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