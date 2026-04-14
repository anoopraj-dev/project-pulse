import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import Admin from "../../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const loginService = async ({ email, password, role }) => {
  if (!jwtSecret) throw new Error("JWT secret not configured");

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!["doctor", "patient", "admin"].includes(role)) {
    throw new Error("Invalid role");
  }

  let user;

  // -------- Role-based lookup --------
  switch (role) {
    case "doctor":
      user = await Doctor.findOne({ email });
      break;
    case "patient":
      user = await Patient.findOne({ email });
      break;
    case "admin":
      user = await Admin.findOne({ email });
      break;
  }

  if (!user) {
    throw new Error(`${role} not found`);
  }

  // -------- Password check --------
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // -------- Extra checks for non-admin --------
  if (role !== "admin" && !user.isVerified) {
    throw new Error("Verify your email to continue");
  }

  // -------- Payload --------
  const payload = {
    id: user._id,
    email: user.email,
    role,
    name: user.name || "Admin",
    customId:
      role === "doctor"
        ? user.doctorId
        : role === "patient"
        ? user.patientId
        : null,
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "1d",
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role,
      name: user.name || "Admin",
      customId: payload.customId,
      firstLogin: user.firstLogin ?? false,
      profilePicture: user.profilePicture ?? null,
      isVerified: role === "admin" ? true : user.isVerified,
    },
  };
};