import { Notification } from "../../models/notification.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getPatientNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user.id,
    role: "patient",
  }).sort({ createdAt: -1 });

  return res.json({ success: true, notifications });
});

// ---------------- MARK ALL READ ----------------
export const setMarkAllRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { role: req.user.role, read: false },
    { $set: { read: true } }
  );

  return res.json({ success: true, modifiedCount: result.modifiedCount });
});
