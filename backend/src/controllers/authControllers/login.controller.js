import { loginService } from "../../services/auth/login.service.js";

// -------- USER LOGIN (doctor/patient/admin) --------
export const login = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(
      error.message.includes("not found") ? 404 :
      error.message.includes("credentials") ? 401 :
      error.message.includes("Verify") ? 401 :
      400
    ).json({
      success: false,
      message: error.message,
    });
  }
};



// -------- AUTH CHECK --------
export const authCheck = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};