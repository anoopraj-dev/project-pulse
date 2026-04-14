import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";

const modelMap = {
  Doctor,
  Patient,
};

//--------------------- GET ALL MESSAGES SERVICE ---------------------
export const getAllMessagesService = async (userId1, userId2, userRole) => {
  let userModel2;

  if (userRole === "patient") userModel2 = "Doctor";
  else if (userRole === "doctor") userModel2 = "Patient";
  else throw { status: 400, message: "Invalid user role" };

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

  //--------------------- GET MESSAGES ---------------------
  const messages = await Message.find({
    conversationId: conversation._id,
  })
    .sort({ createdAt: 1 })
    .lean();

  //--------------------- FORMAT MESSAGES ---------------------
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

  //--------------------- MARK AS READ ---------------------
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

//--------------------- GET ALL CONVERSATIONS SERVICE ---------------------
export const getAllConversationsService = async (userId) => {
  const conversations = await Conversation.find({
    "participants.userId": userId,
  }).sort({ updatedAt: -1 });

  const result = [];

  for (const convo of conversations) {
    const other = convo.participants.find((p) => p.userId.toString() !== userId);

    const ParticipantModel = modelMap[other.userModel];
    const participant = await ParticipantModel.findById(other.userId).select(
      "name profilePicture"
    );

    //--------------------- UNREAD COUNT ---------------------
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

//--------------------- SEND MESSAGE SERVICE ---------------------
export const sendMessageService = async ({
  conversationId,
  senderId,
  senderModel,
  receiverId,
  receiverModel,
  text,
  files = [],
}) => {
  let conversation = null;
  let isNewConversation = false;

  //--------------------- FIND OR CREATE CONVERSATION ---------------------
  if (conversationId) conversation = await Conversation.findById(conversationId);

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

  //--------------------- NORMALIZE FILES ---------------------
  const normalizedFiles = files.map((f) => ({
    url: f.url,
    name: f.name,
    size: f.size,
    resourceType: f.resourceType || "image",
    format: f.format,
  }));

  //--------------------- CREATE MESSAGE ---------------------
  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    senderModel,
    receiverId,
    receiverModel,
    text,
    files: normalizedFiles,
  });

  //--------------------- UPDATE CONVERSATION ---------------------
  conversation.lastMessage = {
    text: message.text,
    senderId: message.senderId,
    files: message.files || [],
    type: message.files?.length ? "media" : "text",
    createdAt: message.createdAt,
  };
  conversation.updatedAt = message.createdAt;
  await conversation.save();

  //--------------------- POPULATE PARTICIPANTS ---------------------
  const populatedConversation = await Conversation.findById(conversation._id).populate(
    "participants.userId",
    "name profilePicture"
  );

  const getOtherParticipant = (conversation, viewerId) =>
    conversation.participants.find((p) => p.userId._id.toString() !== viewerId.toString())
      .userId;

  const senderParticipant = getOtherParticipant(populatedConversation, senderId);
  const receiverParticipant = getOtherParticipant(populatedConversation, receiverId);

  return {
    conversationId: populatedConversation._id,
    message,
    isNewConversation,
    senderConversation: {
      _id: populatedConversation._id,
      participant: senderParticipant,
      lastMessage: populatedConversation.lastMessage,
      updatedAt: populatedConversation.updatedAt,
    },
    receiverConversation: {
      _id: populatedConversation._id,
      participant: receiverParticipant,
      lastMessage: populatedConversation.lastMessage,
      updatedAt: populatedConversation.updatedAt,
    },
  };
};

//--------------------- MARK CONVERSATION AS READ SERVICE ---------------------
export const markConversationAsReadService = async (conversationId) => {
  if (!conversationId) return 0;

  const result = await Message.updateMany(
    { conversationId, isRead: false },
    { $set: { isRead: true } }
  );

  return result.modifiedCount;
};