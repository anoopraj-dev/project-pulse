import { loginService } from "../../services/auth/login.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// ---------------- USER LOGIN (DOCTOR/PATIENT/ADMIN) ----------------
export const login = asyncHandler(async (req, res) => {
  const { token, user } = await loginService(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  });
});

// ---------------- AUTH CHECK ----------------
export const authCheck = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});