import { getDoctorWalletService } from "../../services/doctor/wallet.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// ---------------- GET DOCTOR WALLET ----------------
export const doctorWallet = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(20, Math.max(1, parseInt(limit) || 5));

  const result = await getDoctorWalletService(req.user.id, {
    page: pageNum,
    limit: limitNum,
  });

  return res.status(200).json({
    success: true,
    message: "Wallet fetched successfully",
    wallet: result.wallet,
    transactions: result.transactions,
  });
});