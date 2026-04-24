
import { viewReceiptService } from "../../services/user/receipt.service.js";

export const viewReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.params.role || req.query.role || req.user?.role; 

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const pdfBuffer = await viewReceiptService(id, hostUrl, role);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=receipt.pdf");

    return res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to generate receipt",
    });
  }
};