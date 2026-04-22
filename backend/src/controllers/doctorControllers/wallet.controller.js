import { getDoctorWalletService } from "../../services/doctor/wallet.service.js";

// ---------------- GET DOCTOR WALLET ----------------
export const doctorWallet = async (req, res) => {
  try {
    const doctorId = req.user.id; 
    const { wallet, transactions } = await getDoctorWalletService(doctorId);

    return res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      wallet,
      transactions,
    });
  } catch (error) {
    console.error("Get Doctor Wallet Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch wallet",
    });
  }
};