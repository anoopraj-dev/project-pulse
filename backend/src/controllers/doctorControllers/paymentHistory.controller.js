
import Payment from '../../models/payments.model.js'

// ------------ Get all payments for a doctor --------------
export const getDoctorPaymentHistory = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const payments = await Payment.find({ doctor: doctorId, status: 'verified' })
      .populate('patient', 'name email')
      .populate('appointment', 'appointmentDate timeSlot serviceType status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
