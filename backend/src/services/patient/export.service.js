
import Patient from "../../models/patient.model.js";
import Appointment from "../../models/appointments.model.js";
import Prescription from "../../models/prescription.model.js";
import Payment from "../../models/payments.model.js";
import Consultation from "../../models/consultation.model.js";

export const buildPatientExport = async (patientId) => {
  // ---------------- PATIENT ----------------
  const patient = await Patient.findById(patientId).select("-password");

  if (!patient) {
    throw new Error("Patient not found");
  }

  // ---------------- APPOINTMENTS ----------------
  const appointments = await Appointment.find({ patient: patientId })
    .populate("doctor", "name email")
    .lean();

  // ---------------- CONSULTATIONS ----------------
  const consultations = await Consultation.find({ patient: patientId }).lean();

  // ---------------- PRESCRIPTIONS ----------------
  const prescriptions = await Prescription.find({ patient: patientId })
    .populate("doctor", "name")
    .lean();

  // ---------------- PAYMENTS (EXPENSES) ----------------
  const payments = await Payment.find({ patient: patientId })
    .populate("doctor", "name")
    .lean();

  // ---------------- EXPENSE CALCULATION ----------------
  const totalExpenses = payments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  // ---------------- STATS ----------------
  const stats = {
    totalAppointments: appointments.length,
    totalConsultations: consultations.length,
    totalPrescriptions: prescriptions.length,
    totalDoctors: new Set(
      appointments.map(a => a.doctor?._id?.toString())
    ).size,
  };

  return {
    profile: patient,
    medical_history: patient.medical_history,
    lifestyle_habits: patient.lifestyle_habits,
    stats,
    expenses: {
      total: totalExpenses,
      count: payments.length,
    },
    appointments,
    consultations,
    prescriptions,
    payments,
  };
};