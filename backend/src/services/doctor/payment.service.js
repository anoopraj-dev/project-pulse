import mongoose from "mongoose";
import Settlement from "../../models/settlement.model.js";

export const getDoctorPaymentHistoryService = async (doctorId) => {
  const settlements = await Settlement.find({
    doctor: new mongoose.Types.ObjectId(doctorId),
  })
    .populate("payment")
    .populate("patient", "name email profilePicture")
    .populate("appointment", "appointmentDate timeSlot serviceType status")
    .sort({ createdAt: -1 });

  const payments = settlements
    .filter((s) => s.payment && s.appointment?.status !== "cancelled")
    .map((s) => ({
      ...s.payment.toObject(),
      _id:s.payment._id,
      amount: s.doctorPayout,
      platformFee: s.platformFee,
      patientRefund: s.patientRefund,
      settlementStatus: s.status,
      processedAt: s.processedAt,
      outcome: s.type,
      patient: s.patient,
      appointment: s.appointment,
      isEarning: s.doctorPayout > 0 && s.patientRefund === 0,
    }));

  return payments;
};