import Wallet from "../../models/wallet.model.js";
import Transaction from "../../models/transaction.model.js";
import mongoose from "mongoose";
import Appointment from "../../models/appointments.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from '../../models/payments.model.js'
import Admin from '../../models/admin.model.js'

//----------- Get patients Wallet and transactions ------------
export const getPatientWallet = async (req, res) => {
  try {
    const { id: patientId } = req.user;

    let wallet = await Wallet.findOne({ userId: patientId, role: "patient" });
    const transactions = (await Transaction.find({ wallet: wallet._id })).sort(
      (a, b) => b.createdAt - a.createdAt,
    );

    if (!wallet) {
      wallet = await Wallet.create({
        userId: patientId,
        role: "patient",
        balance: 0,
        transactions: [],
      });
    }

    res.json({
      success: true,
      wallet,
      transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet info",
    });
  }
};

//---------------- Refund controller -----------------
export const refundToWallet = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: patientId } = req.user;
    const { appointmentId, amount } = req.body;

    if (!appointmentId || !amount || amount <= 0) {
      throw new Error("Invalid refund details");
    }

    //----------- Check if appointment exists ----------
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found for this patient");
    }

    //------------ Get / create Wallet ---------------
    let patientWallet = await Wallet.findOne({
      userId: patientId,
      role: "patient",
    }).session(session);

    if (!patientWallet) {
      patientWallet = await Wallet.create(
        { userId: patientId, role: "patient", balance: 0 },
        { session },
      );
    }

    let admin = await Admin.findOne({role:'admin'})
    let adminWallet = await Wallet.findOne({
      role:'admin'
    }).session(session);

    if(!adminWallet) {
      adminWallet = await Wallet.create({
        userId:admin._id,
        role:'admin',
        balance:0
      },{session})
    }

    //------------- Create a transaction ---------------
    const transaction = await Transaction.create(
      [
        {
          wallet: patienttWallet._id,
          type: "credit",
          amount,
          referenceType: "refund",
          referenceId: appointment._id,
          notes: `Refund for cancelled appointment ${appointment._id}`,
        },
      ],
      { session },
    );

    //------------- Update Wallet  -------------
    patientWallet.balance += amount;
    await patientWallet.save({ session });

    adminWallet.balance -= amount;
    await adminWallet.save({session})

    //----------- Find payment related to appointment ------------
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

    res.status(200).json({
      success: true,
      message: "Refund credited to wallet",
      patientWallet,
      transaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message || "Refund failed",
    });
  }
};

//-------------- create Wallet order ---------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createWalletOrder = async (req, res) => {
  try {
    const { amount, notes } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount, // in paise
      currency: "INR",
      receipt: `wallet_topup_${Date.now()}`,
      notes: {
        purpose: "Wallet top-up",
        description: notes || "",
      },
    });

    //----------------- Save in DB ------------

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create wallet order" });
  }
};

//------------- Verify Wallet payment -------------
export const verifyWalletPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
    } = req.body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !amount
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment data" });
    }

    //---------- verify signature ---------------
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // ------------------- Add fund to Wallet ----------------
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user.id,
        role: "patient",
        balance: 0,
        transactions: [],
      });
    }

    wallet.balance += amount;
    await wallet.save();

    //------------- create transaction record ------------
    await Transaction.create({
      wallet: wallet._id,
      type: "credit",
      amount,
      referenceType: "topup",
      referenceId: req.user.id,
      notes: "Wallet top-up via Razorpay",
    });

    res.json({ success: true, message: "Wallet credited successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
