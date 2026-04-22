import Export from "../../models/export.model.js";
import { exportQueue } from "../../queues/export.queue.js";

// --------- REQUEST REVENUE EXPORT (ADMIN ONLY) ----------
export const requestRevenueExport = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    console.log(userId,role)

    // --------- Authorization ----------
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin only access",
      });
    }

    // --------- Create Export Job ----------
    const job = await Export.create({
      role: "admin",
      status: "queued",
      reportType: "admin_revenue_full",
      requestedBy: userId,
      filters: req.body?.filters || {},
    });

    // --------- Queue Job ----------
    await exportQueue.add("export", {
      exportId: job._id,
      reportType: "admin_revenue_full",
      entityId: userId,
      filters: req.body?.filters || {},
    });
    console.log('export que',exportQueue)

    return res.status(202).json({
      success: true,
      exportId: job._id,
      message: "Revenue export queued",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// --------- GET REVENUE EXPORT STATUS ----------
export const getRevenueExportStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Export.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Export job not found",
      });
    }

    // --------- Authorization ----------
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.json({
      success: true,
      status: job.status,
      fileUrl: job.fileUrl || null,
      reportType: job.reportType,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};