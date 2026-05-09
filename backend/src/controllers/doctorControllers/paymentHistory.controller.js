
import { getDoctorPaymentHistoryService } from "../../services/doctor/payment.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getDoctorPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await getDoctorPaymentHistoryService(req.user.id);
  res.status(200).json({ success: true, payments });
});
