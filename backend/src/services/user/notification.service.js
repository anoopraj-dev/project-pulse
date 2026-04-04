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


export const markAllRead = async (userId, role) => {
  const filter =
    role === "admin"
      ? { role, read: false } // admins use role-based
      : { recipient: userId, role, read: false }; //  users use personal

  const result = await Notification.updateMany(filter, {
    $set: { read: true },
  });

  return result.modifiedCount;
};