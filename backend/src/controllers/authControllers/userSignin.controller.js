// import dotenv from "dotenv";
// dotenv.config();

// import Doctor from "../../models/doctor.model.js";
// import Patient from "../../models/patient.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const jwtSecret = process.env.JWT_SECRET;

// export const userSignin = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     //----------CHECK IF USER EXISTS---------
//     let user = null;
//     if (role === "doctor") {
//       user = await Doctor.findOne({ email });
//     } else {
//       user = await Patient.findOne({ email });
//     }

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not registered!",
//       });
//     }

//     //-----------CHECK PASSWORD -----------
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     //------------- CHECK IF VERIFIED EMAIL-----------
//     const isVerifiedUser = user.isVerified === true;
//     if (!isVerifiedUser) {
//       res.clearCookie("token");
//       return res.status(401).json({
//         success: false,
//         message: "Verify your email to continue",
//       });
//     }

//     // ----------CREATE JWT PAYLOAD-----------
//     const payload = {
//       id: user._id,
//       customId: role === "doctor" ? user.doctorId : user.patientId,
//       email: user.email,
//       role,
//       name: user.name,
//     };

//     //-----------CREATE TOKEN-------------
//     if (!jwtSecret) {
//       throw new Error("JWT secret is not defined");
//     }
//     const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user._id,
//         customId: role === "doctor" ? user.doctorId : user.patientId,
//         email: user.email,
//         role,
//         firstLogin: user.firstLogin,
//         name: user.name,
//         profilePicture: user.profilePicture,
//         isVerified: user.isVerified,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// export const authCheck = async (req, res) => {
//   try {
//     // authMiddleware already sets req.user
//     res.status(200).json({ success: true, user: req.user });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// import { loginService } from "../../services/auth/signin.service.js";

// export const userSignin = async (req, res) => {
//   try {
//     const { token, user } = await loginService(req.body);

//     // -------- Set Cookie --------
//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);

//     return res.status(
//       error.message.includes("registered") ? 404 :
//       error.message.includes("credentials") ? 401 :
//       error.message.includes("Verify") ? 401 :
//       400
//     ).json({
//       success: false,
//       message: error.message || "Login failed",
//     });
//   }
// };

// // -------- AUTH CHECK --------
// export const authCheck = async (req, res) => {
//   try {
//     return res.status(200).json({
//       success: true,
//       user: req.user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };
