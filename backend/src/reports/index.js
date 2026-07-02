import { buildPatientExport } from "../services/patient/export.service.js";
import { buildDoctorExport } from "../services/doctor/export.service.js";
import { buildAdminRevenueExport } from "../services/admin/export.service.js";

import { patientTemplate } from "./templates/patient.template.js";
import { doctorTemplate } from "./templates/doctor.template.js";
import { adminTemplate } from "./templates/admin.template.js";

import Payment from "../models/payments.model.js";
import Settlement from "../models/settlement.model.js";
import Consultation from "../models/consultation.model.js";
import Prescription from "../models/prescription.model.js";

import { buildPatientReceiptHTML, buildDoctorReceiptHTML } from "../services/user/receipt.service.js";
import { buildPrescriptionHTML } from "../services/user/consultation.service.js";

const buildPatientReceipt = async (entityId, filters) => {
  const payment = await Payment.findById(entityId)
    .populate("patient", "name email")
    .populate("doctor", "name email professionalInfo")
    .populate("appointment", "serviceType appointmentDate appointmentTime");
  if (!payment) throw new Error("Payment not found");
  return { payment, hostUrl: filters?.hostUrl };
};

const buildDoctorReceipt = async (entityId, filters) => {
  const settlement = await Settlement.findOne({ payment: entityId })
    .populate("payment")
    .populate("patient")
    .populate("appointment");
  if (!settlement) throw new Error("Settlement not found");
  return { settlement, hostUrl: filters?.hostUrl };
};

const buildPrescription = async (entityId, filters) => {
  const consultation = await Consultation.findById(entityId)
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

  if (!consultation) throw new Error("Consultation not found");

  const prescription = await Prescription.findOne({
    consultation: entityId,
  }).populate("doctor", "name");
  if (!prescription) throw new Error("Prescription not found");

  return { consultation, prescription };
};

export const REPORTS = {
  patient_full: {
    builder: buildPatientExport,
    template: patientTemplate,
  },

  doctor_full: {
    builder: buildDoctorExport,
    template: doctorTemplate,
  },

  admin_revenue_full: {
    builder: buildAdminRevenueExport,
    template: adminTemplate,
  },

  patient_receipt: {
    builder: buildPatientReceipt,
    template: ({ payment, hostUrl }) => buildPatientReceiptHTML(payment, hostUrl),
  },

  doctor_receipt: {
    builder: buildDoctorReceipt,
    template: ({ settlement, hostUrl }) => buildDoctorReceiptHTML(settlement, hostUrl),
  },

  prescription: {
    builder: buildPrescription,
    template: ({ consultation, prescription }) => buildPrescriptionHTML(consultation, prescription),
  },
};