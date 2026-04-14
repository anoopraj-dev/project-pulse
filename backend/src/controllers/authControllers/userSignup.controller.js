
import { signupService } from "../../services/auth/signup.service.js";

export const userSignup = async (req, res) => {
  try {
    const { user,expiryTime} =
      await signupService({
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
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(
      error.message.includes("exists") ? 409 :
      error.message.includes("Passwords") ? 400 : 500
    ).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};