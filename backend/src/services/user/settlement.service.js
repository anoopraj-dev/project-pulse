import Consultation from "../../models/consultation.model.js";
import Payment from "../../models/payments.model.js";
import Settlement from "../../models/settlement.model.js";
import { calculateSettlement } from "../../utils/settlement.js";

// ---------------- WALLET SERVICES ----------------
import { creditDoctorWalletService } from "../doctor/wallet.service.js";
import { refundToWalletService } from "../patient/wallet.service.js";
import { createNotification } from "../user/notification.service.js";
import { viewReceiptService } from "../user/receipt.service.js";
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";

export const runSettlementService = async () => {
  try {
    console.log("Settlement service started...");

    const consultations = await Consultation.find({
      isSettled: false,
      status: { $in: ["completed", "cancelled", "disconnected"] },
    }).populate("doctor").populate("patient");

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

      if (settlementResult.doctorPayout > 0) {
        (async () => {
          try {
            // 1. In-app notification
            await createNotification({
              userId: consultation.doctor._id.toString(),
              role: "doctor",
              title: "Payment Settled",
              message: `Earnings of ₹ ${(settlementResult.doctorPayout / 100).toFixed(2)} have been credited to your wallet for consultation.`,
            });

            // 2. Generate PDF and send email
            const pdfBuffer = await viewReceiptService(payment._id, "", "doctor");

            await sendEmail({
              from: `"PULSE360" <${process.env.GMAIL_USER}>`,
              to: consultation.doctor.email,
              subject: "Payout Settlement Statement - PULSE360",
              html: emailTemplate({
                title: "Payment Settled",
                subtitle: "PULSE360 Payout Update",
                body: `<p>Hello <strong>Dr. ${consultation.doctor.name}</strong>,</p>
                       <p>Your earnings of <strong>₹ ${(settlementResult.doctorPayout / 100).toFixed(2)}</strong> for the consultation have been successfully settled and credited to your wallet.</p>
                       <p>Please find your detailed payout statement attached to this email.</p>`,
                highlightText: `Settled Amount: ₹ ${(settlementResult.doctorPayout / 100).toFixed(2)}`,
                highlightType: "success"
              }),
              attachments: [
                { filename: `payout-statement-${settlement._id}.pdf`, content: pdfBuffer }
              ]
            });
          } catch (err) {
            console.error("Doctor settlement notification/email failed:", err.message);
          }
        })();
      }
    }

    console.log("Settlement service completed");
  } catch (error) {
    console.error("Settlement service error:", error);
    throw error;
  }
};
