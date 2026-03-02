import express from 'express';
import { handleRazorpayWebhook } from '../controllers/paymentControllers/razorpayWebhook.controller.js';

const router = express.Router();

router.post(
  '/razorpay',
  express.raw({ type: 'application/json' }), // ---------- for signature verification
  handleRazorpayWebhook
);

export default router;
