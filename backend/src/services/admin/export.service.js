import Payment from "../../models/payments.model.js";
import Settlement from "../../models/settlement.model.js";
import Appointment from "../../models/appointments.model.js";
import Consultation from "../../models/consultation.model.js";
import Doctor from "../../models/doctor.model.js";

export const buildAdminRevenueExport = async (adminId,filters={}) => {

  // ---------------- PAYMENTS (GROSS INCOME) ----------------
  const payments = await Payment.find({ status: "verified" })
    .populate("patient", "name email")
    .lean();

  const grossVolume = payments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  // ---------------- SETTLEMENTS ----------------
  const settlements = await Settlement.find({ status: "processed" }).lean();

  const platformProfit = settlements.reduce(
    (sum, s) => sum + (s.platformFee || 0),
    0
  );

  const refunds = settlements.reduce(
    (sum, s) => sum + (s.patientRefund || 0),
    0
  );

  const doctorPayouts = settlements.reduce(
    (sum, s) => sum + (s.doctorPayout || 0),
    0
  );

  const penalty = settlements.reduce(
    (sum, s) => sum + (s.penalty || 0),
    0
  );

  // ---------------- APPOINTMENTS ----------------
  const appointments = await Appointment.find({})
    .select("status doctor patient appointmentDate")
    .lean();

  // ---------------- CONSULTATIONS ----------------
  const consultations = await Consultation.find({}).lean();

  // ---------------- TOP DOCTORS ----------------
  const doctorMap = {};

  appointments.forEach((a) => {
    const id = a.doctor?.toString();
    if (!id) return;

    doctorMap[id] = (doctorMap[id] || 0) + 1;
  });

  const topDoctors = await Promise.all(
    Object.entries(doctorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(async ([doctorId, count]) => {
        const doc = await Doctor.findById(doctorId)
          .select("name email")
          .lean();

        return {
          doctor: doc,
          appointmentCount: count,
        };
      })
  );

  // ---------------- SUMMARY ----------------
  const summary = {
    grossVolume,
    platformProfit,
    refunds,
    doctorPayouts,
    penalty,
    totalTransactions: payments.length,
    totalAppointments: appointments.length,
    totalConsultations: consultations.length,
    netRevenue: grossVolume - refunds,
    profit: platformProfit + penalty,
  };

  // ---------------- INSIGHTS ----------------
  const insights = {
    topDoctors,
    refundRate: grossVolume
      ? ((refunds / grossVolume) * 100).toFixed(2)
      : 0,
    payoutRatio: grossVolume
      ? ((doctorPayouts / grossVolume) * 100).toFixed(2)
      : 0,
    profitMargin: grossVolume
      ? (((platformProfit + penalty) / grossVolume) * 100).toFixed(2)
      : 0,
  };

  return {
    generatedAt: new Date(),
    summary,
    insights,
    breakdown: {
      payments,
      settlements,
      appointments,
      consultations,
    },
  };
};