import { getHomepageStats } from "../../services/user/homepage.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const homepageStatsController = asyncHandler(async (req, res) => {
  const stats = await getHomepageStats();
  res.status(200).json({ success: true, data: stats });
});