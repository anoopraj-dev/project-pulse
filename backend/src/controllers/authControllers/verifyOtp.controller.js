import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctor.model.js";
import Otp from "../../models/otps.model.js";

export const verifyOtp = async (req, res) => {
  try {
    console.log(req.body);
    const { otp, email } = req.body;

    // Check if OTP exists
    const savedOtp = await Otp.findOne({ email });
    console.log(savedOtp);

    if (!savedOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found'
      });
    }

    // Check if OTP expired
    if (savedOtp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired! Try again'
      });
    }

    // Check if OTP matches
    if (savedOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Verify the user
    await Patient.findOneAndUpdate({ email }, { isVerified: true });
    await Doctor.findOneAndUpdate({ email }, { isVerified: true });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully!'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
