export const EMAIL_TYPES = {
  VERIFY_EMAIL: {
    subject:'Verify Email',
    title: "Email Verification - OTP",
    subtitle: "Verify Your Account",
    message: "Thank you for signing up. Please verify your email using the OTP below.",
    highlightType: "info",
  },
  RESET_PASSWORD: {
    subject:'Reset Password',
    title: "Reset Password OTP",
    subtitle: "Set Your New Password",
    message: "Use the OTP below to reset your password.",
    highlightType: "warning",
  },
  RESEND_OTP: {
    title: "Resend OTP",
    subtitle: "Your New OTP",
    message:
      "Here is your new OTP. Please use this OTP to continue your process.",
    highlightType: "info",
  },
};