import dotenv from "dotenv";
dotenv.config();

import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctorModels/doctor.model.js";
import bcrypt from "bcryptjs";
import { generateOtp } from "../../utils/otpGenerator.js";
import Otp from "../../models/otps.model.js";
import { sendEmail } from "../../config/nodemailer.js";


export const userSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      isVerified,
      firstLogin,
    } = req.body;

    // -------Check if user already exists-------
    const existingPatient = await Patient.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });
    if (existingPatient || existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    // -------- Check password match------------
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    //----------Encrypt password-------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ------------Create new user----------
    if (role === "patient") {
      const newPatient = new Patient({
        patientId: req.registrationId,
        name,
        email,
        password: hashedPassword,
        role,
        isVerified,
        firstLogin,
      });

      await newPatient.save();
    } else {
      const newDoctor = new Doctor({
        doctorId: req.registrationId,
        name,
        email,
        password: hashedPassword,
        role,
        isVerified,
        firstLogin,
      });

      await newDoctor.save();
    }

    //---------- Generate OTP-----------------
    const otpCode = generateOtp();
    await Otp.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
    });

    // ----------Email options for node mailer----------
    const mailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Email verification",
      text: `Hello ${name}, verify your email with this one-time password: ${otpCode}`,
    };

    try {
      await sendEmail(mailOptions);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error sending OTP, try resending the email",
      });
    }
    req.session.OTP = {
      email,
      type: "emailVerification",
    };
    return res.status(201).json({
      success: true,
      message: ` Verify your email with the OTP sent to your email`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error, signup failed!",
    });
  }
};




