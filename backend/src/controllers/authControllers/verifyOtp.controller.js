
import {
  verifyOtpService,
  resetPasswordService,
  setNewPasswordService,
  resendOtpService,
} from "../../services/auth/otp.service.js";

import { sendOtpEmailService } from "../../services/user/email.service.js";
import { EMAIL_TYPES } from "../../constants/email.constants.js";

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  try {
    if (!req.session || !req.session.OTP) {
      return res.status(400).json({
        success: false,
        message: "Session expired or OTP not generated",
      });
    }

    const result = await verifyOtpService(
      req.session.OTP,
      req.body
    );

    if (result.type === "resetPassword") {
      req.session.emailInfo = {
        email: req.session.OTP.email,
        expiresAt: Date.now() + 5 * 60 * 1000,
        type: result.type,
      };
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      type: result.type,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  try {
    const { user, otpCode } = await resetPasswordService(
      req.body,
      req.session
    );

    await sendOtpEmailService({
      to:user.email,
      name:user.name,
      otp:otpCode,
      ...EMAIL_TYPES.RESET_PASSWORD
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(
      error.message.includes("not found") ? 404 : 400
    ).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- SET NEW PASSWORD ----------------
export const setNewPassword = async (req, res) => {
  try {
    const result = await setNewPasswordService(
      req.body,
      req.session.OTP
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(
      error.message.includes("not found") ? 404 : 400
    ).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- RESEND OTP ----------------
export const resendOtp = async (req, res) => {
  try {
    const { user, otpCode } = await resendOtpService(
      req.body,
      req.session
    );

    await sendOtpEmailService({
      to:user.email,
      name:user.name,
      otp:otpCode,
      ...EMAIL_TYPES.RESEND_OTP
    })

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again.",
    });
  }
};