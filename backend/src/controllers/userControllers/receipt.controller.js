
import { viewReceiptService } from "../../services/user/receipt.service.js";

//--------------------- VIEW RECEIPT CONTROLLER ---------------------
export const viewReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const pdfBuffer = await viewReceiptService(id, hostUrl);

    //--------------------- SEND PDF ---------------------
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to generate receipt",
    });
  }
};