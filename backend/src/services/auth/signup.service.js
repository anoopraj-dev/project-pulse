import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctor.model.js";
import bcrypt from "bcryptjs";
import { generateOtp } from "../../utils/otpGenerator.js";
import Otp from "../../models/otps.model.js";
import { createNotification } from "../user/notification.service.js";
import { sendOtpEmailService } from "../user/email.service.js";
import { EMAIL_TYPES } from "../../constants/email.constants.js";

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

  // ---------------- CHECK EXISTING USER ----------------
  const existingPatient = await Patient.findOne({ email });
  const existingDoctor = await Doctor.findOne({ email });

  if (existingPatient || existingDoctor) {
    throw new Error("Email already exists. Please use a different email.");
  }

  // ---------------- PASSWORD MATCH ----------------
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // ---------------- HASH PASSWORD ----------------
  const hashedPassword = await bcrypt.hash(password, 10);

  let user;

  // ---------------- CREATE USER ----------------
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

  // ---------------- NOTIFICATION ----------------
  await createNotification({
    userId:'admin',
    role:'admin',
    title:'New user joined',
    message: role === 'patient'
      ?`${user.name} has registered`
      :`Dr. ${user.name} has registered`
  }) 

  // ---------------- OTP ----------------
  const otpCode = generateOtp();
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

  await Otp.create({
    email,
    otp: otpCode,
    expiresAt: expiryTime,
  });

  await sendOtpEmailService({
    to:user.email,
    name:user.name,
    otp:otpCode,
    ...EMAIL_TYPES.VERIFY_EMAIL
  })

  return {
    user,
    otpCode,
    expiryTime,
  };
};