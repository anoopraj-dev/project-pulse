import { Notification } from "../../models/notification.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getDoctorNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user.id,
    role: "doctor",
  }).sort({ createdAt: -1 });

  return res.json({ success: true, notifications });
});
