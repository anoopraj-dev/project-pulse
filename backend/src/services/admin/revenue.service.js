import Settlement from "../../models/settlement.model.js";
import Payment from "../../models/payments.model.js";
import Transaction from "../../models/transaction.model.js";

export const revenueSummaryService = async (range) => {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case "day":
      startDate.setDate(now.getDate() - 1);
      break;
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }

  //-------- PAYMENTS (INFLOW) ----------
  const paymentAgg = await Payment.aggregate([
    {
      $match: {
        status: "verified",
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        grossInflow: { $sum: "$amount" },
        paymentCount: { $sum: 1 },
      },
    },
  ]);

  const paymentData = paymentAgg[0] || {};

  //-------- SETTLEMENTS ----------
  const settlementAgg = await Settlement.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: "processed",
      },
    },
    {
      $group: {
        _id: null,
        platformProfit: { $sum: "$platformFee" },
        refunds: { $sum: "$patientRefund" },
        doctorPayouts: { $sum: "$doctorPayout" },
        settlementCount: { $sum: 1 },
        consultations: { $addToSet: "$appointment" },
      },
    },
    {
      $project: {
        platformProfit: 1,
        refunds: 1,
        doctorPayouts: 1,
        settlementCount: 1,
        consultations: { $size: "$consultations" },
      },
    },
  ]);

  const settlementData = settlementAgg[0] || {};

  //-------- REFUNDS + PENALTY (FROM TRANSACTIONS) ----------
  const refundAgg = await Transaction.aggregate([
    {
      $match: {
        referenceType: "refund",
        createdAt: { $gte: startDate },
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "referenceId",
        foreignField: "_id",
        as: "payment",
      },
    },
    { $unwind: "$payment" },
    {
      $group: {
        _id: null,
        totalRefunded: { $sum: "$amount" },
        totalOriginal: { $sum: "$payment.amount" },
      },
    },
  ]);

  const refundData = refundAgg[0] || {};

  const totalRefunded = refundData.totalRefunded || 0;
  const totalOriginal = refundData.totalOriginal || 0;

  const penalty = totalOriginal - totalRefunded;

  //-------- FINAL RESPONSE ----------
  return {
    grossVolume: paymentData.grossInflow || 0,

    platformProfit: settlementData.platformProfit || 0,

    refunds: totalRefunded,

    penalty: penalty,

    doctorPayouts: settlementData.doctorPayouts || 0,

    totalTransactions: paymentData.paymentCount || 0,

    consultations: settlementData.consultations || 0,
  };
};