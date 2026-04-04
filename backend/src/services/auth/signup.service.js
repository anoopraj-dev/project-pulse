import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctor.model.js";
import bcrypt from "bcryptjs";
import { generateOtp } from "../../utils/otpGenerator.js";
import Otp from "../../models/otps.model.js";
import { Notification } from "../../models/notification.model.js";

export const signupService = async (payload) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    role,
    isVerified,
    firstLogin,
    registrationId,
  } = payload;

  // -------- Check existing user --------
  const existingPatient = await Patient.findOne({ email });
  const existingDoctor = await Doctor.findOne({ email });

  if (existingPatient || existingDoctor) {
    throw new Error("Email already exists. Please use a different email.");
  }

  // -------- Password match --------
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // -------- Hash password --------
  const hashedPassword = await bcrypt.hash(password, 10);

  let user;

  // -------- Create user --------
  if (role === "patient") {
    user = await Patient.create({
      patientId: registrationId,
      name,
      email,
      password: hashedPassword,
      role,
      isVerified,
      firstLogin,
    });
  } else {
    user = await Doctor.create({
      doctorId: registrationId,
      name,
      email,
      password: hashedPassword,
      role,
      isVerified,
      firstLogin,
    });
  }

  // -------- Notification --------
  const notification = await Notification.create({
    title: "New User Joined",
    message:
      role === "patient"
        ? `${user.name} has registered!`
        : `Dr. ${user.name} has registered!`,
    recipient: "admin",
    role: "admin",
    read: false,
  });

  // -------- OTP --------
  const otpCode = generateOtp();
  const expiryTime = new Date(Date.now() + 60 * 1000);

  await Otp.create({
    email,
    otp: otpCode,
    expiresAt: expiryTime,
  });

  return {
    user,
    otpCode,
    expiryTime,
    notification,
  };
};