import Consultation from "../../models/consultation.model.js";
import Payment from "../../models/payments.model.js";
import Settlement from "../../models/settlement.model.js";
import { calculateSettlement } from "../../utils/settlement.js";

//-------- wallet services ----------
import { creditDoctorWalletService } from "../doctor/wallet.service.js";
import { refundToWalletService } from "../patient/wallet.service.js";

export const runSettlementService = async () => {
  try {
    console.log("Settlement service started...");

    const consultations = await Consultation.find({
      isSettled: false,
      status: { $in: ["completed", "cancelled", "disconnected"] },
    });

    console.log("Consultations found:", consultations.length);

    for (const consultation of consultations) {
      //----------- Get payment ------------
      const payment = await Payment.findOne({
        appointment: consultation.appointment,
        status: { $in: ["verified", "refunded"] },
      });

      if (!payment) {
        console.log("No payment found for:", consultation._id);
        continue;
      }

      //----------- Check already settled (using appointment) ------------
      const alreadySettled = await Settlement.findOne({
        appointment: consultation.appointment,
      });

      if (alreadySettled) {
        console.log("Already settled:", consultation._id);
        continue;
      }

      //----------- Calculate settlement ------------
      const settlementResult = calculateSettlement(consultation, payment);

      if (!settlementResult) {
        console.log("No settlement result for:", consultation._id);
        continue;
      }

      // ------------ CREATE SETTLEMENT RECORD -------------
      const settlement = await Settlement.create({
        appointment: consultation.appointment,
        doctor: consultation.doctor,
        patient: consultation.patient,
        payment: payment._id,
        ...settlementResult,
        status: "pending",
        processedAt: new Date(),
      });

      // ----------- EXECUTE WALLET OPERATIONS ----------------
      const walletOps = [];

      //----------- Doctor payout ------------
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

      // ---------- Patient refund (if any) ------------
      if (settlementResult.patientRefund > 0) {
        walletOps.push(
          refundToWalletService(consultation.patient, {
            appointmentId: consultation.appointment,
            amount: settlementResult.patientRefund,
          }),
        );
      }

      await Promise.all(walletOps);

      //----------- Mark completed ------------
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
