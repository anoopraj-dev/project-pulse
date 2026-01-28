import { Notification } from "../../models/notification.model.js";

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
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read"
    });
  }
};