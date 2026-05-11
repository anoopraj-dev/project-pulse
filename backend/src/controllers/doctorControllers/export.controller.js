import Export from "../../models/export.model.js";
import { exportQueue } from "../../queues/export.queue.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// --------- REQUEST DOCTOR EXPORT ----------
export const requestDoctorExport = asyncHandler(async (req, res) => {
  const doctorId = req.user?.id;

  const job = await Export.create({
    doctor: doctorId,
    role: "doctor",
    status: "queued",
    reportType: "doctor_full",
  });

  await exportQueue.add("export", {
    exportId: job._id,
    reportType: "doctor_full",
    entityId: doctorId,
    filters: {},
  });

  return res.status(202).json({ success: true, exportId: job._id });
});

// -------------- GET EXPORT STATUS -------------
export const getDoctorExportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Export.findById(id);
  if (!job) throw new AppError("Export job not found", 404);

  if (!job.doctor || job.doctor.toString() !== req.user.id) {
    throw new AppError("Unauthorized", 403);
  }

  return res.json({
    success: true,
    status: job.status,
    fileUrl: job.fileUrl || null,
  });
});
