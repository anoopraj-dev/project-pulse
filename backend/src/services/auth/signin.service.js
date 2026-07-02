import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";

const jwtSecret = process.env.JWT_SECRET;

export const loginService = async ({ email, password, role }) => {
  if (!jwtSecret) throw new AppError("JWT secret not configured", 500);

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  if (!["doctor", "patient"].includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  // ---------------- FIND USER ----------------
  let user =
    role === "doctor"
      ? await Doctor.findOne({ email })
      : await Patient.findOne({ email });

  if (!user) {
    throw new AppError("User not registered", 404);
  }

  // ---------------- PASSWORD CHECK ----------------
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  // ---------------- EMAIL VERIFICATION ----------------
  if (!user.isVerified) {
    throw new AppError("Verify your email to continue", 401);
  }

  // ---------------- JWT PAYLOAD ----------------
  const payload = {
    id: user._id,
    customId: role === "doctor" ? user.doctorId : user.patientId,
    email: user.email,
    role,
    name: user.name,
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "1d",
  });

  return {
    token,
    user: {
      id: user._id,
      customId: payload.customId,
      email: user.email,
      role,
      firstLogin: user.firstLogin,
      name: user.name,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
    },
  };
};