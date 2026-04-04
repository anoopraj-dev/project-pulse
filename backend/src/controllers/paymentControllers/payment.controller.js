
import {
  createOrderService,
  verifyPaymentService,
  updatePaymentStatusService,
  retryPaymentService,
  walletPaymentService,
  verifyWalletTopupService,
} from "../../services/payment/payment.service.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const order = await createOrderService(req.user.id, req.body);
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    await verifyPaymentService(req.body);
    res.json({ success: true, message: "Payment Verified" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE STATUS
export const updatePaymentStatus = async (req, res) => {
  try {
    const result = await updatePaymentStatusService(req.body);

    if (result?.alreadyProcessed) {
      return res.json({ success: true, message: "Already processed" });
    }

    res.json({ success: true, payment: result.payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// RETRY
export const retryPayment = async (req, res) => {
  try {
    const data = await retryPaymentService(req.params.id);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// WALLET PAYMENT
export const walletPayment = async (req, res) => {
  try {
    const payment = await walletPaymentService(req.user.id, req.body);
    res.json({ success: true, payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// VERIFY WALLET TOPUP
export const verifyWalletPayment = async (req, res) => {
  try {
    const data = await verifyWalletTopupService(req.user.id, req.body);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};