import Export from "../../models/export.model.js";
import { exportQueue } from "../../queues/export.queue.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

export const requestPatientExport = asyncHandler(async (req, res) => {
  const patientId = req.user?.id;

  const job = await Export.create({
    patient: patientId,
    role: "patient",
    status: "queued",
  });

  await exportQueue.add("export", {
    exportId: job._id,
    reportType: "patient_full",
    entityId: patientId,
  });

  return res.status(202).json({ success: true, exportId: job._id });
});

export const getExportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Export.findById(id);
  if (!job) throw new AppError("Export job not found", 404);

  if (job.patient.toString() !== req.user.id) throw new AppError("Unauthorized", 403);

  return res.json({
    success: true,
    status: job.status,
    fileUrl: job.fileUrl || null,
  });
});
