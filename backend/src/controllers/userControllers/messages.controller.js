
import {
  getAllMessagesService,
  getAllConversationsService,
  sendMessageService,
  markConversationAsReadService,
} from "../../services/user/messages.service.js";

//--------------------- GET ALL MESSAGES CONTROLLER ---------------------
export const getAllMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getAllMessagesService(req.user.id, id, req.user.role);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch messages",
    });
  }
};

//--------------------- GET ALL CONVERSATIONS CONTROLLER ---------------------
export const getAllConversations = async (req, res) => {
  try {
    const conversations = await getAllConversationsService(req.user.id);
    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
};

//--------------------- SEND MESSAGE CONTROLLER ---------------------
export const sendMessage = async (req, res) => {
  try {
    const data = await sendMessageService(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

//--------------------- MARK CONVERSATION AS READ CONTROLLER ---------------------
export const markConversationAsRead= async (req, res) => {
  try {
    const { conversationId } = req.body;
    const count = await markConversationAsReadService(conversationId);
    res.status(200).json({ success: true, modifiedCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};