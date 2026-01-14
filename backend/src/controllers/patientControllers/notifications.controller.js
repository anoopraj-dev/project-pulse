import { Notification } from "../../models/notification.model.js";

export const getPatientNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({
      recipient: userId,      
      role: "patient",
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


//------------------- MARK ALL READ ---------------------
export const setMarkAllRead = async (req, res) => {
  try {
    const role = req.user.role;
    const result = await Notification.updateMany(
      { role, read: false },
      { $set: { read: true } }
    );

    return res.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
};
