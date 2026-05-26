
import {
  getAdminDashboardService,
  getPendingDoctorProfileService,
  getDoctorDocumentsService,
  getAdminNotificationsService,
  dashboardCountsService,
  revenueOverviewService,
  userGrowthService,
  getDashboardSupportDataService,
} from "../../services/admin/dashboard.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// ---------------- GET ADMIN DASHBOARD ----------------
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await getAdminDashboardService();
  res.status(200).json(data);
});

// ---------------- REVIEW PENDING PROFILES ----------------
export const getPendingDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await getPendingDoctorProfileService(req.params.id);
  res.status(200).json({ success: true, user: doctor });
});

// ---------------- GET DOCTOR DOCUMENTS ----------------
export const getDoctorDocuments = asyncHandler(async (req, res) => {
  const doctor = await getDoctorDocumentsService(req.params.id);
  res.status(200).json({ success: true, user: doctor });
});

// ---------------- GET NOTIFICATIONS ----------------
export const getAdminNotifications = asyncHandler(async (req, res) => {
  const notifications = await getAdminNotificationsService();
  res.status(200).json({ success: true, notifications });
});

export const dashboardCounts = asyncHandler(async (req, res) => {
  const counts = await dashboardCountsService();
  return res.status(200).json({ success: true, data: counts });
});

// ---------------- DASHBOARD REVENUE ----------------
export const revenueDashboardOverview = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const data = await revenueOverviewService(range);
  res.status(200).json({
    success: true,
    message: "Fetched revenue overview",
    data,
  });
});

// ---------------- DASHBOARD USER GROWTH ----------------
export const dashboardUserGrowth = asyncHandler(async (req, res) => {
  const data = await userGrowthService();
  res.status(200).json({ success: true, data });
});

// ---------------- SUPPORT SYSTEM DATA ----------------
export const dashboardSupportData = asyncHandler(async (req, res) => {
  const data = await getDashboardSupportDataService();
  return res.status(200).json({ success: true, data });
});