import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateUniqueId } from "../../utils/idGenerator.js";
import { verifyToken } from "@clerk/backend";



//---------------- RANDOM PASSWORD GENERATOR ----------------
const generateRandomPassword = (length = 16) => {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
};

//---------------- UPDATE CLERK USER CONTROLLER ----------------

export const updateClerKUser = async (req, res) => {
  try {
    const { name, email, id, role } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid authorization header",
      });
    }

    //---------------- Verify Clerk token -----------------
    const tokenPayload = await verifyToken(authHeader.substring(7), {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!tokenPayload || tokenPayload.sub !== id) {
      return res
        .status(403)
        .json({ success: false, message: "Token does not match" });
    }

    const clerkUserInfo = await clerkClient.users.getUser(id);

    if (clerkUserInfo?.emailAddresses?.[0]?.emailAddress !== email) {
      return res.status(403).json({
        success: false,
        message: "Provided email does not match Clerk user email",
      });
    }

    //---------------- Check for role conflicts ----------------
    const existingRole = clerkUserInfo?.unsafeMetadata?.role;
    if (existingRole && existingRole !== role) {
      return res.status(409).json({
        success: false,
        message: `Email is already registered as a ${existingRole}. Cannot change roles.`,
      });
    }
    //---------------- Check for email conflicts in local DB ----------------

    const Model = role === "doctor" ? Doctor : Patient;
    const uniqueIdKey = role === "doctor" ? "doctorId" : "patientId";
    const uniqueId = generateUniqueId(role.toUpperCase());

    const existingDbUser = await Model.findOne({ email });
    if (existingDbUser && existingDbUser.role !== role) {
      return res.status(409).json({
        success: false,
        message: `Email registered as ${existingDbUser.role}`,
      });
    }

    //---------------- Upsert user in local DB ----------------
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

    //---------------- Generate JWT token ----------------
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }

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

    // Build a canonical user object to return (include firstLogin/profilePicture)
    // const responseUser = {
    //   id: user._id,
    //   customId: user[uniqueIdKey],
    //   email: user.email,
    //   name: user.name,
    //   role: user.role,
    //   firstLogin: user.firstLogin,
    //   profilePicture: user.profilePicture,
    // };

    const responseUser = user.toObject();
delete responseUser.password; // remove password


    res.status(200).json({
      success: true,
      message: "Google authentication successful!",
      user: responseUser,
      accessToken,
    });
  } catch (error) {
    console.error("updateClerKUser error:", error);
    let status = 500;
    let message = "Authentication failed";

    if (error.code === 11000 || error.message.includes("duplicate key")) {
      status = 409;
      message = "Email already exists";
    } else if (error.name === "ValidationError") {
      status = 400;
      message = "Validation failed";
    } else if (error.statusCode) {
      status = error.statusCode;
      message = error.message;
    }

    return res.status(status).json({
      success: false,
      message,
    });
  }
};
