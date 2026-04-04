
import {
  createConsultationService,
  joinConsultationService,
  endConsultationService,
  getConsultationDetailsService,
  submitPrescriptionService,
  generateConsultationPDFService
} from "../../services/user/consultation.service.js";

export const createConsultation = async (req, res) => {
  try {
    const consultation = await createConsultationService({ appointmentId: req.body.appointmentId });
    res.status(201).json({ success: true, consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const joinConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const consultation = await joinConsultationService(id, userId);
    res.status(200).json({ success: true, message: "Joined consultation successfully", consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const endConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const data = await endConsultationService(id, userId);
    res.status(200).json({ success: true, message: "Consultation ended", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getConsultationDetails= async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const consultation = await getConsultationDetailsService(id, userId);
    res.status(200).json({ success: true, consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const submitPrescription = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const doctorId = req.user.id;
    const { diagnosis, medicines } = req.body;

    const prescription = await submitPrescriptionService(consultationId, doctorId, diagnosis, medicines);
    res.status(201).json({ success: true, message: "Prescription submitted successfully", prescription });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



export const generateConsultationPDF= async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pdfBuffer = await generateConsultationPDFService(id, userId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=consultation-${id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Generate consultation PDF error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};