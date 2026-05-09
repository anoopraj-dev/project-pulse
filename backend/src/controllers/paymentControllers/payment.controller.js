
import {
  createOrderService,
  verifyPaymentService,
  updatePaymentStatusService,
  retryPaymentService,
  walletPaymentService,
  verifyWalletTopupService,
} from "../../services/payment/payment.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// CREATE ORDER
export const createOrder = asyncHandler(async (req, res) => {
  const order = await createOrderService(req.user.id, req.body);
  res.json({ success: true, order });
});

// VERIFY PAYMENT
export const verifyPayment = asyncHandler(async (req, res) => {
  await verifyPaymentService(req.body);
  res.json({ success: true, message: "Payment Verified" });
});

// UPDATE STATUS
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const result = await updatePaymentStatusService(req.body);

  if (result?.alreadyProcessed) {
    return res.json({ success: true, message: "Already processed" });
  }

  res.json({ success: true, payment: result.payment });
});

// RETRY
export const retryPayment = asyncHandler(async (req, res) => {
  const data = await retryPaymentService(req.params.id);
  res.json({ success: true, ...data });
});

// WALLET PAYMENT
export const walletPayment = asyncHandler(async (req, res) => {
  const payment = await walletPaymentService(req.user.id, req.body);
  res.json({ success: true, payment });
});

// VERIFY WALLET TOPUP
export const verifyWalletPayment = asyncHandler(async (req, res) => {
  const data = await verifyWalletTopupService(req.user.id, req.body);
  res.json({ success: true, ...data });
});