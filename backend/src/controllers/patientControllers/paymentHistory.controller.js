import Payment from "../../models/payments.model.js";
import { getPatientPaymentHistoryService } from "../../services/patient/payment.service.js";

//----------------- Payment history for patient -----------------
export const getPatientPaymentHistory = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    const { page, limit, status } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(20, Math.max(1, parseInt(limit) || 5));

    const payments = await getPatientPaymentHistoryService(patientId, {
      page: pageNum,
      limit: limitNum,
      status,
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
   
    next(error);
  }
};

