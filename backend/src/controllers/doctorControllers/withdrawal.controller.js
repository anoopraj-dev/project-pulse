import { requestWithdrawalService } from "../../services/doctor/withdrawal.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const requestWithdrawal = asyncHandler(async (req, res) => {
  const { amount, bankDetails } = req.body;

  const withdrawal = await requestWithdrawalService({
    doctorId: req.user.id,
    amount,
    bankDetails,
  });

  return res.status(201).json({
    success: true,
    message: "Withdrawal request created",
    data: withdrawal,
  });
});
