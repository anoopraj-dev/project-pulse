import crypto from "crypto";
import Consultation from "../../models/consultation.model.js";
import Appointment from "../../models/appointments.model.js";
import Prescription from "../../models/prescription.model.js";
import { getIO } from "../../socket.js";
import { getBrowser } from "../../config/puppeteer.js";
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";

export const createConsultationService = async ({ appointmentId,session }) => {
  const appointment = await Appointment.findById(appointmentId).session(session);

  if (!appointment) throw new Error("Appointment not found");

  const existing = await Consultation.findOne({ appointment: appointmentId });
  if (existing) return existing;
  const sessionId = crypto.randomUUID();

  // ---------- FIX: safe validation ----------
  if (!appointment.appointmentDate || !appointment.timeSlot) {
    throw new Error("Appointment date or timeSlot missing");
  }

  // ---------- FIX: build proper datetime ----------
  const appointmentDate = new Date(appointment.appointmentDate);

  const [hours, minutes] = appointment.timeSlot.split(":");

  if (!hours || !minutes) {
    throw new Error("Invalid timeSlot format");
  }

  const appointmentDateTime = new Date(appointmentDate);
  appointmentDateTime.setHours(Number(hours), Number(minutes), 0, 0);

  if (isNaN(appointmentDateTime.getTime())) {
    throw new Error("Invalid appointment date or timeSlot");
  }

  const tokenExpiresAt = new Date(appointmentDateTime);
  tokenExpiresAt.setMinutes(
    tokenExpiresAt.getMinutes() + (appointment.duration || 30) + 10
  );

  const consultation = await Consultation.create(
  [{
    appointment: appointmentId,
    patient: appointment.patient,
    doctor: appointment.doctor,
    sessionId,
    token: crypto.randomBytes(16).toString("hex"),
    tokenExpiresAt,
    status: "scheduled",
  }],
  { session }
);

  await Appointment.findByIdAndUpdate(appointmentId, {
    consultation: consultation[0]._id,
    
  },{session});

  return consultation[0];
};

//------------------ Join Consultation Service --------------------
export const joinConsultationService = async (consultationId, userId) => {
  const consultation = await Consultation.findById(consultationId)
    .populate("appointment", "appointmentDate duration timeSlot")
    .populate("patient", "name profilePicture")
    .populate("doctor", "name profilePicture");

  if (!consultation) throw new Error("Consultation not found");
  if (consultation.status === "cancelled")
    throw new Error("Consultation cancelled");
  if (consultation.status === "completed")
    throw new Error("Consultation already completed");

  if (
    ![
      consultation.patient._id.toString(),
      consultation.doctor._id.toString(),
    ].includes(userId)
  ) {
    throw new Error("Unauthorized");
  }

  // -------- Build appointment datetime safely --------
  const appointmentDate = new Date(consultation.appointment.appointmentDate);
  const [hours, minutes] = consultation.appointment.timeSlot.split(":");

  const appointmentDateTime = new Date(
    appointmentDate.getFullYear(),
    appointmentDate.getMonth(),
    appointmentDate.getDate(),
    Number(hours),
    Number(minutes),
    0,
    0
  );

  if (isNaN(appointmentDateTime.getTime())) {
    throw new Error("Invalid appointment datetime");
  }

  const now = new Date();

  // -------- Buffers --------
  const earlyJoinBuffer = 5;   // minutes before
  const lateGraceBuffer = 10;  // minutes after

  const startWindow = new Date(
    appointmentDateTime.getTime() - earlyJoinBuffer * 60 * 1000
  );

  const endWindow = new Date(
    appointmentDateTime.getTime() +
      (consultation.appointment.duration || 15) * 60 * 1000 +
      lateGraceBuffer * 60 * 1000
  );

  // -------- Validation --------
  if (now < startWindow) {
    throw new Error("Consultation not started yet");
  }

  if (now > endWindow) {
    throw new Error("Consultation time expired");
  }

  // -------- Initialize participants --------
  if (!consultation.participants) {
    consultation.participants = {
      patient: { joinedAt: null, isPresent: false },
      doctor: { joinedAt: null, isPresent: false },
    };
  }

  const isPatient = consultation.patient._id.toString() === userId;
  const isDoctor = consultation.doctor._id.toString() === userId;

  if (isPatient) {
    consultation.participants.patient.joinedAt =
      consultation.participants.patient.joinedAt || now;
    consultation.participants.patient.isPresent = true;
  }

  if (isDoctor) {
    consultation.participants.doctor.joinedAt =
      consultation.participants.doctor.joinedAt || now;
    consultation.participants.doctor.isPresent = true;
  }

  const patientReady = consultation.participants.patient?.isPresent;
  const doctorReady = consultation.participants.doctor?.isPresent;

  // -------- Status update --------
  if (consultation.status === "scheduled" && patientReady && doctorReady) {
    consultation.status = "in-progress";
    consultation.startTime = consultation.startTime || new Date();
  }

  await consultation.save();

  // -------- Socket emit --------
  const io = getIO();
  io.to(consultationId).emit("consultation:status-update", {
    status: consultation.status,
  });

  return {
    consultationId: consultation._id,
    sessionId: consultation.sessionId,
    status: consultation.status,
    startTime: consultation.startTime,
    participants: {
      patient: consultation.patient,
      doctor: consultation.doctor,
    },
  };
};

