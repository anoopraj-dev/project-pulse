
import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";

const modelMap = {
  Doctor,
  Patient,
};

// ---------------- GET ALL MESSAGES ----------------
export const getAllMessagesService = async (userId1, userId2, role) => {
  let userModel2;

  if (role === "patient") userModel2 = "Doctor";
  else if (role === "doctor") userModel2 = "Patient";
  else throw { status: 400, message: "Invalid role" };

  const ParticipantModel = modelMap[userModel2];

  const participant = await ParticipantModel.findById(userId2).select(
    "name profilePicture"
  );

  if (!participant) throw { status: 404, message: "Participant not found" };

  let conversation = await Conversation.findOne({
    participants: {
      $all: [
        { $elemMatch: { userId: userId1 } },
        { $elemMatch: { userId: userId2 } },
      ],
    },
  });

  if (!conversation) {
    return {
      conversation: null,
      participant,
      messages: [],
    };
  }

  const messages = await Message.find({
    conversationId: conversation._id,
  })
    .sort({ createdAt: 1 })
    .lean();

  const formattedMessages = messages.map((msg) => ({
    ...msg,
    files:
      msg.files?.map((f) => ({
        url: f.url,
        name: f.name,
        size: f.size,
        resourceType: f.resourceType,
        format: f.format,
      })) || [],
  }));

  await Message.updateMany(
    {
      conversationId: conversation._id,
      receiverId: userId1,
      isRead: false,
    },
    { $set: { isRead: true } }
  );

  return {
    conversation: { _id: conversation._id },
    participant,
    messages: formattedMessages,
  };
};

// ---------------- GET ALL CONVERSATIONS ----------------
export const getAllConversationsService = async (userId) => {
  const conversations = await Conversation.find({
    "participants.userId": userId,
  }).sort({ updatedAt: -1 });

  const result = [];

  for (const convo of conversations) {
    const other = convo.participants.find(
      (p) => p.userId.toString() !== userId
    );

    const ParticipantModel = modelMap[other.userModel];
    const participant = await ParticipantModel.findById(other.userId).select(
      "name profilePicture"
    );

    const unreadCount = await Message.countDocuments({
      conversationId: convo._id,
      receiverId: userId,
      isRead: false,
    });

    result.push({
      _id: convo._id,
      participant,
      lastMessage: convo.lastMessage || null,
      unreadCount,
      updatedAt: convo.updatedAt,
    });
  }

  return result;
};

// ---------------- SEND MESSAGE ----------------
export const sendMessageService = async (payload = {}) => {
  const {
    conversationId,
    senderId,
    senderModel,
    receiverId,
    receiverModel,
    text = "",
    files = [],
  } = payload;

  if (!senderId || !receiverId) {
    throw new Error("Missing senderId or receiverId");
  }

  let conversation = null;
  let isNewConversation = false;

  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
  }

  if (!conversation) {
    conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: senderId } },
          { $elemMatch: { userId: receiverId } },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          { userId: senderId, userModel: senderModel },
          { userId: receiverId, userModel: receiverModel },
        ],
      });
      isNewConversation = true;
    }
  }

  const normalizedFiles = (files || []).map((f) => ({
    url: f.url,
    name: f.name,
    size: f.size,
    resourceType: f.resourceType || "image",
    format: f.format,
  }));

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    senderModel,
    receiverId,
    receiverModel,
    text,
    files: normalizedFiles,
  });

  conversation.lastMessage = {
    text: message.text,
    senderId: message.senderId,
    files: message.files || [],
    type: message.files?.length ? "media" : "text",
    createdAt: message.createdAt,
  };

  conversation.updatedAt = message.createdAt;
  await conversation.save();

  const populated = await Conversation.findById(conversation._id).populate(
    "participants.userId",
    "name profilePicture"
  );

  const getOther = (viewerId) =>
    populated.participants.find(
      (p) => p.userId._id.toString() !== viewerId.toString()
    ).userId;

  return {
    conversationId: populated._id,
    message,
    isNewConversation,
    senderConversation: {
      _id: populated._id,
      participant: getOther(senderId),
      lastMessage: populated.lastMessage,
      updatedAt: populated.updatedAt,
    },
    receiverConversation: {
      _id: populated._id,
      participant: getOther(receiverId),
      lastMessage: populated.lastMessage,
      updatedAt: populated.updatedAt,
    },
  };
};

// ---------------- MARK READ ----------------
export const markConversationAsReadService = async (conversationId) => {
  if (!conversationId) return 0;

  const result = await Message.updateMany(
    { conversationId, isRead: false },
    { $set: { isRead: true } }
  );

  return result.modifiedCount;
};