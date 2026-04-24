import { getDoctorWalletService } from "../../services/doctor/wallet.service.js";

// ---------------- GET DOCTOR WALLET ----------------
export const doctorWallet = async (req, res) => {
  try {
    const doctorId = req.user.id; 

    const {page,limit} = req.query;

    const pageNum = Math.max(1,parseInt(page) ||1);
    const limitNum = Math.min(20,Math.max(1,parseInt(limit) || 5));

    const result = await getDoctorWalletService(doctorId, {
      page: pageNum,
      limit: limitNum,
    });

    return res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      wallet:result.wallet,
      transactions:result.transactions,
    });
  } catch (error) {
    console.error("Get Doctor Wallet Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch wallet",
    });
  }
};