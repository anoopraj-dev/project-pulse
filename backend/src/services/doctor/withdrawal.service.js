import Wallet from "../../models/wallet.model.js";
import Withdrawal from "../../models/withdrawal.model.js";
import Transaction from "../../models/transaction.model.js";

export const requestWithdrawalService = async ({
  doctorId,
  amount,
  bankDetails,
}) => {
  //----------- Get Wallet -------
  const wallet = await Wallet.findOne({ userId: doctorId });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  //------------ Validate Balance ------------
  if (wallet.balance < amount * 100) {
    throw new Error("Insufficient balance");
  }

  //-------------- Create withdrawl -----------
  const withdrawal = await Withdrawal.create({
    doctor: doctorId,
    amount: amount * 100,
    bankDetails,
    status: "pending",
  });

  return withdrawal;
};

export const processWithdrawalService = async (withdrawalId) => {
  const withdrawal = await Withdrawal.findOneAndUpdate(
    { _id: withdrawalId, status: "pending" },
    { status: "processing" },
    { new: true },
  );

  if (!withdrawal) {
    throw new Error("Already processed or invalid");
  }

  if (withdrawal.amount < 100) throw new Error("Minimum withdrawal is 100");

  //-------------- Mark processing ------------
  withdrawal.status = "processing";
  await withdrawal.save();

  try {
    // To do:  integrate razorpay payout
    //-------- Get Wallet ------------
    const wallet = await Wallet.findOne({
      userId: withdrawal.doctor,
    });

    if (!wallet || wallet.balance < withdrawal.amount) {
      throw new Error("Insufficient balance at processing");
    }

    //----------- Deduct wallet ----------
    wallet.balance -= withdrawal.amount;
    await wallet.save();

    //------------- Create Transaction -------
    await Transaction.create({
      wallet: wallet._id,
      type: "debit",
      amount: withdrawal.amount,
      referenceType: "withdrawal",
      referenceId: withdrawal._id,
      notes: "Doctor withdrawal",
    });

    //------------ Mark processed ---------
    withdrawal.status = "processed";
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    return withdrawal;
  } catch (error) {
    //------------- Mark failed -------
    withdrawal.status = "failed";
    withdrawal.failureReason = error.message;
    await withdrawal.save();

    throw error;
  }
};
