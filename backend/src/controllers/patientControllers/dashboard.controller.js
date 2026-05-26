
import {
  patientDashboardChartService,
  patientDashboardStatsService,
  patientPrescriptionsService,
  patientVitalsService,
  upcomingAppointmentsService,
} from "../../services/patient/dashboard.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// ---------------- STATS ----------------
export const dashboardStats = asyncHandler(async (req, res) => {
  const data = await patientDashboardStatsService(req.user.id);
  return res.status(200).json({ success: true, data });
});

// ---------------- UPCOMING APPOINTMENTS ----------------
export const patientUpcomingAppointments = asyncHandler(async (req, res) => {
  const data = await upcomingAppointmentsService(req.user.id);
  return res.status(200).json({ success: true, data });
});

// ---------------- CHART DATA ----------------
export const patientDashboardChart = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const data = await patientDashboardChartService(req.user.id, range);
  return res.status(200).json({ success: true, data });
});

// ---------------- PRESCRIPTIONS ----------------
export const patientPrescriptions = asyncHandler(async (req, res) => {
  const patientId = req.user?.id;
  if (!patientId) throw new AppError("Unauthorized", 401);

  const prescriptions = await patientPrescriptionsService(patientId);
  return res.status(200).json({
    success: true,
    message: "Prescriptions fetched successfully",
    data: prescriptions,
  });
});

// ---------------- VITALS ----------------
export const patientVitals = asyncHandler(async (req, res) => {
  const patient = await patientVitalsService(req.user.id);

  if (!patient) return res.json({ success: true, data: null });

  return res.json({ success: true, data: patient.medical_history });
});