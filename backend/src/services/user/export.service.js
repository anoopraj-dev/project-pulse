import Export from '../../models/export.model.js'
import path from 'path'
import fs from 'fs';


export const createExportRequestService = async ({
  reportType,
  targetId,
  userId,
  userRole,
  filters,
}) => {

  // ---------------- Authorization ---------------
  if (reportType === "patient_full" && userId !== targetId) {
    throw new Error("Unauthorized");
  }

  if (
    reportType === "doctor_full" &&
    userRole !== "admin" &&
    userId !== targetId
  ) {
    throw new Error("Unauthorized");
  }

  if (reportType.startsWith("admin_") && userRole !== "admin") {
    throw new Error("Admin only");
  }

  // ----------------- Create DB Record -------------
  const exportJob = await Export.create({
    reportType,
    patient: reportType.includes("patient") ? targetId : null,
    doctor: reportType.includes("doctor") ? targetId : null,
    status: "queued",
    filters: filters || {},
  });

  // -------------- Que Job ---------------
  await exportQueue.add("export", {
    exportId: exportJob._id,
    reportType,
    entityId: targetId,
    filters,
  });

  return {
    message: "Export queued",
    exportId: exportJob._id,
  };
};