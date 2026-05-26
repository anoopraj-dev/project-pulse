
import { getNotifications, markAllRead } from "../../services/user/notification.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

// ---------------- GET USER NOTIFICATIONS ----------------
export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await getNotifications(req.user.id, req.user.role);
  res.json({ success: true, notifications });
});

// ---------------- MARK ALL NOTIFICATIONS AS READ ----------------
export const setMarkAllRead = asyncHandler(async (req, res) => {
  const modifiedCount = await markAllRead(req.user.id, req.user.role);
  res.json({ success: true, modifiedCount });
});