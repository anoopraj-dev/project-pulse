import { Notification } from "../../models/notification.model.js";

export const getDoctorNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({
      recipient: userId,      
      role: "doctor",
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load notifications",
    });
  }
};



