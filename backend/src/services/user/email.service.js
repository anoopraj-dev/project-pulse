import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";

export const sendOtpEmailService = async ({ to, name, otp, subject, title, subtitle, message,highlightType }) => {
  const mailOptions = {
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to: to,
    subject,
    html: emailTemplate({
      title,
      subtitle,
      body: `
          <p>Hello <strong>${name}</strong>,</p>
          <p>${message}</p>
        `,
      highlightText: otp,
      highlightType
    }),
  };

  try {
    await sendEmail(mailOptions);
  } catch (error) {
    console.error("Email failed", error);
  }
};


export const sendEmailService = async ({
  to,
  subject,
  name,
  role,
  title,
  subtitle,
  message,
  highlightText,
  highlightType = "info",
}) => {
  const displayName = role === "doctor" ? `Dr. ${name}` : name;

  const mailOptions = {
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: emailTemplate({
      title,
      subtitle,
      body: `
        <p>Hello <strong>${displayName}</strong>,</p>
        <p>${message}</p>
      `,
      highlightText,
      highlightType,
    }),
  };

  try {
    await sendEmail(mailOptions);
  } catch (error) {
    console.error("Email failed", error);
    throw new Error("Failed to send email");
  }
};
