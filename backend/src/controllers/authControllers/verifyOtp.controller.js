
import {
  verifyOtpService,
  resetPasswordService,
  setNewPasswordService,
  resendOtpService,
} from "../../services/auth/otp.service.js";
import { sendOtpEmailService } from "../../services/user/email.service.js";
import { EMAIL_TYPES } from "../../constants/email.constants.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// ---------------- VERIFY OTP ----------------
export const verifyOtp = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.OTP) {
    throw new AppError("Session expired or OTP not generated", 400);
  }

  const result = await verifyOtpService(req.session.OTP, req.body);

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
});

// ---------------- RESET PASSWORD ----------------
export const resetPassword = asyncHandler(async (req, res) => {
  const { user, otpCode } = await resetPasswordService(req.body, req.session);

  await sendOtpEmailService({
    to: user.email,
    name: user.name,
    otp: otpCode,
    ...EMAIL_TYPES.RESET_PASSWORD,
  });

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

// ---------------- SET NEW PASSWORD ----------------
export const setNewPassword = asyncHandler(async (req, res) => {
  const result = await setNewPasswordService(req.body, req.session.OTP);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

// ---------------- RESEND OTP ----------------
export const resendOtp = asyncHandler(async (req, res) => {
  const { user, otpCode } = await resendOtpService(req.body, req.session);

  await sendOtpEmailService({
    to: user.email,
    name: user.name,
    otp: otpCode,
    ...EMAIL_TYPES.RESEND_OTP,
  });

  return res.status(200).json({
    success: true,
    message: "A new OTP has been sent to your email.",
  });
});