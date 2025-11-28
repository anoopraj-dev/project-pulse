import dotenv from "dotenv";
dotenv.config();

import Doctor from "../../models/doctorModels/doctor.model.js";
import Patient from "../../models/patient.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const userSignin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    //----------CHECK IF USER EXISTS---------
    let user = null;
    if (role === "doctor") {
      user = await Doctor.findOne({ email });
    } else {
      user = await Patient.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered!",
      });
    }

    //-----------CHECK PASSWORD -----------
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ----------CREATE JWT PAYLOAD-----------
    const payload = {
      id: user._id,
      customId: role === "doctor" ? user.doctorId : user.patientId,
      email: user.email,
      role,
      name: user.name,
    };

    //-----------CREATE TOKEN-------------
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        customId: role === "doctor" ? user.doctorId : user.patientId,
        email: user.email,
        role,
        firstLogin: user.firstLogin,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const authCheck = async (req, res) => {
  try {
    // authMiddleware already sets req.user
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
