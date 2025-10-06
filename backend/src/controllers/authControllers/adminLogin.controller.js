import dotenv from "dotenv";
dotenv.config();
import Admin from "../../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const jwtSecret = process.env.JWT_SECRET;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin with this email doesn't exist!",
      });
    }

    console.log("Stored password:", admin.password);
    console.log("Entered password:", password);

    // Compare plain password with stored hash
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Ensure JWT secret exists
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined in environment variables");
    }

    // Create token payload
    const payload = {
      email: admin.email,
      role: "admin",
    };

    // Generate token
    const adminToken = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

    // Set token in cookie (httpOnly)
    res.cookie("adminToken", adminToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        email: admin.email,
        role: "admin",
      },
      token: adminToken,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
