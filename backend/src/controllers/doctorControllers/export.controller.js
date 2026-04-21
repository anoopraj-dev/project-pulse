import Export from "../../models/export.model.js";
import { exportQueue } from "../../queues/export.queue.js";

// --------- REQUEST DOCTOR EXPORT ----------

export const requestDoctorExport = async (req, res) => {
  try {
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

    return res.status(202).json({
      success: true,
      exportId: job._id,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
//-------------- GET EXPORT STATUS -------------
export const getDoctorExportStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Export.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Export job not found",
      });
    }

    // -------------- Security Check --------------
    if (!job.doctor || job.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.json({
      success: true,
      status: job.status,
      fileUrl: job.fileUrl || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
