
import { signupService } from "../../services/auth/signup.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const userSignup = asyncHandler(async (req, res) => {
  const { user, expiryTime } = await signupService({
    ...req.body,
    registrationId: req.registrationId,
  });

  // -------- Session --------
  req.session.OTP = {
    email: user.email,
    type: "emailVerification",
  };

  return res.status(201).json({
    success: true,
    message: "Verify your email with the OTP sent to your email",
    expiryTime: expiryTime.getTime(),
  });
});