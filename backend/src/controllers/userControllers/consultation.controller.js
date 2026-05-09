
import {
  createConsultationService,
  joinConsultationService,
  endConsultationService,
  getConsultationDetailsService,
  submitPrescriptionService,
  generateConsultationPDFService,
} from "../../services/user/consultation.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

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
  const pdfBuffer = await generateConsultationPDFService(req.params.id, req.user.id);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=consultation-${req.params.id}.pdf`);
  res.send(pdfBuffer);
});