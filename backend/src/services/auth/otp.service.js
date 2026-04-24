import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctor.model.js";
import Otp from "../../models/otps.model.js";
import { generateOtp } from "../../utils/otpGenerator.js";
import bcrypt from "bcryptjs";

// ---------------- VERIFY OTP ----------------
export const verifyOtpService = async (session, body) => {
  const { otp } = body;
  const { email, type, role } = session;

  const savedOtp = await Otp.findOne({ email });

  if (!savedOtp) throw new Error("OTP not found");
  if (savedOtp.expiresAt < new Date()) throw new Error("OTP expired! Try again");
  if (savedOtp.otp !== otp) throw new Error("Invalid OTP");

  await Otp.deleteOne({ email });

  if (type === "emailVerification") {
    await Patient.updateOne({ email }, { isVerified: true });
    await Doctor.updateOne({ email }, { isVerified: true });

    return { type, message: "Email verified successfully!" };
  }

  if (type === "resetPassword") {
    return {
      type,
      message: "OTP verified. Set your new password",
    };
  }
};

// ---------------- SEND RESET OTP ----------------
export const resetPasswordService = async (body, session) => {
  const { email, role, type } = body;

  const Model = role === "doctor" ? Doctor : Patient;
  const user = await Model.findOne({ email });

  if (!user)
    throw new Error(
      `${role.charAt(0).toUpperCase() + role.slice(1)} not found`
    );

  const otpCode = generateOtp();

  await Otp.create({
    email,
    otp: otpCode,
    expiresAt: new Date(Date.now() + 60 * 1000),
  });

  session.OTP = { email, type, role };

  return { user, otpCode };
};

// ---------------- SET NEW PASSWORD ----------------
export const setNewPasswordService = async (body, session) => {
  const { newPassword, confirmPassword } = body;
  const { email, role } = session;

  const Model = role === "patient" ? Patient : Doctor;
  const user = await Model.findOne({ email });

  if (!user) throw new Error("User not found!");
  if (newPassword !== confirmPassword)
    throw new Error("Passwords do not match");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Password updated successfully!" };
};

// ---------------- RESEND OTP ----------------
export const resendOtpService = async (body, session) => {
  const { email, type } = body;

  if (!email || !type)
    throw new Error("Email and verification type are required.");

  const otpCode = generateOtp();

  await Otp.findOneAndUpdate(
    { email },
    {
      otp: otpCode,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    },
    { new: true, upsert: true }
  );

  session.OTP = { email, type };

  const user =
    (await Patient.findOne({ email })) ||
    (await Doctor.findOne({ email }));

  return { user, otpCode };
};