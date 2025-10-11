import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctorModels/doctor.model.js";
import Otp from "../../models/otps.model.js";
import { generateOtp } from "../../utils/otpGenerator.js";
import { sendEmail } from "../../config/nodemailer.js";

export const verifyOtp = async (req, res) => {
  try {
    console.log(req.body);
    const { otp, email } = req.body;
    console.log(email)

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


export const resendOtp = async (req,res)=> {
   const otpCode = generateOtp();
       await Otp.create({
         email,
         otp: otpCode,
         expiresAt: new Date(Date.now() + 2 * 60 * 1000) // 2 minutes
       });


       const mailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Email verification',
      text: `Hello ${name}, verify your email with this one-time password: ${otpCode}`
    };

    try {
      await sendEmail(mailOptions)
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error sending OTP, try resending the email'
      });
    }

}
