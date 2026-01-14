import dotenv from "dotenv";
dotenv.config();

import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctor.model.js";
import bcrypt from "bcryptjs";
import { generateOtp } from "../../utils/otpGenerator.js";
import Otp from "../../models/otps.model.js";
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { Notification } from "../../models/notification.model.js";
import { getIO } from "../../socket.js";

//------- USER SIGNUP CONTROLLER -------//
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

    const io = getIO();

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

      const notification = await Notification.create({
        title: "New User Joined",
        message: `${newPatient.name} has registered!`,
        recipient: "admin",
        role: "admin",
        read: false,
      });

      io.to("role:admin").emit("notification:new", notification);
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

      const notification = await Notification.create({
        title: "New User Joined",
        message: ` Dr. ${newDoctor.name} has registered!`,
        recipient: "admin",
        role: "admin",
        read: false,
      });

      io.to("role:admin").emit("notification:new", notification);
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
      subject: "Email Verification – OTP",
      html: emailTemplate({
        title: "Email Verification",
        subtitle: "Verify Your Account",
        body: `
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for signing up. Please verify your email with the OTP below:</p>
        `,
        highlightText: otpCode,
        highlightType: "info",
      }),
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
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error, signup failed!",
    });
  }
};
