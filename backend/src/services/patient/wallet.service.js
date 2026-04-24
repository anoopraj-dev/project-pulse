import Wallet from "../../models/wallet.model.js";
import Transaction from "../../models/transaction.model.js";
import mongoose from "mongoose";
import Appointment from "../../models/appointments.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../../models/payments.model.js";
import Admin from "../../models/admin.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------- GET WALLET ----------
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

// -------- REFUND ----------
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

    return { patientWallet, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// -------- CREATE WALLET ORDER ----------
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

// -------- VERIFY PAYMENT ----------
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