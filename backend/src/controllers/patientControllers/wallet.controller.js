
import {
  getPatientWalletService,
  refundToWalletService,
  createWalletOrderService,
  verifyWalletPaymentService,
} from "../../services/patient/wallet.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// -------- GET WALLET ----------
export const getPatientWallet = asyncHandler(async (req, res) => {
  const { wallet, transactions } = await getPatientWalletService(req.user.id);
  res.json({ success: true, wallet, transactions });
});

// -------- REFUND ----------
export const refundToWallet = asyncHandler(async (req, res) => {
  const { patientWallet, transaction } = await refundToWalletService(req.user.id, req.body);
  res.status(200).json({
    success: true,
    message: "Refund credited",
    patientWallet,
    transaction,
  });
});

// -------- CREATE ORDER ----------
export const createWalletOrder = asyncHandler(async (req, res) => {
  const order = await createWalletOrderService(req.body);
  res.status(200).json({ success: true, order });
});

// -------- VERIFY PAYMENT ----------
export const verifyWalletPayment = asyncHandler(async (req, res) => {
  await verifyWalletPaymentService(req.user.id, req.body);
  res.json({ success: true, message: "Wallet credited successfully" });
});