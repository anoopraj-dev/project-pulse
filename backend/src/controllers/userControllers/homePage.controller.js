import { getHomepageStats } from "../../services/user/homepage.service.js";


export const homepageStatsController = async (req, res) => {
  try {
    const stats = await getHomepageStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch homepage stats",
      error: error.message,
    });
  }
};