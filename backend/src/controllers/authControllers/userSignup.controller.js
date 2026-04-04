
import { signupService } from "../../services/auth/signup.service.js";
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { getIO } from "../../socket.js";

export const userSignup = async (req, res) => {
  try {
    const io = getIO();

    const { user, otpCode, expiryTime, notification } =
      await signupService({
        ...req.body,
        registrationId: req.registrationId,
      });

    // -------- Emit notification --------
    io.to("role:admin").emit("notification:new", notification);

    // -------- Send Email --------
    const mailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "Email Verification – OTP",
      html: emailTemplate({
        title: "Email Verification",
        subtitle: "Verify Your Account",
        body: `
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Thank you for signing up. Please verify your email with the OTP below:</p>
        `,
        highlightText: otpCode,
        highlightType: "info",
      }),
    };

    await sendEmail(mailOptions);

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