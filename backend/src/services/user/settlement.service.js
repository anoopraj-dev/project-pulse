import Consultation from "../../models/consultation.model.js";
import Payment from "../../models/payments.model.js";
import Settlement from "../../models/settlement.model.js";
import { calculateSettlement } from "../../utils/settlement.js";

// ---------------- WALLET SERVICES ----------------
import { creditDoctorWalletService } from "../doctor/wallet.service.js";
import { refundToWalletService } from "../patient/wallet.service.js";

export const runSettlementService = async () => {
  try {
    console.log("Settlement service started...");

    const consultations = await Consultation.find({
      isSettled: false,
      status: { $in: ["completed", "cancelled", "disconnected"] },
    });

    for (const consultation of consultations) {
      // ---------------- GET PAYMENT ----------------
      const payment = await Payment.findOne({
        appointment: consultation.appointment,
        status: { $in: ["verified", "refunded"] },
      });

      if (!payment) {
        continue;
      }

      // ---------------- CHECK ALREADY SETTLED (USING APPOINTMENT) ----------------
      const alreadySettled = await Settlement.findOne({
        appointment: consultation.appointment,
      });

      if (alreadySettled) {
        continue;
      }

      // ---------------- CALCULATE SETTLEMENT ----------------
      const settlementResult = calculateSettlement(consultation, payment);

      if (!settlementResult) {
        continue;
      }

      // ---------------- CREATE SETTLEMENT RECORD ----------------
      const settlement = await Settlement.create({
        appointment: consultation.appointment,
        doctor: consultation.doctor,
        patient: consultation.patient,
        payment: payment._id,
        ...settlementResult,
        status: "pending",
        processedAt: new Date(),
      });

      // ---------------- EXECUTE WALLET OPERATIONS ----------------
      const walletOps = [];

      // ---------------- DOCTOR PAYOUT ----------------
      if (settlementResult.doctorPayout > 0) {
        walletOps.push(
          creditDoctorWalletService({
            doctorId: consultation.doctor,
            amount: settlementResult.doctorPayout,
            referenceId: settlement._id,
            referenceType: "settlement",
            notes: "Consultation earnings",
          }),
        );
      }

      // ---------------- PATIENT REFUND (IF ANY) ----------------
      if (settlementResult.patientRefund > 0) {
        walletOps.push(
          refundToWalletService(consultation.patient, {
            appointmentId: consultation.appointment,
            amount: settlementResult.patientRefund,
          }),
        );
      }

      await Promise.all(walletOps);

      // ---------------- MARK COMPLETED ----------------
      await Promise.all([
        Consultation.findByIdAndUpdate(consultation._id, {
          isSettled: true,
        }),

        Settlement.findByIdAndUpdate(settlement._id, {
          status: "processed",
        }),

        Payment.findByIdAndUpdate(payment._id, {
          status: "settled",
        }),
      ]);
    }

    console.log("Settlement service completed");
  } catch (error) {
    console.error("Settlement service error:", error);
    throw error;
  }
};
