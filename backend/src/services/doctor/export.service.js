import Doctor from "../../models/doctor.model.js";
import Appointment from "../../models/appointments.model.js";
import Prescription from "../../models/prescription.model.js";
import Payment from "../../models/payments.model.js";
import Consultation from "../../models/consultation.model.js";

export const buildDoctorExport = async (doctorId) => {
  // ------------ Get doctor ----------------
  const doctor = await Doctor.findById(doctorId).select("-password");

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // ------------- Appointments ---------------
  const appointments = await Appointment.find({ doctor: doctorId })
    .populate("patient", "name email phone")
    .lean();

  // ------------- Consultations -------------
  const consultations = await Consultation.find({ doctor: doctorId }).lean();

  // ---------------- Prescriptions -----------
  const prescriptions = await Prescription.find({ doctor: doctorId })
    .populate("patient", "name")
    .lean();

  // -------------- Payments ------------------
  const payments = await Payment.find({ doctor: doctorId })
    .populate("patient", "name")
    .lean();

  // ----------- Earnings Calculation ----------
  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // ------------- Stats -----------------------
  const stats = {
    totalAppointments: appointments.length,
    totalConsultations: consultations.length,
    totalPrescriptions: prescriptions.length,
    totalPatients: new Set(
      appointments.map(a => a.patient?._id?.toString())
    ).size,
  };

  return {
    profile: doctor,
    professional_info: doctor.professionalInfo,
    services: doctor.services,
    stats,
    earnings: {
      total: totalEarnings,
      count: payments.length,
    },
    appointments,
    consultations,
    prescriptions,
    payments,
  };
};