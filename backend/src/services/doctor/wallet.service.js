import Wallet from "../../models/wallet.model.js";
import Transaction from "../../models/transaction.model.js";
import mongoose from "mongoose";

// ---------------- GET DOCTOR WALLET ----------------
export const getDoctorWalletService = async (doctorId) => {
  let wallet = await Wallet.findOne({
    userId: doctorId,
    role: "doctor",
  });

  if (!wallet) {
    wallet = await Wallet.create({
      userId: doctorId,
      role: "doctor",
      balance: 0,
    });
  }

  const transactions = await Transaction.find({
    wallet: wallet._id,
  }).sort({ createdAt: -1 });

  return { wallet, transactions };
};

// ---------------- CREDIT WALLET (SETTLEMENT / EARNINGS) ----------------
export const creditDoctorWalletService = async ({
  doctorId,
  amount,
  referenceId,
  referenceType = "settlement",
  notes = "",
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid credit amount");
    }

    let wallet = await Wallet.findOne({
      userId: doctorId,
      role: "doctor",
    }).session(session);

    if (!wallet) {
      const created = await Wallet.create(
        [
          {
            userId: doctorId,
            role: "doctor",
            balance: 0,
          },
        ],
        { session }
      );

      wallet = created[0];
    }

    const transaction = await Transaction.create(
      [
        {
          wallet: wallet._id,
          type: "credit",
          amount,
          referenceType,
          referenceId,
          notes: notes || "Doctor earnings credit",
        },
      ],
      { session }
    );

    wallet.balance += amount;
    await wallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { wallet, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ---------------- DEBIT WALLET (WITHDRAWALS) ----------------
export const debitDoctorWalletService = async ({
  doctorId,
  amount,
  referenceId = null,
  notes = "",
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid debit amount");
    }

    const wallet = await Wallet.findOne({
      userId: doctorId,
      role: "doctor",
    }).session(session);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    const transaction = await Transaction.create(
      [
        {
          wallet: wallet._id,
          type: "debit",
          amount,
          referenceType: "withdrawal",
          referenceId,
          notes: notes || "Doctor withdrawal",
        },
      ],
      { session }
    );

    wallet.balance -= amount;
    await wallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { wallet, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};