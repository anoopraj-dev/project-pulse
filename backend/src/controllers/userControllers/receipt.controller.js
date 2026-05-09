
import { viewReceiptService } from "../../services/user/receipt.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const viewReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = req.params.role || req.query.role || req.user?.role;
  const hostUrl = `${req.protocol}://${req.get("host")}`;

  const pdfBuffer = await viewReceiptService(id, hostUrl, role);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=receipt.pdf");

  return res.send(pdfBuffer);
});