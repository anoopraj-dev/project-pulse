import {
  doctorRevenueService,
  upcomingAppointmentService,
  dashboardStatsService,
  recentPatientsService,
  feedbackService,
} from "../../services/doctor/dashboard.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

export const doctorRevenue = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const data = await doctorRevenueService(req.user.id, range);
  return res.status(200).json({ success: true, data });
});

export const upcomingAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user?.id;
  if (!doctorId) throw new AppError("Unauthorized", 401);

  const limit = parseInt(req.query.limit || "10", 10);
  const data = await upcomingAppointmentService(doctorId, limit);

  return res.status(200).json({
    success: true,
    message: "Upcoming appointments fetched successfully",
    data,
  });
});

export const doctorDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardStatsService(req.user.id);
  return res.status(200).json({ success: true, data: stats });
});

export const recentPatients = asyncHandler(async (req, res) => {
  const data = await recentPatientsService(req.user._id);
  return res.status(200).json({ success: true, data });
});

export const patientFeedbacks = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const data = await feedbackService(req.user.id, page, limit);
  return res.status(200).json({ success: true, data });
});