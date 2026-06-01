import Wallet from "../../models/wallet.model.js";
import Transaction from "../../models/transaction.model.js";
import mongoose from "mongoose";
import Appointment from "../../models/appointments.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../../models/payments.model.js";
import Admin from "../../models/admin.model.js";
import Patient from "../../models/patient.model.js";
import { viewReceiptService } from "../user/receipt.service.js";
import { createNotification } from "../user/notification.service.js";
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";

const sendRefundNotificationAndEmail = async ({ patientId, appointmentId, amount }) => {
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) return;

    const payment = await Payment.findOne({ appointment: appointmentId });
    if (!payment) return;

    // 1. Notification
    try {
      await createNotification({
        userId: patient._id.toString(),
        role: "patient",
        title: "Refund Processed",
        message: `A refund of ₹ ${(amount / 100).toFixed(2)} has been credited to your wallet.`,
      });
    } catch (err) {
      console.error("Refund notification failed:", err.message);
    }

    // 2. Email Receipt
    try {
      const pdfBuffer = await viewReceiptService(payment._id, "", "patient");

      await sendEmail({
        from: `"PULSE360" <${process.env.GMAIL_USER}>`,
        to: patient.email,
        subject: "Refund Receipt - PULSE360",
        html: emailTemplate({
          title: "Refund Processed",
          subtitle: "PULSE360 Refund Update",
          body: `<p>Hello <strong>${patient.name}</strong>,</p>
                 <p>A refund of <strong>₹ ${(amount / 100).toFixed(2)}</strong> has been credited to your wallet for appointment <strong>#${appointmentId.toString().slice(-6).toUpperCase()}</strong>.</p>
                 <p>Please find your refund receipt attached to this email.</p>`,
          highlightText: `Refunded: ₹ ${(amount / 100).toFixed(2)}`,
          highlightType: "success"
        }),
        attachments: [
          { filename: `refund-receipt-${payment.receipt}.pdf`, content: pdfBuffer }
        ]
      });
    } catch (err) {
      console.error("Refund email failed:", err.message);
    }
  } catch (err) {
    console.error("Refund notifier helper failed:", err.message);
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------------- GET WALLET ----------------
export const getPatientWalletService = async (patientId) => {
  let wallet = await Wallet.findOne({ userId: patientId, role: "patient" });

  if (!wallet) {
    wallet = await Wallet.create({
      userId: patientId,
      role: "patient",
      balance: 0,
    });
  }

  const transactions = await Transaction.find({ wallet: wallet._id }).sort({
    createdAt: -1,
  });

  return { wallet, transactions };
};

// ---------------- REFUND ----------------
export const refundToWalletService = async (patientId, body) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { appointmentId, amount } = body;

    if (!appointmentId || !amount || amount <= 0) {
      throw new Error("Invalid refund details");
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error("Appointment not found");

    let patientWallet = await Wallet.findOne({
      userId: patientId,
      role: "patient",
    }).session(session);

    if (!patientWallet) {
      patientWallet = await Wallet.create(
        [{ userId: patientId, role: "patient", balance: 0 }],
        { session }
      );
      patientWallet = patientWallet[0];
    }

    const admin = await Admin.findOne({ role: "admin" });

    let adminWallet = await Wallet.findOne({ role: "admin" }).session(session);

    if (!adminWallet) {
      adminWallet = await Wallet.create(
        [{ userId: admin._id, role: "admin", balance: 0 }],
        { session }
      );
      adminWallet = adminWallet[0];
    }

    const transaction = await Transaction.create(
      [
        {
          wallet: patientWallet._id, // fixed typo here
          type: "credit",
          amount,
          referenceType: "refund",
          referenceId: appointment._id,
          notes: `Refund for appointment ${appointment._id}`,
        },
      ],
      { session }
    );

    patientWallet.balance += amount;
    await patientWallet.save({ session });

    adminWallet.balance -= amount;
    await adminWallet.save({ session });

    const payment = await Payment.findOne({
      appointment: appointment._id,
    }).session(session);

    if (payment) {
      payment.status = "refunded";
      payment.refundedAt = new Date();
      await payment.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    sendRefundNotificationAndEmail({
      patientId,
      appointmentId,
      amount,
    }).catch((err) => console.error("Refund notification background error:", err));

    return { patientWallet, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ---------------- CREATE WALLET ORDER ----------------
export const createWalletOrderService = async ({ amount, notes }) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `wallet_topup_${Date.now()}`,
    notes: {
      purpose: "Wallet top-up",
      description: notes || "",
    },
  });

  return order;
};

// ---------------- VERIFY PAYMENT ----------------
export const verifyWalletPaymentService = async (userId, body) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
  } = body;

  if (
    !razorpay_payment_id ||
    !razorpay_order_id ||
    !razorpay_signature ||
    !amount
  ) {
    throw new Error("Missing payment data");
  }

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    throw new Error("Invalid signature");
  }

  let wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      role: "patient",
      balance: 0,
    });
  }

  wallet.balance += amount;
  await wallet.save();

  await Transaction.create({
    wallet: wallet._id,
    type: "credit",
    amount,
    referenceType: "topup",
    referenceId: userId,
    notes: "Wallet top-up via Razorpay",
  });

  return wallet;
};