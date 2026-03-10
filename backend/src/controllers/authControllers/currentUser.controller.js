import Admin from "../../models/admin.model.js";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";

export const getCurrentUserInfo = async (req, res) => {
  try {
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id,
        name: user.name,
        email: user.email,
        role,
        firstLogin: user.firstLogin,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
