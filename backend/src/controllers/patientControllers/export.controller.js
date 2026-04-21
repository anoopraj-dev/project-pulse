import Export from '../../models/export.model.js';
import { exportQueue } from '../../queues/export.queue.js';


export const requestPatientExport = async (req, res) => {
  try {
    console.log("Incoming export request");

    const patientId = req.user?.id;
    console.log("Patient ID:", patientId);

    const job = await Export.create({
      patient: patientId,
      role: "patient",
      status: "queued",
    });

    console.log("DB job created:", job._id);

    await exportQueue.add("patient-export", {
      exportId: job._id,
      patientId,
    });

    console.log("Job added to queue");

    return res.status(202).json({
      success: true,
      exportId: job._id,
    });

  } catch (err) {
    console.error("EXPORT ERROR:", err); 

    return res.status(500).json({
      error: err.message,
      stack: err.stack, 
    });
  }
};

export const getExportStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Export.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Export job not found",
      });
    }

    // -------- security check
    if (job.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.json({
      success: true,
      status: job.status, // queued | processing | completed | failed
      fileUrl: job.fileUrl || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};