import Export from "../../models/export.model.js";
import { exportQueue } from "../../queues/export.queue.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// ---------------- REQUEST REVENUE EXPORT (ADMIN ONLY) ----------------
export const requestRevenueExport = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  if (role !== "admin") throw new AppError("Admin only access", 403);

  // ---------------- CREATE EXPORT JOB ----------------
  const job = await Export.create({
    role: "admin",
    status: "queued",
    reportType: "admin_revenue_full",
    requestedBy: userId,
    filters: req.body?.filters || {},
  });

  // ---------------- QUEUE JOB ----------------
  await exportQueue.add("export", {
    exportId: job._id,
    reportType: "admin_revenue_full",
    entityId: userId,
    filters: req.body?.filters || {},
  });

  return res.status(202).json({
    success: true,
    exportId: job._id,
    message: "Revenue export queued",
  });
});

// ---------------- GET REVENUE EXPORT STATUS ----------------
export const getRevenueExportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Export.findById(id);
  if (!job) throw new AppError("Export job not found", 404);

  if (req.user.role !== "admin") throw new AppError("Unauthorized", 403);

  return res.json({
    success: true,
    status: job.status,
    fileUrl: job.fileUrl || null,
    reportType: job.reportType,
  });
});