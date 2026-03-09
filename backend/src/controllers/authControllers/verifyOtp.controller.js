import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctor.model.js";
import Otp from "../../models/otps.model.js";
import { generateOtp } from "../../utils/otpGenerator.js";
import { sendEmail } from "../../config/nodemailer.js";
import bcrypt from "bcryptjs";
import { emailTemplate } from "../../utils/emailTemplate.js";

//------------------ VERIFY OTP CONTROLLER -------------------
export const verifyOtp = async (req, res) => {
  try {
    console.log(req.session);
    if (!req.session || !req.session.OTP) {
      return res.status(400).json({ success: false, message: 'Session expired or OTP not generated' });
    }
    const { otp } = req.body;
    const { email, type, role } = req.session.OTP;

    const savedOtp = await Otp.findOne({ email });
    if (!savedOtp) return res.status(400).json({ success: false, message: 'OTP not found' });
    if (savedOtp.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'OTP expired! Try again' });
    if (savedOtp.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    await Otp.deleteOne({ email });

    if(type === 'emailVerification'){
      await Patient.updateOne({ email }, { isVerified: true });
      await Doctor.updateOne({ email }, { isVerified: true });

      return res.status(200).json({ success: true, message: 'Email verified successfully!' });
    } else if (type === 'resetPassword') {
      req.session.emailInfo = {
        email,
        expiresAt: Date.now() + 5 * 60 * 1000,
        type
      };
      return res.status(200).json({
        success: true,
        message: 'OTP verified. Set your new password',
        type: 'resetPassword'
      });
    } 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ------------------------- RESET PASSWORD CONTROLLER ---------------------
export const resetPassword = async (req, res) => {
  try {
    console.log(req.body)
    const { email, role, type } = req.body;
    const Model = role === 'doctor' ? Doctor : Patient;
    const user = await Model.findOne({ email });
    if(!user) return res.status(404).json({ success:false, message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found` });

    const otpCode = generateOtp();
    await Otp.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 60 * 1000) // 1minutes
    });

    req.session.OTP = { email, type, role };

    const mailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Reset Password OTP',
      html: emailTemplate({
        title: 'Reset Password',
        subtitle: 'Set Your New Password',
        body: `<p>Hello ${user.name || ''},</p><p>Use the OTP below to reset your password. It will expire in 2 minutes.</p>`,
        highlightText: otpCode,
        highlightType: 'warning'
      }),
    };

    await sendEmail(mailOptions);

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error sending OTP, try resending the email' });
  }
};

//---------------- Set new password---------------
export const setNewPassword = async (req,res) => {
  const { newPassword, confirmPassword } = req.body;
  const { email, role } = req.session.OTP;

  try {
    const Model = role === 'patient' ? Patient : Doctor;
    const user = await Model.findOne({ email });
    if(!user) return res.status(404).json({ success: false, message: 'User not found!' });
    if(newPassword !== confirmPassword) return res.status(400).json({ success: false, message: 'Passwords do not match' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//--------------- RESEND OTP CONTROLLER ---------------------
export const resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!email || !type) return res.status(400).json({ success: false, message: "Email and verification type are required." });

    const otpCode = generateOtp();
    await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt: new Date(Date.now() + 2 * 60 * 1000) },
      { new: true, upsert: true }
    );
    req.session.OTP = { email, type };
    const user = await Patient.findOne({ email }) || await Doctor.findOne({ email });

    const mailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Resend OTP',
      html: emailTemplate({
        title: 'OTP Verification',
        subtitle: 'Your New OTP',
        body: `<p>Hello ${user?.name || ''},</p><p>Your new OTP is valid for 2 minutes.</p>`,
        highlightText: otpCode,
        highlightType: 'info'
      }),
    };

    await sendEmail(mailOptions);

    return res.status(200).json({ success: true, message: "A new OTP has been sent to your email." });

  } catch (error) {
    console.error("Error in resendOtp:", error);
    return res.status(500).json({ success: false, message: "Failed to resend OTP. Please try again." });
  }
};
