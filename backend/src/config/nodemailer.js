import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmail = async (options) => {
  return transporter.sendMail(options);
};
