import Payment from "../../models/payments.model.js";

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

  const result = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ["verified", "refunded"] },
      },
    },

    {
      $group: {
        _id: null,

        revenueIn: {
          $sum: {
            $cond: [
              { $eq: ["$status", "verified"] },
              "$amount",
              0,
            ],
          },
        },

        revenueOut: {
          $sum: {
            $cond: [
              { $eq: ["$status", "refunded"] },
              "$amount",
              0,
            ],
          },
        },

        totalTransactions: { $sum: 1 },

        consultationCount: {
          $sum: {
            $cond: [
              { $ne: ["$appointment", null] },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const data = result[0] || {};

  const revenueIn = data.revenueIn || 0;
  const revenueOut = data.revenueOut || 0;

  return {
    totalRevenue: revenueIn,
    netRevenue: revenueIn - revenueOut,
    refunds: revenueOut,
    totalTransactions: data.totalTransactions || 0,
    consultations: data.consultationCount || 0,
  };
};