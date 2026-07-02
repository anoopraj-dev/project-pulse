
import {
  createConsultationService,
  joinConsultationService,
  endConsultationService,
  getConsultationDetailsService,
  submitPrescriptionService,
  generateConsultationPDFService,
} from "../../services/user/consultation.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import Export from "../../models/export.model.js";
import Consultation from "../../models/consultation.model.js";
import { exportQueue } from "../../queues/export.queue.js";
import path from "path";
import AppError from "../../utils/AppError.js";

export const createConsultation = asyncHandler(async (req, res) => {
  const consultation = await createConsultationService({ appointmentId: req.body.appointmentId });
  res.status(201).json({ success: true, consultation });
});

export const joinConsultation = asyncHandler(async (req, res) => {
  const consultation = await joinConsultationService(req.params.id, req.user.id);
  res.status(200).json({ success: true, message: "Joined consultation successfully", consultation });
});

export const endConsultation = asyncHandler(async (req, res) => {
  const data = await endConsultationService(req.params.id, req.user.id);
  res.status(200).json({ success: true, message: "Consultation ended", data });
});

export const getConsultationDetails = asyncHandler(async (req, res) => {
  const consultation = await getConsultationDetailsService(req.params.id, req.user.id);
  res.status(200).json({ success: true, consultation });
});

export const submitPrescription = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;
  const { diagnosis, medicines } = req.body;

  const prescription = await submitPrescriptionService(
    consultationId,
    req.user.id,
    diagnosis,
    medicines
  );
  res.status(201).json({
    success: true,
    message: "Prescription submitted successfully",
    prescription,
  });
});

export const generateConsultationPDF = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  // Authorization check
  const consultation = await Consultation.findById(id);
  if (!consultation) throw new AppError("Consultation not found", 404);
  if (
    consultation.patient.toString() !== userId &&
    consultation.doctor.toString() !== userId
  ) {
    throw new AppError("Unauthorized", 403);
  }

  const role = req.user?.role || "patient";

  const exportJob = await Export.create({
    role: role,
    [role === "doctor" ? "doctor" : "patient"]: userId,
    status: "queued",
  });

  await exportQueue.add("export", {
    exportId: exportJob._id,
    reportType: "prescription",
    entityId: id,
  });

  // Poll for completion (timeout after 15 seconds)
  const startTime = Date.now();
  let jobStatus = "queued";
  let completedJob = null;

  while (Date.now() - startTime < 15000) {
    completedJob = await Export.findById(exportJob._id);
    if (completedJob && (completedJob.status === "completed" || completedJob.status === "failed")) {
      jobStatus = completedJob.status;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  if (jobStatus === "completed" && completedJob.fileUrl) {
    const pdfPath = path.join(process.cwd(), completedJob.fileUrl);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=consultation-${id}.pdf`);
    return res.sendFile(pdfPath);
  } else {
    throw new AppError(completedJob?.error || "PDF generation timed out/failed", 500);
  }
});