import crypto from "crypto";
import Consultation from "../../models/consultation.model.js";
import Appointment from "../../models/appointments.model.js";
import Prescription from "../../models/prescription.model.js";
import { getIO } from "../../socket.js";
import Patient from "../../models/patient.model.js";
import { getBrowser } from "../../config/puppeteer.js";
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";

//----------------- Join consultation --------------------

export const joinConsultation = async (req, res) => {
  try {
    console.log(req.params);
    const { id: consultationId } = req.params;
    const userId = req.user.id;

    console.log("consultationId", consultationId);

    //------------ find consultation & appointment ------------
    const consultation = await Consultation.findById(consultationId)
      .populate("appointment", "appointmentDate")
      .populate("patient", "name profilePicture")
      .populate("doctor", "name profilePicture");

    if (!consultation) {
      return res.status(400).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (consultation.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Consultation cancelled",
      });
    }

    if (consultation.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Consultation already completed",
      });
    }
    console.log("consultation.patient", consultation.patient);
    //------------ Authorization Check ------------
    if (
      ![
        consultation.patient._id.toString(),
        consultation.doctor._id.toString(),
      ].includes(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //------------- Time Validation -------------
    const now = new Date();

    // const appointmentTime = consultation.appointment.appointmentDate;

    // //----------- Allow to join 5 min early (buffer) ----------
    // const earlyJoinTime = new Date(appointmentTime);
    // earlyJoinTime.setMinutes(earlyJoinTime.getMinutes() - 5);

    // if (now < earlyJoinTime || now > consultation.tokenExpiresAt) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Consultation not active or expired",
    //   });
    // }

    //------------ Identify & update participants -------
    const isPatient = consultation.patient.toString() === userId;
    const isDoctor = consultation.doctor.toString() === userId;

    if (!consultation.participants) {
      consultation.participants = {
        patientJoined: false,
        doctorJoined: false,
      };
    }

    if (isPatient) consultation.participants.patientJoined = true;
    if (isDoctor) consultation.participants.doctorJoined = true;

    //------ Start session if both participant joined ----------
    if (
      consultation.participants.patientJoined &&
      consultation.participants.doctorJoined &&
      consultation.status === "scheduled"
    ) {
      consultation.status = "in-progress";
      consultation.startTime = now;
    }

    await consultation.save();

    const io = getIO();

    io.to(consultationId).emit("consultation:status-update", {
      status: "in-progress",
    });

    const participants = {
      patient: {
        name: consultation.patient.name,
        profilePicture: consultation.patient.profilePicture,
      },
      doctor: {
        name: consultation.doctor.name,
        profilePicture: consultation.doctor.profilePicture,
      },
    };

    //------------- Response ------------
    res.status(200).json({
      success: true,
      message: "Joined consultation successfully",
      consultation: {
        consultationId: consultation._id,
        sessionId: consultation.sessionId,
        status: consultation.status,
        participants,
      },
    });
  } catch (error) {
    console.log("Join Consultation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//----------------- End Consultation -----------------

export const endConsultation = async (req, res) => {
  try {
    const { id: consultationId } = req.params;
    const userId = req.user.id;
    console.log("Ending consultation:", consultationId, "by user:", userId);
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      console.log("Consultation not found:", consultationId);
      return res.status(400).json({
        success: false,
        message: "Consultation not found",
      });
    }

    console.log("Consultation status:", consultation.status);

    //------------- Prevent invalid status --------
    if (consultation.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Consultation cancelled",
      });
    }

    if (consultation.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Consultation already completed",
      });
    }

    if (
      consultation.status !== "in-progress" &&
      consultation.status !== "scheduled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Consultation cannot be ended",
      });
    }

    // Check if prescription exists
    const prescription = await Prescription.findOne({
      consultation: consultationId,
    });
    if (!prescription) {
      return res.status(400).json({
        success: false,
        message:
          "Prescription must be submitted before ending the consultation",
      });
    }

    //-------------- Authorization check ---------------
    if (
      ![
        consultation.patient.toString(),
        consultation.doctor.toString(),
      ].includes(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //----------- Set end time ---------------
    const now = new Date();
    consultation.endTime = now;
    consultation.status = "completed";

    await consultation.save();

    //----------- Update appointment status -----------
    try {
      await Appointment.findByIdAndUpdate(consultation.appointment, {
        status: "completed",
      });
      console.log(
        `Updated appointment ${consultation.appointment} status to completed`,
      );
    } catch (appointmentError) {
      console.error("Error updating appointment status:", appointmentError);
    }

    // Emit socket event to notify participants
    const io = getIO();
    io.to(consultationId).emit("consultation:ended");

    //--------------- Calculate duration -------------
    let duration = 0;

    if (consultation.startTime) {
      duration = (consultation.endTime - consultation.startTime) / (1000 * 60);
    }

    //--------- response -------------
    res.status(200).json({
      success: true,
      message: "Consultation ended",
      data: {
        consultationId: consultation._id,
        duration: Math.round(duration),
      },
    });
  } catch (error) {
    console.log("End consultation Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//----------------- Generate Consultation PDF -----------------

export const generateConsultationPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find consultation with all related data
    const consultation = await Consultation.findById(id)
      .populate({
        path: "patient",
        select: "name gender dob ",
      })
      .populate({
        path: "appointment",
        select: "appointmentDate timeSlot reason",
      })
      .populate({
        path: "doctor",
        select: "name",
      });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // Authorization check - only patient or doctor can view
    if (
      ![
        consultation.patient._id.toString(),
        consultation.doctor._id.toString(),
      ].includes(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find prescription
    const prescription = await Prescription.findOne({
      consultation: id,
    }).populate("doctor", "name");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Consultation Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { margin-bottom: 8px; }
            .label { font-weight: bold; }
            .medicines { margin-top: 10px; }
            .medicine-item { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Pulse Medical Consultation Report</h1>
            <p>Consultation ID: ${consultation._id}</p>
          </div>

          <div class="section">
            <h3>Patient Information</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Name:</span> ${consultation.patient.name}</div>
              <div class="info-item"><span class="label">Gender:</span> ${consultation.patient.gender}</div>
              <div class="info-item"><span class="label">Date of Birth:</span> ${new Date(consultation.patient.dob).toLocaleDateString()}</div>
              <div class="info-item"><span class="label">Appointment Date:</span> ${new Date(consultation.appointment.appointmentDate).toLocaleDateString()}</div>
              <div class="info-item"><span class="label">Time Slot:</span> ${consultation.appointment.timeSlot}</div>
              <div class="info-item"><span class="label">Reason:</span> ${consultation.appointment.reason}</div>
            </div>
          </div>

          <div class="section">
            <h3>Doctor Information</h3>
            <div class="info-item"><span class="label">Doctor:</span> ${consultation.doctor.name}</div>
          </div>

          <div class="section">
            <h3>Consultation Details</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Status:</span> ${consultation.status}</div>
              <div class="info-item"><span class="label">Start Time:</span> ${consultation.startTime ? new Date(consultation.startTime).toLocaleString() : "N/A"}</div>
              <div class="info-item"><span class="label">End Time:</span> ${consultation.endTime ? new Date(consultation.endTime).toLocaleString() : "N/A"}</div>
              <div class="info-item"><span class="label">Duration:</span> ${consultation.startTime && consultation.endTime ? Math.round((consultation.endTime - consultation.startTime) / (1000 * 60)) + " minutes" : "N/A"}</div>
            </div>
          </div>

          <div class="section">
            <h3>Diagnosis</h3>
            <p>${prescription.diagnosis}</p>
          </div>

          <div class="section">
            <h3>Prescribed Medicines</h3>
            <div class="medicines">
              ${prescription.medicines
                .map(
                  (med, index) => `
                <div class="medicine-item">
                  <div class="info-item"><span class="label">Medicine ${index + 1}:</span> ${med.medicine}</div>
                  <div class="info-item"><span class="label">Dosage:</span> ${med.dosage}</div>
                  <div class="info-item"><span class="label">Timing:</span> ${med.timing === "before" ? "Before meals" : "After meals"}</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>


          <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
            <p>This is a computer-generated report. Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Generate PDF
    const browser = getBrowser();
    if (!browser) {
      return res
        .status(500)
        .json({ message: "PDF generation service unavailable" });
    }

    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await page.close();

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=consultation-${id}.pdf`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Generate consultation PDF error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getConsultationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id)
      .populate({
        path: "patient",
        select: "name gender dob medical_history lifestyle_habits",
      })
      .populate({
        path: "appointment",
        select: "appointmentDate timeSlot reason",
      })
      .populate({
        path: "doctor",
        select: "name",
      });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.status(200).json({
      patient: consultation.patient,
      appointment: {
        date: consultation.appointment.appointmentDate,
        time: consultation.appointment.timeSlot,
        reason: consultation.appointment.reason,
      },
      consultation: consultation,
      doctor: consultation.doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//----------------- Submit Prescription -----------------

export const submitPrescription = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { diagnosis, medicines } = req.body;
    const doctorId = req.user.id;

    // Find consultation
    const consultation = await Consultation.findById(consultationId)
      .populate("appointment")
      .populate("patient", "name email")
      .populate("doctor", "name");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    // Authorization check
    if (consultation.doctor._id.toString() !== doctorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Validate medicines array
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one medicine is required",
      });
    }

    // Create prescription
    const prescription = new Prescription({
      consultation: consultationId,
      appointment: consultation.appointment._id,
      patient: consultation.patient._id,
      doctor: doctorId,
      diagnosis,
      medicines,
    });

    await prescription.save();

    //------------- generate prescription pdf -------------
    const browser = getBrowser();
    const page = await browser.newPage();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Consultation Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { margin-bottom: 8px; }
            .label { font-weight: bold; }
            .medicines { margin-top: 10px; }
            .medicine-item { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Pulse Medical Consultation Report</h1>
            <p>Consultation ID: ${consultation._id}</p>
          </div>

          <div class="section">
            <h3>Patient Information</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Name:</span> ${consultation.patient.name}</div>
              <div class="info-item"><span class="label">Gender:</span> ${consultation.patient.gender}</div>
              <div class="info-item"><span class="label">Date of Birth:</span> ${new Date(consultation.patient.dob).toLocaleDateString()}</div>
              <div class="info-item"><span class="label">Appointment Date:</span> ${new Date(consultation.appointment.appointmentDate).toLocaleDateString()}</div>
              <div class="info-item"><span class="label">Time Slot:</span> ${consultation.appointment.timeSlot}</div>
              <div class="info-item"><span class="label">Reason:</span> ${consultation.appointment.reason}</div>
            </div>
          </div>

          <div class="section">
            <h3>Doctor Information</h3>
            <div class="info-item"><span class="label">Doctor:</span> ${consultation.doctor.name}</div>
          </div>

          <div class="section">
            <h3>Consultation Details</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Status:</span> ${consultation.status}</div>
              <div class="info-item"><span class="label">Start Time:</span> ${consultation.startTime ? new Date(consultation.startTime).toLocaleString() : "N/A"}</div>
              <div class="info-item"><span class="label">End Time:</span> ${consultation.endTime ? new Date(consultation.endTime).toLocaleString() : "N/A"}</div>
              <div class="info-item"><span class="label">Duration:</span> ${consultation.startTime && consultation.endTime ? Math.round((consultation.endTime - consultation.startTime) / (1000 * 60)) + " minutes" : "N/A"}</div>
            </div>
          </div>

          <div class="section">
            <h3>Diagnosis</h3>
            <p>${prescription.diagnosis}</p>
          </div>

          <div class="section">
            <h3>Prescribed Medicines</h3>
            <div class="medicines">
              ${prescription.medicines
                .map(
                  (med, index) => `
                <div class="medicine-item">
                  <div class="info-item"><span class="label">Medicine ${index + 1}:</span> ${med.medicine}</div>
                  <div class="info-item"><span class="label">Dosage:</span> ${med.dosage}</div>
                  <div class="info-item"><span class="label">Timing:</span> ${med.timing === "before" ? "Before meals" : "After meals"}</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>


          <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
            <p>This is a computer-generated report. Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await page.close();

    //--------------- send prescription to patient ---------------
    const mailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: consultation.patient.email,
      subject: "Your Prescription",
      html: emailTemplate({
        title: "Prescription Available",
        subtitle: `Dr. ${consultation.doctor.name}`,
        body: `
      <p>Hello <strong>${consultation.patient.name}</strong>,</p>

      <p>Your prescription is ready.</p>

      <p><strong>Diagnosis:</strong> ${diagnosis}</p>

      <p>Please find the detailed prescription attached.</p>
    `,
        highlightText: `Prescription for consultation #${consultation._id.toString().slice(-6)}`,
        highlightType: "success",
      }),

      attachments: [
        {
          filename: `prescription-${consultation._id}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    sendEmail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Prescription submitted successfully",
      prescription,
    });
  } catch (error) {
    console.error("Submit prescription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
