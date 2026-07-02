import Export from "../../models/export.model.js";
import { exportQueue } from "../../queues/export.queue.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import path from "path";

export const viewReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = req.params.role || req.query.role || req.user?.role;
  const hostUrl = `${req.protocol}://${req.get("host")}`;

  const exportJob = await Export.create({
    role: role === "doctor" ? "doctor" : "patient",
    [role === "doctor" ? "doctor" : "patient"]: req.user?.id || null,
    status: "queued",
  });

  await exportQueue.add("export", {
    exportId: exportJob._id,
    reportType: role === "doctor" ? "doctor_receipt" : "patient_receipt",
    entityId: id,
    filters: { hostUrl },
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
    res.setHeader("Content-Disposition", "inline; filename=receipt.pdf");
    return res.sendFile(pdfPath);
  } else {
    throw new AppError(completedJob?.error || "PDF generation timed out/failed", 500);
  }
});