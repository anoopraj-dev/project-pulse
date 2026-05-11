import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateUniqueId } from "../../utils/idGenerator.js";
import { verifyToken } from "@clerk/backend";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// ---------------- RANDOM PASSWORD GENERATOR ----------------
const generateRandomPassword = (length = 16) => {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
};

// ---------------- UPDATE CLERK USER CONTROLLER ----------------
export const updateClerKUser = asyncHandler(async (req, res) => {
  const { name, email, id, role } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Missing or invalid authorization header", 401);
  }

  // ---------------- Verify Clerk token -----------------
  const tokenPayload = await verifyToken(authHeader.substring(7), {
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  if (!tokenPayload || tokenPayload.sub !== id) {
    throw new AppError("Token does not match", 403);
  }

  const clerkUserInfo = await clerkClient.users.getUser(id);

  if (clerkUserInfo?.emailAddresses?.[0]?.emailAddress !== email) {
    throw new AppError("Provided email does not match Clerk user email", 403);
  }

  // ---------------- Check for role conflicts ----------------
  const existingRole = clerkUserInfo?.unsafeMetadata?.role;
  if (existingRole && existingRole !== role) {
    throw new AppError(
      `Email is already registered as a ${existingRole}. Cannot change roles.`,
      409
    );
  }

  // ---------------- Check for email conflicts in local DB ----------------
  const Model = role === "doctor" ? Doctor : Patient;
  const uniqueIdKey = role === "doctor" ? "doctorId" : "patientId";
  const uniqueId = generateUniqueId(role.toUpperCase());

  const existingDbUser = await Model.findOne({ email });
  if (existingDbUser && existingDbUser.role !== role) {
    throw new AppError(`Email registered as ${existingDbUser.role}`, 409);
  }

  // ---------------- Upsert user in local DB ----------------
  const user = await Model.findOneAndUpdate(
    { email },
    {
      name,
      email,
      role,
      [uniqueIdKey]: uniqueId,
      password: generateRandomPassword(),
      updatedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  // ---------------- Generate JWT token ----------------
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new AppError("JWT secret is not defined", 500);

  const payload = {
    id: user._id,
    customId: user[uniqueIdKey],
    email,
    name,
    role,
  };

  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

  res.cookie("token", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // --------------- Update Clerk user metadata  ----------------
  if (!existingRole) {
    await clerkClient.users.updateUser(id, {
      unsafeMetadata: { role },
    });
  }

  const responseUser = user.toObject();
  delete responseUser.password;

  res.status(200).json({
    success: true,
    message: "Google authentication successful!",
    user: responseUser,
    accessToken,
  });
});
