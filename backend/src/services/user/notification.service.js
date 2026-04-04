import { Notification } from "../../models/notification.model.js";
import { getIO } from "../../socket.js";

//------------------- CREATE AND SEND NOTIFICATION ----------------
export const createNotification = async ({ userId, role, title, message }) => {
  const notification = await Notification.create({
    title,
    message,
    recipient: userId,
    role,
  });

  try {
    const io = getIO();
    io.to(userId.toString()).emit("notification:new", notification);
    if(role){
        io.to(`role:${role}`).emit('notification:new',notification)
    }
  } catch (err) {
    console.warn("Socket emit failed (user might be offline)", err.message);
  }

  return notification;
};

//------------------- GET NOTIFICATIONS ----------------
export const getNotifications = async (userId, role) => {
  return Notification.find({ recipient: userId, role }).sort({ createdAt: -1 });
};

//------------------- MARK ALL AS READ ----------------
export const markAllRead = async (userId, role) => {
  const result = await Notification.updateMany(
    { recipient: userId, role, read: false },
    { $set: { read: true } }
  );
  return result.modifiedCount;
};