//---------------- End consultation service ----------------
export const endConsultationService = async (consultationId, userId) => {
  const io = getIO();
  const consultation =
    await Consultation.findById(consultationId).populate("appointment");

  if (!consultation) throw new Error("Consultation not found");

  const role = consultation.doctor.toString() === userId ? "doctor" : "patient";
  if (consultation.status === "cancelled")
    throw new Error("Consultation cancelled");
  if (consultation.status === "completed")
    throw new Error("Consultation already completed");
  if (
    ![consultation.patient.toString(), consultation.doctor.toString()].includes(
      userId,
    )
  ) {
    throw new Error("Unauthorized");
  }

  const prescription = await Prescription.findOne({
    consultation: consultationId,
  });
  if (!prescription)
    throw new Error(
      "Prescription must be submitted before ending the consultation",
    );

  //----------- Doctor initiates End -------------
  if (role === "doctor") {
    consultation.status = "pending-confirmation";
    await consultation.save();

    io.to(consultationId).emit("consultation:end-requested", {
      consultationId,
    });

    return {
      consultationId,
      status: consultation.status,
      message: "Waiting for patient confirmation",
    };
  }
  if (role === "patient") {
    const now = new Date();
    consultation.endTime = now;
    consultation.status = "completed";

    consultation.duration = consultation.startTime
      ? Math.round((now - consultation.startTime) / (1000 * 60))
      : null;

    await consultation.save();

    await Appointment.findByIdAndUpdate(consultation.appointment._id, {
      status: "completed",
    });

    io.to(consultationId).emit("consultation:ended", {
      consultationId,
    });
    return {
      consultationId,
      status: consultation.status,
      duration: consultation.duration,
    };
  }
};

export const getConsultationDetailsService = async (consultationId, userId) => {
  const consultation = await Consultation.findById(consultationId)
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

  if (!consultation) throw new Error("Consultation not found");

  if (
    ![
      consultation.patient._id.toString(),
      consultation.doctor._id.toString(),
    ].includes(userId)
  ) {
    throw new Error("Unauthorized");
  }

  const patientId = consultation.patient._id;

  // Previous prescriptions
  const prescriptions = await Prescription.find({ patient: patientId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("doctor", "name");

  // Past consultations
  const pastConsultations = await Consultation.find({
    patient: patientId,
    _id: { $ne: consultationId },
    status: "completed",
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("doctor", "name")
    .populate("appointment", "appointmentDate reason");

  return {
    consultation,
    prescriptions,
    pastConsultations,
  };
};

export const submitPrescriptionService = async (
  consultationId,
  doctorId,
  diagnosis,
  medicines,
) => {
  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    throw new Error("At least one medicine is required");
  }

  const consultation = await Consultation.findById(consultationId)
    .populate("appointment")
    .populate("patient", "name email")
    .populate("doctor", "name");

  if (!consultation) throw new Error("Consultation not found");
  if (consultation.doctor._id.toString() !== doctorId)
    throw new Error("Unauthorized");

  if (consultation.isPrescribed) {
    throw new Error("Already submitted prescription");
  }

  consultation.isPrescribed = true;

  await consultation.save();

  const prescription = await Prescription.create({
    consultation: consultationId,
    appointment: consultation.appointment._id,
    patient: consultation.patient._id,
    doctor: doctorId,
    diagnosis,
    medicines,
  });

  // Generate PDF
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
              </div>`,
              )
              .join("")}
          </div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await page.close();

  // Send email
  sendEmail({
    from: `"PULSE360" <${process.env.GMAIL_USER}>`,
    to: consultation.patient.email,
    subject: "Your Prescription",
    html: emailTemplate({
      title: "Prescription Available",
      subtitle: `Dr. ${consultation.doctor.name}`,
      body: `<p>Hello <strong>${consultation.patient.name}</strong>,</p>
             <p>Your prescription is ready.</p>
             <p><strong>Diagnosis:</strong> ${diagnosis}</p>
             <p>Please find the detailed prescription attached.</p>`,
      highlightText: `Prescription for consultation #${consultation._id.toString().slice(-6)}`,
      highlightType: "success",
    }),
    attachments: [
      { filename: `prescription-${consultation._id}.pdf`, content: pdfBuffer },
    ],
  });

  return prescription;
};

export const generateConsultationPDFService = async (
  consultationId,
  userId,
) => {
  // Find consultation with related data
  const consultation = await Consultation.findById(consultationId)
    .populate({
      path: "patient",
      select: "name gender dob",
    })
    .populate({
      path: "appointment",
      select: "appointmentDate timeSlot reason",
    })
    .populate({
      path: "doctor",
      select: "name",
    });

  if (!consultation) throw { status: 404, message: "Consultation not found" };

  // Authorization check - only patient or doctor
  if (
    ![
      consultation.patient._id.toString(),
      consultation.doctor._id.toString(),
    ].includes(userId)
  ) {
    throw { status: 403, message: "Unauthorized" };
  }

  // Find prescription
  const prescription = await Prescription.findOne({
    consultation: consultationId,
  }).populate("doctor", "name");
  if (!prescription) throw { status: 404, message: "Prescription not found" };

  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Consultation Report</title>
        <style>
          body { font-family: Arial; margin: 40px; }
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
                (med, i) => `
              <div class="medicine-item">
                <div class="info-item"><span class="label">Medicine ${i + 1}:</span> ${med.medicine}</div>
                <div class="info-item"><span class="label">Dosage:</span> ${med.dosage}</div>
                <div class="info-item"><span class="label">Timing:</span> ${med.timing === "before" ? "Before meals" : "After meals"}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div style="margin-top:50px;text-align:center;font-size:12px;color:#666;">
          <p>This is a computer-generated report. Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;

  // Generate PDF buffer using Puppeteer
  const browser = await getBrowser();
  if (!browser)
    throw { status: 500, message: "PDF generation service unavailable" };

  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
  });
  await page.close();

  return pdfBuffer;
};
