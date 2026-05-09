import { revenueSummaryService } from "../../services/admin/revenue.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const revenueSummary = asyncHandler(async (req, res) => {
  const { range } = req.query;
  const data = await revenueSummaryService(range);

  return res.status(200).json({
    success: true,
    message: "Revenue summary fetched successfully",
    data,
  });
});