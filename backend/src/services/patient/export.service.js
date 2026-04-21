import Patient from "../../models/patient.model.js";
import Appointment from "../../models/appointments.model.js";
import Prescription from "../../models/prescription.model.js";
import Payment from '../../models/payments.model.js'
import Consultation from "../../models/consultation.model.js";

export const buildPatientExport = async (patientId) => {
  const patient = await Patient.findById(patientId).select("-password");

  if (!patient) {
    throw new Error("Patient not found");
  }

  return {
    profile: patient,

    medical_history: patient.medical_history,
    lifestyle_habits: patient.lifestyle_habits,

    appointments: await Appointment.find({ patient: patientId })
      .populate("doctor", "name email")
      .lean(),

    consultations: await Consultation.find({ patient: patientId }).lean(),

    prescriptions: await Prescription.find({ patient: patientId }).lean(),

    payments: await Payment.find({ patient: patientId }).lean(),

  };
};