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
   DOCTOR_APPROVED: {
    subject:'Profile Status',
    title: "Profile Approved – Welcome to Pulse360",
    subtitle: "Doctor Profile Review",
    message:
      "Your profile has been approved and is now visible on the platform.",
    highlightText: "Your account is now active",
    highlightType: "success",
  },
  DOCTOR_REJECTED: {
    subject:'Profile Status',
    title: "Profile Review Update",
    subtitle: "Doctor Profile Status",
    message:
      "We regret to inform you that your profile has not been approved at this time. Please review your details and reapply. Action required: Please update and resubmit your profile",
    highlightType: "warning",
  },
  DOCTOR_BLOCKED: {
  subject:'Profile Status',
  title: "Account Access Restricted",
  subtitle: "Doctor Account Status Update",
  message:
    "Your account has been temporarily blocked due to a policy or compliance issue. Contact support service",
  highlightType: "warning",
},
DOCTOR_UNBLOCKED: {
  subject:'Profile Status Update',
  title: "Profile Unblocked",
  subtitle: "Doctor Account Restored",
  message:
    "Your account has been successfully unblocked and is now under review.",
  highlightText: "Profile under review",
  highlightType: "success",
},

DOCTOR_STATUS_UPDATED: {
  subject:'Profile Status Update',
  title: "Profile Status Updated",
  subtitle: "Doctor Profile Update",
  message:
    "Your profile status has been updated. Please check the latest status below.",
  highlightType: "info",
},
};