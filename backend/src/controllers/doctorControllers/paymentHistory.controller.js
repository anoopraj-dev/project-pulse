
import { getDoctorPaymentHistoryService } from "../../services/doctor/payment.service.js";

export const getDoctorPaymentHistory = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const payments = await getDoctorPaymentHistoryService(doctorId);
    console.log(payments)

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
