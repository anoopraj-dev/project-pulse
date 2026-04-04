import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const loginService = async ({ email, password, role }) => {
  if (!jwtSecret) throw new Error("JWT secret not configured");

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!["doctor", "patient"].includes(role)) {
    throw new Error("Invalid role");
  }

  // -------- Find user --------
  let user =
    role === "doctor"
      ? await Doctor.findOne({ email })
      : await Patient.findOne({ email });

  if (!user) {
    throw new Error("User not registered");
  }

  // -------- Password check --------
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // -------- Email verification --------
  if (!user.isVerified) {
    throw new Error("Verify your email to continue");
  }

  // -------- JWT Payload --------
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