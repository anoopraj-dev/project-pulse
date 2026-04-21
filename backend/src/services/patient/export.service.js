// import Patient from "../../models/patient.model.js";
// import Appointment from "../../models/appointments.model.js";
// import Prescription from "../../models/prescription.model.js";
// import Payment from '../../models/payments.model.js'
// import Consultation from "../../models/consultation.model.js";

// export const buildPatientExport = async (patientId) => {
//   const patient = await Patient.findById(patientId).select("-password");

//   if (!patient) {
//     throw new Error("Patient not found");
//   }

//   return {
//     profile: patient,

//     medical_history: patient.medical_history,
//     lifestyle_habits: patient.lifestyle_habits,

//     appointments: await Appointment.find({ patient: patientId })
//       .populate("doctor", "name email")
//       .lean(),

//     consultations: await Consultation.find({ patient: patientId }).lean(),

//     prescriptions: await Prescription.find({ patient: patientId }).lean(),

//     payments: await Payment.find({ patient: patientId }).lean(),

//   };
// };


import Patient from "../../models/patient.model.js";
import Appointment from "../../models/appointments.model.js";
import Prescription from "../../models/prescription.model.js";
import Payment from "../../models/payments.model.js";
import Consultation from "../../models/consultation.model.js";

export const buildPatientExport = async (patientId) => {
  // ------------ Patient ----------------
  const patient = await Patient.findById(patientId).select("-password");

  if (!patient) {
    throw new Error("Patient not found");
  }

  // ------------ Appointments -----------
  const appointments = await Appointment.find({ patient: patientId })
    .populate("doctor", "name email")
    .lean();

  // ------------ Consultations ----------
  const consultations = await Consultation.find({ patient: patientId }).lean();

  // ------------ Prescriptions ----------
  const prescriptions = await Prescription.find({ patient: patientId })
    .populate("doctor", "name")
    .lean();

  // ------------ Payments (EXPENSES) -----
  const payments = await Payment.find({ patient: patientId })
    .populate("doctor", "name")
    .lean();

  // ------------- Expense Calculation -------
  const totalExpenses = payments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  //----------- Stats ----------
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