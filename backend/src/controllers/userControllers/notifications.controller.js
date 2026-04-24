
import { getNotifications, markAllRead } from "../../services/user/notification.service.js";

//------------------- GET USER NOTIFICATIONS ----------------
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id, req.user.role);
    res.json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load notifications" });
  }
};

//------------------- MARK ALL NOTIFICATIONS AS READ ----------------
export const setMarkAllRead = async (req, res) => {
  try {
    const modifiedCount = await markAllRead(req.user.id, req.user.role);
    res.json({ success: true, modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to mark notifications as read" });
  }
};