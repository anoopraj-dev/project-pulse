
import {
  getPatientWalletService,
  refundToWalletService,
  createWalletOrderService,
  verifyWalletPaymentService,
} from "../../services/patient/wallet.service.js";

// -------- GET WALLET ----------
export const getPatientWallet = async (req, res) => {
  try {
    const { wallet, transactions } = await getPatientWalletService(
      req.user.id
    );

    res.json({ success: true, wallet, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------- REFUND ----------
export const refundToWallet = async (req, res) => {
  try {
    const { patientWallet, transaction } =
      await refundToWalletService(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Refund credited",
      patientWallet,
      transaction,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// -------- CREATE ORDER ----------
export const createWalletOrder = async (req, res) => {
  try {
    const order = await createWalletOrderService(req.body);

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// -------- VERIFY PAYMENT ----------
export const verifyWalletPayment = async (req, res) => {
  try {
    await verifyWalletPaymentService(req.user.id, req.body);

    res.json({ success: true, message: "Wallet credited successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};