import Admin from "../../models/admin.model.js";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

export const getCurrentUserInfo = asyncHandler(async (req, res) => {
  const { id, email, role } = req.user;

  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  let user;
  if (role === "admin") {
    user = await Admin.findOne({ email }).select("-password");
  } else if (role === "doctor") {
    user = await Doctor.findOne({ email }).select("-password");
  } else {
    user = await Patient.findOne({ email }).select("-password");
  }

  if (!user) throw new AppError("User not found!", 404);

  return res.status(200).json({
    success: true,
    user: {
      user,
      id,
      name: user.name,
      email: user.email,
      role,
      firstLogin: user.firstLogin,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture || "",
    },
  });
});
